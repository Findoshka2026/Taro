import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ModalSheet } from '../components/ModalSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../state/store';
import { t as tFor } from '../i18n';
import type { TaskCategory } from '../i18n/types';
import type { CardArtId, TaskTemplate } from '../data/taskBank';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

const CATEGORIES: { id: TaskCategory; cardArtId: CardArtId }[] = [
  { id: 'creative', cardArtId: 'flame' },
  { id: 'rest', cardArtId: 'chalice' },
  { id: 'study', cardArtId: 'sword' },
  { id: 'routine', cardArtId: 'pentacle' },
  { id: 'body', cardArtId: 'sun' },
  { id: 'social', cardArtId: 'feather' },
  { id: 'mystic', cardArtId: 'star' },
];

export const AddTaskModal: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const modal = useAppStore((s) => s.modal);
  const setModal = useAppStore((s) => s.setModal);
  const addCustom = useAppStore((s) => s.addCustomTask);
  const applyOverride = useAppStore((s) => s.applyOverride);

  const t = tFor(language);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState('');
  const [category, setCategory] = useState<TaskCategory>('creative');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle('');
    setDescription('');
    setQuote('');
    setCategory('creative');
    setError(null);
  };

  const submit = () => {
    if (!title.trim()) {
      setError(t.errors.addEmpty);
      return;
    }
    const cat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
    const tmp: TaskTemplate = {
      id: `custom-${Date.now()}`,
      category,
      cardArtId: cat.cardArtId,
      title: { ru: title.trim(), en: title.trim() },
      description: {
        ru: description.trim() || title.trim(),
        en: description.trim() || title.trim(),
      },
      quote: {
        ru: quote.trim() || '',
        en: quote.trim() || '',
      },
    };
    addCustom(tmp);
    applyOverride({
      templateId: tmp.id,
      title: tmp.title[language],
      description: tmp.description[language],
      quote: tmp.quote[language],
      category: tmp.category,
      cardArtId: tmp.cardArtId,
    });
    reset();
    setModal(null);
  };

  return (
    <ModalSheet
      visible={modal === 'add'}
      onClose={() => setModal(null)}
      title={t.add.title}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 480 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            placeholder={t.add.titlePlaceholder}
            placeholderTextColor={colors.mist}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder={t.add.descriptionPlaceholder}
            placeholderTextColor={colors.mist}
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, styles.multiline]}
          />
          <TextInput
            placeholder={t.add.quotePlaceholder}
            placeholderTextColor={colors.mist}
            value={quote}
            onChangeText={setQuote}
            style={styles.input}
          />

          <Text style={styles.label}>{t.add.categoryLabel}</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={({ pressed }) => [
                  styles.chip,
                  category === c.id ? styles.chipActive : null,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === c.id ? styles.chipTextActive : null,
                  ]}
                >
                  {t.category[c.id]}
                </Text>
              </Pressable>
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttons}>
            <PrimaryButton
              label={t.buttons.cancel}
              variant="ghost"
              onPress={() => {
                reset();
                setModal(null);
              }}
            />
            <PrimaryButton label={t.buttons.save} onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    color: colors.cream,
    backgroundColor: 'rgba(244, 229, 194, 0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  multiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  label: {
    ...typography.label,
    color: colors.gold,
    marginTop: 8,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.4)',
    backgroundColor: 'rgba(244, 229, 194, 0.04)',
  },
  chipActive: {
    backgroundColor: 'rgba(242, 201, 122, 0.18)',
    borderColor: colors.gold,
  },
  chipText: {
    ...typography.bodyDim,
    color: colors.whisper,
  },
  chipTextActive: {
    color: colors.gold,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    ...typography.bodyDim,
    color: colors.ember,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
});
