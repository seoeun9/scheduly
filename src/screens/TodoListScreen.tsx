import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Animated, Easing, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { useTodoStore } from '@/stores/useTodoStore';
import { TODO_COLORS } from '@/utils/constants';
import { useTheme } from '@/hooks/useTheme';
import RainbowCompleteButton from '@/components/RainbowCompleteButton';
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';

import type { Todo } from '@/stores/useTodoStore';

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey: string) {
  if (!dateKey) {
    return new Date();
  }

  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
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

  const isSameMonth =
    firstDate.getFullYear() === lastDate.getFullYear() &&
    firstDate.getMonth() === lastDate.getMonth();

  if (isSameMonth) {
    return `${firstDate.getDate()}일 — ${lastDate.getDate()}일`;
  }

  return `${firstDate.getMonth() + 1}월 ${firstDate.getDate()}일 — ${
    lastDate.getMonth() + 1
  }월 ${lastDate.getDate()}일`;
}

type AnimatedTodoTitleProps = {
  title: string;
  done: boolean;
  color: string;
};

function AnimatedTodoTitle({ title, done, color }: AnimatedTodoTitleProps) {
  const progress = useRef(new Animated.Value(done ? 1 : 0)).current;

  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: done ? 1 : 0,
      duration: done ? 280 : 180,
      easing: done ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [done, progress]);

  const lineWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, textWidth],
  });

  return (
    <View
      style={{
        position: 'relative',
        flexShrink: 1,
        marginLeft: 12,
      }}>
      <Text
        style={{
          color,
          fontSize: 15,
          fontWeight: '600',
          lineHeight: 20,
        }}
        numberOfLines={1}
        onTextLayout={(event) => {
          const width = event.nativeEvent.lines[0]?.width ?? 0;

          setTextWidth(width);
        }}>
        {title}
      </Text>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          top: 10,

          width: lineWidth,
          height: 1.5,

          borderRadius: 1,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

type AnimatedTodoContentProps = {
  done: boolean;
  children: React.ReactNode;
};

function AnimatedTodoContent({ done, children }: AnimatedTodoContentProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    scale.stopAnimation();
    scale.setValue(1);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 1.025,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 1,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [done, scale]);

  return (
    <Animated.View
      style={{
        minWidth: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12,
        transform: [{ scale }],
      }}>
      {children}
    </Animated.View>
  );
}
function getMonthCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const blankCount = firstDay === 0 ? 6 : firstDay - 1;
  const lastDate = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: blankCount }, () => null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];
}

type CalendarPickerModalProps = {
  visible: boolean;
  initialDate: string;
  todos: Todo[];
  isDark: boolean;
  onCancel: () => void;
  onSave: (dateKey: string) => void;
};

function CalendarPickerModal({
  visible,
  initialDate,
  todos,
  isDark,
  onCancel,
  onSave,
}: CalendarPickerModalProps) {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [pendingDate, setPendingDate] = useState(initialDate);

  useEffect(() => {
    if (visible) {
      const date = fromDateKey(initialDate);
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setPendingDate(initialDate);
    }
  }, [visible, initialDate]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const days = getMonthCalendarDays(year, month);
  const cellWidth = `${(100 / 7).toFixed(4)}%` as unknown as number;

  const pendingDateTodos = useMemo(
    () => todos.filter((t) => t.date === pendingDate),
    [todos, pendingDate]
  );

  const bg = isDark ? '#0A0A0A' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#111111';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* 헤더 + 캘린더 */}
        <View style={{ paddingHorizontal: 24 }}>
          {/* 헤더: 취소 / < 년월 > / 저장 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 28,
              paddingBottom: 24,
            }}>
            <Pressable onPress={onCancel} hitSlop={10}>
              <Text style={{ fontSize: 15, color: '#A5A5A5' }}>취소</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable
                onPress={() => setVisibleMonth(new Date(year, month - 1, 1))}
                hitSlop={8}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                }}>
                <Ionicons name="chevron-back" size={18} color={textPrimary} />
              </Pressable>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: textPrimary,
                  minWidth: 80,
                  textAlign: 'center',
                }}>
                {year}년 {month + 1}월
              </Text>

              <Pressable
                onPress={() => setVisibleMonth(new Date(year, month + 1, 1))}
                hitSlop={8}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                }}>
                <Ionicons name="chevron-forward" size={18} color={textPrimary} />
              </Pressable>
            </View>

            <Pressable onPress={() => onSave(pendingDate)} hitSlop={10}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>저장</Text>
            </Pressable>
          </View>

          {/* 요일 헤더 */}
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            {WEEK_DAYS.map((day) => (
              <View key={day} style={{ width: cellWidth, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: '#A5A5A5' }}>{day}</Text>
              </View>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={`blank-${index}`} style={{ width: cellWidth, height: 50 }} />;
              }

              const dateKey = toDateKey(new Date(year, month, day));
              const isSelected = pendingDate === dateKey;
              const isToday = toDateKey(today) === dateKey;

              return (
                <Pressable
                  key={dateKey}
                  style={{
                    width: cellWidth,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setPendingDate(dateKey);
                  }}>
                  <View
                    style={[
                      {
                        width: 37,
                        height: 37,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 18.5,
                      },
                      isSelected ? { backgroundColor: isDark ? '#DDDDDD' : '#111111' } : undefined,
                      isToday && !isSelected
                        ? { borderWidth: 1, borderColor: isDark ? '#DDDDDD' : '#111111' }
                        : undefined,
                    ]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected
                          ? isDark
                            ? '#000000'
                            : '#FFFFFF'
                          : isDark
                            ? '#CCCCCC'
                            : '#454545',
                      }}>
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        {/* /paddingHorizontal wrapper */}

        {/* 미리보기 */}
        <View
          style={{
            flex: 1,
            marginHorizontal: 24,
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#2A2A2A' : '#EEEEEE',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#A5A5A5',
              marginBottom: 12,
              letterSpacing: 0.5,
            }}>
            {pendingDate === toDateKey(today)
              ? '오늘'
              : `${fromDateKey(pendingDate).getMonth() + 1}월 ${fromDateKey(pendingDate).getDate()}일`}{' '}
            · {pendingDateTodos.length}개
          </Text>

          {pendingDateTodos.length === 0 ? (
            <Text style={{ fontSize: 14, color: isDark ? '#555555' : '#C0C0C0' }}>
              할 일이 없어요
            </Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {pendingDateTodos.map((todo) => {
                const palette = TODO_COLORS[todo.color ?? 'blue'];
                const paletteColor =
                  'color' in palette
                    ? palette.color
                    : isDark
                      ? palette.darkColor
                      : palette.lightColor;

                return (
                  <View
                    key={todo.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                      opacity: todo.done ? 0.45 : 1,
                    }}>
                    <SymbolView
                      name={todo.icon}
                      type="monochrome"
                      size={15}
                      tintColor={paletteColor}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: 10,
                        flex: 1,
                        fontSize: 14,
                        fontWeight: '500',
                        color: isDark ? '#CCCCCC' : '#454545',
                        textDecorationLine: todo.done ? 'line-through' : 'none',
                      }}>
                      {todo.title}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function TodoListScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const today = useMemo(() => new Date(), []);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const selectedDate = useTodoStore((state) => state.selectedDate);

  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);

  const todos = useTodoStore((state) => state.todos);

  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  const selectedDateObject = useMemo(() => fromDateKey(selectedDate), [selectedDate]);

  const weekDates = useMemo(() => getWeekDates(selectedDateObject), [selectedDateObject]);

  const selectedTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate]
  );

  const completedCount = useMemo(
    () => selectedTodos.filter((todo) => todo.done).length,
    [selectedTodos]
  );

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(toDateKey(today));
    }
  }, [selectedDate, setSelectedDate, today]);

  const handleSelectDate = (date: Date) => {
    const dateKey = toDateKey(date);

    if (dateKey === selectedDate) {
      return;
    }

    void Haptics.selectionAsync();
    setSelectedDate(dateKey);
  };

  const handleChangeWeek = (direction: -1 | 1) => {
    const nextDate = new Date(selectedDateObject);

    nextDate.setDate(nextDate.getDate() + direction * 7);

    void Haptics.selectionAsync();
    setSelectedDate(toDateKey(nextDate));
  };

  const handleToday = () => {
    void Haptics.selectionAsync();
    setSelectedDate(toDateKey(today));
  };

  const handleAddTodo = () => {
    void Haptics.selectionAsync();
    navigation.navigate('AddTodo', {
      previewMode: 'list',
    });
  };

  const handleToggleTodo = (id: string) => {
    void Haptics.selectionAsync();
    toggleTodo(id);
  };

  const handleEditTodo = (id: string) => {
    void Haptics.selectionAsync();

    navigation.navigate('EditTodo', {
      todoId: id,
      previewMode: 'list',
    });
  };

  const reorderTodos = useTodoStore((state) => state.reorderTodos);

  const monthTitle = `${selectedDateObject.getFullYear()}년 ${selectedDateObject.getMonth() + 1}월`;

  const selectedDateTitle = `${
    selectedDateObject.getMonth() + 1
  }월 ${selectedDateObject.getDate()}일 ${
    WEEK_DAYS[selectedDateObject.getDay() === 0 ? 6 : selectedDateObject.getDay() - 1]
  }요일`;

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`} edges={['top']}>
      <View className="flex-1 px-6 pt-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => setCalendarModalVisible(true)} hitSlop={8}>
            <View className="h-10 w-10 items-center justify-center">
              <Ionicons name="calendar-outline" size={25} color={isDark ? '#FFFFFF' : '#181A21'} />
            </View>
          </Pressable>

          <View className="items-center">
            <Text className="text-sm font-medium text-[#8F8F8F]">{monthTitle}</Text>

            <View className="mt-1 flex-row items-center gap-5">
              <Pressable
                className={`h-8 w-8 items-center justify-center rounded-full ${isDark ? 'active:bg-[#2A2A2A]' : 'active:bg-[#F2F2F2]'}`}
                onPress={() => handleChangeWeek(-1)}
                hitSlop={8}>
                <Ionicons name="chevron-back" size={19} color={isDark ? '#FFFFFF' : '#181A21'} />
              </Pressable>

              <Text
                className={`min-w-[110px] text-center text-[14px] font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                {getWeekRangeText(weekDates)}
              </Text>

              <Pressable
                className={`h-8 w-8 items-center justify-center rounded-full ${isDark ? 'active:bg-[#2A2A2A]' : 'active:bg-[#F2F2F2]'}`}
                onPress={() => handleChangeWeek(1)}
                hitSlop={8}>
                <Ionicons name="chevron-forward" size={19} color={isDark ? '#FFFFFF' : '#181A21'} />
              </Pressable>
            </View>
          </View>

          <Pressable
            className={`h-8 min-w-[48px] items-center justify-center rounded-full border px-3 active:scale-95 active:opacity-60 ${isDark ? 'border-white bg-transparent' : 'border-black bg-white'}`}
            onPress={handleToday}>
            <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              오늘
            </Text>
          </Pressable>
        </View>

        <View className="mt-4 flex-row">
          {WEEK_DAYS.map((day) => (
            <View key={day} className="flex-1 items-center">
              <Text className="text-sm text-[#A5A5A5]">{day}</Text>
            </View>
          ))}
        </View>

        <View className="mt-1 flex-row">
          {weekDates.map((date) => {
            const dateKey = toDateKey(date);
            const isSelected = dateKey === selectedDate;

            return (
              <View key={dateKey} className="flex-1 items-center">
                <Pressable
                  className={`h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
                    isSelected ? (isDark ? 'bg-[#DDDDDD]' : 'bg-black') : 'bg-transparent'
                  }`}
                  onPress={() => handleSelectDate(date)}>
                  <Text
                    style={{
                      color: isSelected
                        ? isDark
                          ? '#000000'
                          : '#FFFFFF'
                        : isDark
                          ? '#CCCCCC'
                          : '#454545',
                    }}
                    className="text-base font-medium">
                    {date.getDate()}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View className="mb-5 mt-5">
          <View className="flex-row items-center justify-between">
            <View className="justify-center gap-1">
              <Text className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                {selectedDateTitle}
              </Text>
              <Text
                className={`text-sm font-medium ${isDark ? 'text-[#888888]' : 'text-[#686868]'}`}>
                {completedCount}/{selectedTodos.length} 완료
              </Text>
            </View>

            <Pressable
              className={`h-10 w-10 items-center justify-center rounded-full active:scale-95 active:opacity-70 ${isDark ? 'bg-[#DDDDDD]' : 'bg-black'}`}
              onPress={handleAddTodo}
              hitSlop={7}>
              <Ionicons name="add" size={25} color={isDark ? '#000000' : '#FFFFFF'} />
            </Pressable>
          </View>
        </View>

        {/* <FlatList
          data={selectedTodos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
          }}
          ItemSeparatorComponent={() => <View className="ml-12 h-px bg-[#EEEEEE]" />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pb-28">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F4]">
                <Ionicons name="checkmark-circle-outline" size={27} color="#A5A5A5" />
              </View>

              <Text className="mt-4 text-base font-semibold text-[#454545]">
                아직 할 일이 없어요
              </Text>

              <Text className="mt-2 text-sm text-[#A5A5A5]">
                + 버튼을 눌러 새로운 할 일을 추가해보세요
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const palette = TODO_COLORS[item.color ?? 'blue'];

            return (
              <Pressable
                className="h-16 flex-row items-center px-3"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.55 : 1,
                })}
                onPress={() => handleEditTodo(item.id)}>
                <AnimatedTodoContent done={item.done}>
                  <View className="h-9 w-9 items-center justify-center">
                    <SymbolView
                      name={item.icon}
                      type="monochrome"
                      size={21}
                      tintColor={palette.color}
                    />
                  </View>

                  <AnimatedTodoTitle title={item.title} done={item.done} color={palette.color} />
                </AnimatedTodoContent>

                <RainbowCompleteButton
                  done={item.done}
                  color={palette.color}
                  onPress={() => handleToggleTodo(item.id)}
                />
              </Pressable>
            );
          }}
        /> */}
        <DraggableFlatList
          data={selectedTodos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          dragItemOverflow
          activationDistance={10}
          autoscrollThreshold={70}
          autoscrollSpeed={120}
          containerStyle={{
            overflow: 'visible',
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
          }}
          animationConfig={{
            damping: 24,
            stiffness: 220,
            mass: 0.5,
          }}
          onDragEnd={({ data }) => {
            reorderTodos(selectedDate, data);
            void Haptics.selectionAsync();
          }}
          ItemSeparatorComponent={() => (
            <View className={`ml-12 h-px ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#EEEEEE]'}`} />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pb-28">
              <View
                className={`h-14 w-14 items-center justify-center rounded-full ${isDark ? 'bg-[#1E1E1E]' : 'bg-[#F4F4F4]'}`}>
                <Ionicons name="checkmark-circle-outline" size={27} color="#A5A5A5" />
              </View>

              <Text
                className={`mt-4 text-base font-semibold ${isDark ? 'text-[#CCCCCC]' : 'text-[#454545]'}`}>
                아직 할 일이 없어요
              </Text>

              <Text className="mt-2 text-sm text-[#A5A5A5]">
                + 버튼을 눌러 새로운 할 일을 추가해보세요
              </Text>
            </View>
          }
          renderItem={({ item, drag, isActive }: RenderItemParams<Todo>) => {
            const palette = TODO_COLORS[item.color ?? 'blue'];
            const paletteColor =
              'color' in palette ? palette.color : isDark ? palette.darkColor : palette.lightColor;

            const handleLongPress = () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              drag();
            };

            return (
              <ScaleDecorator activeScale={1.025}>
                <Pressable
                  className="h-16 flex-row items-center rounded-[18px] px-3"
                  style={({ pressed }) => ({
                    backgroundColor: isActive ? (isDark ? '#1E1E1E' : '#FAFAFA') : 'transparent',

                    opacity: pressed && !isActive ? 0.55 : 1,

                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: isActive ? 4 : 0,
                    },
                    shadowOpacity: isActive ? 0.09 : 0,
                    shadowRadius: isActive ? 9 : 0,

                    elevation: isActive ? 4 : 0,
                  })}
                  onPress={() => handleEditTodo(item.id)}
                  onLongPress={handleLongPress}
                  delayLongPress={300}
                  disabled={isActive}>
                  <AnimatedTodoContent done={item.done}>
                    <View className="h-9 w-9 items-center justify-center">
                      <SymbolView
                        name={item.icon}
                        type="monochrome"
                        size={21}
                        tintColor={paletteColor}
                      />
                    </View>

                    <AnimatedTodoTitle title={item.title} done={item.done} color={paletteColor} />
                  </AnimatedTodoContent>

                  <RainbowCompleteButton
                    done={item.done}
                    color={paletteColor}
                    onPress={() => handleToggleTodo(item.id)}
                  />
                </Pressable>
              </ScaleDecorator>
            );
          }}
        />
      </View>

      <CalendarPickerModal
        visible={calendarModalVisible}
        initialDate={selectedDate}
        todos={todos}
        isDark={isDark}
        onCancel={() => setCalendarModalVisible(false)}
        onSave={(date) => {
          setSelectedDate(date);
          setCalendarModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
