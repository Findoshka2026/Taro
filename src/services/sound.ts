import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type SoundId = 'cardTap' | 'flip' | 'complete' | 'burn';

const sources: Record<SoundId, number> = {
  cardTap: require('../../assets/sounds/card_tap.wav'),
  flip: require('../../assets/sounds/flip.wav'),
  complete: require('../../assets/sounds/complete.wav'),
  burn: require('../../assets/sounds/burn.wav'),
};

const players: Partial<Record<SoundId, AudioPlayer>> = {};
let initialized = false;

export const initSounds = async (): Promise<void> => {
  if (initialized) return;
  initialized = true;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    });
  } catch {
    // Audio mode is best-effort; some platforms may reject options.
  }
  (Object.keys(sources) as SoundId[]).forEach((id) => {
    try {
      players[id] = createAudioPlayer(sources[id]);
    } catch {
      // If a single asset fails to load we still want the rest to work.
    }
  });
};

export const playSound = (id: SoundId): void => {
  const p = players[id];
  if (!p) return;
  try {
    p.currentTime = 0;
    p.play();
  } catch {
    // Swallow runtime errors — sound is decorative.
  }
};

export const releaseSounds = (): void => {
  (Object.keys(players) as SoundId[]).forEach((id) => {
    const p = players[id];
    if (p) {
      try {
        p.remove();
      } catch {
        // ignore
      }
      delete players[id];
    }
  });
  initialized = false;
};
