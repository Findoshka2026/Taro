import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '../components/ModalSheet';
import { useAppStore } from '../state/store';
import { t as tFor } from '../i18n';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';
import { CardArt } from '../data/cardArt';

const LEVELS: { key: 'apprentice' | 'adept' | 'mage' | 'archmage'; threshold: number }[] = [
  { key: 'apprentice', threshold: 0 },
  { key: 'adept', threshold: 7 },
  { key: 'mage', threshold: 30 },
  { key: 'archmage', threshold: 100 },
];

const pickLevel = (current: number) => {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (current >= LEVELS[i].threshold) idx = i;
  }
  return idx;
};

export const StreakModal: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const modal = useAppStore((s) => s.modal);
  const setModal = useAppStore((s) => s.setModal);
  const streak = useAppStore((s) => s.streak);

  const t = tFor(language);
  const idx = pickLevel(streak.current);
  const levelKey = LEVELS[idx].key;
  const next = LEVELS[idx + 1];
  const remaining = next ? next.threshold - streak.current : 0;
  const motivational =
    t.streak.motivational[streak.current % t.streak.motivational.length];

  return (
    <ModalSheet
      visible={modal === 'streak'}
      onClose={() => setModal(null)}
      title={t.streak.title}
    >
      <View style={styles.flameWrap}>
        <CardArt id="flame" width={120} height={180} />
      </View>
      <Text style={styles.bigNumber}>{streak.current}</Text>
      <Text style={styles.daysLabel}>{t.stats.days}</Text>
      <Text style={styles.level}>{t.streak.levels[levelKey]}</Text>
      {next ? (
        <Text style={styles.next}>{t.streak.nextLevel(remaining)}</Text>
      ) : null}
      <View style={styles.divider} />
      <Text style={styles.quote}>{motivational}</Text>
      <Text style={styles.bestLabel}>
        {t.stats.bestStreak}: <Text style={styles.bestValue}>{streak.best}</Text>{' '}
        {t.stats.days}
      </Text>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  flameWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  bigNumber: {
    ...typography.hero,
    fontSize: 52,
    color: colors.goldGlow,
    textAlign: 'center',
    fontWeight: '500',
  },
  daysLabel: {
    ...typography.label,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 10,
  },
  level: {
    ...typography.title,
    color: colors.cream,
    textAlign: 'center',
  },
  next: {
    ...typography.bodyDim,
    color: colors.mist,
    textAlign: 'center',
    marginTop: 6,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(212, 162, 76, 0.3)',
    marginVertical: 16,
  },
  quote: {
    ...typography.quote,
    color: colors.parchment,
    textAlign: 'center',
    marginBottom: 14,
  },
  bestLabel: {
    ...typography.bodyDim,
    color: colors.whisper,
    textAlign: 'center',
  },
  bestValue: {
    color: colors.gold,
    fontWeight: '600',
  },
});
