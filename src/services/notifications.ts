import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ANDROID_CHANNEL_ID = 'tarot-reminders';

let configured = false;

const configure = async (): Promise<void> => {
  if (configured) return;
  configured = true;

  // Foreground display behaviour — keep notifications visible if the app is
  // open, with sound on. Other features kept off to feel ambient.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Карта дня',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#D4A24C',
      });
    } catch {
      // ignore — channel setup is best-effort
    }
  }
};

export const ensureNotificationPermission = async (): Promise<boolean> => {
  await configure();
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
};

/**
 * Schedule a single local reminder one hour before the 12-hour daily timer
 * runs out. Returns the notification identifier (so it can be cancelled when
 * the user completes the task), or null if scheduling failed.
 */
export const scheduleTaskReminder = async (
  startedAt: Date,
  body: { ru: string; en: string },
  language: 'ru' | 'en',
): Promise<string | null> => {
  try {
    await configure();
    const granted = await ensureNotificationPermission();
    if (!granted) return null;

    const fireAt = new Date(startedAt.getTime() + 11 * 60 * 60 * 1000);
    if (fireAt.getTime() < Date.now() + 60_000) {
      // Not enough headroom — skip scheduling.
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: language === 'ru' ? 'Карта дня ждёт' : 'Your card is waiting',
        body: body[language],
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
        channelId: ANDROID_CHANNEL_ID,
      },
    });
    return id;
  } catch {
    return null;
  }
};

export const cancelScheduledReminder = async (id: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // ignore
  }
};
