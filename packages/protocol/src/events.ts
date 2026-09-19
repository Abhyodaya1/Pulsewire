export type EventType =  'network' | 'device' | 'console' | 'navigation'

export interface BaseEvent {
    id: string;
    timestamp: number;
    sessionId: string;
}

export interface NetworkEventPayload 
{
    requestId : string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    status: number;
    durationMs: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseBody?: unknown;
  error?: string;
}

export interface NetworkStudioEvent extends BaseEvent {
    type: 'network';
    payload: NetworkEventPayload;
}   

export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
export interface ConsoleEventPayload {
  level: ConsoleLogLevel;
  messages: unknown[];
  stack?: string;
}

export interface ConsoleStudioEvent extends BaseEvent {
    type: 'console';
    payload: ConsoleEventPayload;
}

export interface DeviceEventPayload {
     platform: 'ios' | 'android' | 'web' | 'windows' | 'macos' | 'unknown';
  osVersion: string;
  appVersion: string;
  rnVersion: string;
  screen: {
    width: number;
    height: number;
    scale: number;
  };
}

export interface DeviceStudioEvent extends BaseEvent {
  type: 'device';
  payload: DeviceEventPayload;
}

export interface NavigationEventPayload {
  fromRoute: string | null;
  toRoute: string;
  params?: Record<string, unknown>;
}
export interface NavigationStudioEvent extends BaseEvent {
  type: 'navigation';
  payload: NavigationEventPayload;
}

export type StudioEvent =
  | NetworkStudioEvent
  | ConsoleStudioEvent
  | NavigationStudioEvent
  | DeviceStudioEvent;