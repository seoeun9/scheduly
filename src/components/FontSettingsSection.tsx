import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { useFontStore, type FontMode } from '@/stores/fontStore';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from '@/utils/haptics';

export function FontSettingsSection() {
  const { fontMode, setFontMode } = useFontStore();
  const { isDark } = useTheme();
  const options: { value: FontMode; label: string }[] = [
    { value: 'system', label: '시스템' },
    { value: 'app', label: '앱' },
  ];
  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center justify-start gap-3">
        <Ionicons name="text-outline" size={18} color={isDark ? '#FFFFFF' : '#222631'} />
        <Text className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
          글꼴
        </Text>
      </View>
      <View
        className={`relative flex-row items-center rounded-full border p-[2px] ${isDark ? 'border-[#3A3A3A] bg-[#1A1A1A]' : 'border-[#DCDCDC] bg-[#FCFCFC]'}`}>
        {options.map(({ value, label }) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={`글꼴 ${label}`}
            accessibilityState={{ checked: fontMode === value }}
            onPress={() => {
              void Haptics.selectionAsync();
              setFontMode(value);
            }}
            className="relative h-[24px] w-[52px] items-center justify-center rounded-full">
            {fontMode === value && (
              <View
                pointerEvents="none"
                className="absolute inset-0 rounded-full"
                style={{
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
                  fontMode === value
                    ? isDark
                      ? '#FFFFFF'
                      : '#3A3A3A'
                    : isDark
                      ? '#555555'
                      : '#B0B0B0',
              }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
