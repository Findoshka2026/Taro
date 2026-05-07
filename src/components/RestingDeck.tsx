import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CardBack } from './CardBack';

interface RestingDeckProps {
  width: number;
  height: number;
}

/**
 * A small stack of card backs with subtle offsets — the deck "resting" after
 * the day's task is complete.
 */
export const RestingDeck: React.FC<RestingDeckProps> = ({ width, height }) => (
  <View style={[styles.wrap, { width, height }]}>
    <View
      style={[
        styles.card,
        {
          width,
          height,
          transform: [{ translateX: 12 }, { translateY: 6 }, { rotate: '6deg' }],
          opacity: 0.55,
        },
      ]}
    >
      <CardBack width={width} height={height} />
    </View>
    <View
      style={[
        styles.card,
        {
          width,
          height,
          transform: [{ translateX: -10 }, { translateY: 4 }, { rotate: '-4deg' }],
          opacity: 0.7,
        },
      ]}
    >
      <CardBack width={width} height={height} />
    </View>
    <View style={[styles.card, { width, height }]}>
      <CardBack width={width} height={height} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
});
