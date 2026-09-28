import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FontMode = 'system' | 'app';
interface FontState {
  fontMode: FontMode;
  setFontMode: (mode: FontMode) => void;
}
export const useFontStore = create<FontState>()(
  persist((set) => ({ fontMode: 'app', setFontMode: (fontMode) => set({ fontMode }) }), {
    name: 'scheduly-font-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: ({ fontMode }) => ({ fontMode }),
    skipHydration: true,
  })
);
