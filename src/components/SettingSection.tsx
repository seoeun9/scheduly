import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'nativewind';
import { useThemeStore, ThemeMode } from '@/stores/themeStore';
import { useTheme } from '@/hooks/useTheme';

type SettingSectionProps = {
  title: string;
  function?: [];
};

export default function SettingSection(props: SettingSectionProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { setColorScheme } = useColorScheme();
  const { themeMode, setThemeMode } = useThemeStore();
  const { isDark } = useTheme();

  const handleChangeTheme = (mode: ThemeMode) => {
    Haptics.selectionAsync();
    setThemeMode(mode);
    setColorScheme(mode);
  };

  const toggleTranslateX = useRef(new Animated.Value(notificationsEnabled ? 18 : 0)).current;
  const themeFadeOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(toggleTranslateX, {
      toValue: notificationsEnabled ? 18 : 0,
      tension: 180,
      friction: 18,
      useNativeDriver: true,
    }).start();
  }, [notificationsEnabled, toggleTranslateX]);

  useEffect(() => {
    Animated.timing(themeFadeOpacity, {
      toValue: 1,
      duration: 170,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [themeMode, themeFadeOpacity]);

  const handleToggleNotifications = () => {
    void Haptics.selectionAsync();
    setNotificationsEnabled((previous) => !previous);
  };

  return (
    <View className="flex flex-col items-start justify-center gap-3 px-10 pt-10">
      <Text className="text-[13px] font-medium text-[#7C7C7C]">{props.title}</Text>
      <View
        className={`w-full rounded-[18px] border px-7 py-6 ${isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-[#F1F1F1] bg-white'}`}>
        {props.title === '일반' && (
          <View className="flex flex-col items-center justify-start gap-1">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={isDark ? '#FFFFFF' : '#222631'}
                />
                <Text
                  className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
                  리마인드 알림
                </Text>
              </View>
              <Pressable
                onPress={handleToggleNotifications}
                className="h-[26px] w-[44px] rounded-full px-[4px] py-[4px]"
                style={{
                  backgroundColor: notificationsEnabled
                    ? isDark
                      ? '#FFFFFF'
                      : '#111111'
                    : isDark
                      ? '#3A3A3A'
                      : '#E7E7EA',
                }}>
                <Animated.View
                  className="h-[18px] w-[18px] rounded-full"
                  style={{
                    backgroundColor: isDark && notificationsEnabled ? '#111111' : '#FFFFFF',
                    transform: [{ translateX: toggleTranslateX }],
                    shadowColor: '#000000',
                    shadowOpacity: 0.16,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 1,
                  }}
                />
              </Pressable>
            </View>

            <View className={`my-5 h-px w-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#F1F1F1]'}`} />

            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons
                  name="color-palette-outline"
                  size={18}
                  color={isDark ? '#FFFFFF' : '#222631'}
                />
                <Text
                  className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
                  테마
                </Text>
              </View>
              <View
                className={`relative flex-row items-center rounded-full border p-[2px] ${isDark ? 'border-[#3A3A3A] bg-[#1A1A1A]' : 'border-[#DCDCDC] bg-[#FCFCFC]'}`}>
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
                        shadowOffset: { width: 0, height: 2 },
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
                        shadowOffset: { width: 0, height: 2 },
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
                        shadowOffset: { width: 0, height: 2 },
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
          </View>
        )}
        {props.title === '계정' && (
          <View className="flex flex-col items-center justify-start gap-2 ">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={isDark ? '#FFFFFF' : '#222631'}
                />
                <Text
                  className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
                  로그아웃
                </Text>
              </View>
              {/*로그아웃*/}
            </View>
          </View>
        )}
        {props.title === '피드백' && (
          <View className="flex flex-col items-center justify-start gap-2 ">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={18}
                  color={isDark ? '#FFFFFF' : '#222631'}
                />
                <Text
                  className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
                  피드백 보내기
                </Text>
              </View>
              <Pressable className="ㅐ h-[18px] items-center justify-center">
                <Text className="text-xs text-[#757575]">jseoeun26@gmail.com</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
