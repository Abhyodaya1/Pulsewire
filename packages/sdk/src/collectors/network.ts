import { EventBus } from '../EventBus';
import { redact } from '../redact';
import { NetworkStudioEvent, StudioEvent } from '@rn-studio/protocol';

export interface NetworkCollectorOptions {
  bus: EventBus<StudioEvent>;
  sessionId: string;
}

/**
 * Wraps global.fetch to intercept HTTP traffic, measure duration,
 * redact sensitive headers/bodies, and emit NetworkStudioEvents.
 */
export function initializeNetworkCollector({
  bus,
  sessionId,
}: NetworkCollectorOptions): () => void {
  // Store reference to original unpatched fetch
  const originalFetch = globalThis.fetch;

  if (!originalFetch) {
    console.warn('[RNStudio:Network] globalThis.fetch is not defined.');
    return () => {};
  }

  // Monkey-patch global.fetch
  globalThis.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const startTime = Date.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 9)}_${startTime}`;
    
    // Resolve URL string
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = (init?.method?.toUpperCase() ?? 'GET') as NetworkStudioEvent['payload']['method'];

    // Redact request headers & body
    const requestHeaders = init?.headers ? (redact(init.headers) as Record<string, string>) : undefined;
    let requestBody: unknown = undefined;
    if (init?.body) {
      try {
        requestBody = typeof init.body === 'string' ? redact(JSON.parse(init.body)) : '[Non-JSON Body]';
      } catch {
        requestBody = '[String / Binary Body]';
      }
    }

    try {
      // Execute original fetch request
      const response = await originalFetch.apply(this, [input, init]);
      const durationMs = Date.now() - startTime;

      // INVARIANT: Clone the response to read body without consuming the host app's stream
      let responseBody: unknown = undefined;
      try {
        const cloned = response.clone();
        const text = await cloned.text();
        try {
          responseBody = redact(JSON.parse(text));
        } catch {
          // Truncate non-JSON text to 500 chars to avoid memory bloat
          responseBody = text.slice(0, 500);
        }
      } catch {
        responseBody = '[Unreadable Stream]';
      }

      // Convert Headers to plain object and redact
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const event: NetworkStudioEvent = {
        id: `net_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'network',
        sessionId,
        timestamp: startTime,
        payload: {
          requestId,
          url,
          method,
          status: response.status,
          durationMs,
          requestHeaders,
          responseHeaders: redact(responseHeaders) as Record<string, string>,
          requestBody,
          responseBody,
        },
      };

      bus.emit(event);
      return response;
    } catch (error: any) {
      const durationMs = Date.now() - startTime;

      // Emit failed network attempt
      const event: NetworkStudioEvent = {
        id: `net_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'network',
        sessionId,
        timestamp: startTime,
        payload: {
          requestId,
          url,
          method,
          status: 0, // 0 denotes connection dropped / DNS failure / timeout
          durationMs,
          requestHeaders,
          requestBody,
          error: error?.message ?? 'Network request failed',
        },
      };

      bus.emit(event);

      // INVARIANT: Re-throw original error so host app error handling is not altered
      throw error;
    }
  };

  // Return uninstaller function to restore original fetch cleanly
  return () => {
    globalThis.fetch = originalFetch;
  };
}