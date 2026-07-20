export const TODO_COLORS = {
  red: {
    color: '#FF7474',
    backgroundColor: '#FFE8E8',
  },
  orange: {
    color: '#FF9F43',
    backgroundColor: '#FFF0DE',
  },
  yellow: {
    color: '#E6B522',
    backgroundColor: '#FFF7D6',
  },
  green: {
    color: '#55B889',
    backgroundColor: '#E3F6ED',
  },
  blue: {
    color: '#4AB4FF',
    backgroundColor: '#E8F6FF',
  },
  navy: {
    color: '#5967C8',
    backgroundColor: '#ECEEFC',
  },
  purple: {
    color: '#C765F4',
    backgroundColor: '#F6E7FD',
  },
} as const;

export type TodoColor = keyof typeof TODO_COLORS;
