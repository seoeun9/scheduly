import { Text } from '@/components/AppText';
import { Pressable, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/utils/style';
import { useState } from 'react';
import OnboardingWelcome from './steps/OnboardingWelcome';
import OnboardingStep1 from './steps/OnboardingStep1';

type OnboardingScreenProps = {
  onComplete?: () => void;
};

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const maxStepIndex = 1;

  const goNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goBackStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OnboardingWelcome />;
      case 1:
        return <OnboardingStep1 />;
      case 2:
        // Render step 2
        break;
      case 3:
        // Render step 3
        break;
      case 4:
        // Render step 4
        break;
      case 5:
        // Render step 5
        break;
      case 6:
        // Render complete step
        break;
      default:
        return null;
    }
  };

  const handleNextStep = () => {
    if (currentStep >= maxStepIndex) {
      onComplete?.();
      return;
    }

    goNextStep();
  };

  return (
    <SafeAreaView style={styles.safeArea} className="flex-1 bg-[#212121]">
      <View style={styles.container}>
        <Pressable onPress={goBackStep} hitSlop={12} disabled={currentStep === 0}>
          <Ionicons name="chevron-back" size={22} color="#181A21" />
        </Pressable>
        {renderStep()}
        <Pressable onPress={handleNextStep}>
          <View className="mt-10 h-10 min-w-0 items-center justify-center rounded-full bg-[#212121] px-20">
            <Text className="text-white">
              {currentStep >= maxStepIndex ? '시작하기' : '다음 →'}
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
