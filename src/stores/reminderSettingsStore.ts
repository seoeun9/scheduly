import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ReminderSettingsState = {
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  scheduledNotificationId: string | null;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (hour: number, minute: number) => void;
  setScheduledNotificationId: (id: string | null) => void;
};

export const useReminderSettingsStore = create<ReminderSettingsState>()(
  persist(
    (set) => ({
      reminderEnabled: false,
      reminderHour: 20,
      reminderMinute: 0,
      scheduledNotificationId: null,

      setReminderEnabled: (enabled) => {
        set({ reminderEnabled: enabled });
      },

      setReminderTime: (hour, minute) => {
        set({
          reminderHour: Math.max(0, Math.min(23, hour)),
          reminderMinute: Math.max(0, Math.min(59, minute)),
        });
      },

      setScheduledNotificationId: (id) => {
        set({ scheduledNotificationId: id });
      },
    }),
    {
      name: 'scheduly-reminder-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        reminderEnabled: state.reminderEnabled,
        reminderHour: state.reminderHour,
        reminderMinute: state.reminderMinute,
        scheduledNotificationId: state.scheduledNotificationId,
      }),
    }
  )
);
