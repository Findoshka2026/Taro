import type { TaskCategory } from '../i18n/types';

export interface BilingualText {
  ru: string;
  en: string;
}

export interface TaskTemplate {
  id: string;
  category: TaskCategory;
  title: BilingualText;
  description: BilingualText;
  quote: BilingualText;
  /** Major Arcana name when the task is symbolically tied to one. */
  arcana?: string;
  /** Card art identifier — see `data/cardArt.ts`. */
  cardArtId: CardArtId;
}

export type CardArtId =
  | 'flame'
  | 'moon'
  | 'eye'
  | 'sword'
  | 'chalice'
  | 'star'
  | 'sun'
  | 'tower'
  | 'wheel'
  | 'pentacle'
  | 'wand'
  | 'lotus'
  | 'feather'
  | 'serpent'
  | 'key';

export const TASK_BANK: TaskTemplate[] = [
  // ── Wands · Creative ──
  {
    id: 'creative-1',
    category: 'creative',
    cardArtId: 'flame',
    title: {
      ru: 'Зажги маленький огонь',
      en: 'Kindle a small flame',
    },
    description: {
      ru: 'Сделай 15-минутный набросок, заметку или эскиз чего-то, что давно крутится в голове. Без оценок — только искра.',
      en: 'Spend 15 minutes sketching, jotting or doodling something that has been circling in your head. No judgment — only the spark.',
    },
    quote: {
      ru: '«Творчество — это мужество идти за своим видением, не зная, куда оно ведёт.»',
      en: '"Creativity takes courage to follow a vision wherever it leads."',
    },
  },
  {
    id: 'creative-2',
    category: 'creative',
    cardArtId: 'wand',
    title: {
      ru: 'Перепридумай скучное',
      en: 'Reimagine the dull',
    },
    description: {
      ru: 'Возьми один обычный предмет рядом и придумай ему три невозможных применения.',
      en: 'Pick an ordinary object nearby and invent three impossible uses for it.',
    },
    quote: {
      ru: '«Воображение важнее знания.»',
      en: '"Imagination is more important than knowledge."',
    },
  },
  {
    id: 'creative-3',
    category: 'creative',
    cardArtId: 'feather',
    title: {
      ru: 'Письмо себе из будущего',
      en: 'Letter from your future self',
    },
    description: {
      ru: 'Напиши короткое письмо себе через год. Что бы ты сказал?',
      en: 'Write a short letter to yourself one year from now. What would you say?',
    },
    quote: {
      ru: '«Настоящее всегда чуть-чуть пишет твоё будущее.»',
      en: '"The present always writes a little of your future."',
    },
  },
  {
    id: 'creative-4',
    category: 'creative',
    cardArtId: 'star',
    title: {
      ru: 'Три невозможные идеи',
      en: 'Three impossible ideas',
    },
    description: {
      ru: 'Запиши три идеи, которые кажутся слишком странными, чтобы существовать. Выбери одну и подумай, как сделать первый шаг.',
      en: 'Write down three ideas that feel too strange to exist. Pick one and consider what a first step would look like.',
    },
    quote: {
      ru: '«Невозможное — всего лишь возможное, ещё не освоенное.»',
      en: '"The impossible is just the possible not yet practiced."',
    },
  },

  // ── Cups · Rest ──
  {
    id: 'rest-1',
    category: 'rest',
    cardArtId: 'chalice',
    title: {
      ru: 'Долгая чашка',
      en: 'A slow cup',
    },
    description: {
      ru: 'Завари любимый напиток и выпей его без телефона, медленно, прислушиваясь к вкусу.',
      en: 'Brew a favourite drink and finish it without your phone, slowly, tasting it fully.',
    },
    quote: {
      ru: '«Покой — это тоже продуктивность, просто другой её алхимии.»',
      en: '"Stillness is productivity in a different alchemy."',
    },
  },
  {
    id: 'rest-2',
    category: 'rest',
    cardArtId: 'moon',
    title: {
      ru: 'Десять минут тишины',
      en: 'Ten minutes of silence',
    },
    description: {
      ru: 'Найди десять минут полной тишины — без музыки, разговоров и уведомлений. Просто слушай мир.',
      en: 'Find ten minutes of pure silence — no music, talk, or notifications. Just listen to the world.',
    },
    quote: {
      ru: '«В тишине слышно то, что обычно тонет в шуме.»',
      en: '"In silence we hear what usually drowns in noise."',
    },
  },
  {
    id: 'rest-3',
    category: 'rest',
    cardArtId: 'lotus',
    title: {
      ru: 'Прогулка без цели',
      en: 'A walk without aim',
    },
    description: {
      ru: 'Выйди на 20 минут на воздух без маршрута и сценария. Замечай, что притягивает взгляд.',
      en: 'Step outside for 20 minutes with no route or plan. Notice what catches your eye.',
    },
    quote: {
      ru: '«Маршрут без цели иногда приводит туда, куда было нужно.»',
      en: '"A path without a destination sometimes leads exactly where you needed."',
    },
  },
  {
    id: 'rest-4',
    category: 'rest',
    cardArtId: 'chalice',
    title: {
      ru: 'Заметить три радости',
      en: 'Notice three joys',
    },
    description: {
      ru: 'Запиши три маленьких приятных вещи, которые случились сегодня — даже самые крошечные.',
      en: 'Write down three small pleasant things that happened today — even the tiniest.',
    },
    quote: {
      ru: '«Из мелочей складывается ткань хороших дней.»',
      en: '"Small things weave the cloth of good days."',
    },
  },

  // ── Swords · Study ──
  {
    id: 'study-1',
    category: 'study',
    cardArtId: 'sword',
    title: {
      ru: 'Узнать что-то новое',
      en: 'Learn one new thing',
    },
    description: {
      ru: 'Прочитай или посмотри 10 минут о теме, в которой совсем не разбираешься. Сформулируй главное одной фразой.',
      en: 'Spend 10 minutes reading or watching about a topic you know nothing about. Sum it up in one sentence.',
    },
    quote: {
      ru: '«Острый ум острее любого клинка.»',
      en: '"A sharp mind cuts deeper than any blade."',
    },
  },
  {
    id: 'study-2',
    category: 'study',
    cardArtId: 'eye',
    title: {
      ru: 'Перечитай свои заметки',
      en: 'Revisit your notes',
    },
    description: {
      ru: 'Открой старые заметки или конспекты и найди одну мысль, которая снова актуальна сегодня.',
      en: 'Open old notes and find one thought that is relevant today again.',
    },
    quote: {
      ru: '«Мудрость — это вспомненное вовремя.»',
      en: '"Wisdom is what you remember at the right moment."',
    },
  },
  {
    id: 'study-3',
    category: 'study',
    cardArtId: 'feather',
    title: {
      ru: 'Один вопрос — один ответ',
      en: 'One question, one answer',
    },
    description: {
      ru: 'Сформулируй вопрос, который давно тебя занимает. Найди один внятный ответ — пусть даже неполный.',
      en: 'Frame a question that has been nagging you. Find one clear answer, even if incomplete.',
    },
    quote: {
      ru: '«Хороший вопрос — половина правильного пути.»',
      en: '"A good question is half the right path."',
    },
  },
  {
    id: 'study-4',
    category: 'study',
    cardArtId: 'sword',
    title: {
      ru: '20 минут практики',
      en: 'Twenty minutes of practice',
    },
    description: {
      ru: 'Удели 20 минут любимому навыку (язык, инструмент, код, рисунок) — без отвлечений.',
      en: 'Give 20 focused minutes to a beloved skill — language, instrument, code, drawing.',
    },
    quote: {
      ru: '«Мастерство — это сумма обыкновенных дней.»',
      en: '"Mastery is the sum of ordinary days."',
    },
  },

  // ── Pentacles · Routine ──
  {
    id: 'routine-1',
    category: 'routine',
    cardArtId: 'pentacle',
    title: {
      ru: 'Освободить угол',
      en: 'Reclaim a corner',
    },
    description: {
      ru: 'Выбери один маленький уголок (стол, полку, ящик) и приведи его в порядок.',
      en: 'Choose one small corner (a desk, shelf, drawer) and tidy it.',
    },
    quote: {
      ru: '«Порядок снаружи — пространство для мысли внутри.»',
      en: '"Order outside is space for thought inside."',
    },
  },
  {
    id: 'routine-2',
    category: 'routine',
    cardArtId: 'wheel',
    title: {
      ru: 'Закрыть зависшее',
      en: 'Close a loose end',
    },
    description: {
      ru: 'Доделай одно маленькое дело, которое висит уже несколько дней.',
      en: 'Finish one small thing that has been hanging on your list for days.',
    },
    quote: {
      ru: '«Каждое закрытое дело отдаёт энергию обратно.»',
      en: '"Every closed task returns its energy to you."',
    },
  },
  {
    id: 'routine-3',
    category: 'routine',
    cardArtId: 'pentacle',
    title: {
      ru: 'Маленькая инвестиция',
      en: 'A tiny investment',
    },
    description: {
      ru: 'Сделай одну вещь, которая поможет завтрашнему «себе» (приготовь одежду, налей воды, запиши план на утро).',
      en: 'Do one thing that helps tomorrow-you (lay out clothes, fill water, jot a morning plan).',
    },
    quote: {
      ru: '«Завтрашний день строится из сегодняшних мелочей.»',
      en: '"Tomorrow is built from the small things you do today."',
    },
  },
  {
    id: 'routine-4',
    category: 'routine',
    cardArtId: 'key',
    title: {
      ru: 'Цифровой порядок',
      en: 'Digital tidying',
    },
    description: {
      ru: 'Удали 15 ненужных файлов, фото или приложений — освободи воздух в устройстве.',
      en: 'Delete 15 unneeded files, photos or apps — give your device some air.',
    },
    quote: {
      ru: '«У внимания тоже есть рабочий стол.»',
      en: '"Attention has its own desktop."',
    },
  },

  // ── Body ──
  {
    id: 'body-1',
    category: 'body',
    cardArtId: 'sun',
    title: {
      ru: '20 минут движения',
      en: 'Twenty minutes of motion',
    },
    description: {
      ru: 'Любая активность 20 минут: танец, растяжка, прогулка, велосипед.',
      en: 'Any activity for 20 minutes: dance, stretch, walk, bike ride.',
    },
    quote: {
      ru: '«Тело хранит ту мудрость, которую ум забывает.»',
      en: '"The body keeps wisdom the mind forgets."',
    },
  },
  {
    id: 'body-2',
    category: 'body',
    cardArtId: 'moon',
    title: {
      ru: 'Лечь раньше',
      en: 'Sleep earlier',
    },
    description: {
      ru: 'Сегодня ляг хотя бы на 30 минут раньше обычного. Без экрана за час до сна.',
      en: 'Tonight, get to bed at least 30 minutes earlier. No screens for an hour before.',
    },
    quote: {
      ru: '«Сон — это магический круг, в котором заживают раны.»',
      en: '"Sleep is the magic circle where wounds heal."',
    },
  },
  {
    id: 'body-3',
    category: 'body',
    cardArtId: 'lotus',
    title: {
      ru: 'Пять глубоких вдохов',
      en: 'Five deep breaths',
    },
    description: {
      ru: 'Три раза за день остановись и сделай пять медленных глубоких вдохов. По 4 секунды вдох, 6 — выдох.',
      en: 'Three times today, pause and take five slow deep breaths. 4 seconds in, 6 seconds out.',
    },
    quote: {
      ru: '«Дыхание — это нить, на которую нанизан день.»',
      en: '"Breath is the thread that strings the day together."',
    },
  },

  // ── Social ──
  {
    id: 'social-1',
    category: 'social',
    cardArtId: 'chalice',
    title: {
      ru: 'Маленькое спасибо',
      en: 'A small thank-you',
    },
    description: {
      ru: 'Напиши кому-то короткое сообщение «спасибо» за что-то конкретное.',
      en: 'Send someone a short, specific thank-you message.',
    },
    quote: {
      ru: '«Благодарность — самое мягкое и сильное волшебство.»',
      en: '"Gratitude is the gentlest and strongest magic."',
    },
  },
  {
    id: 'social-2',
    category: 'social',
    cardArtId: 'feather',
    title: {
      ru: 'Услышать другого',
      en: 'Truly listen',
    },
    description: {
      ru: 'В одном разговоре сегодня не перебивай, не готовь ответ заранее. Просто слушай.',
      en: 'In one conversation today, do not interrupt or pre-plan your answer. Just listen.',
    },
    quote: {
      ru: '«Слушать — это тот же дар, что и говорить.»',
      en: '"To listen is as great a gift as to speak."',
    },
  },
  {
    id: 'social-3',
    category: 'social',
    cardArtId: 'star',
    title: {
      ru: 'Маленький жест',
      en: 'A small gesture',
    },
    description: {
      ru: 'Сделай для кого-то одно маленькое доброе дело без причины и без ожидания «спасибо».',
      en: 'Do one small kind thing for someone with no reason and no expectation.',
    },
    quote: {
      ru: '«Малая доброта возвращается окольными путями.»',
      en: '"Small kindness returns by hidden roads."',
    },
  },

  // ── Mystic / Major Arcana ──
  {
    id: 'mystic-1',
    category: 'mystic',
    cardArtId: 'eye',
    arcana: 'The Magician',
    title: {
      ru: 'Назвать желание',
      en: 'Name the wish',
    },
    description: {
      ru: 'Запиши одно желание, в котором ты до конца не признавался даже себе. Просто напиши.',
      en: 'Write down one wish you have not fully admitted, even to yourself. Just put it on paper.',
    },
    quote: {
      ru: '«Названное обретает форму.»',
      en: '"What is named takes form."',
    },
  },
  {
    id: 'mystic-2',
    category: 'mystic',
    cardArtId: 'wheel',
    arcana: 'The Wheel of Fortune',
    title: {
      ru: 'Принять перемену',
      en: 'Welcome a change',
    },
    description: {
      ru: 'Сделай одну вещь иначе, чем обычно: другой маршрут, другой порядок, другой стул. Просто чтобы заметить.',
      en: 'Do one thing differently than usual: a new route, new order, new chair. Just to notice.',
    },
    quote: {
      ru: '«Колесо вращается само — наш выбор только в том, как сесть.»',
      en: '"The wheel turns on its own — our choice is how to ride it."',
    },
  },
  {
    id: 'mystic-3',
    category: 'mystic',
    cardArtId: 'star',
    arcana: 'The Star',
    title: {
      ru: 'Поверить во что-то снова',
      en: 'Believe again',
    },
    description: {
      ru: 'Вспомни одну мечту, в которую ты перестал верить. Сегодня сделай один маленький шаг навстречу ей.',
      en: 'Remember one dream you stopped believing in. Today, take one small step towards it.',
    },
    quote: {
      ru: '«Звезда не светит сильнее — мы просто перестаём смотреть на небо.»',
      en: '"Stars don\u2019t shine brighter — we just stop looking up."',
    },
  },
  {
    id: 'mystic-4',
    category: 'mystic',
    cardArtId: 'tower',
    arcana: 'The Tower',
    title: {
      ru: 'Отпустить лишнее',
      en: 'Let one thing go',
    },
    description: {
      ru: 'Откажись от одной маленькой обязанности или привычки, которая давно перестала помогать.',
      en: 'Drop one small habit or duty that has stopped helping you long ago.',
    },
    quote: {
      ru: '«Иногда башню рушат, чтобы освободить вид.»',
      en: '"Sometimes the tower falls so the view can return."',
    },
  },
  {
    id: 'mystic-5',
    category: 'mystic',
    cardArtId: 'sun',
    arcana: 'The Sun',
    title: {
      ru: 'Праздник без повода',
      en: 'A reason-free celebration',
    },
    description: {
      ru: 'Устрой себе маленький праздник без повода: вкусная еда, любимая музыка, свечка. Просто потому что.',
      en: 'Throw yourself a tiny celebration with no occasion: good food, favourite music, a candle. Just because.',
    },
    quote: {
      ru: '«Радость не заслуживают — её впускают.»',
      en: '"Joy is not earned — it is invited in."',
    },
  },
  {
    id: 'mystic-6',
    category: 'mystic',
    cardArtId: 'serpent',
    arcana: 'Death',
    title: {
      ru: 'Похоронить старое',
      en: 'Bury the old',
    },
    description: {
      ru: 'Закрой одну вкладку, чат или подписку, которые давно стали шумом, а не полезным.',
      en: 'Close one tab, chat, or subscription that has long been noise rather than help.',
    },
    quote: {
      ru: '«Окончание — это форма освобождения.»',
      en: '"Endings are a form of release."',
    },
  },
];

const CATEGORIES: TaskCategory[] = [
  'creative',
  'rest',
  'study',
  'routine',
  'body',
  'social',
  'mystic',
];

/** Pick three task templates with distinct categories deterministically per day. */
export const drawThreeForDay = (epochDay: number, seed = 0): TaskTemplate[] => {
  const cats = [...CATEGORIES].sort(
    (a, b) => hash(`${epochDay}-${seed}-${a}`) - hash(`${epochDay}-${seed}-${b}`),
  );
  const chosenCats = cats.slice(0, 3);
  return chosenCats.map((cat) => {
    const pool = TASK_BANK.filter((t) => t.category === cat);
    const idx = hash(`${epochDay}-${seed}-${cat}`) % pool.length;
    return pool[idx];
  });
};

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};
