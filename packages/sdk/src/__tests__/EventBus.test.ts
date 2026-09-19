import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../EventBus';

describe('EventBus', () => {
  it('should notify subscriber when event is emitted', () => {
    const bus = new EventBus<string>();
    const listener = vi.fn();

    bus.subscribe(listener);
    bus.emit('event-1');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('event-1');
  });

  it('INVARIANT: subscribers receive every emitted event in exact order', () => {
   const bus = new EventBus<number>();
   const receivedEvents: number[] = [];

   bus.subscribe((event) => {
     receivedEvents.push(event);
   });

    bus.emit(1);
    bus.emit(2);
    bus.emit(3);

    expect(receivedEvents).toEqual([1, 2, 3]);
  });

  it('should stop receiving events after unsubscription', () => {
    const bus = new EventBus<string>();
    const listener = vi.fn();

    const unsubscribe = bus.subscribe(listener);
    bus.emit('first');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    bus.emit('second');
    expect(listener).toHaveBeenCalledTimes(1); // Still 1, not called again
  });

  it('INVARIANT: error in one subscriber does not prevent others from receiving events', () => {
    const bus = new EventBus<string>();
    const faultyListener = vi.fn(() => {
      throw new Error('Exploding UI component');
    });
    const healthyListener = vi.fn();

    // Suppress console.error during expected failure test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    bus.subscribe(faultyListener);
    bus.subscribe(healthyListener);

    bus.emit('critical-event');

    expect(faultyListener).toHaveBeenCalledWith('critical-event');
    expect(healthyListener).toHaveBeenCalledWith('critical-event');

    consoleSpy.mockRestore();
  });
});