import React, { useMemo } from 'react';
import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTodoStore } from '@/stores/useTodoStore';
import { TodoRow } from './TodoRow';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';

export default function TodoCarousel() {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();

  const selectedTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate]
  );

  const activeTodos = useMemo(() => selectedTodos.filter((todo) => !todo.done), [selectedTodos]);

  const completedTodos = useMemo(() => selectedTodos.filter((todo) => todo.done), [selectedTodos]);

  const handleToggleTodo = (id: string) => {
    void Haptics.selectionAsync();
    toggleTodo(id);
  };

  const handleEditTodo = (id: string) => {
    navigation.navigate('EditTodo', {
      todoId: id,
      previewMode: 'calendar',
    });
  };

  return (
    <View className="mt-6 flex-col justify-between gap-8">
      <TodoRow
        title="Tasks"
        todos={activeTodos}
        completed={false}
        emptyMessage={completedTodos.length ? '모든 일을 완료했어요!' : '아직 할 일이 없어요'}
        isDark={isDark}
        onPressTodo={handleToggleTodo}
        onEditTodo={handleEditTodo}
        onAddTodo={() => {
          Haptics.selectionAsync();
          navigation.navigate('AddTodo', {
            previewMode: 'calendar',
          });
        }}
      />

      <TodoRow
        title="Completed"
        todos={completedTodos}
        completed
        emptyMessage="아직 완료한 일이 없어요"
        isDark={isDark}
        onEditTodo={handleEditTodo}
        onPressTodo={handleToggleTodo}
      />
    </View>
  );
}
