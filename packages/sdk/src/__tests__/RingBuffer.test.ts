import { describe, it, expect } from 'vitest';
import { RingBuffer } from '../RingBuffer';

describe('RingBuffer', () => {
  it('should initialize with default limit of 500', () => {
    const buffer = new RingBuffer<number>();
    expect(buffer.limit).toBe(500);
    expect(buffer.size).toBe(0);
    expect(buffer.isFull).toBe(false);
  });

  it('should reject invalid limits', () => {
    expect(() => new RingBuffer(0)).toThrow();
    expect(() => new RingBuffer(-5)).toThrow();
    expect(() => new RingBuffer(2.5)).toThrow();
  });

  it('should store items without eviction while under limit', () => {
    const buffer = new RingBuffer<string>(3);
    buffer.push('a');
    buffer.push('b');

    expect(buffer.size).toBe(2);
    expect(buffer.getAll()).toEqual(['a', 'b']);
    expect(buffer.isFull).toBe(false);
  });

  it('INVARIANT: never exceeds limit and evicts oldest items first', () => {
    const buffer = new RingBuffer<number>(3);
    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    expect(buffer.isFull).toBe(true);

    // Push 4th item -> 1 should be evicted
    buffer.push(4);
    expect(buffer.size).toBe(3);
    expect(buffer.getAll()).toEqual([2, 3, 4]);

    // Push 5th item -> 2 should be evicted
    buffer.push(5);
    expect(buffer.size).toBe(3);
    expect(buffer.getAll()).toEqual([3, 4, 5]);
  });

  it('INVARIANT: getAll() returns an isolated snapshot copy', () => {
    const buffer = new RingBuffer<string>(3);
    buffer.push('x');
    buffer.push('y');

    const snapshot = buffer.getAll();
    snapshot.push('corrupted'); // Mutate the returned array

    expect(buffer.getAll()).toEqual(['x', 'y']); // Internal buffer remains untouched
  });

  it('should clear buffer on clear()', () => {
    const buffer = new RingBuffer<number>(5);
    buffer.push(1);
    buffer.push(2);
    buffer.clear();

    expect(buffer.size).toBe(0);
    expect(buffer.getAll()).toEqual([]);
  });
});