import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getVersion } from '@rn-studio/sdk';

export default function App(): React.JSX.Element {
  const sdkVersion = getVersion();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
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
});