import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';

interface BurnOverlayProps {
  width: number;
  height: number;
}

interface Spark {
  x: number;
  y: number;
  size: number;
  delay: number;
  endX: number;
  endY: number;
}

/**
 * Renders a layered burn-away effect: a creeping ember edge, a fading char
 * gradient and a dozen bright sparks scattered on top.
 */
export const BurnOverlay: React.FC<BurnOverlayProps> = ({ width, height }) => {
  const burn = useSharedValue(0);

  useEffect(() => {
    burn.value = withTiming(1, {
      duration: 900,
      easing: Easing.inOut(Easing.quad),
    });
  }, [burn]);

  const charStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burn.value, [0, 0.4, 1], [0, 0.6, 0.95]),
  }));

  const emberStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burn.value, [0, 0.5, 1], [0, 1, 0]),
    transform: [
      { translateY: interpolate(burn.value, [0, 1], [height, -10]) },
    ],
  }));

  const sparks = useMemo<Spark[]>(() => {
    let seed = 9842;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed % 10000) / 10000;
    };
    return Array.from({ length: 18 }, () => ({
      x: rand() * width,
      y: 30 + rand() * (height - 60),
      size: 2 + rand() * 3,
      delay: rand() * 350,
      endX: (rand() - 0.5) * 80,
      endY: -60 - rand() * 100,
    }));
  }, [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, charStyle]}>
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(20, 8, 4, 0.7)',
            'rgba(40, 14, 4, 0.95)',
            'rgba(8, 4, 2, 1)',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.ember,
          { width, height: 22 },
          emberStyle,
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 122, 69, 0)', '#FFB347', '#FF7A45', 'rgba(255, 70, 30, 0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      {sparks.map((s, i) => (
        <SparkDot key={i} spark={s} progress={burn} />
      ))}
    </View>
  );
};

const SparkDot: React.FC<{
  spark: Spark;
  progress: SharedValue<number>;
}> = ({ spark, progress }) => {
  const opacityShared = useSharedValue(0);

  useEffect(() => {
    opacityShared.value = withDelay(
      spark.delay,
      withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
    );
  }, [opacityShared, spark.delay]);

  const style = useAnimatedStyle(() => {
    const t = progress.value;
    const opa = opacityShared.value * (1 - Math.max(0, (t - 0.6) * 2.5));
    return {
      transform: [
        { translateX: t * spark.endX },
        { translateY: t * spark.endY },
      ],
      opacity: Math.max(0, opa),
    };
  });

  return (
    <Animated.View
      style={[
        styles.spark,
        {
          left: spark.x,
          top: spark.y,
          width: spark.size,
          height: spark.size,
          borderRadius: spark.size / 2,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ember: {
    position: 'absolute',
    left: 0,
  },
  spark: {
    position: 'absolute',
    backgroundColor: colors.goldGlow,
    shadowColor: colors.gold,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
