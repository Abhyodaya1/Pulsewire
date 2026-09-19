import { PROTOCOL_VERSION } from '@rn-studio/protocol';

export { RingBuffer } from './RingBuffer';
export { EventBus, type EventListener } from './EventBus';
export { redact } from './redact';

export function getVersion(): string {
  return PROTOCOL_VERSION;
}