import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ModalSheet } from '../components/ModalSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../state/store';
import { SUPPORTED_LANGUAGES, t as tFor } from '../i18n';
import { colors } from '../theme/colors';
import { text as typography } from '../theme/typography';

export const SettingsModal: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const modal = useAppStore((s) => s.modal);
  const setModal = useAppStore((s) => s.setModal);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const soundsEnabled = useAppStore((s) => s.soundsEnabled);
  const groqApiKey = useAppStore((s) => s.groqApiKey);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const setHaptics = useAppStore((s) => s.setHaptics);
  const setSounds = useAppStore((s) => s.setSounds);
  const setGroqKey = useAppStore((s) => s.setGroqKey);

  const t = tFor(language);
  const [keyDraft, setKeyDraft] = useState(groqApiKey ?? '');

  return (
    <ModalSheet
      visible={modal === 'settings'}
      onClose={() => setModal(null)}
      title={t.settings.title}
    >
      <Text style={styles.section}>{t.settings.language}</Text>
      <Text style={styles.hint}>{t.settings.languageHint}</Text>
      <View style={styles.langRow}>
        {SUPPORTED_LANGUAGES.map((l) => (
          <Pressable
            key={l.code}
            onPress={() => setLanguage(l.code)}
            style={({ pressed }) => [
              styles.langChip,
              language === l.code ? styles.langChipActive : null,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                styles.langText,
                language === l.code ? styles.langTextActive : null,
              ]}
            >
              {l.native}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.rowLabel}>{t.settings.haptics}</Text>
        <Switch
          value={hapticsEnabled}
          onValueChange={setHaptics}
          trackColor={{ false: 'rgba(244,229,194,0.18)', true: colors.gold }}
          thumbColor={colors.cream}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{t.settings.sounds}</Text>
        <Switch
          value={soundsEnabled}
          onValueChange={setSounds}
          trackColor={{ false: 'rgba(244,229,194,0.18)', true: colors.gold }}
          thumbColor={colors.cream}
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.section}>{t.settings.aiSection}</Text>
      <Text style={styles.hint}>{t.settings.aiHint}</Text>
      <TextInput
        placeholder="gsk_..."
        placeholderTextColor={colors.mist}
        value={keyDraft}
        onChangeText={setKeyDraft}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.btnRow}>
        <PrimaryButton
          label={t.buttons.save}
          onPress={() => {
            setGroqKey(keyDraft.trim() || null);
            setModal(null);
          }}
        />
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  section: {
    ...typography.label,
    color: colors.gold,
    marginBottom: 6,
  },
  hint: {
    ...typography.bodyDim,
    color: colors.mist,
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 162, 76, 0.4)',
    backgroundColor: 'rgba(244, 229, 194, 0.04)',
  },
  langChipActive: {
    backgroundColor: 'rgba(242, 201, 122, 0.18)',
    borderColor: colors.gold,
  },
  langText: {
    ...typography.body,
    color: colors.whisper,
  },
  langTextActive: {
    color: colors.gold,
    fontWeight: '600',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(212, 162, 76, 0.25)',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: {
    ...typography.body,
    color: colors.cream,
  },
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
  btnRow: {
    alignItems: 'flex-end',
  },
});
