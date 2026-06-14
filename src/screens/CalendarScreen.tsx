import { Text, View, ImageBackground } from 'react-native';
import WeekCarousel from '@/components/WeekCarousel';
import Calender from '@/components/Calendar';
import ScreenFade from '@/components/ScreenFade';

export default function CalendarScreen() {
  return (
    <ScreenFade>
      <ImageBackground
        source={require('@/assets/images/backgroundImage.png')}
        resizeMode="cover"
        className="flex-1"></ImageBackground>
    </ScreenFade>
  );
}
