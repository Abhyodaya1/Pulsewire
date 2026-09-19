import { EventBus } from '../EventBus';
import { redact } from '../redact';
import {
  ConsoleLogLevel,
  ConsoleStudioEvent,
  StudioEvent,
} from '@rn-studio/protocol';

export interface ConsoleCollectorOptions {
  bus: EventBus<StudioEvent>;
  sessionId: string;
}

const LOG_LEVELS: ConsoleLogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

/**
 * Wraps console methods (log, info, warn, error, debug) to capture runtime logs,
 * redact sensitive arguments, extract stack traces, and emit ConsoleStudioEvents.
 * Preserves original console output in Metro, Xcode, and Android Logcat.
 */
export function initializeConsoleCollector({
  bus,
  sessionId,
}: ConsoleCollectorOptions): () => void {
  const originalMethods: Partial<Record<ConsoleLogLevel, (...args: any[]) => void>> = {};
  let isIntercepting = false;

  LOG_LEVELS.forEach((level) => {
    const original = console[level];
    if (typeof original === 'function') {
      originalMethods[level] = original;

      console[level] = function (...args: any[]) {
        // 1. INVARIANT: Always execute original console method first to preserve stdout/Metro logs
        original.apply(console, args);

        // 2. INVARIANT: Re-entrancy guard to prevent infinite recursion
        if (isIntercepting) {
          return;
        }

        try {
          isIntercepting = true;

          let errorStack: string | undefined = undefined;

          // Format and redact each argument
          const processedMessages = args.map((arg) => {
            if (arg instanceof Error) {
              if (!errorStack) {
                errorStack = arg.stack;
              }
              return {
                name: arg.name,
                message: arg.message,
                stack: arg.stack,
              };
            }
            return redact(arg);
          });

          // For error-level logs, capture synthetic stack if no Error instance was passed
          if (level === 'error' && !errorStack) {
            const syntheticError = new Error();
            errorStack = syntheticError.stack;
          }

          const event: ConsoleStudioEvent = {
            id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'console',
            sessionId,
            timestamp: Date.now(),
            payload: {
              level,
              messages: processedMessages,
              stack: errorStack,
            },
          };

          bus.emit(event);
        } catch {
          // Fail silently to guarantee we never crash the host application
        } finally {
          isIntercepting = false;
        }
      };
    }
  });

  // Return clean teardown function
  return () => {
    LOG_LEVELS.forEach((level) => {
      const original = originalMethods[level];
      if (original) {
        console[level] = original;
      }
    });
  };
}