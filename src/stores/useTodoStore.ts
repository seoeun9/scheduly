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
};

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
  reorderTodos: (date: string, done: boolean, reorderedTodos: Todo[]) => void;
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
      reorderTodos: (date, done, reorderedTodos) => {
        set((state) => {
          let reorderedIndex = 0;

          return {
            todos: state.todos.map((todo) => {
              const isTarget = todo.date === date && todo.done === done;

              if (!isTarget) {
                return todo;
              }

              const reorderedTodo = reorderedTodos[reorderedIndex];
              reorderedIndex += 1;

              return reorderedTodo ?? todo;
            }),
          };
        });
      },
    }),
    {
      name: 'scheduly-todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
