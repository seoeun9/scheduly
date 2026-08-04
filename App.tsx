// App.tsx
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
import { ToastProvider } from '@/components/ToastProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReminderSettingsStore } from '@/stores/reminderSettingsStore';
import { useTodoStore } from '@/stores/useTodoStore';
import { syncTodoReminderNotification } from '@/utils/reminderNotifications';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    let storesReady = false;

    const sync = () => {
      if (storesReady) {
        void syncTodoReminderNotification().catch((error: unknown) => {
          console.warn('Failed to sync reminder notification.', error);
        });
      }
    };

    const unsubscribeReminder = useReminderSettingsStore.subscribe((state, previousState) => {
      if (
        state.reminderEnabled !== previousState.reminderEnabled ||
        state.reminderHour !== previousState.reminderHour ||
        state.reminderMinute !== previousState.reminderMinute
      ) {
        sync();
      }
    });
    const unsubscribeTodos = useTodoStore.subscribe((state, previousState) => {
      if (state.todos !== previousState.todos) {
        sync();
      }
    });
    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        sync();
      }
    });

    void Promise.all([
      useReminderSettingsStore.persist.rehydrate(),
      useTodoStore.persist.rehydrate(),
    ]).then(() => {
      storesReady = true;
      sync();
    });

    return () => {
      unsubscribeReminder();
      unsubscribeTodos();
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ToastProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
