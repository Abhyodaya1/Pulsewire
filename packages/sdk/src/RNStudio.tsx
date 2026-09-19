import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DebugBubble } from './overlay/DebugBubble';
import { DebugPanel } from './overlay/DebugPanel';

export interface RNStudioProps {
  /**
   * Explicitly enable the overlay even outside __DEV__ (e.g. staging builds).
   * Defaults to false.
   */
  enabled?: boolean;
}

export const RNStudio: React.FC<RNStudioProps> = ({ enabled = false }) => {
  // INVARIANT: DevTools must never render in production unless explicitly forced
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
  if (!isDev && !enabled) {
    return null;
  }

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [eventCount, setEventCount] = useState<number>(3); // Mocked 3 events for Phase 2

  const handleClear = () => {
    setEventCount(0);
  };

  return (
    // INVARIANT: pointerEvents="box-none" ensures this root view allows touches
    // to pass straight through to the host application screens underneath.
    <View style={styles.rootContainer} pointerEvents="box-none">
      {!isPanelOpen && (
        <DebugBubble
          onPress={() => setIsPanelOpen(true)}
          eventCount={eventCount}
        />
      )}

      <DebugPanel
        visible={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onClear={handleClear}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99990,
  },
});