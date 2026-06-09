import { ScrollView, View, Text, StyleSheet } from 'react-native';
import WeekCover from '@/assets/images/weekCover.svg';

export default function WeekCarousel() {
  const weeks = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8', '6/9'];

  return (
    <View style={styles.shadowBox}>
      <WeekCover
        width="100%"
        height={170}
        preserveAspectRatio="xMidYMid meet"
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}>
        {weeks.map((week) => (
          <View key={week} style={styles.slide}>
            <Text style={styles.slideText}>{week}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    height: 170,
    position: 'relative',

    shadowColor: '#E292B7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 8,
  },

  carousel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  carouselContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 10,
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
    fontFamily: 'Manrope',
  },
});
