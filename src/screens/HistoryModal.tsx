import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '../components/ModalSheet';
import { useAppStore } from '../state/store';
import { t as tFor } from '../i18n';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';
import { CardArt } from '../data/cardArt';

const formatDate = (iso: string, lang: 'ru' | 'en'): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
  });
};

export const HistoryModal: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const modal = useAppStore((s) => s.modal);
  const setModal = useAppStore((s) => s.setModal);
  const history = useAppStore((s) => s.history);

  const t = tFor(language);

  return (
    <ModalSheet
      visible={modal === 'history'}
      onClose={() => setModal(null)}
      title={t.history.title}
    >
      {history.length === 0 ? (
        <Text style={styles.empty}>{t.history.empty}</Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 460 }}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {history.slice(0, 60).map((entry) => (
            <View key={`${entry.completedAt}-${entry.templateId}`} style={styles.row}>
              <View style={styles.miniCard}>
                <CardArt id={entry.cardArtId} width={50} height={80} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.date}>{formatDate(entry.completedAt, language)}</Text>
                <Text style={styles.title} numberOfLines={1}>
                  {entry.title}
                </Text>
                <Text style={styles.category}>{t.category[entry.category]}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  empty: {
    ...typography.body,
    color: colors.whisper,
    textAlign: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(212, 162, 76, 0.18)',
  },
  miniCard: {
    width: 50,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.4)',
  },
  copy: {
    flex: 1,
  },
  date: {
    ...typography.label,
    color: colors.gold,
    fontSize: 10,
    marginBottom: 2,
  },
  title: {
    ...typography.body,
    color: colors.cream,
    fontWeight: '600',
  },
  category: {
    ...typography.bodyDim,
    color: colors.mist,
    marginTop: 2,
  },
});
