import type { TaskCategory } from '../i18n/types';
import type { CardArtId, TaskTemplate } from '../data/taskBank';

const PROXY_URL =
  'https://taro-proxy.findoshka2k26.workers.dev/v1/chat/completions';
const APP_TOKEN = 'Mb2JmylDfDNs2thxd8xqDKN5lGm0FEvnimAYiC20400';
const MODEL = 'llama-3.3-70b-versatile';

const ALLOWED_CATEGORIES: TaskCategory[] = [
  'creative',
  'rest',
  'study',
  'routine',
  'body',
  'social',
  'mystic',
];

const ALLOWED_ART: CardArtId[] = [
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

const buildPrompt = (lang: 'ru' | 'en'): string => {
  if (lang === 'ru') {
    return [
      'Ты — оракул-планировщик в стиле таро. Сгенерируй ОДНУ задачу на день.',
      'Возвращай ТОЛЬКО валидный JSON без markdown и комментариев.',
      'Структура:',
      '{ "title": string, "description": string, "quote": string, "category": one of ' +
        JSON.stringify(ALLOWED_CATEGORIES) +
        ', "cardArtId": one of ' +
        JSON.stringify(ALLOWED_ART) +
        ' }',
      'Требования:',
      '- title — короткое (до 6 слов), вдохновляющее, в стиле названий карт.',
      '- description — 1–3 предложения, конкретное действие на сегодня (10–30 минут).',
      '- quote — поэтичная цитата в кавычках «», 1 предложение.',
      '- category выбирай по смыслу.',
      '- cardArtId выбирай по смыслу: flame/wand=творчество, chalice/lotus=отдых, sword/eye/feather=знания, pentacle/wheel/key=рутина, sun/star=общее, moon=сон, tower/serpent=отпустить.',
      'Только JSON.',
    ].join('\n');
  }
  return [
    'You are a tarot-flavoured task oracle. Generate ONE daily task.',
    'Return ONLY valid JSON without markdown or commentary.',
    'Schema:',
    '{ "title": string, "description": string, "quote": string, "category": one of ' +
      JSON.stringify(ALLOWED_CATEGORIES) +
      ', "cardArtId": one of ' +
      JSON.stringify(ALLOWED_ART) +
      ' }',
    'Rules:',
    '- title: short (max 6 words), inspirational, like a tarot card name.',
    '- description: 1–3 sentences, a concrete action for today (10–30 min).',
    '- quote: a poetic quote in "..." marks, 1 sentence.',
    '- pick category by meaning.',
    '- cardArtId by theme: flame/wand=creative, chalice/lotus=rest, sword/eye/feather=study, pentacle/wheel/key=routine, sun/star=general, moon=sleep, tower/serpent=letting go.',
    'JSON only.',
  ].join('\n');
};

interface GeneratedTask {
  title: string;
  description: string;
  quote: string;
  category: TaskCategory;
  cardArtId: CardArtId;
}

export const generateTaskWithGroq = async (
  language: 'ru' | 'en',
): Promise<TaskTemplate> => {
  const prompt = buildPrompt(language);

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Token': APP_TOKEN,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.85,
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You output only JSON objects. No markdown. No explanations. No code fences.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Proxy ${response.status}: ${errText.slice(0, 120)}`);
  }

  const data = await response.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from proxy');

  const parsed = parseJsonLoose<GeneratedTask>(content);
  if (!parsed) throw new Error('Could not parse JSON from response');
  validate(parsed);

  const id = `ai-${Date.now()}`;
  return {
    id,
    category: parsed.category,
    cardArtId: parsed.cardArtId,
    title: { ru: parsed.title, en: parsed.title },
    description: { ru: parsed.description, en: parsed.description },
    quote: { ru: parsed.quote, en: parsed.quote },
  };
};

const parseJsonLoose = <T,>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    try {
      return JSON.parse(raw.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
};

const validate = (t: GeneratedTask): void => {
  if (!t.title || !t.description || !t.quote) {
    throw new Error('Missing required fields in generated task');
  }
  if (!ALLOWED_CATEGORIES.includes(t.category)) {
    t.category = 'mystic';
  }
  if (!ALLOWED_ART.includes(t.cardArtId)) {
    t.cardArtId = 'star';
  }
};
