import ScreenFade from '@/components/ScreenFade';
import { View, Text, ImageBackground } from 'react-native';

export default function SettingScreen() {
  return (
    <ScreenFade>
      <ImageBackground
        source={require('@/assets/images/backgroundImage.png')}
        resizeMode="cover"
        className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text></Text>
        </View>
      </ImageBackground>
    </ScreenFade>
  );
}
