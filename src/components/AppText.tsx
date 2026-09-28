import { createContext, forwardRef, useContext, useEffect, type ReactNode } from 'react';
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  StyleSheet,
  Platform,
  type TextProps,
  type TextInputProps,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { useFonts } from 'expo-font';
import { useFontStore } from '@/stores/fontStore';

const FontReadyContext = createContext(false);
export function FontProvider({ children }: { children: ReactNode }) {
  const [loaded, error] = useFonts({
    'Pretendard-Light': require('../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
  });
  useEffect(() => {
    if (error) console.warn('Failed to load Pretendard.', error);
  }, [error]);
  if (!loaded && !error) return null;
  return <FontReadyContext.Provider value={loaded}>{children}</FontReadyContext.Provider>;
}

function useFontStyle(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  const fontMode = useFontStore((state) => state.fontMode);
  const loaded = useContext(FontReadyContext);
  const weight = StyleSheet.flatten(style)?.fontWeight;
  const baseWeight = weight === 'bold' ? 700 : Number(weight) || 400;
  const numericWeight = Platform.OS === 'android' ? Math.max(100, baseWeight - 100) : baseWeight;
  if (fontMode === 'system' || !loaded) {
    return Platform.OS === 'android'
      ? [style, { fontWeight: String(numericWeight) as TextStyle['fontWeight'] }]
      : style;
  }
  const family =
    numericWeight >= 700
      ? 'Bold'
      : numericWeight >= 600
        ? 'SemiBold'
        : numericWeight >= 500
          ? 'Medium'
          : numericWeight >= 400
            ? 'Regular'
            : 'Light';
  // Each Android font is registered under its own family; avoid a second weight lookup.
  return [style, { fontFamily: `Pretendard-${family}`, fontWeight: 'normal' }];
}

export const Text = forwardRef<NativeText, TextProps>(function AppText({ style, ...props }, ref) {
  return <NativeText ref={ref} {...props} style={useFontStyle(style)} />;
});
export const TextInput = forwardRef<NativeTextInput, TextInputProps>(function AppTextInput(
  { style, ...props },
  ref
) {
  return <NativeTextInput ref={ref} {...props} style={useFontStyle(style)} />;
});
// Resolve NativeWind classes before selecting the corresponding font weight.
cssInterop(Text, { className: 'style' });
cssInterop(TextInput, { className: 'style' });
