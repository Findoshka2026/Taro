import type { TaskCategory } from '../i18n/types';
import type { CardArtId } from './taskBank';
import type { HistoryEntry, PersistedState } from '../state/storage';

export interface AchievementDef {
  id: string;
  /** Glyph rendered in the badge — already-supported emoji or unicode mark. */
  glyph: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  /** Returns true when the achievement should be considered unlocked. */
  predicate: (snapshot: AchievementSnapshot) => boolean;
}

export interface AchievementSnapshot {
  history: HistoryEntry[];
  streak: PersistedState['streak'];
  cardCollection: PersistedState['cardCollection'];
}

const uniqueCategoriesIn = (history: HistoryEntry[]): Set<TaskCategory> =>
  new Set(history.map((h) => h.category));

const uniqueCardsIn = (
  collection: PersistedState['cardCollection'],
): Set<CardArtId> =>
  new Set(
    (Object.entries(collection) as [CardArtId, number | undefined][])
      .filter(([, n]) => (n ?? 0) > 0)
      .map(([id]) => id),
  );

const aiCount = (history: HistoryEntry[]): number =>
  history.filter((h) => h.templateId.startsWith('ai-')).length;

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_card',
    glyph: '✨',
    title: { ru: 'Первая искра', en: 'First Spark' },
    description: { ru: 'Выполни первую задачу.', en: 'Complete your first task.' },
    predicate: ({ history }) => history.length >= 1,
  },
  {
    id: 'total_5',
    glyph: '🜂',
    title: { ru: 'Пробудившаяся', en: 'Awakening' },
    description: { ru: 'Выполни 5 задач.', en: 'Complete 5 tasks.' },
    predicate: ({ history }) => history.length >= 5,
  },
  {
    id: 'total_25',
    glyph: '◆',
    title: { ru: 'Хранительница пути', en: 'Path Keeper' },
    description: { ru: 'Выполни 25 задач.', en: 'Complete 25 tasks.' },
    predicate: ({ history }) => history.length >= 25,
  },
  {
    id: 'total_100',
    glyph: '☀',
    title: { ru: 'Светоносная', en: 'Lightbearer' },
    description: { ru: 'Выполни 100 задач.', en: 'Complete 100 tasks.' },
    predicate: ({ history }) => history.length >= 100,
  },
  {
    id: 'streak_3',
    glyph: '🔥',
    title: { ru: 'Огонёк', en: 'Ember' },
    description: { ru: 'Серия 3 дня подряд.', en: '3-day streak.' },
    predicate: ({ streak }) => streak.best >= 3,
  },
  {
    id: 'streak_7',
    glyph: '🔥',
    title: { ru: 'Пламя недели', en: 'Weekly Flame' },
    description: { ru: 'Серия 7 дней подряд.', en: '7-day streak.' },
    predicate: ({ streak }) => streak.best >= 7,
  },
  {
    id: 'streak_30',
    glyph: '☄',
    title: { ru: 'Лунный цикл', en: 'Lunar Cycle' },
    description: { ru: 'Серия 30 дней подряд.', en: '30-day streak.' },
    predicate: ({ streak }) => streak.best >= 30,
  },
  {
    id: 'categories_3',
    glyph: '✦',
    title: { ru: 'Три стихии', en: 'Three Elements' },
    description: {
      ru: 'Выполни задачи из трёх разных мастей.',
      en: 'Complete tasks from three different suits.',
    },
    predicate: ({ history }) => uniqueCategoriesIn(history).size >= 3,
  },
  {
    id: 'categories_all',
    glyph: '🜸',
    title: { ru: 'Все стихии', en: 'All Elements' },
    description: {
      ru: 'Выполни хотя бы по одной задаче из каждой масти.',
      en: 'Complete at least one task from each suit.',
    },
    predicate: ({ history }) => uniqueCategoriesIn(history).size >= 7,
  },
  {
    id: 'card_5',
    glyph: '❖',
    title: { ru: 'Пятая печать', en: 'Fifth Sigil' },
    description: { ru: 'Собери 5 разных карт.', en: 'Collect 5 different cards.' },
    predicate: ({ cardCollection }) => uniqueCardsIn(cardCollection).size >= 5,
  },
  {
    id: 'card_10',
    glyph: '❉',
    title: { ru: 'Десять знамён', en: 'Ten Standards' },
    description: { ru: 'Собери 10 разных карт.', en: 'Collect 10 different cards.' },
    predicate: ({ cardCollection }) => uniqueCardsIn(cardCollection).size >= 10,
  },
  {
    id: 'card_15',
    glyph: '☉',
    title: { ru: 'Полная колода', en: 'Full Deck' },
    description: { ru: 'Собери все 15 карт.', en: 'Collect all 15 cards.' },
    predicate: ({ cardCollection }) => uniqueCardsIn(cardCollection).size >= 15,
  },
  {
    id: 'ai_5',
    glyph: '🌌',
    title: { ru: 'Ясновидящая', en: 'Clairvoyant' },
    description: {
      ru: 'Выполни 5 задач, сгенерированных AI.',
      en: 'Complete 5 AI-generated tasks.',
    },
    predicate: ({ history }) => aiCount(history) >= 5,
  },
];

/** Returns IDs that became unlocked compared to the previously unlocked set. */
export const findNewlyUnlocked = (
  prev: string[],
  snapshot: AchievementSnapshot,
): string[] => {
  const prevSet = new Set(prev);
  return ACHIEVEMENTS.filter((a) => !prevSet.has(a.id) && a.predicate(snapshot)).map(
    (a) => a.id,
  );
};

export const findById = (id: string): AchievementDef | undefined =>
  ACHIEVEMENTS.find((a) => a.id === id);
