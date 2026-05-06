import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { findTemplate, useAppStore } from '../state/store';
import { TASK_BANK, TaskTemplate } from '../data/taskBank';
import { t as tFor } from '../i18n';
import type { Translations } from '../i18n/types';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';
import { TarotCard } from '../components/TarotCard';
import { Timer } from '../components/Timer';
import { PrimaryButton } from '../components/PrimaryButton';
import { IconButton } from '../components/IconButton';
import { RestingDeck } from '../components/RestingDeck';
import { generateTaskWithGroq } from '../services/groq';

const { width: SCREEN_W } = Dimensions.get('window');

const CARD_GAP = 12;
const HORIZONTAL_PAD = 22;
const SMALL_CARD_W = Math.min(
  118,
  Math.floor((SCREEN_W - HORIZONTAL_PAD * 2 - CARD_GAP * 2) / 3),
);
const SMALL_CARD_H = Math.round(SMALL_CARD_W * 1.55);

const BIG_CARD_W = Math.min(240, Math.floor(SCREEN_W * 0.62));
const BIG_CARD_H = Math.round(BIG_CARD_W * 1.55);

const REST_CARD_W = Math.min(170, Math.floor(SCREEN_W * 0.42));
const REST_CARD_H = Math.round(REST_CARD_W * 1.55);

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const language = useAppStore((s) => s.language);
  const phase = useAppStore((s) => s.phase);
  const today = useAppStore((s) => s.today);
  const customTasks = useAppStore((s) => s.customTasks);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const errorMessage = useAppStore((s) => s.errorMessage);

  const selectCard = useAppStore((s) => s.selectCard);
  const finishReveal = useAppStore((s) => s.finishReveal);
  const completeToday = useAppStore((s) => s.completeToday);
  const setModal = useAppStore((s) => s.setModal);
  const applyOverride = useAppStore((s) => s.applyOverride);
  const setGenerating = useAppStore((s) => s.setGenerating);
  const setError = useAppStore((s) => s.setError);

  const t = tFor(language);

  const [revealAnim, setRevealAnim] = useState(false);

  const drawn = useMemo<TaskTemplate[]>(() => {
    if (!today) return [];
    return today.drawnIds
      .map((id) => findTemplate(id, customTasks))
      .filter((tmp): tmp is TaskTemplate => Boolean(tmp));
  }, [today, customTasks]);

  const activeTask = useMemo<{
    title: string;
    description: string;
    quote: string;
    cardArtId: TaskTemplate['cardArtId'];
    category: TaskTemplate['category'];
  } | null>(() => {
    if (!today) return null;
    if (today.override) {
      return {
        title: today.override.title,
        description: today.override.description,
        quote: today.override.quote,
        cardArtId: today.override.cardArtId,
        category: today.override.category,
      };
    }
    if (today.selectedIndex === null) return null;
    const tmp = findTemplate(today.drawnIds[today.selectedIndex], customTasks);
    if (!tmp) return null;
    return {
      title: tmp.title[language],
      description: tmp.description[language],
      quote: tmp.quote[language],
      cardArtId: tmp.cardArtId,
      category: tmp.category,
    };
  }, [today, customTasks, language]);

  const onCardPress = useCallback(
    (i: number) => {
      if (phase !== 'idle') return;
      if (hapticsEnabled) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      selectCard(i);
    },
    [phase, hapticsEnabled, selectCard],
  );

  // Drive the burning → revealing → active sequence.
  useEffect(() => {
    if (phase === 'burning') {
      const tm = setTimeout(() => {
        if (hapticsEnabled) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setRevealAnim(true);
      }, 950);
      return () => clearTimeout(tm);
    }
    if (phase === 'idle' || phase === 'completed') {
      setRevealAnim(false);
    }
    return undefined;
  }, [phase, hapticsEnabled]);

  const onFlipDone = useCallback(() => {
    finishReveal();
  }, [finishReveal]);

  const onComplete = useCallback(() => {
    if (hapticsEnabled) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    completeToday();
  }, [completeToday, hapticsEnabled]);

  const onGenerateRandom = useCallback(() => {
    const pool = [...TASK_BANK, ...customTasks];
    const tmp = pool[Math.floor(Math.random() * pool.length)];
    applyOverride({
      templateId: tmp.id,
      title: tmp.title[language],
      description: tmp.description[language],
      quote: tmp.quote[language],
      category: tmp.category,
      cardArtId: tmp.cardArtId,
    });
  }, [applyOverride, customTasks, language]);

  const onGenerateAi = useCallback(async () => {
    setError(null);
    setGenerating(true);
    try {
      const tmp = await generateTaskWithGroq(language);
      applyOverride({
        templateId: tmp.id,
        title: tmp.title[language],
        description: tmp.description[language],
        quote: tmp.quote[language],
        category: tmp.category,
        cardArtId: tmp.cardArtId,
      });
    } catch (err) {
      setError(t.errors.aiFailed);
    } finally {
      setGenerating(false);
    }
  }, [language, t, setGenerating, setError, applyOverride]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 18 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Header t={t} onSettings={() => setModal('settings')} />

      {phase === 'completed' ? (
        <CompletedView t={t} onOpenStats={() => setModal('stats')} onOpenStreak={() => setModal('streak')} onOpenHistory={() => setModal('history')} />
      ) : phase === 'active' && activeTask ? (
        <ActiveView
          t={t}
          title={activeTask.title}
          description={activeTask.description}
          quote={activeTask.quote}
          cardArtId={activeTask.cardArtId}
          subtitle={t.category[activeTask.category]}
          startedAt={today?.startedAt ?? null}
          onComplete={onComplete}
          onOpenStats={() => setModal('stats')}
        />
      ) : (
        <IdleOrBurningView
          t={t}
          drawn={drawn}
          phase={phase}
          revealAnim={revealAnim}
          selectedIndex={today?.selectedIndex ?? null}
          onCardPress={onCardPress}
          onFlipDone={onFlipDone}
          onAddTask={() => setModal('add')}
          onGenerateRandom={onGenerateRandom}
          onGenerateAi={onGenerateAi}
          onOpenStats={() => setModal('stats')}
          onOpenStreak={() => setModal('streak')}
          onOpenHistory={() => setModal('history')}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
        />
      )}
    </ScrollView>
  );
};

const Header: React.FC<{ t: Translations; onSettings: () => void }> = ({ t, onSettings }) => (
  <View style={styles.header}>
    <View style={{ flex: 1 }}>
      <Text style={styles.appLabel}>{t.app.title.toUpperCase()}</Text>
      <View style={styles.titleRow}>
        <View style={styles.flourishLine} />
        <Text style={styles.appOrnament}>✦</Text>
        <View style={styles.flourishLine} />
      </View>
    </View>
    <IconButton glyph="✦" onPress={onSettings} />
  </View>
);

interface IdleViewProps {
  t: Translations;
  drawn: TaskTemplate[];
  phase: ReturnType<typeof useAppStore.getState>['phase'];
  revealAnim: boolean;
  selectedIndex: number | null;
  onCardPress: (i: number) => void;
  onFlipDone: () => void;
  onAddTask: () => void;
  onGenerateRandom: () => void;
  onGenerateAi: () => void;
  onOpenStats: () => void;
  onOpenStreak: () => void;
  onOpenHistory: () => void;
  isGenerating: boolean;
  errorMessage: string | null;
}

const IdleOrBurningView: React.FC<IdleViewProps> = ({
  t,
  drawn,
  phase,
  revealAnim,
  selectedIndex,
  onCardPress,
  onFlipDone,
  onAddTask,
  onGenerateRandom,
  onGenerateAi,
  onOpenStats,
  onOpenStreak,
  onOpenHistory,
  isGenerating,
  errorMessage,
}) => {
  const language = useAppStore((s) => s.language);

  const cardStateFor = (i: number) => {
    if (phase === 'idle') return 'idle' as const;
    if (phase === 'burning') {
      if (i === selectedIndex) {
        return revealAnim ? ('flipping' as const) : ('hover' as const);
      }
      return 'burning' as const;
    }
    if (phase === 'revealing') {
      return i === selectedIndex ? ('flipping' as const) : ('gone' as const);
    }
    return 'idle' as const;
  };

  return (
    <View style={styles.body}>
      <Text style={styles.heroTitle}>{t.app.todayTask}</Text>
      <Text style={styles.heroHint}>{t.app.tap}</Text>

      <View style={styles.cardsRow}>
        {drawn.map((tmp, i) => (
          <View key={tmp.id} style={{ marginHorizontal: CARD_GAP / 2 }}>
            <TarotCard
              state={cardStateFor(i)}
              width={SMALL_CARD_W}
              height={SMALL_CARD_H}
              artId={tmp.cardArtId}
              title={tmp.title[language]}
              subtitle={t.category[tmp.category]}
              delay={i * 250}
              onPress={() => onCardPress(i)}
              onFlipComplete={i === selectedIndex ? onFlipDone : undefined}
            />
          </View>
        ))}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.actionsCol}>
        <View style={styles.iconRow}>
          <IconButton glyph="✎" label={t.buttons.addTask} onPress={onAddTask} />
          <IconButton glyph="✦" label={t.buttons.generate} onPress={onGenerateRandom} />
        </View>
        <PrimaryButton
          label={isGenerating ? '…' : t.buttons.generateAi}
          variant="ghost"
          onPress={onGenerateAi}
          loading={isGenerating}
          fullWidth
        />
      </View>

      <View style={styles.metricsRow}>
        <IconButton glyph="◇" label={t.stats.title} onPress={onOpenStats} />
        <IconButton glyph="🜂" label={t.streak.title} onPress={onOpenStreak} />
        <IconButton glyph="❦" label={t.history.title.split(' ')[0]} onPress={onOpenHistory} />
      </View>
    </View>
  );
};

interface ActiveViewProps {
  t: Translations;
  title: string;
  description: string;
  quote: string;
  cardArtId: TaskTemplate['cardArtId'];
  subtitle: string;
  startedAt: string | null;
  onComplete: () => void;
  onOpenStats: () => void;
}

const ActiveView: React.FC<ActiveViewProps> = ({
  t,
  title,
  description,
  quote,
  cardArtId,
  subtitle,
  startedAt,
  onComplete,
  onOpenStats,
}) => (
  <View style={styles.body}>
    <Text style={styles.heroTitle}>{t.app.todayTask}</Text>

    <View style={styles.bigCardWrap}>
      <TarotCard
        state="face"
        width={BIG_CARD_W}
        height={BIG_CARD_H}
        artId={cardArtId}
        title={title}
        subtitle={subtitle}
      />
    </View>

    <LinearGradient
      colors={['rgba(244, 229, 194, 0.08)', 'rgba(244, 229, 194, 0.02)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.taskCard}
    >
      <Text style={styles.taskCategory}>{subtitle.toUpperCase()}</Text>
      <Text style={styles.taskTitle}>{title}</Text>
      <Text style={styles.taskDescription}>{description}</Text>
      <View style={styles.divider} />
      <Text style={styles.taskQuote}>{quote}</Text>
    </LinearGradient>

    <View style={{ height: 18 }} />
    <Timer
      startedAt={startedAt}
      label={t.timer.label}
      hLabel={t.timer.hours}
      mLabel={t.timer.minutes}
      expiredLabel={t.timer.expired}
    />

    <View style={{ height: 22 }} />
    <PrimaryButton label={t.buttons.complete} onPress={onComplete} fullWidth />
    <View style={{ height: 12 }} />
    <IconButton glyph="◇" label={t.stats.title} onPress={onOpenStats} />
  </View>
);

const CompletedView: React.FC<{
  t: Translations;
  onOpenStats: () => void;
  onOpenStreak: () => void;
  onOpenHistory: () => void;
}> = ({ t, onOpenStats, onOpenStreak, onOpenHistory }) => (
  <View style={[styles.body, { alignItems: 'center' }]}>
    <Text style={styles.heroTitle}>{t.cards.completed}</Text>
    <Text style={styles.heroHint}>{t.cards.deckTitle}</Text>
    <View style={{ height: 26 }} />
    <RestingDeck width={REST_CARD_W} height={REST_CARD_H} />
    <View style={{ height: 36 }} />
    <View style={styles.metricsRow}>
      <IconButton glyph="◇" label={t.stats.title} onPress={onOpenStats} />
      <IconButton glyph="🜂" label={t.streak.title} onPress={onOpenStreak} />
      <IconButton glyph="❦" label={t.history.title.split(' ')[0]} onPress={onOpenHistory} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PAD,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  appLabel: {
    ...typography.label,
    color: colors.gold,
    fontSize: 11,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flourishLine: {
    height: 1,
    width: 32,
    backgroundColor: colors.gold,
    opacity: 0.6,
  },
  appOrnament: {
    color: colors.gold,
    fontSize: 14,
    marginHorizontal: 6,
  },
  body: {
    alignItems: 'center',
  },
  heroTitle: {
    ...typography.hero,
    color: colors.cream,
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 6,
  },
  heroHint: {
    ...typography.subtitle,
    color: colors.mist,
    marginBottom: 30,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  errorText: {
    ...typography.bodyDim,
    color: colors.ember,
    textAlign: 'center',
    marginBottom: 12,
  },
  actionsCol: {
    width: '100%',
    gap: 12,
    marginBottom: 18,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  bigCardWrap: {
    marginVertical: 10,
    alignItems: 'center',
  },
  taskCard: {
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.45)',
    width: '100%',
    marginTop: 22,
  },
  taskCategory: {
    ...typography.label,
    color: colors.gold,
    marginBottom: 6,
    fontSize: 10,
  },
  taskTitle: {
    ...typography.title,
    color: colors.cream,
    marginBottom: 10,
    fontSize: 24,
  },
  taskDescription: {
    ...typography.body,
    color: colors.whisper,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(212, 162, 76, 0.4)',
    marginVertical: 14,
  },
  taskQuote: {
    ...typography.quote,
    color: colors.parchment,
  },
});
