import { Platform, TextStyle } from 'react-native';

/**
 * Typography uses Cormorant Garamond (serif, ornate) for headings and quotes,
 * and Manrope (clean sans-serif) for body and UI text.
 *
 * Until custom fonts are loaded these gracefully fall back to platform serifs
 * and sans-serifs so the layout still feels intentional during cold starts.
 */
const serifFallback = Platform.select({
  ios: 'Times New Roman',
  android: 'serif',
  default: 'serif',
});

const sansFallback = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif',
  default: 'sans-serif',
});

export const fonts = {
  serif: serifFallback,
  serifItalic: serifFallback,
  sans: sansFallback,
};

export const text = {
  hero: {
    fontFamily: fonts.serif,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.5,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 0.3,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  subtitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    lineHeight: 26,
    fontStyle: 'italic' as TextStyle['fontStyle'],
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  bodyDim: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 1.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  quote: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic' as TextStyle['fontStyle'],
  },
} satisfies Record<string, TextStyle>;
