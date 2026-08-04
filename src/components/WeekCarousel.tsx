import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '@/utils/haptics';

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

function getWeekDates(date: Date) {
  const start = getStartOfWeek(date);

  return Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + index);
    return nextDate;
  });
}

function getWeekRangeText(weekDates: Date[]) {
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const getWeekOfMonth = (date: Date) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthStartWeek = getStartOfWeek(monthStart);
    const targetWeek = getStartOfWeek(date);
    const dayDiff = Math.round((targetWeek.getTime() - monthStartWeek.getTime()) / MS_PER_DAY);

    return Math.floor(dayDiff / 7) + 1;
  };

  const isSameMonth =
    firstDate.getFullYear() === lastDate.getFullYear() &&
    firstDate.getMonth() === lastDate.getMonth();

  const firstWeek = getWeekOfMonth(firstDate);

  if (isSameMonth) {
    return `${firstWeek}주차`;
  }

  const lastWeek = getWeekOfMonth(lastDate);

  return `${firstWeek}주차 (${lastDate.getMonth() + 1}월 ${lastWeek}주차)`;
}

function getDateWithWeekOffset(date: Date, offset: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + offset * 7);

  return nextDate;
}

type WeekCarouselProps = {
  selectedDate: string;
  isDark: boolean;
  onSelectDate: (date: string) => void;
  onOpenCalendar: () => void;
};

type WeekPageProps = {
  date: Date;
  selectedDate: string;
  isDark: boolean;
  onSelectDate: (date: Date) => void;
};

function WeekPage({ date, selectedDate, isDark, onSelectDate }: WeekPageProps) {
  const weekDates = useMemo(() => getWeekDates(date), [date]);

  return (
    <View style={{ width: '100%' }}>
      <View className="mt-3 flex-row">
        {WEEK_DAYS.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-sm text-[#A5A5A5]">{day}</Text>
          </View>
        ))}
      </View>

      <View className="mt-1 flex-row">
        {weekDates.map((weekDate) => {
          const dateKey = toDateKey(weekDate);
          const isSelected = dateKey === selectedDate;

          return (
            <View key={dateKey} className="flex-1 items-center">
              <Pressable
                className={`h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
                  isSelected ? (isDark ? 'bg-[#F4F4F4]' : 'bg-[#212121]') : 'bg-transparent'
                }`}
                onPress={() => onSelectDate(weekDate)}>
                <Text
                  style={{
                    color: isSelected
                      ? isDark
                        ? '#212121'
                        : '#F4F4F4'
                      : isDark
                        ? '#CCCCCC'
                        : '#454545',
                  }}
                  className="text-base font-medium">
                  {weekDate.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function WeekCarousel({
  selectedDate,
  isDark,
  onSelectDate,
  onOpenCalendar,
}: WeekCarouselProps) {
  const today = useMemo(() => new Date(), []);

  const selectedDateObject = useMemo(() => {
    if (!selectedDate) {
      return today;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);

    return new Date(year, month - 1, day);
  }, [selectedDate, today]);

  const [visibleDate, setVisibleDate] = useState(() => new Date(selectedDateObject));

  useEffect(() => {
    setVisibleDate(new Date(selectedDateObject));
  }, [selectedDateObject]);

  const currentWeekDates = useMemo(() => getWeekDates(visibleDate), [visibleDate]);

  const previousMonthDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);

  const hasPreviousMonthInWeek = currentWeekDates.some(
    (date) =>
      date.getFullYear() === previousMonthDate.getFullYear() &&
      date.getMonth() === previousMonthDate.getMonth()
  );

  const monthLabelDate = hasPreviousMonthInWeek ? previousMonthDate : visibleDate;
  const monthTitle = `${monthLabelDate.getFullYear()}년 ${monthLabelDate.getMonth() + 1}월`;

  const changeWeek = (direction: -1 | 1) => {
    void Haptics.selectionAsync();
    setVisibleDate((currentDate) => getDateWithWeekOffset(currentDate, direction));
  };

  const handleSelectDate = (date: Date) => {
    const dateKey = toDateKey(date);

    if (dateKey === selectedDate) {
      return;
    }

    void Haptics.selectionAsync();
    onSelectDate(dateKey);
    setVisibleDate(new Date(date));
  };

  const handleChangeWeek = (direction: -1 | 1) => {
    changeWeek(direction);
  };

  const handleToday = () => {
    const currentToday = new Date();
    const todayKey = toDateKey(currentToday);

    void Haptics.selectionAsync();
    onSelectDate(todayKey);
    setVisibleDate(new Date(currentToday));
  };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Pressable onPress={onOpenCalendar} hitSlop={8}>
          <View className="h-10 w-10 items-center justify-center">
            <Ionicons name="calendar-outline" size={25} color={isDark ? '#FFFFFF' : '#181A21'} />
          </View>
        </Pressable>

        <View className="items-center">
          <Text className="text-sm font-medium text-[#8F8F8F]">{monthTitle}</Text>

          <View className="mt-1 flex-row items-center gap-5">
            <Pressable
              className={`h-8 w-8 items-center justify-center rounded-full ${
                isDark ? 'active:bg-[#2A2A2A]' : 'active:bg-[#F2F2F2]'
              }`}
              onPress={() => handleChangeWeek(-1)}
              hitSlop={8}>
              <Ionicons name="chevron-back" size={19} color={isDark ? '#FFFFFF' : '#181A21'} />
            </Pressable>

            <Text
              className={`min-w-[110px] text-center text-[14px] font-bold ${
                isDark ? 'text-white' : 'text-black'
              }`}>
              {getWeekRangeText(currentWeekDates)}
            </Text>

            <Pressable
              className={`h-8 w-8 items-center justify-center rounded-full ${
                isDark ? 'active:bg-[#2A2A2A]' : 'active:bg-[#F2F2F2]'
              }`}
              onPress={() => handleChangeWeek(1)}
              hitSlop={8}>
              <Ionicons name="chevron-forward" size={19} color={isDark ? '#FFFFFF' : '#181A21'} />
            </Pressable>
          </View>
        </View>

        <Pressable
          className={`h-8 min-w-[48px] items-center justify-center rounded-full border px-3 active:scale-95 active:opacity-60 ${
            isDark ? 'border-white bg-transparent' : 'border-black bg-white'
          }`}
          onPress={handleToday}>
          <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            오늘
          </Text>
        </Pressable>
      </View>

      <View className="overflow-hidden">
        <WeekPage
          date={visibleDate}
          selectedDate={selectedDate}
          isDark={isDark}
          onSelectDate={handleSelectDate}
        />
      </View>
    </View>
  );
}
