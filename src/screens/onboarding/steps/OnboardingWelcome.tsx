import { View, Text } from 'react-native';
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
      </View>
    </SafeAreaView>
  );
}
