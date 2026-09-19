import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DebugBubbleProps {
  onPress: () => void;
  eventCount: number;
}

export const DebugBubble: React.FC<DebugBubbleProps> = ({
  onPress,
  eventCount,
}) => {
  // Animated value for 2D position
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 100 })).current;

  // PanResponder to handle drag gestures smoothly
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only take over gesture if finger moved more than 3px (distinguishes tap from drag)
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        // Flatten current offset so new drag starts relative to where it was dropped
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // If the gesture barely moved, treat it as a click/tap
        const isTap =
          Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
        if (isTap) {
          onPress();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.bubble}
      >
        <View style={styles.pulseDot} />
        <Text style={styles.title}>RN</Text>
        {eventCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {eventCount > 99 ? '99+' : eventCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    zIndex: 99999,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#030712',
    borderWidth: 1.5,
    borderColor: '#0284c7', // Sky-600 border glow
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  title: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
});