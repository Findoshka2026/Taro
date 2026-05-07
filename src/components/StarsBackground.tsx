import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  delay: number;
  duration: number;
}

const STAR_COUNT = 70;

const Twinkle: React.FC<{ star: Star }> = ({ star }) => {
  const opacity = useSharedValue(star.baseOpacity);

  React.useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(star.baseOpacity * 1.6, {
            duration: star.duration,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(star.baseOpacity * 0.4, {
            duration: star.duration,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
      ),
    );
  }, [opacity, star.baseOpacity, star.delay, star.duration]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

export const StarsBackground: React.FC = () => {
  const stars = useMemo<Star[]>(() => {
    const out: Star[] = [];
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < STAR_COUNT; i += 1) {
      out.push({
        x: rand() * SCREEN_W,
        y: rand() * SCREEN_H,
        size: 1 + rand() * 2.4,
        baseOpacity: 0.25 + rand() * 0.5,
        delay: rand() * 4000,
        duration: 1800 + rand() * 2200,
      });
    }
    return out;
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s, idx) => (
        <Twinkle key={idx} star={s} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: colors.cream,
    shadowColor: colors.goldGlow,
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});
