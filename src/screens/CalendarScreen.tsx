import { Text, View, ImageBackground } from 'react-native';

export default function CalendarScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/backgroundImage.png')}
      resizeMode="cover"
      className="flex-1">
      <View className="flex-1 items-center justify-center bg-transparent">
        <Text className="text-manrope text-purple-600">Oh~</Text>
      </View>
    </ImageBackground>
  );
}
