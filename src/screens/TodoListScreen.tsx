import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Animated, Easing, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { useTodoStore } from '@/stores/useTodoStore';
import { TODO_COLORS } from '@/types/todo';
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
export default function TodoListScreen({ navigation }: any) {
  const today = useMemo(() => new Date(), []);

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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 px-6 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="h-10 w-10 items-center justify-center">
            <Ionicons name="calendar-outline" size={25} color="#181A21" />
          </View>

          <View className="items-center">
            <Text className="text-sm font-medium text-[#8F8F8F]">{monthTitle}</Text>

            <View className="mt-1 flex-row items-center gap-5">
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full active:bg-[#F2F2F2]"
                onPress={() => handleChangeWeek(-1)}
                hitSlop={8}>
                <Ionicons name="chevron-back" size={19} color="#181A21" />
              </Pressable>

              <Text className="min-w-[110px] text-center text-[14px] font-bold text-black">
                {getWeekRangeText(weekDates)}
              </Text>

              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full active:bg-[#F2F2F2]"
                onPress={() => handleChangeWeek(1)}
                hitSlop={8}>
                <Ionicons name="chevron-forward" size={19} color="#181A21" />
              </Pressable>
            </View>
          </View>

          <Pressable
            className="h-8 min-w-[48px] items-center justify-center rounded-full border border-black bg-white px-3 active:scale-95 active:opacity-60"
            onPress={handleToday}>
            <Text className="text-xs font-semibold text-black">오늘</Text>
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
                    isSelected ? 'bg-black' : 'bg-white'
                  }`}
                  onPress={() => handleSelectDate(date)}>
                  <Text
                    className={`text-base font-medium ${
                      isSelected ? 'text-white' : 'text-[#454545]'
                    }`}>
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
              <Text className="text-[15px] font-bold text-black">{selectedDateTitle}</Text>
              <Text className="text-sm font-medium text-[#686868]">
                {completedCount}/{selectedTodos.length} 완료
              </Text>
            </View>

            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-black active:scale-95 active:opacity-70"
              onPress={handleAddTodo}
              hitSlop={7}>
              <Ionicons name="add" size={25} color="#FFFFFF" />
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
          renderItem={({ item, drag, isActive }: RenderItemParams<Todo>) => {
            const palette = TODO_COLORS[item.color ?? 'blue'];

            const handleLongPress = () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              drag();
            };

            return (
              <ScaleDecorator activeScale={1.025}>
                <Pressable
                  className="h-16 flex-row items-center rounded-[18px] px-3"
                  style={({ pressed }) => ({
                    backgroundColor: isActive ? '#FAFAFA' : 'transparent',

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
              </ScaleDecorator>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
