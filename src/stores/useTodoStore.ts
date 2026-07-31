import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TodoColor } from '@/types/todo';
import type { SFSymbol } from 'expo-symbols';

export type Todo = {
  id: string;
  date: string;
  title: string;
  done: boolean;
  color: TodoColor;
  icon: SFSymbol;
  routineId?: string;
};

type RoutineTodoInput = {
  routineId: string;
  date: string;
  title: string;
  color: TodoColor;
  icon: SFSymbol;
  done: boolean;
};

type RoutineTodoChanges = Partial<Pick<Todo, 'title' | 'color' | 'icon'>>;

type AddTodoInput = {
  title: string;
  color: TodoColor;
  icon: SFSymbol;
};

type UpdateTodoInput = Partial<Pick<Todo, 'date' | 'title' | 'done' | 'color' | 'icon'>>;

type TodoStore = {
  selectedDate: string;
  todos: Todo[];

  setSelectedDate: (date: string) => void;

  addTodo: (input: AddTodoInput) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, changes: UpdateTodoInput) => void;
  removeTodo: (id: string) => void;
  reorderTodos: (date: string, reorderedTodos: Todo[]) => void;
  addRoutineTodos: (inputs: RoutineTodoInput[]) => void;
  updateRoutineTodos: (routineId: string, changes: RoutineTodoChanges) => void;
  removeRoutineTodos: (routineId: string) => void;

  removeFutureRoutineTodos: (routineId: string, fromDate: string) => void;
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      selectedDate: '',
      todos: [],

      setSelectedDate: (date) => {
        set({
          selectedDate: date,
        });
      },

      addTodo: ({ title, color, icon }) => {
        const { selectedDate } = get();
        const trimmedTitle = title.trim();

        if (!selectedDate || !trimmedTitle) {
          return;
        }

        const newTodo: Todo = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          date: selectedDate,
          title: trimmedTitle,
          done: false,
          color,
          icon,
        };

        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  done: !todo.done,
                }
              : todo
          ),
        }));
      },

      updateTodo: (id, changes) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...changes,
                }
              : todo
          ),
        }));
      },

      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      reorderTodos: (date, reorderedTodos) => {
        set((state) => {
          let reorderedIndex = 0;

          return {
            todos: state.todos.map((todo) => {
              if (todo.date !== date) {
                return todo;
              }

              const reorderedTodo = reorderedTodos[reorderedIndex];

              reorderedIndex += 1;

              return reorderedTodo ?? todo;
            }),
          };
        });
      },
      addRoutineTodos: (inputs) => {
        set((state) => {
          const existingKeys = new Set(
            state.todos
              .filter((todo) => todo.routineId)
              .map((todo) => `${todo.routineId}:${todo.date}`)
          );

          const newTodos: Todo[] = inputs
            .filter((input) => !existingKeys.has(`${input.routineId}:${input.date}`))
            .map((input) => ({
              id: `routine-${input.routineId}-${input.date}`,

              routineId: input.routineId,

              date: input.date,
              title: input.title,
              color: input.color,
              icon: input.icon,

              done: input.done,
            }));

          return {
            todos: [...state.todos, ...newTodos],
          };
        });
      },
      updateRoutineTodos: (routineId, changes) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.routineId === routineId
              ? {
                  ...todo,
                  ...changes,
                }
              : todo
          ),
        }));
      },
      removeRoutineTodos: (routineId) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.routineId !== routineId),
        }));
      },

      removeFutureRoutineTodos: (routineId, fromDate) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.routineId !== routineId || todo.date < fromDate),
        }));
      },
    }),
    {
      name: 'scheduly-todo-storage',

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        todos: state.todos,
      }),

      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TodoStore>;

        return {
          ...currentState,
          todos: persisted.todos ?? [],
          selectedDate: '',
        };
      },
    }
  )
);
