import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';
import { StarsBackground } from './StarsBackground';

interface GradientBgProps {
  children: React.ReactNode;
}

export const GradientBg: React.FC<GradientBgProps> = ({ children }) => (
  <View style={styles.root}>
    <LinearGradient
      colors={[colors.night, colors.twilight, colors.royal]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <LinearGradient
      colors={['rgba(111, 63, 168, 0.35)', 'transparent']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
      style={StyleSheet.absoluteFill}
    />
    <StarsBackground />
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.night,
  },
});
