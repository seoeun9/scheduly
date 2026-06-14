import { ReactNode, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

type ScreenFadeProps = {
  children: ReactNode;
};

export default function ScreenFade({ children }: ScreenFadeProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return undefined;
    }, [fadeAnim])
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
      }}>
      {children}
    </Animated.View>
  );
}
