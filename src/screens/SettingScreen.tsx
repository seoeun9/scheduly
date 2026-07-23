import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import SettingSection from '@/components/SettingSection';

export default function SettingScreen({ navigation }: any) {
  const handleClose = () => {
    void Haptics.selectionAsync();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View className="mx-10 mt-10 flex flex-col items-start justify-start gap-5">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full bg-[#d1d1d1]"
          onPress={handleClose}
          hitSlop={8}>
          <Ionicons name="close" size={28} color="#222631" />
        </Pressable>
        <Text className="mt-6 text-3xl font-medium">설정</Text>
      </View>

      <View className="pb-10 pt-1">
        <SettingSection title="일반" />

        <SettingSection title="계정" />

        <SettingSection title="피드백" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
});
