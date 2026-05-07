/**
 * Mystical tarot palette inspired by night skies and antique parchment.
 *
 * The base layers run from deepest indigo (`night`) up through twilight
 * (`twilight`) and royal purple (`royal`) before catching the warm gold
 * accents (`gold`, `goldGlow`) used for ornate borders, sparks and stars.
 */
export const colors = {
  night: '#0B0723',
  twilight: '#160B33',
  royal: '#3B1B6B',
  amethyst: '#6F3FA8',
  mist: '#A78BD4',

  gold: '#D4A24C',
  goldGlow: '#F2C97A',
  goldDeep: '#8C6321',

  parchment: '#F4E5C2',
  cream: '#F8EDD3',

  ember: '#FF7A45',
  emberHot: '#FFB347',

  ink: '#1A0E2E',
  whisper: '#E9D7FA',
  veil: 'rgba(11, 7, 35, 0.72)',
  ghost: 'rgba(244, 229, 194, 0.08)',
} as const;

export type ColorKey = keyof typeof colors;

export const gradients = {
  night: ['#0B0723', '#160B33', '#3B1B6B'] as const,
  twilight: ['#160B33', '#3B1B6B', '#6F3FA8'] as const,
  goldShimmer: ['#8C6321', '#D4A24C', '#F2C97A', '#D4A24C', '#8C6321'] as const,
  cardBack: ['#1A0E2E', '#3B1B6B', '#1A0E2E'] as const,
  cardFace: ['#241540', '#3B1B6B', '#241540'] as const,
  emberGlow: ['#FF7A45', '#FFB347', '#D4A24C'] as const,
};
