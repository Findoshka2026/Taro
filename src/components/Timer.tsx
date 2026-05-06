import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';
import { TWELVE_HOURS_MS, formatRemaining } from '../utils/date';

interface TimerProps {
  startedAt: string | null;
  label: string;
  hLabel: string;
  mLabel: string;
  expiredLabel: string;
  /** Notify caller when 12 hours elapse. */
  onExpire?: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  startedAt,
  label,
  hLabel,
  mLabel,
  expiredLabel,
  onExpire,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = startedAt ? now - new Date(startedAt).getTime() : 0;
  const remaining = TWELVE_HOURS_MS - elapsed;
  const expired = startedAt ? remaining <= 0 : false;
  const progress = startedAt
    ? Math.max(0, Math.min(1, elapsed / TWELVE_HOURS_MS))
    : 0;

  useEffect(() => {
    if (expired && onExpire) {
      onExpire();
    }
  }, [expired, onExpire]);

  if (!startedAt) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, expired ? styles.expired : null]}>
        {expired ? expiredLabel : formatRemaining(remaining, hLabel, mLabel)}
      </Text>
      <View style={styles.barOuter}>
        <View
          style={[
            styles.barInner,
            {
              width: `${(1 - progress) * 100}%`,
              backgroundColor: expired ? colors.ember : colors.gold,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 229, 194, 0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.4)',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.gold,
    fontSize: 10,
    marginBottom: 6,
  },
  value: {
    ...typography.title,
    color: colors.cream,
    fontSize: 28,
    fontWeight: '500',
  },
  expired: {
    color: colors.ember,
    fontSize: 16,
    textAlign: 'center',
  },
  barOuter: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(244, 229, 194, 0.12)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  barInner: {
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
});
