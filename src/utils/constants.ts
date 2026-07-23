import { type SFSymbol } from 'expo-symbols';

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
    lightColor: '#222222',
    darkColor: '#EEEEEE',
    backgroundColor: '#F0F0F0',
    darkBackgroundColor: '#3A3A3A',
  },
} as const;

export type TodoColor = keyof typeof TODO_COLORS;

export const TODO_ICONS: SFSymbol[] = [
  // 기본
  'checkmark.circle',
  'calendar',
  'clock',
  'star',
  'heart',

  // 공부·업무
  'book',
  'graduationcap',
  'pencil',
  'briefcase',
  'laptopcomputer',

  // 집·청소
  'house',
  'sparkles',
  'bubbles.and.sparkles',
  'trash',

  // 쇼핑
  'cart',
  'bag',
  'creditcard',
  'gift',

  // 요리·식사
  'fork.knife',
  'cup.and.saucer',
  'takeoutbag.and.cup.and.straw',
  'birthday.cake',

  // 영화·미디어
  'film',
  'tv',
  'play.rectangle',
  'headphones',
  'music.note',
  'gamecontroller',

  // 운동·건강
  'figure.run',
  'dumbbell',
  'cross.case',

  // 이동·여행
  'airplane',
  'car',
  'bus',
  'tram',

  // 약속·소통
  'person.2',
  'bubble.left',
  'phone',
  'party.popper',
];
