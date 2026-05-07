import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'tarot-daily:v1';

export interface PersistedState {
  language: 'ru' | 'en';
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  notificationsEnabled: boolean;
  customTasks: import('../data/taskBank').TaskTemplate[];
  history: HistoryEntry[];
  streak: {
    current: number;
    best: number;
    lastCompletedEpochDay: number | null;
  };
  today: TodayState | null;
  /**
   * Number of times each card art has been completed. Used by the
   * Album / collection screen and by achievement predicates.
   */
  cardCollection: Partial<Record<import('../data/taskBank').CardArtId, number>>;
  /** IDs of achievements that have been unlocked at least once. */
  unlockedAchievements: string[];
}

export interface HistoryEntry {
  templateId: string;
  title: string;
  description: string;
  quote: string;
  category: import('../i18n/types').TaskCategory;
  cardArtId: import('../data/taskBank').CardArtId;
  completedAt: string;
  epochDay: number;
}

export interface TodayState {
  epochDay: number;
  drawnIds: string[];
  selectedIndex: number | null;
  startedAt: string | null;
  completedAt: string | null;
  /**
   * If non-null, the active task data overrides the drawn template (e.g. the
   * user picked their own custom task or generated one with AI).
   */
  override: {
    templateId: string;
    title: string;
    description: string;
    quote: string;
    category: import('../i18n/types').TaskCategory;
    cardArtId: import('../data/taskBank').CardArtId;
  } | null;
  /**
   * Identifier of the locally scheduled “don’t forget your card”
   * notification, so we can cancel it when the task is completed.
   */
  scheduledNotificationId: string | null;
}

export const loadPersisted = async (): Promise<Partial<PersistedState>> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch (err) {
    console.warn('Failed to load persisted state', err);
    return {};
  }
};

export const savePersisted = async (state: PersistedState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to persist state', err);
  }
};
