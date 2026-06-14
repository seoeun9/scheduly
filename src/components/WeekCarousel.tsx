import { useRef, useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import * as Haptics from 'expo-haptics';

import ArrowLeftIcon from '@/assets/icons/arrowLeftIcon.svg';
import ArrowRightIcon from '@/assets/icons/arrowRightIcon.svg';

const CAROUSEL_WIDTH = 272;
const CHIP_WIDTH = 48;
const CHIP_GAP = 8;
const CHIP_STEP = CHIP_WIDTH + CHIP_GAP;
const SIDE_PADDING = (CAROUSEL_WIDTH - CHIP_WIDTH) / 2;

export default function WeekCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const today = new Date();
  const currentYear = today.getFullYear();

  const weeks = useMemo(() => {
    const dates: string[] = [];
    const date = new Date(currentYear, 0, 1);

    while (date.getFullYear() === currentYear) {
      dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }, [currentYear]);

  const todayLabel = `${today.getMonth() + 1}/${today.getDate()}`;
  const initialDay = weeks.includes(todayLabel) ? todayLabel : weeks[0];

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [scrollX, setScrollX] = useState(0);

  const contentWidth = SIDE_PADDING * 2 + weeks.length * CHIP_WIDTH + (weeks.length - 1) * CHIP_GAP;

  const maxScrollX = Math.max(contentWidth - CAROUSEL_WIDTH, 0);

  const scrollToDay = (day: string) => {
    const index = weeks.indexOf(day);

    if (index === -1) return;

    const chipCenterX = index * CHIP_STEP + CHIP_WIDTH / 2;
    const targetX = chipCenterX - CAROUSEL_WIDTH / 2;

    scrollRef.current?.scrollTo({
      x: Math.max(targetX, 0),
      animated: true,
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToDay(initialDay);
    });
  }, []);

  const maxPage = Math.ceil((weeks.length * 58) / CAROUSEL_WIDTH) - 1;

  const movePage = (direction: 'prev' | 'next') => {
    const nextPage = direction === 'next' ? Math.min(page + 1, maxPage) : Math.max(page - 1, 0);

    Haptics.selectionAsync();
    setPage(nextPage);

    scrollRef.current?.scrollTo({
      x: nextPage * CAROUSEL_WIDTH,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadowBox}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedDay(todayLabel);
            scrollToDay(todayLabel);
          }}
          style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Today</Text>
        </Pressable>
        <ImageBackground
          source={require('@/assets/images/dateCover.png')}
          resizeMode="stretch"
          style={StyleSheet.absoluteFillObject}
        />

        <Pressable
          hitSlop={12}
          onPress={() => movePage('prev')}
          style={[styles.arrowButton, styles.leftButton]}>
          <ArrowLeftIcon width={18} height={18} />
        </Pressable>

        <View className="mt-20 w-[272px] flex-1 self-center">
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={styles.carousel}
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              setScrollX(event.nativeEvent.contentOffset.x);
            }}>
            {weeks.map((week) => {
              const selected = selectedDay === week;

              return (
                <Pressable
                  key={week}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedDay(week);
                    scrollToDay(week);
                  }}
                  style={[styles.chip, selected && styles.selectedChip]}>
                  {!selected && <View style={styles.glassHighlight} />}

                  <Text style={[styles.chipText, selected && styles.selectedChipText]}>{week}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable
          hitSlop={12}
          onPress={() => movePage('next')}
          style={[styles.arrowButton, styles.rightButton]}>
          <ArrowRightIcon width={18} height={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    width: '100%',
    aspectRatio: 400 / 160,
    position: 'relative',
    borderRadius: 24,
  },

  dateCover: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: -8,
  },

  drawerOutline: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 13.5,
    // height: 32,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderBottomWidth: 4,
    // borderTopWidth: 0,
    // borderColor: '#FFFFFF',
    // borderBottomLeftRadius: 36,
    // borderBottomRightRadius: 36,
    // zIndex: 1,
  },

  container: {
    // flex: 1,
  },

  todoBackground: {
    flex: 1,
    height: 120,
    width: '100%',
  },

  todoImage: {
    width: '95%',
    height: '95%',
  },

  carousel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  carouselContent: {
    alignItems: 'center',
    gap: 8,
  },

  slide: {
    width: 40,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slideText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'McLaren',
  },

  chip: {
    width: 48,
    height: 38,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#725F67',
    borderWidth: 1,
    borderColor: '#725F67',
  },

  glassHighlight: {
    position: 'absolute',
    // top: 3,
    // left: 6,
    // right: 6,
    // height: 10,
    // borderRadius: 999,
    // backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },

  selectedChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#725F67',
  },

  chipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'McLaren',
  },

  selectedChipText: {
    color: '#725F67',
  },

  arrowButton: {
    position: 'absolute',
    top: 60,
    bottom: 0,
    zIndex: 2,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftButton: {
    left: 15,
  },

  rightButton: {
    right: 15,
  },

  todayButton: {
    position: 'absolute',
    top: 65,
    alignSelf: 'center',
    zIndex: 3,
    height: 20,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(145, 105, 125, 0.38)',
  },

  todayButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'McLaren',
  },
});
