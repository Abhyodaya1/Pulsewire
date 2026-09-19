import React ,{ useState, useEffect } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

export type TabType = 'network' | 'logs' | 'navigation' | 'device';

interface DebugPanelProps {
    visible: boolean;
    onClose: () => void;
    onClear: () => void;
    
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
    visible, onClose, onClear
})=>{
  const [activeTab, setActiveTab] = useState<TabType>('network');
  const [fps, setFps] = useState<number>(60);
  const [droppedFrames, setDroppedFrames] = useState<number>(0);

  const { width, height , scale } = useWindowDimensions();
const getNow = (): number => {
  return typeof globalThis !== 'undefined' && (globalThis as any).performance?.now
    ? (globalThis as any).performance.now()
    : Date.now();
};
useEffect(() => {
  if (!visible) return;

  let targetHz = 60;
  let expectedInterval = 1000 / targetHz; // ~16.67ms
  let jankThreshold = expectedInterval * 2; // ~33.34ms

  let calibrationFrames = 0;
  const CALIBRATION_LIMIT = 30; // Calibrate across first 30 frames
  let minObservedInterval = Infinity;

  // Measurement window trackers (sampled every 500ms)
  let windowFrameCount = 0;
  let windowStartTime = getNow();

  // Instant frame-to-frame tracker (for jank detection)
  let prevFrameTime = getNow();

  // Total drops counter
  let totalDrops = 0;
  let animId: number;

  const loop = (now: number) => {
    // 2. Instantaneous delta between consecutive frames
    const frameDelta = now - prevFrameTime;
    prevFrameTime = now;

    // 3. Auto-Calibration Phase (Runs only during first 30 frames)
    if (calibrationFrames < CALIBRATION_LIMIT) {
      // Ignore crazy spikes during initial mount
      if (frameDelta > 4 && frameDelta < 25) {
        if (frameDelta < minObservedInterval) {
          minObservedInterval = frameDelta;
        }
      }
      calibrationFrames++;

      if (calibrationFrames === CALIBRATION_LIMIT && minObservedInterval !== Infinity) {
        // Map observed frame delta to nearest standard refresh rate
        if (minObservedInterval <= 9.5) {
          targetHz = 120; // 120Hz ProMotion / High-refresh panel (~8.33ms)
        } else if (minObservedInterval <= 13.0) {
          targetHz = 90;  // 90Hz panel (~11.11ms)
        } else {
          targetHz = 60;  // Standard 60Hz (~16.67ms)
        }

        // Recompute dynamic thresholds based on calibrated Hz
        expectedInterval = 1000 / targetHz;
        jankThreshold = expectedInterval * 2;
      }
    }

    // 4. Dynamic Hitch Detection (uses expectedInterval & jankThreshold)
    if (frameDelta > jankThreshold) {
      const missedFrames = Math.floor(frameDelta / expectedInterval) - 1;
      if (missedFrames > 0) {
        totalDrops += missedFrames;
        setDroppedFrames(totalDrops);
      }
    }

    // 5. Increment frame count in current sampling window
    windowFrameCount++;

    // 6. Evaluate aggregate FPS every 500ms
    const windowElapsed = now - windowStartTime;
    if (windowElapsed >= 500) {
      const calculatedFps = Math.round((windowFrameCount * 1000) / windowElapsed);
      
      // Clamp dynamically to detected targetHz instead of fixed 60
      setFps(Math.min(targetHz, calculatedFps));

      // Reset window metrics
      windowFrameCount = 0;
      windowStartTime = now;
    }

    // 7. Schedule next frame
    animId = requestAnimationFrame(loop);
  };

  // Kick off the loop
  animId = requestAnimationFrame(loop);

  // Stop loop cleanly on unmount or when drawer is hidden
  return () => {
    cancelAnimationFrame(animId);
  };
}, [visible]);
if (!visible) {
    return null;
  }

  const mockNetwork = [
    { id: '1', method: 'POST', url: '/v1/auth/login', status: 200, duration: '48ms', time: '12:00:01' },
    { id: '2', method: 'GET', url: '/v1/users/profile', status: 200, duration: '112ms', time: '12:00:03' },
    { id: '3', method: 'GET', url: '/v1/cart/items', status: 504, duration: '3012ms', time: '12:00:06' },
  ];
  const mockLogs = [
    { id: '1', level: 'info', msg: 'Application booted with Hermes runtime', time: '12:00:00' },
    { id: '2', level: 'warn', msg: 'Overdue task queue item detected in scheduler', time: '12:00:04' },
    { id: '3', level: 'error', msg: 'Network timeout on /v1/cart/items', time: '12:00:06' },
  ];
  const mockNav = [
    { id: '1', from: null, to: 'SplashScreen', time: '12:00:00' },
    { id: '2', from: 'SplashScreen', to: 'LoginScreen', time: '12:00:02' },
    { id: '3', from: 'LoginScreen', to: 'HomeScreen', time: '12:00:05' },
  ];

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.panelContainer}>
          
          {/* Header Bar - Responsive Flex Layout */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>RN</Text>
              </View>
              <Text style={styles.headerTitle} numberOfLines={1}>DEVTOOLS</Text>
            </View>
            {/* Performance & FPS Ticker */}
            <View style={styles.perfBar}>
              <View style={[
                styles.fpsBadge,
                fps >= 55 ? styles.fpsGood : fps >= 40 ? styles.fpsMedium : styles.fpsBad
              ]}>
                <Text style={styles.fpsText}>{fps} FPS</Text>
              </View>
              {droppedFrames > 0 && (
                <Text style={styles.dropText}>{droppedFrames} drops</Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={onClear} style={styles.actionBtn}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Tab Selector - Equal Fluid Flex Distribution */}
          <View style={styles.tabBar}>
            {(['network', 'logs', 'navigation', 'device'] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              >
                <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Scrollable Content Area */}
          <View style={styles.content}>
            {activeTab === 'network' && (
              <FlatList
                data={mockNetwork}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View style={styles.itemRow}>
                      <View style={[
                        styles.methodBadge,
                        item.method === 'POST' ? styles.badgePost : styles.badgeGet
                      ]}>
                        <Text style={styles.methodText}>{item.method}</Text>
                      </View>
                      <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="middle">
                        {item.url}
                      </Text>
                      <Text style={[
                        styles.statusText,
                        item.status >= 400 ? styles.statusErr : styles.statusOk
                      ]}>
                        {item.status}
                      </Text>
                    </View>
                    <View style={styles.subRow}>
                      <Text style={styles.metaText}>{item.duration}</Text>
                      <Text style={styles.metaText}>{item.time}</Text>
                    </View>
                  </View>
                )}
              />
            )}
            {activeTab === 'logs' && (
              <FlatList
                data={mockLogs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View style={styles.itemRow}>
                      <Text style={[
                        styles.logLevel,
                        item.level === 'error' ? styles.statusErr : item.level === 'warn' ? styles.fpsMediumText : styles.statusOk
                      ]}>
                        [{item.level.toUpperCase()}]
                      </Text>
                      <Text style={styles.logMsg} numberOfLines={2}>{item.msg}</Text>
                    </View>
                    <View style={styles.subRow}>
                      <Text style={styles.metaText}>{item.time}</Text>
                    </View>
                  </View>
                )}
              />
            )}
            {activeTab === 'navigation' && (
              <FlatList
                data={mockNav}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View style={styles.itemRow}>
                      <Text style={styles.navFrom} numberOfLines={1}>
                        {item.from ?? '(root)'}
                      </Text>
                      <Text style={styles.navArrow}>→</Text>
                      <Text style={styles.navTo} numberOfLines={1}>
                        {item.to}
                      </Text>
                    </View>
                    <View style={styles.subRow}>
                      <Text style={styles.metaText}>{item.time}</Text>
                    </View>
                  </View>
                )}
              />
            )}
            {activeTab === 'device' && (
              <View style={styles.deviceCard}>
                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>Platform</Text>
                  <Text style={styles.deviceValue}>{Platform.OS} (v{Platform.Version})</Text>
                </View>
                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>Viewport</Text>
                  <Text style={styles.deviceValue}>
                    {Math.round(width)} × {Math.round(height)} @ {scale}x
                  </Text>
                </View>
                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>JS Engine</Text>
                  <Text style={styles.deviceValue}>
                    {(globalThis as any).HermesInternal ? 'Hermes' : 'JSC / V8'}
                  </Text>
                </View>
                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>JS Thread FPS</Text>
                  <Text style={[styles.deviceValue, { color: '#38bdf8' }]}>
                    {fps} FPS ({droppedFrames} dropped)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.95)',
    zIndex: 99998,
  },
  safeArea: {
    flex: 1,
  },
  panelContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  logoBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  perfBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fpsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  fpsGood: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  fpsMedium: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  fpsBad: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  fpsText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#34d399',
  },
  dropText: {
    fontSize: 10,
    color: '#f87171',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#38bdf8',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: '#38bdf8',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  listItem: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeGet: { backgroundColor: 'rgba(56, 189, 248, 0.2)' },
  badgePost: { backgroundColor: 'rgba(168, 85, 247, 0.2)' },
  methodText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  urlText: {
    flex: 1,
    fontSize: 12,
    color: '#f1f5f9',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusOk: { color: '#34d399' },
  statusErr: { color: '#f87171' },
  fpsMediumText: { color: '#fbbf24' },
  metaText: {
    fontSize: 10,
    color: '#64748b',
  },
  logLevel: {
    fontSize: 11,
    fontWeight: '700',
  },
  logMsg: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
  },
  navFrom: {
    fontSize: 12,
    color: '#94a3b8',
    flexShrink: 1,
  },
  navArrow: {
    fontSize: 12,
    color: '#38bdf8',
    paddingHorizontal: 4,
  },
  navTo: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '700',
    flexShrink: 1,
  },
  deviceCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    gap: 8,
  },
  deviceLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  deviceValue: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
  },
});
