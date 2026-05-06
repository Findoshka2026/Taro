export type Language = 'ru' | 'en';

export type TaskCategory =
  | 'creative'
  | 'rest'
  | 'study'
  | 'routine'
  | 'body'
  | 'social'
  | 'mystic';

export interface Translations {
  app: {
    title: string;
    todayTask: string;
    tap: string;
  };
  cards: {
    burning: string;
    revealing: string;
    completed: string;
    deckTitle: string;
  };
  buttons: {
    complete: string;
    add: string;
    addTask: string;
    generate: string;
    generateAi: string;
    skip: string;
    save: string;
    cancel: string;
    close: string;
    retry: string;
    drawAgain: string;
  };
  stats: {
    title: string;
    total: string;
    currentStreak: string;
    bestStreak: string;
    completedToday: string;
    days: string;
    tasks: string;
    nothing: string;
  };
  streak: {
    title: string;
    keepFireBurning: string;
    nextLevel: (n: number) => string;
    levels: Record<string, string>;
    motivational: string[];
  };
  history: {
    title: string;
    empty: string;
  };
  add: {
    title: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    quotePlaceholder: string;
    categoryLabel: string;
  };
  settings: {
    title: string;
    language: string;
    languageHint: string;
    aiSection: string;
    aiHint: string;
    sounds: string;
    haptics: string;
  };
  category: Record<TaskCategory, string>;
  timer: {
    label: string;
    hours: string;
    minutes: string;
    expired: string;
  };
  errors: {
    aiFailed: string;
    addEmpty: string;
  };
}
