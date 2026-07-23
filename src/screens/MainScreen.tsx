// import React, { useMemo, useRef, useState, useEffect, useLayoutEffect } from 'react';
// import { Animated, Easing, Pressable, PanResponder, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useTodoStore } from '@/stores/useTodoStore';
// import * as Haptics from 'expo-haptics';
// import TodoCarousel from '@/components/TodoCarousel';

// const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
// const DAY_CELL_HEIGHT = 50;
// const WEEK_HEADER_HEIGHT = 24;
// const CALENDAR_ROW_COUNT = 6;
// const CALENDAR_BODY_HEIGHT = WEEK_HEADER_HEIGHT + DAY_CELL_HEIGHT * CALENDAR_ROW_COUNT;

// type CalendarDay = number | string;

// function getMonthDate(date: Date, offset: number) {
//   return new Date(date.getFullYear(), date.getMonth() + offset, 1);
// }

// function getCalendarDays(date: Date): CalendarDay[] {
//   const year = date.getFullYear();
//   const month = date.getMonth();

//   const firstDay = new Date(year, month, 1).getDay();

//   const blankCount = firstDay === 0 ? 6 : firstDay - 1;

//   const lastDate = new Date(year, month + 1, 0).getDate();

//   const blanks = Array.from({ length: blankCount }, (_, index) => `blank-${index}`);

//   const days = Array.from({ length: lastDate }, (_, index) => index + 1);

//   return [...blanks, ...days];
// }

// type CalendarPageProps = {
//   date: Date;
//   width: number;
//   today: Date;
//   selectedDate: string;
//   onSelectDate: (dateKey: string) => void;
// };

// function CalendarPage({ date, width, today, selectedDate, onSelectDate }: CalendarPageProps) {
//   const year = date.getFullYear();
//   const month = date.getMonth();

//   const days = getCalendarDays(date);

//   return (
//     <View style={{ width }}>
//       <View style={styles.weekRow}>
//         {WEEK_DAYS.map((day) => (
//           <View key={day} style={styles.weekCell}>
//             <Text className="text-sm text-[#A5A5A5]">{day}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.daysContainer}>
//         {days.map((day) => {
//           if (typeof day === 'string') {
//             return <View key={`${year}-${month}-${day}`} style={styles.dayCell} />;
//           }

//           const fullDate = new Date(year, month, day);

//           const dateKey = toDateKey(fullDate);

//           const isSelected = selectedDate === dateKey;

//           const isToday =
//             today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

//           return (
//             <Pressable
//               key={dateKey}
//               style={styles.dayCell}
//               onPress={() => {
//                 if (isSelected) {
//                   return;
//                 }

//                 void Haptics.selectionAsync();
//                 onSelectDate(dateKey);
//               }}>
//               <View
//                 style={[
//                   styles.dayCircle,
//                   isSelected && styles.selectedDayCircle,
//                   isToday && !isSelected && styles.todayOutline,
//                 ]}>
//                 <Text
//                   className="font-manrope"
//                   style={[styles.dayText, isSelected && styles.selectedDayText]}>
//                   {day}
//                 </Text>
//               </View>
//             </Pressable>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// function toDateKey(date: Date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');

//   const day = String(date.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }

// export default function MainScreen() {
//   const today = useMemo(() => new Date(), []);
//   const [visibleDate, setVisibleDate] = useState(
//     new Date(today.getFullYear(), today.getMonth(), 1)
//   );
//   const selectedDate = useTodoStore((state) => state.selectedDate);
//   const setSelectedDate = useTodoStore((state) => state.setSelectedDate);

//   // for 캘린더 애니메이션
//   const [calendarWidth, setCalendarWidth] = useState(0);
//   const isCalendarAnimating = useRef(false);
//   const shouldRecenter = useRef(false);
//   const year = visibleDate.getFullYear();
//   const month = visibleDate.getMonth();

//   const previousMonth = useMemo(() => getMonthDate(visibleDate, -1), [visibleDate]);

//   const currentMonth = useMemo(() => getMonthDate(visibleDate, 0), [visibleDate]);

//   const nextMonth = useMemo(() => getMonthDate(visibleDate, 1), [visibleDate]);

//   const carouselMonths = [
//     {
//       slot: 'previous',
//       date: previousMonth,
//     },
//     {
//       slot: 'current',
//       date: currentMonth,
//     },
//     {
//       slot: 'next',
//       date: nextMonth,
//     },
//   ] as const;

//   const carouselTranslateX = useRef(new Animated.Value(0)).current;

//   const finishMonthChange = (direction: -1 | 1) => {
//     shouldRecenter.current = true;

//     setVisibleDate((currentDate) => getMonthDate(currentDate, direction));
//   };

//   useLayoutEffect(() => {
//     if (!shouldRecenter.current || calendarWidth === 0) {
//       return;
//     }

//     carouselTranslateX.stopAnimation();

//     carouselTranslateX.setValue(-calendarWidth);

//     shouldRecenter.current = false;
//     isCalendarAnimating.current = false;
//   }, [visibleDate, calendarWidth, carouselTranslateX]);

//   const changeMonth = (direction: -1 | 1) => {
//     if (isCalendarAnimating.current || calendarWidth === 0) {
//       return;
//     }

//     isCalendarAnimating.current = true;

//     // 이전 달: 첫 번째 페이지로 이동
//     // 다음 달: 세 번째 페이지로 이동
//     const targetX = direction === 1 ? -calendarWidth * 2 : 0;

//     Animated.timing(carouselTranslateX, {
//       toValue: targetX,
//       duration: 260,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: false,
//     }).start(({ finished }) => {
//       if (!finished) {
//         carouselTranslateX.setValue(-calendarWidth);

//         isCalendarAnimating.current = false;
//         return;
//       }

//       finishMonthChange(direction);
//     });
//   };

//   const restoreCalendarPosition = () => {
//     Animated.spring(carouselTranslateX, {
//       toValue: -calendarWidth,
//       tension: 160,
//       friction: 17,
//       useNativeDriver: false,
//     }).start();
//   };

//   const calendarPanResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: (_, gestureState) => {
//       const { dx, dy } = gestureState;

//       return (
//         calendarWidth > 0 &&
//         !isCalendarAnimating.current &&
//         Math.abs(dx) > Math.abs(dy) &&
//         Math.abs(dx) > 7
//       );
//     },

//     onPanResponderGrant: () => {
//       carouselTranslateX.stopAnimation();
//     },

//     onPanResponderMove: (_, gestureState) => {
//       if (isCalendarAnimating.current || calendarWidth === 0) {
//         return;
//       }

//       const limitedDrag = Math.max(-calendarWidth, Math.min(calendarWidth, gestureState.dx));

//       // 현재 달의 기본 위치(-width)에
//       // 손가락 이동 거리를 더함
//       carouselTranslateX.setValue(-calendarWidth + limitedDrag);
//     },

//     onPanResponderRelease: (_, gestureState) => {
//       const { dx, vx } = gestureState;

//       const threshold = calendarWidth * 0.2;

//       if (dx < -threshold || vx < -0.45) {
//         changeMonth(1);
//         return;
//       }

//       if (dx > threshold || vx > 0.45) {
//         changeMonth(-1);
//         return;
//       }

//       restoreCalendarPosition();
//     },

//     onPanResponderTerminate: () => {
//       restoreCalendarPosition();
//     },
//   });
//   const handlePreviousMonth = () => {
//     changeMonth(-1);
//   };

//   const handleNextMonth = () => {
//     changeMonth(1);
//   };

//   const handleToday = () => {
//     const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     const isAlreadyTodayMonth =
//       visibleDate.getFullYear() === today.getFullYear() &&
//       visibleDate.getMonth() === today.getMonth();

//     void Haptics.selectionAsync();
//     setSelectedDate(toDateKey(today));

//     if (isAlreadyTodayMonth) {
//       return;
//     }

//     carouselTranslateX.stopAnimation();
//     isCalendarAnimating.current = false;
//     shouldRecenter.current = true;

//     setVisibleDate(todayMonth);
//   };

//   useEffect(() => {
//     if (!selectedDate) {
//       setSelectedDate(toDateKey(today));
//     }
//   }, [selectedDate, setSelectedDate, today]);

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top']}>
//       <View style={styles.container}>
//         <View className="mb-9 mt-4 flex flex-row items-center justify-between">
//           <View>
//             <Text className="text-[13px] font-medium text-[#A5A5A5]">Today</Text>

//             <Text className="text-xl font-semibold text-black">
//               {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일
//             </Text>
//           </View>

//           {/* <Pressable
//               style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
//               onPress={handleSettings}
//               hitSlop={10}>
//               <Ionicons name="settings-sharp" size={23} color={COLORS.text} />
//             </Pressable> */}
//         </View>

//         <View>
//           <View className="relative mb-6 h-8 flex-row items-center justify-center">
//             <View className="w-[230px] flex-row items-center justify-between">
//               <Pressable
//                 className="h-8 w-8 items-center justify-center rounded-full active:bg-[#F2F2F2]"
//                 onPress={handlePreviousMonth}
//                 hitSlop={8}>
//                 <Ionicons name="chevron-back" size={18} color="#000000" />
//               </Pressable>

//               <View className="w-[110px] items-center justify-center overflow-hidden">
//                 <Text className="font-medium text-black">
//                   {year}년 {month + 1}월
//                 </Text>
//               </View>

//               <Pressable
//                 className="h-8 w-8 items-center justify-center rounded-full active:bg-[#F2F2F2]"
//                 onPress={handleNextMonth}
//                 hitSlop={8}>
//                 <Ionicons name="chevron-forward" size={18} color="#111111" />
//               </Pressable>
//             </View>

//             <Pressable
//               className="absolute right-0 h-7 items-center justify-center rounded-full border border-black bg-white px-3 active:scale-95 active:opacity-70"
//               onPress={handleToday}
//               hitSlop={6}>
//               <Text className="text-[11px] font-semibold text-black">오늘</Text>
//             </Pressable>
//           </View>

//           <View
//             {...calendarPanResponder.panHandlers}
//             style={styles.calendarBodyClip}
//             onLayout={(event) => {
//               const width = event.nativeEvent.layout.width;

//               if (width > 0 && width !== calendarWidth) {
//                 setCalendarWidth(width);

//                 // 3개 중 가운데 달력을 표시
//                 carouselTranslateX.setValue(-width);
//               }
//             }}>
//             {calendarWidth > 0 && (
//               <Animated.View
//                 style={[
//                   styles.calendarCarousel,
//                   {
//                     width: calendarWidth * 3,
//                     transform: [
//                       {
//                         translateX: carouselTranslateX,
//                       },
//                     ],
//                   },
//                 ]}>
//                 {carouselMonths.map(({ slot, date }) => {
//                   return (
//                     <CalendarPage
//                       key={slot}
//                       date={date}
//                       width={calendarWidth}
//                       today={today}
//                       selectedDate={selectedDate}
//                       onSelectDate={setSelectedDate}
//                     />
//                   );
//                 })}
//               </Animated.View>
//             )}
//           </View>
//         </View>

//         <TodoCarousel />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingTop: 22,
//   },
//   calendarAnimatedContent: {
//     width: '100%',
//   },
//   monthTitleClip: {
//     flex: 1,
//     overflow: 'hidden',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   weekRow: {
//     height: WEEK_HEADER_HEIGHT,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   weekCell: {
//     width: `${100 / 7}%`,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   dayCell: {
//     width: `${100 / 7}%`,
//     height: DAY_CELL_HEIGHT,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dayCircle: {
//     width: 37,
//     height: 37,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 18.5,
//   },
//   selectedDayCircle: {
//     backgroundColor: '#111111',
//   },
//   todayOutline: {
//     borderWidth: 1,
//     borderColor: '#111111',
//   },
//   dayText: {
//     color: '#454545',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   selectedDayText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   bottomSpace: {
//     height: 120,
//   },
//   calendarBodyClip: {
//     height: CALENDAR_BODY_HEIGHT,
//     overflow: 'hidden',
//   },
//   calendarCarousel: {
//     flexDirection: 'row',
//   },
// });

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodoStore } from '@/stores/useTodoStore';
import Calendar from '@/components/Calendar';
import TodoCarousel from '@/components/TodoCarousel';
import { useTheme } from '@/hooks/useTheme';

export default function MainScreen() {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const { isDark } = useTheme();

  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const todos = useTodoStore((state) => state.todos);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
      className={isDark ? 'bg-black' : 'bg-white'}>
      <View style={styles.container}>
        <Calendar selectedDate={selectedDate} todos={todos} onSelectDate={setSelectedDate} />

        <TodoCarousel />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
});
