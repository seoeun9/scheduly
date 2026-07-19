import { create } from 'zustand';

type Todo = {
  id: string;
  date: string;
  title: string;
  time: string;
  done: boolean;
};

type TodoStore = {
  selectedDate: string;
  selectedTime: string;
  todos: Todo[];
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  selectedDate: '',
  selectedTime: '',
  todos: [],

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),

  addTodo: (title) => {
    const { selectedDate } = get();
    const { selectedTime } = get();
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          date: selectedDate,
          time: selectedTime,
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
