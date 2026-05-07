import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors } from '../theme/colors';
import type { CardArtId } from './taskBank';

/**
 * Each illustration is rendered into a 200×320 viewBox so it can be scaled
 * proportionally to any card size. Strokes are warm gold on a dark twilight
 * gradient. Compositions favour symmetry, slim line-work, and a single
 * focal sigil — like genuine Major Arcana plates.
 */
interface CardArtProps {
  id: CardArtId;
  width?: number;
  height?: number;
}

const W = 200;
const H = 320;

const Background = () => (
  <>
    <Defs>
      <RadialGradient id="aura" cx="50%" cy="48%" r="60%">
        <Stop offset="0%" stopColor={colors.amethyst} stopOpacity={0.65} />
        <Stop offset="55%" stopColor={colors.royal} stopOpacity={0.4} />
        <Stop offset="100%" stopColor={colors.ink} stopOpacity={0} />
      </RadialGradient>
      <LinearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={colors.gold} />
        <Stop offset="50%" stopColor={colors.goldGlow} />
        <Stop offset="100%" stopColor={colors.gold} />
      </LinearGradient>
    </Defs>
    <Rect x={0} y={0} width={W} height={H} fill={colors.ink} />
    <Rect x={0} y={0} width={W} height={H} fill="url(#aura)" />
  </>
);

const Stars = ({ count = 24 }: { count?: number }) => {
  const dots = Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const sx = ((seed % 1000) / 1000) * W;
    const sy = (((seed * 31) % 1000) / 1000) * H;
    const r = 0.6 + ((seed % 7) / 7) * 1.2;
    const op = 0.35 + ((seed % 11) / 11) * 0.6;
    return <Circle key={i} cx={sx} cy={sy} r={r} fill={colors.cream} opacity={op} />;
  });
  return <G>{dots}</G>;
};

const Frame = () => (
  <>
    <Rect
      x={10}
      y={10}
      width={W - 20}
      height={H - 20}
      rx={6}
      stroke="url(#goldStroke)"
      strokeWidth={1}
      fill="none"
    />
    <Rect
      x={16}
      y={16}
      width={W - 32}
      height={H - 32}
      rx={4}
      stroke={colors.gold}
      strokeOpacity={0.4}
      strokeWidth={0.5}
      fill="none"
    />
  </>
);

const Flame = () => (
  <G stroke="url(#goldStroke)" strokeWidth={1.5} fill="none" strokeLinecap="round">
    <Path d="M100 230 C 75 200, 75 170, 100 140 C 105 165, 130 175, 125 200 C 122 215, 110 222, 100 230 Z" />
    <Path d="M100 200 C 90 185, 90 170, 100 155 C 105 168, 115 175, 110 188 C 108 195, 104 198, 100 200 Z" fill={colors.gold} fillOpacity={0.18} />
    <Path d="M70 250 Q 100 240 130 250" />
    <Path d="M60 260 Q 100 248 140 260" strokeOpacity={0.5} />
  </G>
);

const Moon = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5}>
    <Circle cx={100} cy={150} r={48} />
    <Path d="M84 110 A 48 48 0 0 0 84 190 A 36 36 0 0 1 84 110 Z" fill={colors.gold} fillOpacity={0.2} />
    <Circle cx={100} cy={150} r={62} strokeOpacity={0.35} strokeDasharray="2 4" />
    <Line x1={100} y1={70} x2={100} y2={88} />
    <Line x1={100} y1={212} x2={100} y2={230} />
  </G>
);

const Eye = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5}>
    <Path d="M40 160 Q 100 100 160 160 Q 100 220 40 160 Z" />
    <Circle cx={100} cy={160} r={22} />
    <Circle cx={100} cy={160} r={9} fill={colors.gold} />
    <Path d="M30 160 Q 100 90 170 160" strokeOpacity={0.35} />
    <Path d="M30 160 Q 100 230 170 160" strokeOpacity={0.35} />
    <Path d="M100 90 L 100 130" strokeOpacity={0.4} />
    <Path d="M100 190 L 100 230" strokeOpacity={0.4} />
  </G>
);

const Sword = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinejoin="round">
    <Path d="M100 60 L 100 220" />
    <Path d="M100 60 L 96 64 L 96 215 L 100 220 L 104 215 L 104 64 Z" fill={colors.gold} fillOpacity={0.15} />
    <Line x1={70} y1={220} x2={130} y2={220} />
    <Line x1={68} y1={226} x2={132} y2={226} />
    <Path d="M100 230 L 100 260" />
    <Circle cx={100} cy={266} r={6} />
    <Path d="M40 220 Q 100 250 160 220" strokeOpacity={0.3} />
  </G>
);

const Chalice = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinejoin="round">
    <Path d="M70 110 L 70 150 Q 70 185 100 195 Q 130 185 130 150 L 130 110 Z" />
    <Path d="M70 110 L 130 110" />
    <Path d="M100 195 L 100 230" />
    <Path d="M70 230 L 130 230" />
    <Path d="M64 230 L 136 230" />
    <Path d="M82 132 Q 100 142 118 132" />
    <Path d="M82 122 Q 100 110 118 122" fill={colors.gold} fillOpacity={0.2} />
  </G>
);

const Star = () => {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? 56 : 22;
    points.push(`${100 + Math.cos(a) * r},${160 + Math.sin(a) * r}`);
  }
  return (
    <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinejoin="round">
      <Path d={`M${points.join(' L ')} Z`} fill={colors.gold} fillOpacity={0.12} />
      <Circle cx={100} cy={160} r={70} strokeOpacity={0.3} strokeDasharray="3 4" />
    </G>
  );
};

const Sun = () => {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI / 6) * i;
    const x1 = 100 + Math.cos(a) * 42;
    const y1 = 160 + Math.sin(a) * 42;
    const x2 = 100 + Math.cos(a) * 70;
    const y2 = 160 + Math.sin(a) * 70;
    return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinecap="round">
      <Circle cx={100} cy={160} r={32} fill={colors.gold} fillOpacity={0.18} />
      <Circle cx={100} cy={160} r={32} />
      {rays}
    </G>
  );
};

const Tower = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5}>
    <Path d="M82 240 L 82 130 L 118 130 L 118 240 Z" />
    <Path d="M82 130 L 82 120 L 118 120 L 118 130" />
    <Path d="M100 120 L 100 90" />
    <Path d="M88 90 L 112 90 L 112 80 L 88 80 Z" fill={colors.gold} fillOpacity={0.25} />
    <Line x1={82} y1={170} x2={118} y2={170} strokeOpacity={0.5} />
    <Line x1={82} y1={210} x2={118} y2={210} strokeOpacity={0.5} />
    <Path d="M118 130 Q 150 145 145 175" strokeOpacity={0.45} />
    <Path d="M82 130 Q 50 145 55 175" strokeOpacity={0.45} />
  </G>
);

const Wheel = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5}>
    <Circle cx={100} cy={160} r={62} />
    <Circle cx={100} cy={160} r={48} strokeOpacity={0.5} />
    <Circle cx={100} cy={160} r={20} fill={colors.gold} fillOpacity={0.2} />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI / 4) * i;
      return (
        <Line
          key={i}
          x1={100 + Math.cos(a) * 20}
          y1={160 + Math.sin(a) * 20}
          x2={100 + Math.cos(a) * 62}
          y2={160 + Math.sin(a) * 62}
        />
      );
    })}
  </G>
);

const Pentacle = () => {
  const pts: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    pts.push(`${100 + Math.cos(a) * 56},${160 + Math.sin(a) * 56}`);
  }
  return (
    <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5}>
      <Circle cx={100} cy={160} r={62} />
      <Path d={`M${pts[0]} L ${pts[2]} L ${pts[4]} L ${pts[1]} L ${pts[3]} Z`} />
      <Circle cx={100} cy={160} r={6} fill={colors.gold} />
    </G>
  );
};

const Wand = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinecap="round">
    <Line x1={70} y1={250} x2={130} y2={70} />
    <Path d="M120 70 Q 130 60 140 70 Q 130 80 120 70 Z" fill={colors.gold} fillOpacity={0.3} />
    <Path d="M65 250 Q 50 260 55 250" strokeOpacity={0.6} />
    <Path d="M126 80 L 144 70 L 134 88" />
    <Path d="M118 92 L 102 84" />
    <Path d="M110 108 L 96 98" />
  </G>
);

const Lotus = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5}>
    <Path d="M100 200 Q 60 170 100 130 Q 140 170 100 200 Z" fill={colors.gold} fillOpacity={0.18} />
    <Path d="M100 200 Q 40 200 60 150 Q 90 175 100 200" />
    <Path d="M100 200 Q 160 200 140 150 Q 110 175 100 200" />
    <Path d="M100 200 Q 30 220 50 180" strokeOpacity={0.5} />
    <Path d="M100 200 Q 170 220 150 180" strokeOpacity={0.5} />
    <Line x1={100} y1={200} x2={100} y2={260} strokeOpacity={0.5} />
  </G>
);

const Feather = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinecap="round">
    <Path d="M100 70 Q 70 130 80 220 Q 100 230 120 220 Q 130 130 100 70 Z" fill={colors.gold} fillOpacity={0.16} />
    <Line x1={100} y1={80} x2={100} y2={230} />
    {Array.from({ length: 6 }, (_, i) => {
      const y = 100 + i * 22;
      return (
        <G key={i}>
          <Line x1={100} y1={y} x2={80 + i} y2={y + 14} strokeOpacity={0.7} />
          <Line x1={100} y1={y} x2={120 - i} y2={y + 14} strokeOpacity={0.7} />
        </G>
      );
    })}
  </G>
);

const Serpent = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinecap="round">
    <Path d="M70 240 Q 60 200 100 180 Q 140 160 130 120 Q 120 80 80 90 Q 60 95 70 110" />
    <Circle cx={70} cy={110} r={3} fill={colors.gold} />
    <Path d="M65 110 Q 60 105 55 110" />
    <Path d="M76 116 L 82 122" strokeOpacity={0.6} />
    <Path d="M86 124 L 92 130" strokeOpacity={0.6} />
    <Path d="M96 132 L 102 138" strokeOpacity={0.6} />
  </G>
);

const Key = () => (
  <G stroke="url(#goldStroke)" fill="none" strokeWidth={1.5} strokeLinecap="round">
    <Circle cx={100} cy={110} r={28} />
    <Circle cx={100} cy={110} r={10} fill={colors.gold} fillOpacity={0.25} />
    <Line x1={100} y1={138} x2={100} y2={240} />
    <Line x1={100} y1={210} x2={120} y2={210} />
    <Line x1={100} y1={222} x2={114} y2={222} />
  </G>
);

const ART_REGISTRY: Record<CardArtId, React.FC> = {
  flame: Flame,
  moon: Moon,
  eye: Eye,
  sword: Sword,
  chalice: Chalice,
  star: Star,
  sun: Sun,
  tower: Tower,
  wheel: Wheel,
  pentacle: Pentacle,
  wand: Wand,
  lotus: Lotus,
  feather: Feather,
  serpent: Serpent,
  key: Key,
};

export const CardArt: React.FC<CardArtProps> = ({ id, width = W, height = H }) => {
  const Component = ART_REGISTRY[id];
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Background />
      <Stars />
      <Frame />
      <Component />
    </Svg>
  );
};

export default CardArt;
