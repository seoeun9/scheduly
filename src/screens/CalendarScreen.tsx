import { Text, View, ImageBackground } from 'react-native';
import WeekCarousel from '@/components/WeekCarousel';
import Calender from '@/components/Calendar';

export default function CalendarScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/backgroundImage.png')}
      resizeMode="cover"
      className="flex-1">
      <WeekCarousel />
      <Calender />
    </ImageBackground>
  );
}
