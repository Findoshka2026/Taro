import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '../components/ModalSheet';
import { useAppStore } from '../state/store';
import { t as tFor } from '../i18n';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';
import { epochDay } from '../utils/date';

export const StatsModal: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const modal = useAppStore((s) => s.modal);
  const setModal = useAppStore((s) => s.setModal);
  const history = useAppStore((s) => s.history);
  const streak = useAppStore((s) => s.streak);

  const t = tFor(language);
  const today = epochDay();
  const completedToday = history.filter((h) => h.epochDay === today).length;

  const data: { label: string; value: string }[] = [
    { label: t.stats.total, value: `${history.length} ${t.stats.tasks}` },
    { label: t.stats.currentStreak, value: `${streak.current} ${t.stats.days}` },
    { label: t.stats.bestStreak, value: `${streak.best} ${t.stats.days}` },
    { label: t.stats.completedToday, value: completedToday > 0 ? '✓' : '·' },
  ];

  return (
    <ModalSheet
      visible={modal === 'stats'}
      onClose={() => setModal(null)}
      title={t.stats.title}
    >
      {history.length === 0 ? (
        <Text style={styles.empty}>{t.stats.nothing}</Text>
      ) : (
        <View>
          {data.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
          ))}
        </View>
      )}
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  empty: {
    ...typography.body,
    color: colors.whisper,
    textAlign: 'center',
    paddingVertical: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(212, 162, 76, 0.25)',
  },
  label: {
    ...typography.body,
    color: colors.whisper,
  },
  value: {
    ...typography.title,
    color: colors.gold,
    fontSize: 22,
  },
});
