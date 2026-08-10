// App.tsx
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
import { ToastProvider } from '@/components/ToastProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReminderSettingsStore } from '@/stores/reminderSettingsStore';
import { useThemeStore } from '@/stores/themeStore';
import { useTodoStore } from '@/stores/useTodoStore';
import { syncTodoReminderNotification } from '@/utils/reminderNotifications';
import { useOnboardingStore } from '@/stores/onboardingStore';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';

export default function App() {
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const setHasCompletedOnboarding = useOnboardingStore((state) => state.setHasCompletedOnboarding);

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
      useThemeStore.persist.rehydrate(),
      useTodoStore.persist.rehydrate(),
      useOnboardingStore.persist.rehydrate(),
    ]).then(() => {
      // 임시: 온보딩 계속 확인할 수 있게 하기
      setHasCompletedOnboarding(false);

      storesReady = true;
      sync();
      setIsBootstrapped(true);
    });

    return () => {
      unsubscribeReminder();
      unsubscribeTodos();
      appStateSubscription.remove();
    };
  }, [setHasCompletedOnboarding]);

  if (!isBootstrapped) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ToastProvider>
          <NavigationContainer>
            {hasCompletedOnboarding ? (
              <RootNavigator />
            ) : (
              <OnboardingScreen onComplete={() => setHasCompletedOnboarding(true)} />
            )}
          </NavigationContainer>
        </ToastProvider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
