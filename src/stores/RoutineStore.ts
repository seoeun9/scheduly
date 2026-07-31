import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SFSymbol } from 'expo-symbols';

import type { TodoColor } from '@/types/todo';

export type RepeatType = 'daily' | 'weekly' | 'monthly';

export type Routine = {
  id: string;
  title: string;

  icon: SFSymbol;
  color: TodoColor;

  repeatType: RepeatType;
  interval: number;

  startDate: string;
  endDate: string | null;

  nextDate: string;
  completedDates: string[];
};

export type AddRoutineInput = {
  title: string;

  icon: SFSymbol;
  color: TodoColor;

  repeatType: RepeatType;
  interval: number;

  startDate: string;
  endDate: string | null;

  nextDate: string;
};

type UpdateRoutineInput = Partial<
  Pick<
    Routine,
    'title' | 'icon' | 'color' | 'repeatType' | 'interval' | 'startDate' | 'endDate' | 'nextDate'
  >
>;

type RoutineStore = {
  routines: Routine[];

  addRoutine: (input: AddRoutineInput) => Routine | null;
  updateRoutine: (id: string, changes: UpdateRoutineInput) => void;

  removeRoutine: (id: string) => void;

  toggleRoutineCompletion: (id: string, date: string) => void;

  reorderRoutines: (routines: Routine[]) => void;

  setRoutineCompletion: (id: string, date: string, done: boolean) => void;
};

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set) => ({
      routines: [],

      addRoutine: (input) => {
        const trimmedTitle = input.title.trim();

        if (!trimmedTitle) {
          return null;
        }

        const newRoutine: Routine = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

          ...input,

          title: trimmedTitle,
          completedDates: [],
        };

        set((state) => ({
          routines: [...state.routines, newRoutine],
        }));

        return newRoutine;
      },

      updateRoutine: (id, changes) => {
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id
              ? {
                  ...routine,
                  ...changes,

                  title: changes.title !== undefined ? changes.title.trim() : routine.title,
                }
              : routine
          ),
        }));
      },

      removeRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
        }));
      },

      toggleRoutineCompletion: (id, date) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
            if (routine.id !== id) {
              return routine;
            }

            const isCompleted = routine.completedDates.includes(date);

            return {
              ...routine,

              completedDates: isCompleted
                ? routine.completedDates.filter((completedDate) => completedDate !== date)
                : [...routine.completedDates, date].sort(),
            };
          }),
        }));
      },

      reorderRoutines: (reorderedRoutines) => {
        set({
          routines: reorderedRoutines,
        });
      },

      setRoutineCompletion: (id, date, done) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
            if (routine.id !== id) {
              return routine;
            }

            const alreadyCompleted = routine.completedDates.includes(date);

            if (done && !alreadyCompleted) {
              return {
                ...routine,

                completedDates: [...routine.completedDates, date].sort(),
              };
            }

            if (!done && alreadyCompleted) {
              return {
                ...routine,

                completedDates: routine.completedDates.filter(
                  (completedDate) => completedDate !== date
                ),
              };
            }

            return routine;
          }),
        }));
      },
    }),
    {
      name: 'scheduly-routine-storage',

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        routines: state.routines,
      }),
    }
  )
);
