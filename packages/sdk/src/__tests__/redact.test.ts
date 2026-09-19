import { describe, it, expect } from 'vitest';
import { redact } from '../redact';

describe('redact() utility', () => {
  it('INVARIANT: removes sensitive keys case-insensitively and leaves everything else untouched', () => {
    const input = {
      username: 'johndoe',
      password: 'supersecretpassword',
      TOKEN: 'bearer-xyz-123',
      Authorization: 'Bearer auth-header-value',
      Cookie: 'session_id=abcdef',
      nested: {
        userId: 42,
        Token: 'nested-token',
        deep: {
          active: true,
          PassWord: 'deep-secret',
        },
      },
    };

    const result = redact(input);

    expect(result).toEqual({
      username: 'johndoe',
      nested: {
        userId: 42,
        deep: {
          active: true,
        },
      },
    });
  });

  it('INVARIANT: leaves non-sensitive input 100% untouched', () => {
    const cleanPayload = {
      url: 'https://api.example.com/v1/users',
      status: 200,
      headers: {
        'content-type': 'application/json',
        accept: '*/*',
      },
      data: [{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }],
    };

    const result = redact(cleanPayload);
    expect(result).toEqual(cleanPayload);
  });

  it('INVARIANT: does not mutate the original input object', () => {
    const input = {
      user: 'alice',
      password: 'mypassword',
    };

    const copy = JSON.parse(JSON.stringify(input));
    const result = redact(input);

    expect(input).toEqual(copy); // Original object was not altered
    expect(result).toEqual({ user: 'alice' });
  });

  it('recursively redacts sensitive keys inside arrays', () => {
    const input = [
      { id: 1, token: 'secret-1' },
      { id: 2, token: 'secret-2', safeKey: 'value' },
    ];

    const result = redact(input);

    expect(result).toEqual([
      { id: 1 },
      { id: 2, safeKey: 'value' },
    ]);
  });

  it('INVARIANT: handles circular references without stack overflow or crash', () => {
    interface CircularTarget {
      name: string;
      password: string;
      self?: CircularTarget;
    }

    const circular: CircularTarget = {
      name: 'circular-test',
      password: 'strip-me',
    };
    circular.self = circular;

    expect(() => redact(circular)).not.toThrow();
    const result = redact(circular);
    expect(result.name).toBe('circular-test');
    expect('password' in result).toBe(false);
  });
});