import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type SettingSectionProps = {
  title: string;
  function?: [];
};

type ThemeMode = 'system' | 'light' | 'dark';

export default function SettingSection(props: SettingSectionProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

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

  const handleSelectTheme = (nextThemeMode: ThemeMode) => {
    void Haptics.selectionAsync();

    if (nextThemeMode === themeMode) {
      return;
    }

    themeFadeOpacity.setValue(0.45);
    setThemeMode(nextThemeMode);
  };

  return (
    <View className="flex flex-col items-start justify-center gap-3 px-10 pt-10">
      <Text className="text-[13px] font-medium text-[#7C7C7C]">{props.title}</Text>
      <View className=" w-full rounded-[18px] border border-[#F1F1F1] bg-white px-7 py-6">
        {props.title === '일반' && (
          <View className="flex flex-col items-center justify-start gap-1">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons name="notifications-outline" size={18} color="#222631" />
                <Text className="text-[15px] font-medium text-[#222631]">알림 허용</Text>
              </View>
              <Pressable
                onPress={handleToggleNotifications}
                className="h-[26px] w-[44px] rounded-full px-[4px] py-[4px]"
                style={{
                  backgroundColor: notificationsEnabled ? '#111111' : '#E7E7EA',
                }}>
                <Animated.View
                  className="h-[18px] w-[18px] rounded-full bg-white"
                  style={{
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

            <View className="my-5 h-px w-full bg-[#F1F1F1]" />

            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons name="color-palette-outline" size={18} color="#222631" />
                <Text className="text-[15px] font-medium text-[#222631]">테마</Text>
              </View>
              <View className="relative flex-row items-center rounded-full border border-[#DCDCDC] bg-[#FCFCFC] p-[2px]">
                <Pressable
                  onPress={() => handleSelectTheme('system')}
                  className="relative h-[24px] w-[48px] items-center justify-center rounded-full">
                  {themeMode === 'system' && (
                    <Animated.View
                      pointerEvents="none"
                      className="absolute inset-0 rounded-full bg-white"
                      style={{
                        opacity: themeFadeOpacity,
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
                      color: themeMode === 'system' ? '#3A3A3A' : '#B0B0B0',
                    }}>
                    시스템
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSelectTheme('light')}
                  className="relative h-[24px] w-[28px] items-center justify-center rounded-full">
                  {themeMode === 'light' && (
                    <Animated.View
                      pointerEvents="none"
                      className="absolute inset-0 rounded-full bg-white"
                      style={{
                        opacity: themeFadeOpacity,
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
                    color={themeMode === 'light' ? '#111111' : '#C8C8C8'}
                  />
                </Pressable>

                <Pressable
                  onPress={() => handleSelectTheme('dark')}
                  className="relative h-[24px] w-[28px] items-center justify-center rounded-full">
                  {themeMode === 'dark' && (
                    <Animated.View
                      pointerEvents="none"
                      className="absolute inset-0 rounded-full bg-white"
                      style={{
                        opacity: themeFadeOpacity,
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
                    color={themeMode === 'dark' ? '#111111' : '#C8C8C8'}
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
                <Ionicons name="notifications-outline" size={18} color="#222631" />
                <Text className="text-[15px] font-medium text-[#222631]">로그아웃</Text>
              </View>
              {/*로그아웃*/}
            </View>
          </View>
        )}
        {props.title === '피드백' && (
          <View className="flex flex-col items-center justify-start gap-2 ">
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center justify-start gap-3">
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#222631" />
                <Text className="text-[15px] font-medium text-[#222631]">피드백 보내기</Text>
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
