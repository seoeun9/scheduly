import { View, Text, ImageBackground } from 'react-native';
import WeekCarousel from '@/components/WeekCarousel';
import TodoList from '@/components/TodoList';
import ScreenFade from '@/components/ScreenFade';

export default function ListScreen() {
  return (
    <ScreenFade>
      <ImageBackground
        source={require('@/assets/images/backgroundImage.png')}
        resizeMode="cover"
        className="flex-1">
        <WeekCarousel />
        <TodoList />
      </ImageBackground>
    </ScreenFade>
  );
}
