// React Native exposes performance.now() via the Hermes runtime.
// This declaration bridges the missing DOM/Node lib types.
declare const performance: {
  now(): number;
};

// React Native exposes the Node.js-style `global` object.
declare const global: Record<string, unknown>;

// React Native's __DEV__ compile-time flag.
declare const __DEV__: boolean;