import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppSymbol } from '@/components/AppSymbol';
import * as Haptics from '@/utils/haptics';
import { useTodoStore } from '@/stores/useTodoStore';
import { TODO_COLORS } from '@/utils/constants';
import { useTheme } from '@/hooks/useTheme';
import RainbowCompleteButton from '@/components/RainbowCompleteButton';
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';

import type { Todo } from '@/stores/useTodoStore';
import { useToggleTodoCompletion } from '@/hooks/useToggleTodoCompletion';
import CalendarPickerModal from '@/components/CalendarPickerModal';
import WeekCarousel from '@/components/WeekCarousel';

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
  const { isDark } = useTheme();
  const today = useMemo(() => new Date(), []);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedDate = useTodoStore((state) => state.selectedDate);

  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);

  const todos = useTodoStore((state) => state.todos);
  const handleToggleTodo = useToggleTodoCompletion();

  const selectedDateObject = useMemo(() => fromDateKey(selectedDate), [selectedDate]);

  const selectedTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate]
  );

  const filteredTodos = useMemo(
    () =>
      selectedTodos.filter((todo) => {
        if (listFilter === 'all') {
          return true;
        }

        return listFilter === 'todo' ? !todo.done : todo.done;
      }),
    [selectedTodos, listFilter]
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

  const handleAddTodo = () => {
    void Haptics.selectionAsync();
    navigation.navigate('AddTodo', {
      previewMode: 'list',
    });
  };

  const handleEditTodo = (id: string) => {
    void Haptics.selectionAsync();

    navigation.navigate('EditTodo', {
      todoId: id,
      previewMode: 'list',
    });
  };

  const reorderTodos = useTodoStore((state) => state.reorderTodos);

  const selectedDateTitle = `${
    selectedDateObject.getMonth() + 1
  }월 ${selectedDateObject.getDate()}일 ${
    WEEK_DAYS[selectedDateObject.getDay() === 0 ? 6 : selectedDateObject.getDay() - 1]
  }요일`;

  const filterLabel = listFilter === 'all' ? 'All' : listFilter === 'todo' ? 'Todo' : 'Done';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`} edges={['top']}>
      <View className="flex-1 px-6 pt-8">
        <WeekCarousel
          selectedDate={selectedDate}
          isDark={isDark}
          onSelectDate={setSelectedDate}
          onOpenCalendar={() => setCalendarModalVisible(true)}
        />

        <View className="mb-5 mt-8">
          <View className="flex-row items-center justify-between">
            <View className="justify-center gap-1">
              <Text
                className={`text-[15px] font-bold ${isDark ? 'text-[#F4F4F4]' : 'text-[#212121]'}`}>
                {selectedDateTitle}
              </Text>
              <Text
                className={`text-sm font-medium ${isDark ? 'text-[#888888]' : 'text-[#686868]'}`}>
                {completedCount}/{selectedTodos.length} 완료
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <View className="relative">
                <Pressable
                  className={`h-8 min-w-[74px] flex-row items-center justify-center rounded-full px-3 ${
                    isDark ? 'bg-[#212121]' : 'bg-[#F4F4F4]'
                  }`}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setFilterOpen((current) => !current);
                  }}>
                  <Text
                    className={`text-[11px] font-semibold ${isDark ? 'text-[#E5E5E5]' : 'text-[#4B4B4B]'}`}>
                    {filterLabel}
                  </Text>
                  <Ionicons
                    name={filterOpen ? 'chevron-up' : 'chevron-down'}
                    size={12}
                    color={isDark ? '#D0D0D0' : '#666666'}
                    style={{ marginLeft: 4 }}
                  />
                </Pressable>

                {filterOpen && (
                  <View
                    className={`absolute right-0 top-10 z-20 w-[120px] rounded-2xl border p-1 ${
                      isDark ? 'border-[#212121] bg-[#212121]' : 'border-[#F4F4F4] bg-[#F4F4F4]'
                    }`}>
                    {(['all', 'todo', 'done'] as const).map((option) => {
                      const optionLabel =
                        option === 'all' ? 'All' : option === 'todo' ? 'Todo' : 'Done';
                      const selected = listFilter === option;

                      return (
                        <Pressable
                          key={option}
                          className={`h-10 flex-row items-center rounded-xl px-2 ${
                            selected ? (isDark ? 'bg-[#212121]' : 'bg-[#F4F4F4]') : 'bg-transparent'
                          }`}
                          onPress={() => {
                            void Haptics.selectionAsync();
                            setListFilter(option);
                            setFilterOpen(false);
                          }}>
                          <Text
                            className={`text-sm font-semibold ${
                              selected
                                ? isDark
                                  ? 'text-white'
                                  : 'text-[#212121]'
                                : isDark
                                  ? 'text-[#BDBDBD]'
                                  : 'text-[#727272]'
                            }`}>
                            {optionLabel}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              <Pressable
                className={`h-10 w-10 items-center justify-center rounded-full active:scale-95 active:opacity-70 ${isDark ? 'bg-[#DDDDDD]' : 'bg-black'}`}
                onPress={handleAddTodo}
                hitSlop={7}>
                <Ionicons name="add" size={25} color={isDark ? '#000000' : '#FFFFFF'} />
              </Pressable>
            </View>
          </View>
        </View>

        <DraggableFlatList
          data={filteredTodos}
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
            paddingBottom: 70,
          }}
          animationConfig={{
            damping: 24,
            stiffness: 220,
            mass: 0.5,
          }}
          onDragEnd={({ data }) => {
            if (listFilter === 'all') {
              reorderTodos(selectedDate, data);
            } else {
              const untouched = selectedTodos.filter((todo) =>
                listFilter === 'todo' ? todo.done : !todo.done
              );

              reorderTodos(selectedDate, [...data, ...untouched]);
            }

            void Haptics.selectionAsync();
          }}
          ItemSeparatorComponent={() => <View className="h-2" />}
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
            const paletteBackground = isDark
              ? palette.darkBackgroundColor
              : palette.backgroundColor;
            const titleColor = item.done ? paletteColor : isDark ? '#F3F3F3' : '#1F2430';

            const handleLongPress = () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              drag();
            };

            return (
              <ScaleDecorator activeScale={1.025}>
                <Pressable
                  className="h-[45px] flex-row items-center rounded-[20px] px-4"
                  style={({ pressed }) => ({
                    backgroundColor: isActive
                      ? isDark
                        ? '#1E1E1E'
                        : '#F7F7F7'
                      : item.done
                        ? paletteBackground
                        : isDark
                          ? '#111111'
                          : '#FFFFFF',

                    borderWidth: 1,
                    borderColor: item.done ? `${paletteColor}44` : isDark ? '#242424' : '#EDEDED',

                    opacity: pressed && !isActive ? 0.55 : 1,

                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: isActive ? 4 : 2,
                    },
                    shadowOpacity: isActive ? 0.09 : isDark ? 0 : 0.04,
                    shadowRadius: isActive ? 9 : 6,

                    elevation: isActive ? 4 : 1,
                  })}
                  onPress={() => handleEditTodo(item.id)}
                  onLongPress={handleLongPress}
                  delayLongPress={300}
                  disabled={isActive}>
                  <AnimatedTodoContent done={item.done}>
                    <View className="h-9 w-9 items-center justify-center">
                      <AppSymbol
                        name={item.icon}
                        type="monochrome"
                        size={21}
                        tintColor={paletteColor}
                      />
                    </View>

                    <AnimatedTodoTitle title={item.title} done={item.done} color={titleColor} />
                  </AnimatedTodoContent>

                  <View
                    className={`mr-2 rounded-full px-2 py-1 ${
                      item.done
                        ? isDark
                          ? 'bg-[#FFFFFF1A]'
                          : 'bg-[#FFFFFFB3]'
                        : isDark
                          ? 'bg-[#1E1E1E]'
                          : 'bg-[#F2F2F2]'
                    }`}
                    style={
                      item.done
                        ? {
                            backgroundColor: `${paletteColor}${isDark ? '2B' : '24'}`,
                          }
                        : undefined
                    }>
                    <Text
                      style={{ color: item.done ? paletteColor : isDark ? '#9C9C9C' : '#8A8A8A' }}
                      className="text-[10px] font-bold">
                      {item.done ? 'DONE' : 'TODO'}
                    </Text>
                  </View>

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
