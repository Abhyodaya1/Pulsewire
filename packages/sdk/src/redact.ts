const DEFAULT_SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'password',
  'token',
]);

/**
 * Checks whether an object is a plain record vs. a complex native instance.
 */
function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  if (obj === null || typeof obj !== 'object') return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype;
}

/**
 * Strips known sensitive keys case-insensitively and recursively.
 * Optimized for low-allocation traversal on Hermes/V8 engines.
 */
export function redact<T>(
  target: T,
  sensitiveKeys: Set<string> = DEFAULT_SENSITIVE_KEYS,
  seen: WeakSet<object> = new WeakSet()
): T {
  // 1. Fast exit for primitives, functions, and null
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 2. Prevent circular recursion
  if (seen.has(target)) {
    return '[Circular]' as unknown as T;
  }
  seen.add(target);

  // 3. Preserve native built-ins without traversal
  if (
    target instanceof Date ||
    target instanceof RegExp ||
    target instanceof Error
  ) {
    return target;
  }

  // 4. Arrays: pre-allocated loop (faster than Array.prototype.map)
  if (Array.isArray(target)) {
    const len = target.length;
    const copy = new Array(len);
    for (let i = 0; i < len; i++) {
      copy[i] = redact(target[i], sensitiveKeys, seen);
    }
    return copy as unknown as T;
  }

  // 5. If it is not a plain object (e.g. FormData, Blobs, Streams), leave untouched
  if (!isPlainObject(target)) {
    return target;
  }

  // 6. Plain objects: iterate keys without allocating [k, v] entry tuples
  const result: Record<string, unknown> = {};
  const keys = Object.keys(target);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i]!;
    if (sensitiveKeys.has(key.toLowerCase())) {
      continue;
    }
    result[key] = redact(target[key], sensitiveKeys, seen);
  }

  return result as T;
}