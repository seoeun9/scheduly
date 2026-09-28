import { Text } from '@/components/AppText';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '@/utils/style';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingWelcome() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View className="flex flex-col items-center justify-center gap-5">
          <Text className="text-xl font-medium text-white">안녕하세요 ! 👋</Text>
          <Text className="text-3xl font-semibold text-white">스케줄리가 처음이신가요?</Text>
        </View>
        <Pressable
          onPress={() => {
            // Navigate to the next onboarding step
          }}>
          <View className="mt-40 flex flex-col items-center justify-center gap-2 rounded-full bg-white px-6 py-3">
            <Text className="text-lg font-medium text-black">네, 처음이에요 </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            // Navigate to the next onboarding step
          }}>
          <View className="mt-10 flex flex-col items-center justify-center">
            <Text className="text-lg font-medium text-[#969696]">
              아니요, 이용한 적 있어요 (skip)
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
