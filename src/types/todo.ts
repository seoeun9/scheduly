import type { SFSymbol } from 'expo-symbols';

export type Todo = {
  id: string;
  date: string;
  title: string;
  done: boolean;
  color: TodoColor;
  icon: SFSymbol;
};

export const TODO_COLORS = {
  red: {
    color: '#FF7474',
    backgroundColor: '#FFE8E8',
    darkBackgroundColor: '#3A1818',
  },
  orange: {
    color: '#FF9F43',
    backgroundColor: '#FFF0DE',
    darkBackgroundColor: '#3A2210',
  },
  yellow: {
    color: '#E6B522',
    backgroundColor: '#FFF7D6',
    darkBackgroundColor: '#362A00',
  },
  green: {
    color: '#55B889',
    backgroundColor: '#E3F6ED',
    darkBackgroundColor: '#102918',
  },
  blue: {
    color: '#4AB4FF',
    backgroundColor: '#E8F6FF',
    darkBackgroundColor: '#0C2236',
  },
  navy: {
    color: '#5967C8',
    backgroundColor: '#ECEEFC',
    darkBackgroundColor: '#101436',
  },
  purple: {
    color: '#C765F4',
    backgroundColor: '#F6E7FD',
    darkBackgroundColor: '#250D32',
  },
  gray: {
    color: '#555555',
    backgroundColor: '#F0F0F0',
    darkBackgroundColor: '#3A3A3A',
  },
} as const;

export type TodoColor = keyof typeof TODO_COLORS;
