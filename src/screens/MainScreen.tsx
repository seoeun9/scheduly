import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodoStore } from '@/stores/useTodoStore';
import Calendar from '@/components/Calendar';
import TodoCarousel from '@/components/TodoCarousel';
import { useTheme } from '@/hooks/useTheme';
import styles from '@/utils/style';

export default function MainScreen() {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const { isDark } = useTheme();

  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const todos = useTodoStore((state) => state.todos);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
      className={isDark ? 'bg-black' : 'bg-white'}>
      <View style={styles.container}>
        <Calendar selectedDate={selectedDate} todos={todos} onSelectDate={setSelectedDate} />

        <TodoCarousel />
      </View>
    </SafeAreaView>
  );
}
