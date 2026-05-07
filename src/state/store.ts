import { create } from 'zustand';

import { findNewlyUnlocked } from '../data/achievements';
import { drawThreeForDay, TASK_BANK, TaskTemplate } from '../data/taskBank';
import type { Language } from '../i18n/types';
import {
  cancelScheduledReminder,
  scheduleTaskReminder,
} from '../services/notifications';
import {
  HistoryEntry,
  loadPersisted,
  PersistedState,
  savePersisted,
  TodayState,
} from './storage';
import { epochDay, TWELVE_HOURS_MS } from '../utils/date';

const DEFAULT_STATE: PersistedState = {
  language: 'ru',
  hapticsEnabled: true,
  soundsEnabled: true,
  notificationsEnabled: true,
  customTasks: [],
  history: [],
  streak: {
    current: 0,
    best: 0,
    lastCompletedEpochDay: null,
  },
  today: null,
  cardCollection: {},
  unlockedAchievements: [],
};

interface UiState {
  isHydrated: boolean;
  /**
   * Visual phase of the home screen — drives which view is rendered:
   * `idle` = three cards displayed; `burning` = neighbours burn away;
   * `revealing` = chosen card flips face up; `active` = task is shown;
   * `completed` = deck rests until tomorrow.
   */
  phase: 'idle' | 'burning' | 'revealing' | 'active' | 'completed';
  modal:
    | null
    | 'stats'
    | 'streak'
    | 'history'
    | 'add'
    | 'settings'
    | 'generate'
    | 'album';
  isGenerating: boolean;
  errorMessage: string | null;
  /** Achievement ID waiting to be shown as a toast (null = nothing). */
  achievementToast: string | null;
}

interface Actions {
  hydrate: () => Promise<void>;
  setLanguage: (lang: Language) => void;
  setHaptics: (enabled: boolean) => void;
  setSounds: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => Promise<void>;
  dismissAchievementToast: () => void;
  /** Initialise today's three cards if a new day has begun. */
  rollDailyDraw: () => void;
  /** User taps one of the three cards. */
  selectCard: (index: number) => void;
  /** Mark the chosen card as flipped and show task. */
  finishReveal: () => void;
  /** Complete today's task, update streak, log history. */
  completeToday: () => void;
  /** Replace today's task with a custom one (the user just authored). */
  applyOverride: (override: NonNullable<TodayState['override']>) => void;
  /** Add a permanent custom task template to the bank. */
  addCustomTask: (template: TaskTemplate) => void;
  /** Open / close modals. */
  setModal: (modal: UiState['modal']) => void;
  setGenerating: (v: boolean) => void;
  setError: (msg: string | null) => void;
  /** Internal — re-roll for testing or after override clear. */
  redrawDay: () => void;
}

export type AppState = PersistedState & UiState & Actions;

const persistKeys: (keyof PersistedState)[] = [
  'language',
  'hapticsEnabled',
  'soundsEnabled',
  'notificationsEnabled',
  'customTasks',
  'history',
  'streak',
  'today',
  'cardCollection',
  'unlockedAchievements',
];

const persist = (state: AppState): void => {
  const out = persistKeys.reduce<Record<string, unknown>>((acc, key) => {
    acc[key] = state[key];
    return acc;
  }, {});
  void savePersisted(out as unknown as PersistedState);
};

const findTemplate = (id: string, customs: TaskTemplate[]): TaskTemplate | undefined =>
  customs.find((t) => t.id === id) ?? TASK_BANK.find((t) => t.id === id);

export const useAppStore = create<AppState>((set, get) => ({
  ...DEFAULT_STATE,
  isHydrated: false,
  phase: 'idle',
  modal: null,
  isGenerating: false,
  errorMessage: null,

  hydrate: async () => {
    const stored = await loadPersisted();
    const merged: PersistedState = {
      ...DEFAULT_STATE,
      ...stored,
      streak: { ...DEFAULT_STATE.streak, ...(stored.streak ?? {}) },
      customTasks: stored.customTasks ?? [],
      history: stored.history ?? [],
      cardCollection: stored.cardCollection ?? {},
      unlockedAchievements: stored.unlockedAchievements ?? [],
    };
    set({
      ...merged,
      isHydrated: true,
      phase: derivePhase(merged.today),
    });
    get().rollDailyDraw();
  },

  setLanguage: (lang) => {
    set({ language: lang });
    persist(get());
  },
  setHaptics: (enabled) => {
    set({ hapticsEnabled: enabled });
    persist(get());
  },
  setSounds: (enabled) => {
    set({ soundsEnabled: enabled });
    persist(get());
  },
  setNotifications: async (enabled) => {
    set({ notificationsEnabled: enabled });
    persist(get());
    if (!enabled) {
      const today = get().today;
      if (today?.scheduledNotificationId) {
        await cancelScheduledReminder(today.scheduledNotificationId);
        set({
          today: { ...today, scheduledNotificationId: null },
        });
        persist(get());
      }
    }
  },
  dismissAchievementToast: () => set({ achievementToast: null }),

  rollDailyDraw: () => {
    const today = epochDay();
    const current = get().today;
    if (current && current.epochDay === today) {
      // Already drawn for today — keep it.
      set({ phase: derivePhase(current) });
      return;
    }
    // New day — cancel any leftover reminder from yesterday.
    if (current?.scheduledNotificationId) {
      void cancelScheduledReminder(current.scheduledNotificationId);
    }
    const drawn = drawThreeForDay(today);
    const next: TodayState = {
      epochDay: today,
      drawnIds: drawn.map((t) => t.id),
      selectedIndex: null,
      startedAt: null,
      completedAt: null,
      override: null,
      scheduledNotificationId: null,
    };
    set({ today: next, phase: 'idle' });
    persist(get());
  },

  redrawDay: () => {
    const today = epochDay();
    const current = get().today;
    if (current?.scheduledNotificationId) {
      void cancelScheduledReminder(current.scheduledNotificationId);
    }
    const drawn = drawThreeForDay(today, Date.now());
    const next: TodayState = {
      epochDay: today,
      drawnIds: drawn.map((t) => t.id),
      selectedIndex: null,
      startedAt: null,
      completedAt: null,
      override: null,
      scheduledNotificationId: null,
    };
    set({ today: next, phase: 'idle' });
    persist(get());
  },

  selectCard: (index) => {
    const today = get().today;
    if (!today) return;
    if (today.selectedIndex !== null) return;
    const startedAt = new Date();
    const updated: TodayState = {
      ...today,
      selectedIndex: index,
      startedAt: startedAt.toISOString(),
    };
    set({ today: updated, phase: 'burning' });
    persist(get());
    // Fire-and-forget: schedule the reminder one hour before the timer
    // runs out, then patch the today state with the resulting id.
    if (get().notificationsEnabled) {
      void scheduleTaskReminder(
        startedAt,
        {
          ru: 'Загляни в карту дня — задача почти растает.',
          en: 'Look at your card — the task is about to fade.',
        },
        get().language,
      ).then((id) => {
        if (!id) return;
        const t = get().today;
        if (!t || t.epochDay !== updated.epochDay || t.completedAt) {
          // Day already finished or rolled over before scheduling resolved.
          void cancelScheduledReminder(id);
          return;
        }
        set({ today: { ...t, scheduledNotificationId: id } });
        persist(get());
      });
    }
  },

  finishReveal: () => {
    set({ phase: 'active' });
  },

  completeToday: () => {
    const state = get();
    const today = state.today;
    if (!today || today.completedAt) return;
    const template = today.override
      ? null
      : today.selectedIndex !== null
        ? findTemplate(today.drawnIds[today.selectedIndex], state.customTasks)
        : null;
    if (!template && !today.override) return;

    const lang = state.language;
    const entry: HistoryEntry = today.override
      ? {
          templateId: today.override.templateId,
          title: today.override.title,
          description: today.override.description,
          quote: today.override.quote,
          category: today.override.category,
          cardArtId: today.override.cardArtId,
          completedAt: new Date().toISOString(),
          epochDay: today.epochDay,
        }
      : {
          templateId: template!.id,
          title: template!.title[lang],
          description: template!.description[lang],
          quote: template!.quote[lang],
          category: template!.category,
          cardArtId: template!.cardArtId,
          completedAt: new Date().toISOString(),
          epochDay: today.epochDay,
        };

    const todayN = epochDay();
    const lastDay = state.streak.lastCompletedEpochDay;
    const continuing = lastDay !== null && todayN - lastDay === 1;
    const sameDay = lastDay === todayN;
    const nextCurrent = sameDay
      ? state.streak.current
      : continuing
        ? state.streak.current + 1
        : 1;
    const nextBest = Math.max(state.streak.best, nextCurrent);

    if (today.scheduledNotificationId) {
      void cancelScheduledReminder(today.scheduledNotificationId);
    }

    const cardCollection = {
      ...state.cardCollection,
      [entry.cardArtId]: (state.cardCollection[entry.cardArtId] ?? 0) + 1,
    } as PersistedState['cardCollection'];

    const nextHistory = [entry, ...state.history].slice(0, 365);
    const nextStreak = {
      current: nextCurrent,
      best: nextBest,
      lastCompletedEpochDay: todayN,
    };
    const newlyUnlocked = findNewlyUnlocked(state.unlockedAchievements, {
      history: nextHistory,
      streak: nextStreak,
      cardCollection,
    });
    const unlocked = [...state.unlockedAchievements, ...newlyUnlocked];

    set({
      today: {
        ...today,
        completedAt: entry.completedAt,
        scheduledNotificationId: null,
      },
      phase: 'completed',
      history: nextHistory,
      streak: nextStreak,
      cardCollection,
      unlockedAchievements: unlocked,
      achievementToast: newlyUnlocked[0] ?? null,
    });
    persist(get());
  },

  applyOverride: (override) => {
    const today = get().today;
    if (!today) return;
    const updated: TodayState = {
      ...today,
      override,
      selectedIndex: today.selectedIndex ?? 0,
      startedAt: today.startedAt ?? new Date().toISOString(),
    };
    set({ today: updated, phase: 'active' });
    persist(get());
  },

  addCustomTask: (template) => {
    set({ customTasks: [...get().customTasks, template] });
    persist(get());
  },

  setModal: (modal) => set({ modal }),
  setGenerating: (v) => set({ isGenerating: v }),
  setError: (msg) => set({ errorMessage: msg }),
  achievementToast: null,
}));

const derivePhase = (today: TodayState | null): UiState['phase'] => {
  if (!today) return 'idle';
  if (today.completedAt) {
    // Keep "completed" only if it was today.
    if (today.epochDay === epochDay()) return 'completed';
    return 'idle';
  }
  if (today.selectedIndex !== null && today.startedAt) {
    const elapsed = Date.now() - new Date(today.startedAt).getTime();
    if (elapsed >= TWELVE_HOURS_MS) {
      // Expired — treat as fresh idle for next day.
      return 'idle';
    }
    return 'active';
  }
  return 'idle';
};

export { findTemplate };
