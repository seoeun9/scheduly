import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useReminderSettingsStore } from '@/stores/reminderSettingsStore';
import { useTodoStore } from '@/stores/useTodoStore';

const ANDROID_CHANNEL_ID = 'todo-reminder-channel-v2';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function requestReminderPermissions() {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) {
    return {
      granted: true,
      canAskAgain: current.canAskAgain,
    };
  }

  if (!current.canAskAgain) {
    return {
      granted: false,
      canAskAgain: false,
    };
  }

  const requested = await Notifications.requestPermissionsAsync();

  return {
    granted: requested.granted,
    canAskAgain: requested.canAskAgain,
  };
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: '할 일 리마인드',
    description: '오늘 완료하지 않은 할 일을 알려드려요.',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 150, 120, 150],
    lightColor: '#6A9EFF',
  });
}

async function cancelScheduledReminderById(id: string | null) {
  if (!id) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // The notification may already have fired or been removed by the OS.
  }
}

async function scheduleTodayReminder(date: Date, remainingCount: number) {
  await ensureAndroidChannel();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: '리마인드',
      body: `오늘 할 일이 ${remainingCount}개 남아 있어요.`,
      sound: 'default',
      data: {
        screen: 'TodoList',
        date: toDateKey(date),
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
  });
}

async function runReminderSync() {
  const reminderState = useReminderSettingsStore.getState();
  const todos = useTodoStore.getState().todos;
  const now = new Date();
  const todayKey = toDateKey(now);
  const incompleteTodosToday = todos.filter((todo) => todo.date === todayKey && !todo.done);

  await cancelScheduledReminderById(reminderState.scheduledNotificationId);

  if (reminderState.scheduledNotificationId) {
    reminderState.setScheduledNotificationId(null);
  }

  if (!reminderState.reminderEnabled || incompleteTodosToday.length === 0) {
    return;
  }

  const permission = await Notifications.getPermissionsAsync();

  if (!permission.granted) {
    useReminderSettingsStore.getState().setReminderEnabled(false);
    return;
  }

  const reminderDate = new Date(now);
  reminderDate.setHours(reminderState.reminderHour, reminderState.reminderMinute, 0, 0);

  // A past time must not become an unwanted notification tomorrow.
  if (reminderDate.getTime() <= now.getTime()) {
    return;
  }

  const nextId = await scheduleTodayReminder(reminderDate, incompleteTodosToday.length);

  useReminderSettingsStore.getState().setScheduledNotificationId(nextId);
}

let syncQueue: Promise<void> = Promise.resolve();

export function syncTodoReminderNotification() {
  const nextSync = syncQueue.then(runReminderSync, runReminderSync);

  syncQueue = nextSync.catch(() => undefined);

  return nextSync;
}
