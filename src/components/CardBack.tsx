import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors } from '../theme/colors';

interface CardBackProps {
  width: number;
  height: number;
}

const VW = 200;
const VH = 320;

const Pent = (cx: number, cy: number, r: number, key: string) => {
  const pts: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return (
    <Path
      key={key}
      d={`M${pts[0]} L ${pts[2]} L ${pts[4]} L ${pts[1]} L ${pts[3]} Z`}
      stroke={colors.gold}
      strokeOpacity={0.4}
      strokeWidth={0.7}
      fill="none"
    />
  );
};

/**
 * Card back: a deep purple velvet field, stitched gold borders, an ornate
 * compass-rose with concentric pentacle motifs and a subtle damask grid.
 */
export const CardBack: React.FC<CardBackProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
    <Defs>
      <LinearGradient id="bgBack" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#1A0E2E" />
        <Stop offset="55%" stopColor="#311262" />
        <Stop offset="100%" stopColor="#1A0E2E" />
      </LinearGradient>
      <LinearGradient id="goldBack" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={colors.gold} />
        <Stop offset="50%" stopColor={colors.goldGlow} />
        <Stop offset="100%" stopColor={colors.goldDeep} />
      </LinearGradient>
    </Defs>

    <Rect x={0} y={0} width={VW} height={VH} rx={14} fill="url(#bgBack)" />

    {/* Outer ornate border */}
    <Rect
      x={6}
      y={6}
      width={VW - 12}
      height={VH - 12}
      rx={10}
      stroke="url(#goldBack)"
      strokeWidth={1.5}
      fill="none"
    />
    <Rect
      x={12}
      y={12}
      width={VW - 24}
      height={VH - 24}
      rx={6}
      stroke={colors.gold}
      strokeOpacity={0.5}
      strokeWidth={0.6}
      fill="none"
    />

    {/* Damask diagonal lattice */}
    <G stroke={colors.gold} strokeOpacity={0.08} strokeWidth={0.5}>
      {Array.from({ length: 18 }, (_, i) => (
        <Line key={`d1-${i}`} x1={-40 + i * 22} y1={0} x2={120 + i * 22} y2={VH} />
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <Line key={`d2-${i}`} x1={-40 + i * 22} y1={VH} x2={120 + i * 22} y2={0} />
      ))}
    </G>

    {/* Compass / pentacle rose */}
    <G transform={`translate(${VW / 2} ${VH / 2})`}>
      <Circle r={62} stroke="url(#goldBack)" strokeWidth={1.2} fill="none" />
      <Circle r={48} stroke={colors.gold} strokeOpacity={0.5} strokeWidth={0.7} fill="none" />
      <Circle r={28} stroke={colors.gold} strokeOpacity={0.6} strokeWidth={0.7} fill="none" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 4) * i;
        return (
          <Line
            key={`ray-${i}`}
            x1={Math.cos(a) * 28}
            y1={Math.sin(a) * 28}
            x2={Math.cos(a) * 62}
            y2={Math.sin(a) * 62}
            stroke={colors.gold}
            strokeOpacity={0.55}
            strokeWidth={0.7}
          />
        );
      })}
      {Pent(0, 0, 22, 'inner')}
      {Pent(0, 0, 56, 'outer')}
      <Circle r={5} fill={colors.gold} />
    </G>

    {/* Corner flourishes */}
    {[
      [22, 22, 0],
      [VW - 22, 22, 90],
      [VW - 22, VH - 22, 180],
      [22, VH - 22, 270],
    ].map(([x, y, rot], i) => (
      <G key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
        <Path
          d="M0 0 L 16 0 M0 0 L 0 16 M0 0 Q 6 6 12 12"
          stroke={colors.gold}
          strokeOpacity={0.65}
          strokeWidth={0.8}
          fill="none"
        />
      </G>
    ))}
  </Svg>
);

export default CardBack;
