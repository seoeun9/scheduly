import { useCallback } from 'react';
import * as Haptics from '@/utils/haptics';

import { useRoutineStore } from '@/stores/RoutineStore';
import { useTodoStore } from '@/stores/useTodoStore';

export function useToggleTodoCompletion() {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const setRoutineCompletion = useRoutineStore((state) => state.setRoutineCompletion);

  return useCallback(
    (todoId: string) => {
      const todo = useTodoStore.getState().todos.find((item) => item.id === todoId);

      if (!todo) {
        return;
      }

      const nextDone = !todo.done;

      void Haptics.selectionAsync();
      toggleTodo(todoId);

      if (todo.routineId) {
        setRoutineCompletion(todo.routineId, todo.date, nextDone);
      }
    },
    [setRoutineCompletion, toggleTodo]
  );
}
