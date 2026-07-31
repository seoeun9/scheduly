import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import * as Haptics from '@/utils/haptics';

import { useTheme } from '@/hooks/useTheme';
import { TODO_COLORS } from '@/types/todo';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useRoutineStore, type Routine } from '@/stores/RoutineStore';
import { AppSymbol } from '@/components/AppSymbol';

function formatDate(date: string) {
  const [, month, day] = date.split('-');

  return `${Number(month)}월 ${Number(day)}일`;
}

function getRepeatText(routine: Routine) {
  const { repeatType, interval } = routine;

  if (repeatType === 'daily') {
    return interval === 1 ? '매일' : `${interval}일마다`;
  }

  if (repeatType === 'weekly') {
    return interval === 1 ? '매주' : `${interval}주마다`;
  }

  return interval === 1 ? '매달' : `${interval}개월마다`;
}

function getPeriodText(routine: Routine) {
  const startText = `${formatDate(routine.startDate)}부터`;

  if (!routine.endDate) {
    return startText;
  }

  return `${startText} · ${formatDate(routine.endDate)}까지`;
}

type RoutineCardProps = {
  routine: Routine;
  isDark: boolean;
  onPress: () => void;
};

function RoutineCard({ routine, isDark, onPress }: RoutineCardProps) {
  const palette = TODO_COLORS[routine.color] ?? TODO_COLORS.blue;

  const repeatText = getRepeatText(routine);
  const periodText = getPeriodText(routine);
  const completedCount = routine.completedDates.length;

  return (
    <Pressable
      className={`flex-row items-center rounded-[18px] border px-4 py-4 ${
        isDark ? 'border-[#2A2A2A] bg-[#151515]' : 'border-[#ECECEC] bg-[#FAFAFA]'
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.62 : 1,
        transform: [
          {
            scale: pressed ? 0.99 : 1,
          },
        ],
      })}
      onPress={onPress}>
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{
          backgroundColor: isDark ? `${palette.color}22` : palette.backgroundColor,
        }}>
        <AppSymbol name={routine.icon} type="monochrome" size={21} tintColor={palette.color} />
      </View>

      <View className="ml-4 min-w-0 flex-1">
        <Text
          className={`text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}
          numberOfLines={1}>
          {routine.title}
        </Text>

        <Text
          className={`mt-1 text-xs ${isDark ? 'text-[#8D8D8D]' : 'text-[#969696]'}`}
          numberOfLines={1}>
          {repeatText} · {periodText}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Text
            className="text-xs font-semibold"
            style={{
              color: palette.color,
            }}>
            지금까지 {completedCount}회 완료
          </Text>
        </View>
      </View>

      <View
        className={`ml-3 h-8 w-8 items-center justify-center rounded-full ${
          isDark ? 'bg-[#242424]' : 'bg-white'
        }`}>
        <Ionicons name="create-outline" size={14} color={isDark ? '#D5D5D5' : '#686868'} />
      </View>
    </Pressable>
  );
}

export default function RoutineScreen() {
  const { isDark } = useTheme();
  const routines = useRoutineStore((state) => state.routines);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleAddRoutine = () => {
    Haptics.selectionAsync();
    navigation.navigate('AddRoutine');
  };

  const handleEditRoutine = (routineId: string) => {
    void Haptics.selectionAsync();

    navigation.navigate('EditRoutine', {
      routineId,
    });
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`} edges={['top']}>
      <View className="pb-30 flex-1 px-8 pt-7">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-[26px] font-bold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              나의 루틴
            </Text>

            <Text className={`mt-2 text-[15px] ${isDark ? 'text-[#8D8D8D]' : 'text-[#969696]'}`}>
              오늘도 나만의 리듬을 이어가요
            </Text>
          </View>

          <Pressable
            className={`h-10 w-10 items-center justify-center rounded-full ${
              isDark ? 'bg-white' : 'bg-black'
            }`}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              transform: [
                {
                  scale: pressed ? 0.94 : 1,
                },
              ],
            })}
            onPress={handleAddRoutine}
            hitSlop={8}>
            <Ionicons name="add" size={22} color={isDark ? '#000000' : '#FFFFFF'} />
          </Pressable>
        </View>

        <View
          className={`mt-7 rounded-[22px] px-6 py-6 ${isDark ? 'bg-[#161616]' : 'bg-[#F5F5F5]'}`}>
          <Text className={`text-3xl ${isDark ? 'text-white' : 'text-[#181A21]'}`}>“</Text>

          <Text
            className={`mt-2 text-[20px] font-medium leading-8 ${
              isDark ? 'text-white' : 'text-[#181A21]'
            }`}>
            작은 반복이 결국{'\n'}
            나를 만든다.
          </Text>

          <Text className={`mt-3 text-xs ${isDark ? 'text-[#777777]' : 'text-[#969696]'}`}>
            — 작자 미상
          </Text>
        </View>

        {routines.length === 0 ? (
          <View className="flex-1 items-center justify-center pb-16">
            <View
              className={`h-16 w-16 items-center justify-center rounded-full ${
                isDark ? 'bg-[#1C1C1C]' : 'bg-[#F4F4F4]'
              }`}>
              <Ionicons name="repeat-outline" size={28} color={isDark ? '#777777' : '#A5A5A5'} />
            </View>

            <Text
              className={`mt-5 text-[17px] font-semibold ${
                isDark ? 'text-white' : 'text-[#181A21]'
              }`}>
              아직 루틴이 없어요
            </Text>

            <Text
              className={`mt-2 text-center text-sm leading-5 ${
                isDark ? 'text-[#777777]' : 'text-[#969696]'
              }`}>
              작은 습관부터 하나씩{'\n'}
              나만의 루틴을 만들어보세요
            </Text>

            <Pressable
              className={`mt-6 flex-row items-center rounded-full px-5 py-3 ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              style={({ pressed }) => ({
                opacity: pressed ? 0.65 : 1,
                transform: [
                  {
                    scale: pressed ? 0.96 : 1,
                  },
                ],
              })}
              onPress={handleAddRoutine}>
              <Ionicons name="add" size={17} color={isDark ? '#000000' : '#FFFFFF'} />

              <Text
                className={`ml-2 text-sm font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
                첫 루틴 만들기
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text
              className={`mb-4 mt-8 text-[17px] font-semibold ${
                isDark ? 'text-white' : 'text-[#181A21]'
              }`}>
              {routines.length}개의 루틴을 이어가고 있어요
            </Text>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 32,
              }}>
              <View className="gap-3">
                {routines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    isDark={isDark}
                    onPress={() => handleEditRoutine(routine.id)}
                  />
                ))}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
