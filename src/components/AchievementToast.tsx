import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findById } from '../data/achievements';
import { t as tFor } from '../i18n';
import { useAppStore } from '../state/store';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

const VISIBLE_MS = 3500;

export const AchievementToast: React.FC = () => {
  const insets = useSafeAreaInsets();
  const language = useAppStore((s) => s.language);
  const id = useAppStore((s) => s.achievementToast);
  const dismiss = useAppStore((s) => s.dismissAchievementToast);
  const t = tFor(language);

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!id) return;
    translateY.value = withSpring(0, { damping: 14, stiffness: 140 });
    opacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
    translateY.value = withSequence(
      withSpring(0, { damping: 14, stiffness: 140 }),
      withDelay(
        VISIBLE_MS,
        withTiming(-160, { duration: 380, easing: Easing.in(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(dismiss)();
        }),
      ),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 220 }),
      withDelay(VISIBLE_MS, withTiming(0, { duration: 380 })),
    );
  }, [id, translateY, opacity, dismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!id) return null;
  const def = findById(id);
  if (!def) return null;

  return (
    <Animated.View
      style={[styles.wrap, { top: insets.top + 8 }, animatedStyle]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => {
          translateY.value = withTiming(-160, { duration: 220 }, (finished) => {
            if (finished) runOnJS(dismiss)();
          });
          opacity.value = withTiming(0, { duration: 220 });
        }}
        style={styles.pressable}
      >
        <LinearGradient
          colors={[colors.goldDeep, colors.gold, colors.goldGlow, colors.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bg}
        >
          <View style={styles.glyphCircle}>
            <Text style={styles.glyph}>{def.glyph}</Text>
          </View>
          <View style={styles.textCol}>
            <Text style={styles.label} numberOfLines={1}>
              {t.achievements.unlockedToast}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {def.title[language]}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {def.description[language]}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  pressable: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  bg: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  glyphCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(26, 14, 46, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  glyph: {
    fontSize: 22,
  },
  textCol: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.ink,
    opacity: 0.7,
    fontSize: 10,
    marginBottom: 2,
  },
  title: {
    ...typography.title,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  desc: {
    ...typography.bodyDim,
    color: colors.ink,
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },
});
