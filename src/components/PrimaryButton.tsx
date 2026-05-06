import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppStore } from '../state/store';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

type Variant = 'gold' | 'ghost' | 'ember';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'gold',
  disabled,
  loading,
  fullWidth,
  style,
}) => {
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);

  const handlePress = () => {
    if (disabled || loading) return;
    if (hapticsEnabled) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const isGold = variant === 'gold';
  const isEmber = variant === 'ember';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.root,
        fullWidth ? styles.fullWidth : null,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {isGold ? (
        <LinearGradient
          colors={[colors.goldDeep, colors.gold, colors.goldGlow, colors.gold]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {isEmber ? (
        <LinearGradient
          colors={['#7A1F0E', colors.ember, colors.emberHot]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={isGold ? colors.ink : colors.gold} />
      ) : (
        <Text
          style={[
            styles.label,
            isGold ? styles.labelGold : null,
            variant === 'ghost' ? styles.labelGhost : null,
            isEmber ? styles.labelEmber : null,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    minHeight: 50,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 162, 76, 0.55)',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelGold: {
    color: colors.ink,
  },
  labelGhost: {
    color: colors.cream,
  },
  labelEmber: {
    color: colors.cream,
  },
});
