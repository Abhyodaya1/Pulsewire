import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getVersion, RNStudio } from '@rn-studio/sdk';

export default function App(): React.JSX.Element {
  const sdkVersion = getVersion();
  const [hostTapCount, setHostTapCount] = useState<number>(0);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />

        {/* Host App Main Card */}
        <View style={styles.card}>
          <Text style={styles.badge}>DEMO HOST APP</Text>
          <Text style={styles.title}>RN Studio</Text>
          <Text style={styles.subtitle}>
            React Native Integration Testbed
          </Text>

          <View style={styles.divider} />

          <Text style={styles.statusText}>
            Embedded SDK Protocol:{' '}
            <Text style={styles.highlight}>v{sdkVersion}</Text>
          </Text>

          {/* Interactive touch pass-through test button */}
          <View style={styles.testSection}>
            <Text style={styles.testLabel}>Touch Pass-Through Verification:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.hostButton}
              onPress={() => setHostTapCount((prev) => prev + 1)}
            >
              <Text style={styles.hostButtonText}>
                Tap Host App Button ({hostTapCount})
              </Text>
            </TouchableOpacity>
            <Text style={styles.hintText}>
              Verifies the floating bubble does not block host UI touches.
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* The In-App DevTools Overlay */}
      <RNStudio enabled={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#030712',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badge: {
    alignSelf: 'flex-start',
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  highlight: {
    color: '#34d399',
    fontWeight: '700',
  },
  testSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  testLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  hostButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  hostButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  hintText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
});