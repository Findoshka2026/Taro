import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ModalSheet } from '../components/ModalSheet';
import { CardArt } from '../data/cardArt';
import type { CardArtId } from '../data/taskBank';
import { t as tFor } from '../i18n';
import { useAppStore } from '../state/store';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

const ALL_CARDS: CardArtId[] = [
  'flame',
  'moon',
  'eye',
  'sword',
  'chalice',
  'star',
  'sun',
  'tower',
  'wheel',
  'pentacle',
  'wand',
  'lotus',
  'feather',
  'serpent',
  'key',
];

const CARD_NAMES: Record<CardArtId, { ru: string; en: string }> = {
  flame: { ru: 'Пламя', en: 'Flame' },
  moon: { ru: 'Луна', en: 'Moon' },
  eye: { ru: 'Око', en: 'Eye' },
  sword: { ru: 'Меч', en: 'Sword' },
  chalice: { ru: 'Чаша', en: 'Chalice' },
  star: { ru: 'Звезда', en: 'Star' },
  sun: { ru: 'Солнце', en: 'Sun' },
  tower: { ru: 'Башня', en: 'Tower' },
  wheel: { ru: 'Колесо', en: 'Wheel' },
  pentacle: { ru: 'Пентакль', en: 'Pentacle' },
  wand: { ru: 'Жезл', en: 'Wand' },
  lotus: { ru: 'Лотос', en: 'Lotus' },
  feather: { ru: 'Перо', en: 'Feather' },
  serpent: { ru: 'Змея', en: 'Serpent' },
  key: { ru: 'Ключ', en: 'Key' },
};

const SCREEN_W = Dimensions.get('window').width;
const GRID_PAD = 22;
const GRID_GAP = 10;
const CELL_W = Math.floor((SCREEN_W - GRID_PAD * 2 - GRID_GAP * 4) / 3);
const CELL_H = Math.round(CELL_W * 1.5);

export const AlbumModal: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const modal = useAppStore((s) => s.modal);
  const setModal = useAppStore((s) => s.setModal);
  const collection = useAppStore((s) => s.cardCollection);

  const t = tFor(language);
  const collected = ALL_CARDS.filter((c) => (collection[c] ?? 0) > 0).length;

  return (
    <ModalSheet
      visible={modal === 'album'}
      onClose={() => setModal(null)}
      title={t.album.title}
      contentStyle={styles.sheet}
    >
      <Text style={styles.subtitle}>{t.album.subtitle}</Text>
      <Text style={styles.progress}>{t.album.progress(collected, ALL_CARDS.length)}</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {ALL_CARDS.map((id) => {
          const count = collection[id] ?? 0;
          const isCollected = count > 0;
          return (
            <View key={id} style={styles.cell}>
              <View style={styles.cellArtWrap}>
                {isCollected ? (
                  <CardArt id={id} width={CELL_W} height={CELL_H} />
                ) : (
                  <LockedSilhouette />
                )}
                <View style={styles.cellOverlay} pointerEvents="none">
                  <LinearGradient
                    colors={[
                      'transparent',
                      'transparent',
                      'rgba(11,7,35,0.85)',
                    ]}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
                {isCollected && count > 1 ? (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>×{count}</Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[styles.name, !isCollected && styles.nameLocked]}
                numberOfLines={1}
              >
                {isCollected ? CARD_NAMES[id][language] : t.album.locked}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </ModalSheet>
  );
};

const LockedSilhouette: React.FC = () => (
  <LinearGradient
    colors={[colors.ink, colors.twilight, colors.ink]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.lockedBg}
  >
    <Text style={styles.lockedGlyph}>?</Text>
  </LinearGradient>
);

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 18,
    maxHeight: '85%',
  },
  subtitle: {
    ...typography.bodyDim,
    color: colors.mist,
    textAlign: 'center',
    marginBottom: 6,
  },
  progress: {
    ...typography.label,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: {
    maxHeight: CELL_H * 3 + 90,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  cell: {
    width: CELL_W,
    alignItems: 'center',
  },
  cellArtWrap: {
    width: CELL_W,
    height: CELL_H,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: 'rgba(212, 162, 76, 0.45)',
    position: 'relative',
  },
  cellOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  countBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 162, 76, 0.85)',
  },
  countText: {
    ...typography.label,
    color: colors.ink,
    fontSize: 9,
    fontWeight: '700',
  },
  lockedBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedGlyph: {
    color: 'rgba(244, 229, 194, 0.18)',
    fontSize: 38,
    fontWeight: '300',
  },
  name: {
    ...typography.label,
    color: colors.cream,
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  nameLocked: {
    color: 'rgba(244, 229, 194, 0.35)',
    fontStyle: 'italic',
  },
});
