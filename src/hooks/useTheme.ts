import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';

export function useTheme() {
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  return { isDark };
}
