import React, { useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { SFSymbol } from 'expo-symbols';

import { AppSymbol } from '@/components/AppSymbol';
import * as Haptics from '@/utils/haptics';
import { generateRoutineTodos } from '@/utils/routineSchedule';
import { useTodoStore } from '@/stores/useTodoStore';
import { useTheme } from '@/hooks/useTheme';
import { useRoutineStore, type RepeatType } from '@/stores/RoutineStore';
import { TODO_COLORS, TODO_ICONS } from '@/utils/constants';
import type { TodoColor } from '@/types/todo';

const ICON_ROWS = 3;
const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const TODO_ICON_COLUMNS = Array.from(
  { length: Math.ceil(TODO_ICONS.length / ICON_ROWS) },
  (_, columnIndex) => {
    const startIndex = columnIndex * ICON_ROWS;
    return TODO_ICONS.slice(startIndex, startIndex + ICON_ROWS);
  }
);

const COLOR_OPTIONS = Object.keys(TODO_COLORS) as TodoColor[];
const DEFAULT_ROUTINE_TITLE = '새로운 루틴';

const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'daily', label: '일' },
  { value: 'weekly', label: '주' },
  { value: 'monthly', label: '월' },
];

type DatePickerTarget = 'start' | 'end' | null;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getRepeatUnit(repeatType: RepeatType) {
  if (repeatType === 'daily') return '일';
  if (repeatType === 'weekly') return '주';
  return '개월';
}

function getRepeatText(repeatType: RepeatType, interval: number) {
  if (repeatType === 'daily' && interval === 1) return '매일';
  if (repeatType === 'weekly' && interval === 1) return '매주';
  if (repeatType === 'monthly' && interval === 1) return '매달';

  return `${interval}${getRepeatUnit(repeatType)}마다`;
}

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const blankCount = firstDay === 0 ? 6 : firstDay - 1;
  const lastDate = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: blankCount }, (_, index) => `blank-${index}`),
    ...Array.from({ length: lastDate }, (_, index) => index + 1),
  ];
}

type CalendarDay = number | string;

function getCalendarWeeks(date: Date) {
  const days = getCalendarDays(date);
  const trailingBlankCount = (7 - (days.length % 7)) % 7;

  const paddedDays: CalendarDay[] = [
    ...days,
    ...Array.from({ length: trailingBlankCount }, (_, index) => `tail-blank-${index}`),
  ];

  return Array.from({ length: paddedDays.length / 7 }, (_, weekIndex) =>
    paddedDays.slice(weekIndex * 7, weekIndex * 7 + 7)
  );
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isBeforeDay(first: Date, second: Date) {
  const firstDay = new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime();
  const secondDay = new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();

  return firstDay < secondDay;
}

export default function AddRoutineScreen({ navigation }: any) {
  const { isDark } = useTheme();

  const addRoutine = useRoutineStore((state) => state.addRoutine);
  const addRoutineTodos = useTodoStore((state) => state.addRoutineTodos);

  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<SFSymbol>('repeat');
  const [selectedColor, setSelectedColor] = useState<TodoColor>('blue');
  const [repeatType, setRepeatType] = useState<RepeatType>('daily');
  const [interval, setInterval] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const [endDate, setEndDate] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  });
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const iconScrollX = useRef(new Animated.Value(0)).current;
  const [iconViewportWidth, setIconViewportWidth] = useState(0);
  const [iconContentWidth, setIconContentWidth] = useState(0);

  const isSaveDisabled = false;

  const selectedPalette = TODO_COLORS[selectedColor];

  const selectedPaletteColor =
    'color' in selectedPalette
      ? selectedPalette.color
      : isDark
        ? selectedPalette.darkColor
        : selectedPalette.lightColor;

  const selectedPaletteBackground = isDark
    ? selectedPalette.darkBackgroundColor
    : selectedPalette.backgroundColor;

  const iconMaxScroll = Math.max(iconContentWidth - iconViewportWidth, 1);

  const iconThumbWidth =
    iconContentWidth > iconViewportWidth
      ? Math.max(40, iconViewportWidth * (iconViewportWidth / iconContentWidth))
      : iconViewportWidth;

  const iconThumbMaxTranslate = Math.max(iconViewportWidth - iconThumbWidth, 0);

  const iconThumbTranslateX = iconScrollX.interpolate({
    inputRange: [0, iconMaxScroll],
    outputRange: [0, iconThumbMaxTranslate],
    extrapolate: 'clamp',
  });

  const repeatText = getRepeatText(repeatType, interval);

  const handleClose = () => {
    void Haptics.selectionAsync();
    navigation.goBack();
  };

  const handleSelectIcon = (icon: SFSymbol) => {
    void Haptics.selectionAsync();
    setSelectedIcon(icon);
  };

  const handleSelectColor = (color: TodoColor) => {
    void Haptics.selectionAsync();
    setSelectedColor(color);
  };

  const handleSelectRepeatType = (value: RepeatType) => {
    void Haptics.selectionAsync();
    setRepeatType(value);
    setInterval(1);
  };

  const handleDecreaseInterval = () => {
    if (interval <= 1) return;

    void Haptics.selectionAsync();
    setInterval((current) => Math.max(1, current - 1));
  };

  const handleIncreaseInterval = () => {
    void Haptics.selectionAsync();
    setInterval((current) => Math.min(99, current + 1));
  };

  const handleToggleEndDate = () => {
    void Haptics.selectionAsync();

    setEndDateEnabled((current) => {
      const nextValue = !current;

      if (nextValue && isBeforeDay(endDate, startDate)) {
        setEndDate(startDate);
      }

      return nextValue;
    });
  };

  const openDatePicker = (target: Exclude<DatePickerTarget, null>) => {
    void Haptics.selectionAsync();

    const currentDate = target === 'start' ? startDate : endDate;

    setCalendarMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    setDatePickerTarget(target);
  };

  const closeDatePicker = () => {
    void Haptics.selectionAsync();
    setDatePickerTarget(null);
  };

  const handleSelectDate = (date: Date) => {
    void Haptics.selectionAsync();

    if (datePickerTarget === 'start') {
      setStartDate(date);

      if (isBeforeDay(endDate, date)) {
        setEndDate(date);
      }
    }

    if (datePickerTarget === 'end') {
      setEndDate(date);
    }

    setDatePickerTarget(null);
  };

  const handleChangeCalendarMonth = (direction: -1 | 1) => {
    void Haptics.selectionAsync();

    setCalendarMonth((current) => {
      const nextDate = new Date(current);
      nextDate.setMonth(nextDate.getMonth() + direction);
      return nextDate;
    });
  };

  const handleSave = () => {
    const trimmedTitle = title.trim() || DEFAULT_ROUTINE_TITLE;

    const newRoutine = addRoutine({
      title: trimmedTitle,
      icon: selectedIcon,
      color: selectedColor,
      repeatType,
      interval,
      startDate: toDateKey(startDate),
      endDate: endDateEnabled ? toDateKey(endDate) : null,
      nextDate: formatDate(startDate),
    });

    if (!newRoutine) return;

    const rangeStart = new Date();
    const rangeEnd = new Date();

    rangeEnd.setDate(rangeEnd.getDate() + 90);

    const generatedTodos = generateRoutineTodos(newRoutine, rangeStart, rangeEnd);

    addRoutineTodos(generatedTodos);

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
      edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between">
            <Pressable
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDark ? 'bg-[#2A2A2A]' : 'bg-[#F0F0F0]'
              }`}
              style={({ pressed }) => [pressed && styles.buttonPressed]}
              onPress={handleClose}
              hitSlop={8}>
              <Ionicons name="close" size={23} color={isDark ? '#FFFFFF' : '#222631'} />
            </Pressable>

            <Pressable
              className={`rounded-full px-5 py-3 ${isDark ? 'bg-white' : 'bg-black'}`}
              style={({ pressed }) => [
                isSaveDisabled && styles.saveButtonDisabled,
                pressed && !isSaveDisabled && styles.buttonPressed,
              ]}
              disabled={isSaveDisabled}
              onPress={handleSave}>
              <Text className={`text-sm font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
                추가하기
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 gap-2">
            <Text className={`text-3xl font-medium ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              새로운 루틴 추가
            </Text>

            <Text className="text-sm text-[#A5A5A5]">작은 반복부터 시작해보세요</Text>
          </View>

          <View className="mt-9">
            <Text
              className={`mb-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              제목
            </Text>

            <View
              className={`flex-row items-center rounded-[20px] px-5 ${
                isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F4]'
              }`}>
              <AppSymbol
                name={selectedIcon}
                type="monochrome"
                size={23}
                tintColor={selectedPaletteColor}
              />

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="어떤 루틴을 만들까요?"
                placeholderTextColor="#A5A5A5"
                returnKeyType="done"
                maxLength={15}
                className={`ml-3 h-16 flex-1 text-[16px] ${
                  isDark ? 'text-white' : 'text-[#181A21]'
                }`}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            <Text className="mt-2 text-right text-xs text-[#B0B0B0]">{title.length}/15</Text>
          </View>

          <View className="mt-7">
            <Text
              className={`mb-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              아이콘
            </Text>

            <View
              onLayout={(event) => {
                setIconViewportWidth(event.nativeEvent.layout.width);
              }}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onContentSizeChange={(width) => {
                  setIconContentWidth(width);
                }}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: iconScrollX } } }], {
                  useNativeDriver: false,
                })}
                contentContainerStyle={{ paddingRight: 24 }}>
                <View className="flex-row gap-3">
                  {TODO_ICON_COLUMNS.map((iconColumn, columnIndex) => (
                    <View key={`icon-column-${columnIndex}`} className="gap-3">
                      {iconColumn.map((icon) => {
                        const isSelected = selectedIcon === icon;

                        return (
                          <Pressable
                            key={icon}
                            className="h-12 w-12 items-center justify-center rounded-2xl"
                            style={({ pressed }) => [
                              {
                                backgroundColor: isSelected
                                  ? selectedPaletteBackground
                                  : isDark
                                    ? '#1A1A1A'
                                    : '#F4F4F4',
                                borderWidth: isSelected ? 1.5 : 0,
                                borderColor: isSelected ? selectedPaletteColor : 'transparent',
                              },
                              pressed && styles.optionPressed,
                            ]}
                            onPress={() => handleSelectIcon(icon)}>
                            <AppSymbol
                              name={icon}
                              type="monochrome"
                              size={22}
                              tintColor={
                                isSelected ? selectedPaletteColor : isDark ? '#888888' : '#777777'
                              }
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </Animated.ScrollView>

              <View
                style={{
                  height: 3,
                  marginTop: 13,
                  borderRadius: 2,
                  backgroundColor: isDark ? '#2A2A2A' : '#EEEEEE',
                  overflow: 'hidden',
                }}>
                <Animated.View
                  style={{
                    width: iconThumbWidth,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: isDark ? '#555555' : '#8A8A8A',
                    transform: [{ translateX: iconThumbTranslateX }],
                  }}
                />
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text
              className={`mb-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              색상
            </Text>

            <View className="flex-row items-center gap-4">
              {COLOR_OPTIONS.map((color) => {
                const palette = TODO_COLORS[color];

                const paletteColor =
                  'color' in palette
                    ? palette.color
                    : isDark
                      ? palette.darkColor
                      : palette.lightColor;

                const isSelected = selectedColor === color;

                return (
                  <Pressable
                    key={color}
                    style={({ pressed }) => [
                      styles.colorButton,
                      {
                        borderColor: isSelected ? (isDark ? '#FFFFFF' : '#181A21') : 'transparent',
                      },
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelectColor(color)}>
                    <View
                      className="h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: paletteColor }}>
                      {isSelected && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-8">
            <Text
              className={`mb-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              반복
            </Text>

            <View
              className={`flex-row rounded-[18px] p-1 ${isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F4]'}`}>
              {REPEAT_OPTIONS.map((option) => {
                const isSelected = repeatType === option.value;

                return (
                  <Pressable
                    key={option.value}
                    className="h-11 flex-1 items-center justify-center rounded-[15px]"
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? '#FFFFFF'
                          : '#181A21'
                        : 'transparent',
                    }}
                    onPress={() => handleSelectRepeatType(option.value)}>
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected
                          ? isDark
                            ? 'text-black'
                            : 'text-white'
                          : isDark
                            ? 'text-[#8D8D8D]'
                            : 'text-[#777777]'
                      }`}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View
              className={`mt-3 flex-row items-center justify-between rounded-[18px] px-4 py-3 ${
                isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F4]'
              }`}>
              <Text className={`text-sm ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
                {repeatText}
              </Text>

              <View className="flex-row items-center">
                <Pressable
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isDark ? 'bg-[#2A2A2A]' : 'bg-white'
                  }`}
                  onPress={handleDecreaseInterval}>
                  <Ionicons name="remove" size={17} color={isDark ? '#FFFFFF' : '#181A21'} />
                </Pressable>

                <Text
                  className={`w-11 text-center text-base font-semibold ${
                    isDark ? 'text-white' : 'text-[#181A21]'
                  }`}>
                  {interval}
                </Text>

                <Pressable
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isDark ? 'bg-[#2A2A2A]' : 'bg-white'
                  }`}
                  onPress={handleIncreaseInterval}>
                  <Ionicons name="add" size={17} color={isDark ? '#FFFFFF' : '#181A21'} />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text
              className={`mb-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              기간
            </Text>

            <Pressable
              className={`flex-row items-center justify-between rounded-[18px] px-5 py-4 ${
                isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F4]'
              }`}
              onPress={() => openDatePicker('start')}>
              <Text className={`text-sm ${isDark ? 'text-[#A5A5A5]' : 'text-[#777777]'}`}>
                시작일
              </Text>

              <View className="flex-row items-center">
                <Text
                  className={`mr-2 text-sm font-medium ${
                    isDark ? 'text-white' : 'text-[#181A21]'
                  }`}>
                  {formatDate(startDate)}
                </Text>

                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color={isDark ? '#A5A5A5' : '#777777'}
                />
              </View>
            </Pressable>

            <View
              className={`mt-3 rounded-[18px] px-5 py-4 ${
                isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F4]'
              }`}>
              <View className="flex-row items-center justify-between">
                <Text className={`text-sm ${isDark ? 'text-[#A5A5A5]' : 'text-[#777777]'}`}>
                  종료일
                </Text>

                <Pressable
                  className={`rounded-full px-3 py-2 ${
                    endDateEnabled
                      ? isDark
                        ? 'bg-white'
                        : 'bg-black'
                      : isDark
                        ? 'bg-[#2A2A2A]'
                        : 'bg-white'
                  }`}
                  onPress={handleToggleEndDate}>
                  <Text
                    className={`text-xs font-semibold ${
                      endDateEnabled
                        ? isDark
                          ? 'text-black'
                          : 'text-white'
                        : isDark
                          ? 'text-[#A5A5A5]'
                          : 'text-[#777777]'
                    }`}>
                    {endDateEnabled ? '설정됨' : '없음'}
                  </Text>
                </Pressable>
              </View>

              {endDateEnabled && (
                <Pressable
                  className="mt-4 flex-row items-center justify-between"
                  onPress={() => openDatePicker('end')}>
                  <Text
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
                    {formatDate(endDate)}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={17}
                    color={isDark ? '#A5A5A5' : '#777777'}
                  />
                </Pressable>
              )}
            </View>
          </View>

          <View className="mt-9">
            <Text
              className={`mb-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              미리보기
            </Text>

            <View
              className={`flex-row items-center rounded-[18px] border px-4 py-4 ${
                isDark ? 'border-[#2A2A2A] bg-[#151515]' : 'border-[#ECECEC] bg-[#FAFAFA]'
              }`}>
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: selectedPaletteBackground }}>
                <AppSymbol
                  name={selectedIcon}
                  type="monochrome"
                  size={21}
                  tintColor={selectedPaletteColor}
                />
              </View>

              <View className="ml-4 min-w-0 flex-1">
                <Text
                  className={`text-[16px] font-semibold ${
                    isDark ? 'text-white' : 'text-[#181A21]'
                  }`}
                  numberOfLines={1}>
                  {title.trim() || DEFAULT_ROUTINE_TITLE}
                </Text>

                <Text
                  className={`mt-1 text-xs ${isDark ? 'text-[#8D8D8D]' : 'text-[#969696]'}`}
                  numberOfLines={1}>
                  {repeatText} · {formatDate(startDate)}부터
                </Text>

                <View className="mt-2 flex-row items-center">
                  <Text className="text-xs font-semibold" style={{ color: selectedPaletteColor }}>
                    지금까지 0회 완료
                  </Text>
                </View>
              </View>

              <View
                className={`ml-3 h-8 w-8 items-center justify-center rounded-full ${
                  isDark ? 'bg-[#242424]' : 'bg-white'
                }`}>
                <Ionicons name="create-outline" size={14} color={isDark ? '#D5D5D5' : '#686868'} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={Boolean(datePickerTarget)}
        transparent
        animationType="fade"
        onRequestClose={closeDatePicker}>
        <Pressable style={styles.sheetBackdrop} onPress={closeDatePicker}>
          <Pressable
            className={`rounded-t-[28px] px-6 pb-8 pt-5 ${isDark ? 'bg-[#111111]' : 'bg-white'}`}
            style={styles.calendarSheet}
            onPress={(event) => event.stopPropagation()}>
            <View className="mb-5 flex-row items-center justify-between">
              <Pressable
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isDark ? 'bg-[#242424]' : 'bg-[#F4F4F4]'
                }`}
                onPress={() => handleChangeCalendarMonth(-1)}>
                <Ionicons name="chevron-back" size={18} color={isDark ? '#FFFFFF' : '#181A21'} />
              </Pressable>

              <Text
                className={`text-[17px] font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
                {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
              </Text>

              <Pressable
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  isDark ? 'bg-[#242424]' : 'bg-[#F4F4F4]'
                }`}
                onPress={() => handleChangeCalendarMonth(1)}>
                <Ionicons name="chevron-forward" size={18} color={isDark ? '#FFFFFF' : '#181A21'} />
              </Pressable>
            </View>

            <View className="mb-2 flex-row">
              {WEEK_DAYS.map((day) => (
                <View key={day} className="flex-1 items-center">
                  <Text className="text-xs font-medium text-[#A5A5A5]">{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {getCalendarWeeks(calendarMonth).map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.calendarWeekRow}>
                  {week.map((day) => {
                    if (typeof day === 'string') {
                      return <View key={day} style={styles.calendarDayCell} />;
                    }

                    const date = new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth(),
                      day
                    );

                    const selectedDate = datePickerTarget === 'start' ? startDate : endDate;
                    const isSelected = isSameDate(date, selectedDate);
                    const isDisabled = datePickerTarget === 'end' && isBeforeDay(date, startDate);

                    return (
                      <Pressable
                        key={`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${day}`}
                        style={styles.calendarDayCell}
                        disabled={isDisabled}
                        onPress={() => handleSelectDate(date)}>
                        <View
                          className="h-10 w-10 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: isSelected
                              ? isDark
                                ? '#FFFFFF'
                                : '#181A21'
                              : 'transparent',
                            opacity: isDisabled ? 0.25 : 1,
                          }}>
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: isSelected
                                ? isDark
                                  ? '#000000'
                                  : '#FFFFFF'
                                : isDark
                                  ? '#E8E8E8'
                                  : '#181A21',
                            }}>
                            {day}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            <Pressable
              className={`mt-5 h-12 items-center justify-center rounded-full ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              onPress={closeDatePicker}>
              <Text className={`text-sm font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
                닫기
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 56,
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },

  optionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },

  saveButtonDisabled: {
    opacity: 0.3,
  },

  colorButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 21,
  },

  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },

  calendarSheet: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    elevation: 12,
  },

  calendarGrid: {},

  calendarWeekRow: {
    flexDirection: 'row',
  },

  calendarDayCell: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
