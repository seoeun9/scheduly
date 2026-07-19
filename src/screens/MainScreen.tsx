import React, { useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#77C2F8',
  primaryDark: '#57ADF0',
  background: '#EEF8FF',
  card: '#FFFFFF',
  text: '#222631',
  secondaryText: '#A5A5A5',
  border: '#EAF2F7',
  timeBackground: '#EFF8FF',
};

const WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_CELL_HEIGHT = 44;
const WEEK_HEADER_HEIGHT = 22;

function getCalendarRowCount(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const blankCount = firstDay === 0 ? 6 : firstDay - 1;
  const lastDate = new Date(year, month + 1, 0).getDate();

  return Math.ceil((blankCount + lastDate) / 7);
}

function getCalendarBodyHeight(year: number, month: number) {
  const rowCount = getCalendarRowCount(year, month);

  return WEEK_HEADER_HEIGHT + rowCount * DAY_CELL_HEIGHT;
}

type Schedule = {
  id: number;
  time: string;
  title: string;
};

const schedules: Schedule[] = [
  {
    id: 1,
    time: '09:00',
    title: 'Team meeting',
  },
  {
    id: 2,
    time: '14:30',
    title: 'Study React Native',
  },
  {
    id: 3,
    time: '19:00',
    title: 'Evening workout',
  },
];

export default function MainScreen({ navigation }: any) {
  const today = useMemo(() => new Date(), []);

  const [visibleDate, setVisibleDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const calendarTranslateX = useRef(new Animated.Value(0)).current;

  const calendarOpacity = useRef(new Animated.Value(1)).current;

  const calendarBodyHeight = useRef(
    new Animated.Value(getCalendarBodyHeight(today.getFullYear(), today.getMonth()))
  ).current;

  const isCalendarAnimating = useRef(false);

  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();

    // JavaScript: 일요일 0, 월요일 1
    // 달력: 월요일부터 시작
    const blankCount = firstDay === 0 ? 6 : firstDay - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();

    const blanks = Array.from({ length: blankCount }, (_, index) => `blank-${index}`);

    const days = Array.from({ length: lastDate }, (_, index) => index + 1);

    return [...blanks, ...days];
  }, [month, year]);

  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const formattedToday = `${MONTH_NAMES[today.getMonth()]} ${today.getDate()}`;

  const weekday = today.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  const changeMonth = (direction: -1 | 1) => {
    if (isCalendarAnimating.current) {
      return;
    }

    isCalendarAnimating.current = true;

    const enterX = direction === 1 ? 45 : -45;

    // 1. 기존 달력을 먼저 빠르게 숨김
    Animated.timing(calendarOpacity, {
      toValue: 0,
      duration: 70,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        calendarOpacity.setValue(1);
        isCalendarAnimating.current = false;
        return;
      }

      const changedDate = new Date(year, month + direction, 1);

      const nextHeight = getCalendarBodyHeight(changedDate.getFullYear(), changedDate.getMonth());

      // 2. 보이지 않는 상태에서 새로운 월로 변경
      calendarTranslateX.setValue(enterX);
      setVisibleDate(changedDate);

      // React가 새로운 월을 화면에 반영한 다음 애니메이션 시작
      requestAnimationFrame(() => {
        // 3. 새 달력을 슬라이드 + 페이드인
        Animated.parallel([
          Animated.timing(calendarTranslateX, {
            toValue: 0,
            duration: 210,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          Animated.timing(calendarOpacity, {
            toValue: 1,
            duration: 150,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),

          Animated.timing(calendarBodyHeight, {
            toValue: nextHeight,
            duration: 250,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ]).start(() => {
          isCalendarAnimating.current = false;
        });
      });
    });
  };

  const handlePreviousMonth = () => {
    changeMonth(-1);
  };

  const handleNextMonth = () => {
    changeMonth(1);
  };

  const handleSettings = () => {
    console.log('Open settings');
    navigation.navigate('Setting');
  };

  const handleAddSchedule = () => {
    console.log('Add schedule');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#FFFFFF', '#D1ECFF']}
        locations={[0, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.screen}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Today</Text>

              <Text style={styles.description}>
                {weekday}, {formattedToday}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
              onPress={handleSettings}
              hitSlop={10}>
              <Ionicons name="settings-sharp" size={23} color={COLORS.text} />
            </Pressable>
          </View>

          <View style={styles.calendarCard}>
            <View className="mb-6 flex flex-row items-center justify-between ">
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full bg-[#E0F2FF]"
                onPress={handlePreviousMonth}>
                <Ionicons name="chevron-back" size={18} color="#66C0FF" />
              </Pressable>

              <View style={styles.monthTitleClip}>
                <Animated.View
                  style={{
                    opacity: calendarOpacity,
                    transform: [
                      {
                        translateX: calendarTranslateX,
                      },
                    ],
                  }}>
                  <Text style={styles.monthTitle}>
                    {MONTH_NAMES[month]} {year}
                  </Text>
                </Animated.View>
              </View>

              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full bg-[#E0F2FF]"
                onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={18} color="#66C0FF" />
              </Pressable>
            </View>

            <Animated.View
              style={[
                styles.calendarBodyClip,
                {
                  height: calendarBodyHeight,
                },
              ]}>
              <Animated.View
                style={[
                  styles.calendarAnimatedContent,
                  {
                    opacity: calendarOpacity,
                    transform: [
                      {
                        translateX: calendarTranslateX,
                      },
                    ],
                  },
                ]}>
                <View style={styles.weekRow}>
                  {WEEK_DAYS.map((day) => (
                    <View key={day} style={styles.weekCell}>
                      <Text style={styles.weekText}>{day}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.daysContainer}>
                  {calendarDays.map((day) => {
                    if (typeof day === 'string') {
                      return <View key={day} style={styles.dayCell} />;
                    }

                    const isSelected =
                      selectedDate.getFullYear() === year &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getDate() === day;

                    const isToday =
                      today.getFullYear() === year &&
                      today.getMonth() === month &&
                      today.getDate() === day;

                    return (
                      <Pressable
                        key={`${year}-${month}-${day}`}
                        style={styles.dayCell}
                        onPress={() => {
                          setSelectedDate(new Date(year, month, day));
                        }}>
                        <View
                          style={[
                            styles.dayCircle,
                            isSelected && styles.selectedDayCircle,
                            isToday && !isSelected && styles.todayOutline,
                          ]}>
                          <Text
                            className="font-manrope"
                            style={[styles.dayText, isSelected && styles.selectedDayText]}>
                            {day}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            </Animated.View>
          </View>

          <View className="mb-4 mt-12 flex-row items-center">
            <Text className="font-manrope text-2xl font-medium text-[#32AAFF]">
              {schedules.length}{' '}
            </Text>
            <Text className="text-[15px] font-medium">Schedules</Text>
          </View>

          <View className="flex flex-col gap-3 px-2">
            {schedules.map((schedule) => (
              <Pressable
                key={schedule.id}
                className="elevation-4 flex w-full flex-row items-center gap-[14px] rounded-[10px] bg-white px-7 py-4 shadow-slate-200"
                onPress={() => console.log(schedule)}>
                <View className="h-[24px] w-1 rounded-lg bg-[#66C0FF]" />

                <View className="rounded-[2px] bg-[#F2F9FF] px-[6px] py-[2px]">
                  <Text className="font-manrope text-sm text-[#4AB4FF]">{schedule.time}</Text>
                </View>

                <Text className="text-sm font-semibold text-black" numberOfLines={1}>
                  {schedule.title}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={handleAddSchedule}>
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    marginTop: 10,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    marginTop: 6,
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: '400',
  },
  settingsButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  buttonPressed: {
    opacity: 0.55,
  },
  calendarContentClip: {
    overflow: 'hidden',
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },

  calendarAnimatedContent: {
    width: '100%',
  },
  monthTitleClip: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarCard: {
    paddingHorizontal: 36,
    paddingTop: 36,
    paddingBottom: 24,
    borderRadius: 28,
    backgroundColor: COLORS.card,

    shadowColor: '#6D9AB5',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 15,

    elevation: 4,
  },
  monthButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#E0F2FF',
  },
  monthTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  weekRow: {
    height: WEEK_HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  weekCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    color: COLORS.secondaryText,
    fontSize: 8,
    fontWeight: '500',
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: DAY_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 37,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18.5,
  },
  selectedDayCircle: {
    backgroundColor: COLORS.primary,
  },
  todayOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  dayText: {
    color: '#454545',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scheduleNum: {
    color: '#32AAFF',
    fontSize: 20,
    fontWeight: '500',
  },
  scheduleList: {
    gap: 12,
  },
  scheduleCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.card,

    shadowColor: '#7896A8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 2,
  },
  scheduleCardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  scheduleAccent: {
    width: 4,
    height: 44,
    marginRight: 14,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  timeBox: {
    minWidth: 67,
    height: 36,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: COLORS.timeBackground,
  },
  timeText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleItemTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 26,
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: COLORS.primary,

    shadowColor: '#3D9DDF',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,

    elevation: 8,
  },
  addButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.94 }],
  },
  bottomSpace: {
    height: 120,
  },
  calendarBodyClip: {
    overflow: 'hidden',
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
});
