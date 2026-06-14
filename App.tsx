// App.tsx
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { McLaren_400Regular } from '@expo-google-fonts/mclaren';

import './global.css';
import Navigator from '@/navigation/Navigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    McLaren_400Regular,
  });

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <Navigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
