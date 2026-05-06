import { ru } from './ru';
import { en } from './en';
import type { Language, Translations } from './types';

export type { Language, Translations, TaskCategory } from './types';

const dictionaries: Record<Language, Translations> = { ru, en };

export const t = (lang: Language): Translations => dictionaries[lang];

export const SUPPORTED_LANGUAGES: { code: Language; native: string }[] = [
  { code: 'ru', native: 'Русский' },
  { code: 'en', native: 'English' },
];
