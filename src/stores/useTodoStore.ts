import { create } from 'zustand';

type Todo = {
  id: string;
  date: string;
  title: string;
  done: boolean;
};

type TodoStore = {
  selectedDate: string;
  todos: Todo[];
  setSelectedDate: (date: string) => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  selectedDate: '',
  todos: [],

  setSelectedDate: (date) => set({ selectedDate: date }),

  addTodo: (title) => {
    const { selectedDate } = get();
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          date: selectedDate,
          title,
          done: false,
        },
      ],
    }));
  },

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    })),
}));
