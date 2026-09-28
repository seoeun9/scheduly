import styles from '@/utils/style';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingStep1() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View className="flex flex-col">
          <p>
            <span className="font-bold">스케줄리</span>는 날짜별로 일정을 관리할 수 있는
          </p>
          <p>
            <span className="font-bold">투두리스트(To-do List)</span> 앱입니다.
          </p>
          <p className="mt-10 font-bold">오늘 할 일을 설정해볼까요?</p>
        </View>
      </View>
    </SafeAreaView>
  );
}
