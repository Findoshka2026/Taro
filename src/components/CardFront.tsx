import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CardArt } from '../data/cardArt';
import type { CardArtId } from '../data/taskBank';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

interface CardFrontProps {
  width: number;
  height: number;
  artId: CardArtId;
  title: string;
  subtitle?: string;
}

/**
 * Front face of the card: ornate art panel + title plate.
 */
export const CardFront: React.FC<CardFrontProps> = ({
  width,
  height,
  artId,
  title,
  subtitle,
}) => {
  const artHeight = height * 0.7;
  return (
    <View style={[styles.root, { width, height }]}>
      <View style={[StyleSheet.absoluteFill, styles.bg]} />
      <View style={styles.frame} />
      <View style={[styles.artWrap, { height: artHeight }]}>
        <CardArt id={artId} width={width - 18} height={artHeight - 12} />
      </View>
      <View style={styles.titlePlate}>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  bg: {
    backgroundColor: colors.ink,
  },
  frame: {
    ...StyleSheet.absoluteFillObject,
    margin: 6,
    borderWidth: 1.2,
    borderColor: colors.gold,
    borderRadius: 10,
  },
  artWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  titlePlate: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.label,
    color: colors.gold,
    fontSize: 9,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  title: {
    ...typography.title,
    color: colors.cream,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
  },
});

export default CardFront;
