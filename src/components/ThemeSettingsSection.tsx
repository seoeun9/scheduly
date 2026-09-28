import { Text } from '@/components/AppText';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';
import { useThemeStore, type ThemeMode } from '@/stores/themeStore';
import { useTheme } from '@/hooks/useTheme';

export function ThemeSettingsSection() {
  const { setColorScheme } = useColorScheme();
  const { themeMode, setThemeMode } = useThemeStore();
  const { isDark } = useTheme();
  const themeFadeOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(themeFadeOpacity, {
      toValue: 1,
      duration: 170,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [themeMode, themeFadeOpacity]);

  const handleChangeTheme = (mode: ThemeMode) => {
    void Haptics.selectionAsync();
    setThemeMode(mode);
    setColorScheme(mode);
  };

  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center justify-start gap-3">
        <Ionicons name="color-palette-outline" size={18} color={isDark ? '#FFFFFF' : '#222631'} />

        <Text className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
          테마
        </Text>
      </View>

      <View
        className={`relative flex-row items-center rounded-full border p-[2px] ${
          isDark ? 'border-[#3A3A3A] bg-[#1A1A1A]' : 'border-[#DCDCDC] bg-[#FCFCFC]'
        }`}>
        <Pressable
          onPress={() => handleChangeTheme('system')}
          className="relative h-[24px] w-[48px] items-center justify-center rounded-full">
          {themeMode === 'system' && (
            <Animated.View
              pointerEvents="none"
              className="absolute inset-0 rounded-full"
              style={{
                opacity: themeFadeOpacity,
                backgroundColor: isDark ? '#333333' : '#FFFFFF',
                shadowColor: '#000000',
                shadowOpacity: 0.07,
                shadowRadius: 4,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 1,
              }}
            />
          )}

          <Text
            className="text-[12px] font-medium"
            style={{
              color:
                themeMode === 'system'
                  ? isDark
                    ? '#FFFFFF'
                    : '#3A3A3A'
                  : isDark
                    ? '#555555'
                    : '#B0B0B0',
            }}>
            시스템
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleChangeTheme('light')}
          className="relative h-[24px] w-[28px] items-center justify-center rounded-full">
          {themeMode === 'light' && (
            <Animated.View
              pointerEvents="none"
              className="absolute inset-0 rounded-full"
              style={{
                opacity: themeFadeOpacity,
                backgroundColor: isDark ? '#333333' : '#FFFFFF',
                shadowColor: '#000000',
                shadowOpacity: 0.07,
                shadowRadius: 4,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 1,
              }}
            />
          )}

          <Ionicons
            name="sunny-outline"
            size={14}
            color={
              themeMode === 'light'
                ? isDark
                  ? '#FFFFFF'
                  : '#111111'
                : isDark
                  ? '#555555'
                  : '#C8C8C8'
            }
          />
        </Pressable>

        <Pressable
          onPress={() => handleChangeTheme('dark')}
          className="relative h-[24px] w-[28px] items-center justify-center rounded-full">
          {themeMode === 'dark' && (
            <Animated.View
              pointerEvents="none"
              className="absolute inset-0 rounded-full"
              style={{
                opacity: themeFadeOpacity,
                backgroundColor: isDark ? '#333333' : '#FFFFFF',
                shadowColor: '#000000',
                shadowOpacity: 0.07,
                shadowRadius: 4,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 1,
              }}
            />
          )}

          <Ionicons
            name="moon-outline"
            size={14}
            color={
              themeMode === 'dark'
                ? isDark
                  ? '#FFFFFF'
                  : '#111111'
                : isDark
                  ? '#555555'
                  : '#C8C8C8'
            }
          />
        </Pressable>
      </View>
    </View>
  );
}
