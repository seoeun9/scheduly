import { View, Pressable, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SettingSection from '@/components/SettingSection';

export default function SettingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#FFFFFF', '#D1ECFF']}
        locations={[0, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.screen}>
        <View className="ml-8 mt-12 flex flex-col items-start justify-start gap-8">
          <Pressable
            className="h-6 w-6 rounded-[18px]"
            onPress={() => navigation.goBack()}
            hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color="#181A21" />
          </Pressable>
          <Text className="ml-2 text-2xl font-bold">Settings</Text>
        </View>
        <View className="flex flex-col">
          <SettingSection title="General" />
          <SettingSection title="Account" />
          <SettingSection title="Feedback" />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    marginTop: 10,
  },
});
