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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <SettingSection title="General" />

        <SettingSection title="Account" />

        <SettingSection title="Feedback" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 12,
  },

  title: {
    color: '#222631',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },

  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 18,
    backgroundColor: '#EAF6FF',
  },

  closeButtonPressed: {
    opacity: 0.6,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
});
