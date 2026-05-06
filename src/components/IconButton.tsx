import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { useAppStore } from '../state/store';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

interface IconButtonProps {
  glyph: string;
  label?: string;
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * Compact pill button with an emoji-like glyph and optional label,
 * used for secondary actions (stats, streak, history, settings).
 */
export const IconButton: React.FC<IconButtonProps> = ({ glyph, label, onPress, style }) => {
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  return (
    <Pressable
      onPress={() => {
        if (hapticsEnabled) {
          void Haptics.selectionAsync();
        }
        onPress();
      }}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
    >
      <Text style={styles.glyph}>{glyph}</Text>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(244, 229, 194, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.45)',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  glyph: {
    fontSize: 16,
    color: colors.gold,
    marginRight: 8,
  },
  label: {
    ...typography.bodyDim,
    color: colors.cream,
    fontWeight: '600',
  },
});
