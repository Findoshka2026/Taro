import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '../components/ModalSheet';
import { ACHIEVEMENTS } from '../data/achievements';
import { CardArt } from '../data/cardArt';
import { t as tFor } from '../i18n';
import { useAppStore } from '../state/store';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

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
  const unlocked = useAppStore((s) => s.unlockedAchievements);

  const t = tFor(language);
  const idx = pickLevel(streak.current);
  const levelKey = LEVELS[idx].key;
  const next = LEVELS[idx + 1];
  const remaining = next ? next.threshold - streak.current : 0;
  const motivational =
    t.streak.motivational[streak.current % t.streak.motivational.length];

  const unlockedSet = new Set(unlocked);

  return (
    <ModalSheet
      visible={modal === 'streak'}
      onClose={() => setModal(null)}
      title={t.streak.title}
      contentStyle={styles.sheet}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{t.achievements.title}</Text>
        <Text style={styles.sectionSubtitle}>
          {t.achievements.progress(unlocked.length, ACHIEVEMENTS.length)}
        </Text>

        <View style={styles.achievementList}>
          {ACHIEVEMENTS.map((a) => {
            const isUnlocked = unlockedSet.has(a.id);
            return (
              <View
                key={a.id}
                style={[styles.achievementRow, !isUnlocked && styles.achievementRowLocked]}
              >
                <View
                  style={[
                    styles.achievementGlyph,
                    !isUnlocked && styles.achievementGlyphLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.achievementGlyphText,
                      !isUnlocked && styles.achievementGlyphTextLocked,
                    ]}
                  >
                    {isUnlocked ? a.glyph : '·'}
                  </Text>
                </View>
                <View style={styles.achievementText}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !isUnlocked && styles.achievementTitleLocked,
                    ]}
                    numberOfLines={1}
                  >
                    {isUnlocked ? a.title[language] : t.achievements.locked}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDesc,
                      !isUnlocked && styles.achievementDescLocked,
                    ]}
                    numberOfLines={2}
                  >
                    {a.description[language]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    maxHeight: '88%',
  },
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
  sectionTitle: {
    ...typography.title,
    color: colors.cream,
    fontSize: 18,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.label,
    color: colors.gold,
    marginBottom: 12,
  },
  achievementList: {
    gap: 8,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 229, 194, 0.06)',
    borderWidth: 0.6,
    borderColor: 'rgba(212, 162, 76, 0.45)',
  },
  achievementRowLocked: {
    backgroundColor: 'rgba(11, 7, 35, 0.4)',
    borderColor: 'rgba(244, 229, 194, 0.12)',
  },
  achievementGlyph: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212, 162, 76, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 0.6,
    borderColor: 'rgba(212, 162, 76, 0.55)',
  },
  achievementGlyphLocked: {
    backgroundColor: 'rgba(244, 229, 194, 0.04)',
    borderColor: 'rgba(244, 229, 194, 0.12)',
  },
  achievementGlyphText: {
    fontSize: 18,
    color: colors.goldGlow,
  },
  achievementGlyphTextLocked: {
    color: 'rgba(244, 229, 194, 0.25)',
    fontSize: 22,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.title,
    color: colors.cream,
    fontSize: 14,
  },
  achievementTitleLocked: {
    color: 'rgba(244, 229, 194, 0.4)',
    fontStyle: 'italic',
  },
  achievementDesc: {
    ...typography.bodyDim,
    color: colors.mist,
    fontSize: 11,
    marginTop: 2,
  },
  achievementDescLocked: {
    color: 'rgba(167, 139, 212, 0.5)',
  },
});
