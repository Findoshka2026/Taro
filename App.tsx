import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GradientBg } from './src/components/GradientBg';
import { HomeScreen } from './src/screens/HomeScreen';
import { StatsModal } from './src/screens/StatsModal';
import { StreakModal } from './src/screens/StreakModal';
import { HistoryModal } from './src/screens/HistoryModal';
import { AddTaskModal } from './src/screens/AddTaskModal';
import { SettingsModal } from './src/screens/SettingsModal';
import { useAppStore } from './src/state/store';
import { colors } from './src/theme/colors';

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate);
  const isHydrated = useAppStore((s) => s.isHydrated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <GradientBg>
          {isHydrated ? (
            <HomeScreen />
          ) : (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.gold} size="large" />
            </View>
          )}
          <StatsModal />
          <StreakModal />
          <HistoryModal />
          <AddTaskModal />
          <SettingsModal />
        </GradientBg>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
