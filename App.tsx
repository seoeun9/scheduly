// App.tsx
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { McLaren_400Regular } from '@expo-google-fonts/mclaren';

import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
function Sparkle({ style }: { style?: object }) {
  return <View style={[styles.sparkle, style]} />;
}

function SchedulySplash({ onFinish }: { onFinish: () => void }) {
  const logoProgress = useRef(new Animated.Value(0)).current;
  const sparkleProgress = useRef(new Animated.Value(0)).current;
  const exitProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoProgress, {
          toValue: 1,
          duration: 560,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(260),
          Animated.spring(sparkleProgress, {
            toValue: 1,
            friction: 5,
            tension: 130,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(780),
      Animated.timing(exitProgress, {
        toValue: 1,
        duration: 360,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(onFinish);
  }, [exitProgress, logoProgress, onFinish, sparkleProgress]);

  const logoStyle = {
    opacity: logoProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: logoProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
      {
        scale: logoProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1],
        }),
      },
    ],
  };

  const sparkleStyle = {
    opacity: sparkleProgress,
    transform: [
      {
        scale: sparkleProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 1],
        }),
      },
      {
        rotate: sparkleProgress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const containerStyle = {
    opacity: exitProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        scale: exitProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.03],
        }),
      },
    ],
  };

  return (
    <Animated.View pointerEvents="none" style={[styles.splashContainer, containerStyle]}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={styles.mark}>
          <View style={styles.checkLineShort} />
          <View style={styles.checkLineLong} />
        </View>

        <View>
          <View style={styles.wordmarkRow}>
            <Text style={styles.wordmark}>Schedul</Text>
            <Text style={[styles.wordmark, styles.wordmarkAccent]}>y</Text>
          </View>

          <Animated.View style={[styles.sparkleGroup, sparkleStyle]}>
            <Sparkle style={styles.sparkleLarge} />
            <Sparkle style={styles.sparkleSmall} />
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    McLaren_400Regular,
  });

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      {showSplash && <SchedulySplash onFinish={() => setShowSplash(false)} />}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BFE6FB',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mark: {
    width: 78,
    height: 78,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '-2deg' }],
  },
  checkLineShort: {
    position: 'absolute',
    left: 18,
    top: 38,
    width: 25,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#222631',
    transform: [{ rotate: '43deg' }],
  },
  checkLineLong: {
    position: 'absolute',
    left: 32,
    top: 33,
    width: 38,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#222631',
    transform: [{ rotate: '-43deg' }],
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmark: {
    color: '#222631',
    fontFamily: 'McLaren_400Regular',
    fontSize: 44,
    lineHeight: 54,
    letterSpacing: 0,
  },
  wordmarkAccent: {
    color: '#5DADE6',
  },
  sparkleGroup: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 38,
    height: 38,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  sparkleLarge: {
    right: 8,
    top: 5,
    width: 17,
    height: 17,
  },
  sparkleSmall: {
    right: 0,
    top: 24,
    width: 9,
    height: 9,
    opacity: 0.88,
  },
});
