import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, gradients } from '../theme/colors';
import type { CardArtId } from '../data/taskBank';
import { CardBack } from './CardBack';
import { CardFront } from './CardFront';
import { BurnOverlay } from './BurnOverlay';

export type TarotCardState =
  | 'idle' /* lying still on the table, back up */
  | 'hover' /* hovered/pressed - subtle lift + glow */
  | 'burning' /* fades into ash */
  | 'flipping' /* rotateY animation back→front */
  | 'face' /* showing front, slight breathing */
  | 'gone' /* removed */;

interface TarotCardProps {
  state: TarotCardState;
  width: number;
  height: number;
  artId?: CardArtId;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  /** Stagger delay (ms) for entrance breathing animation. */
  delay?: number;
  /** Called once burning animation finishes. */
  onBurnComplete?: () => void;
  /** Called once flip animation finishes. */
  onFlipComplete?: () => void;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  state,
  width,
  height,
  artId,
  title,
  subtitle,
  onPress,
  delay = 0,
  onBurnComplete,
  onFlipComplete,
}) => {
  const breath = useSharedValue(0);
  const lift = useSharedValue(0);
  const flip = useSharedValue(0); // 0..1
  const burn = useSharedValue(0); // 0..1
  const exit = useSharedValue(0); // 0..1 fade away

  useEffect(() => {
    breath.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, [breath, delay]);

  useEffect(() => {
    if (state === 'hover') {
      lift.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) });
    } else if (state !== 'flipping' && state !== 'burning' && state !== 'face') {
      lift.value = withTiming(0, { duration: 220 });
    }

    if (state === 'flipping') {
      flip.value = withTiming(
        1,
        { duration: 900, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished && onFlipComplete) runOnJS(onFlipComplete)();
        },
      );
    } else if (state === 'face') {
      flip.value = 1;
    } else {
      flip.value = 0;
    }

    if (state === 'burning') {
      burn.value = withTiming(
        1,
        { duration: 900, easing: Easing.inOut(Easing.quad) },
        (finished) => {
          if (finished && onBurnComplete) runOnJS(onBurnComplete)();
        },
      );
      exit.value = withDelay(
        450,
        withTiming(1, { duration: 600, easing: Easing.in(Easing.quad) }),
      );
    } else if (state === 'gone') {
      burn.value = 1;
      exit.value = 1;
    } else {
      burn.value = 0;
      exit.value = 0;
    }
  }, [state, flip, burn, exit, lift, onFlipComplete, onBurnComplete]);

  const containerStyle = useAnimatedStyle(() => {
    const liftPx = interpolate(lift.value, [0, 1], [0, -12]);
    const breathScale = 1 + interpolate(breath.value, [0, 1], [0, 0.012]);
    const liftScale = 1 + interpolate(lift.value, [0, 1], [0, 0.05]);
    const exitOpacity = interpolate(exit.value, [0, 1], [1, 0]);
    return {
      transform: [
        { translateY: liftPx },
        { scale: breathScale * liftScale },
      ],
      opacity: exitOpacity,
    };
  });

  const glowOpacity = useDerivedValue(() => {
    return interpolate(lift.value, [0, 1], [0.2, 0.7]);
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * (1 - burn.value),
  }));

  const backStyle = useAnimatedStyle(() => {
    const rotate = `${interpolate(flip.value, [0, 1], [0, 180])}deg`;
    const opacity = flip.value < 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 1000 }, { rotateY: rotate }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    const rotate = `${interpolate(flip.value, [0, 1], [180, 360])}deg`;
    const opacity = flip.value >= 0.5 ? 1 : 0;
    return {
      transform: [{ perspective: 1000 }, { rotateY: rotate }],
      opacity,
      backfaceVisibility: 'hidden',
    };
  });

  const burnStyle = useAnimatedStyle(() => ({
    opacity: burn.value,
  }));

  const interactive = state === 'idle' || state === 'hover';

  return (
    <Animated.View style={[{ width, height }, containerStyle]}>
      {/* Soft golden glow behind the card */}
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { width: width * 1.4, height: height * 1.25 }, glowStyle]}
      />
      <Pressable
        disabled={!interactive || !onPress}
        onPress={onPress}
        style={({ pressed }) => [
          { width, height },
          pressed ? styles.pressed : null,
        ]}
      >
        <Animated.View style={[styles.face, backStyle]}>
          <CardBack width={width} height={height} />
        </Animated.View>
        <Animated.View style={[styles.face, frontStyle]}>
          {artId && title ? (
            <CardFront
              width={width}
              height={height}
              artId={artId}
              title={title}
              subtitle={subtitle}
            />
          ) : (
            <View style={[styles.face, { backgroundColor: colors.ink }]} />
          )}
        </Animated.View>
        <Animated.View style={[styles.burn, burnStyle]} pointerEvents="none">
          <BurnOverlay width={width} height={height} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

void gradients;

const styles = StyleSheet.create({
  face: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.95,
  },
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    backgroundColor: 'rgba(242, 201, 122, 0.18)',
    borderRadius: 200,
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  burn: {
    ...StyleSheet.absoluteFillObject,
  },
});
