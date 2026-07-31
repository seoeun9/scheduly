import { Ionicons } from '@expo/vector-icons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Platform, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

type AppSymbolProps = {
  name: SFSymbol;
  size?: number;
  tintColor: string;
  type?: 'monochrome' | 'multicolor' | 'hierarchical' | 'palette';
  style?: StyleProp<TextStyle | ViewStyle>;
};

const SYMBOL_TO_IONICON: Record<string, string> = {
  'checkmark.circle': 'checkmark-circle-outline',
  calendar: 'calendar-outline',
  clock: 'time-outline',
  star: 'star-outline',
  heart: 'heart-outline',
  book: 'book-outline',
  graduationcap: 'school-outline',
  pencil: 'pencil-outline',
  briefcase: 'briefcase-outline',
  laptopcomputer: 'laptop-outline',
  house: 'home-outline',
  sparkles: 'sparkles-outline',
  'bubbles.and.sparkles': 'color-wand-outline',
  trash: 'trash-outline',
  cart: 'cart-outline',
  bag: 'bag-outline',
  creditcard: 'card-outline',
  gift: 'gift-outline',
  'fork.knife': 'restaurant-outline',
  'cup.and.saucer': 'cafe-outline',
  'takeoutbag.and.cup.and.straw': 'fast-food-outline',
  'birthday.cake': 'cake-outline',
  film: 'film-outline',
  tv: 'tv-outline',
  'play.rectangle': 'play-circle-outline',
  headphones: 'headset-outline',
  'music.note': 'musical-notes-outline',
  gamecontroller: 'game-controller-outline',
  'figure.run': 'fitness-outline',
  dumbbell: 'barbell-outline',
  'cross.case': 'medkit-outline',
  airplane: 'airplane-outline',
  car: 'car-outline',
  bus: 'bus-outline',
  tram: 'train-outline',
  'person.2': 'people-outline',
  'bubble.left': 'chatbubble-outline',
  phone: 'call-outline',
  'party.popper': 'balloon-outline',
  repeat: 'repeat-outline',
};

function mapSymbolToIonicon(name: SFSymbol) {
  return SYMBOL_TO_IONICON[name] ?? 'ellipse-outline';
}

export function AppSymbol({
  name,
  size = 20,
  tintColor,
  type = 'monochrome',
  style,
}: AppSymbolProps) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={name} size={size} tintColor={tintColor} type={type} />;
  }

  return (
    <Ionicons name={mapSymbolToIonicon(name) as any} size={size} color={tintColor} style={style} />
  );
}
