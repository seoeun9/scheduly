import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '@/utils/haptics';

import SettingSection from '@/components/SettingSection';
import { useTheme } from '@/hooks/useTheme';

export default function SettingScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const feedbackEmail = 'jseoeun26@gmail.com';

  const handleClose = () => {
    void Haptics.selectionAsync();
    navigation.goBack();
  };

  const handleOpenFeedback = async () => {
    void Haptics.selectionAsync();

    const subject = encodeURIComponent('Scheduly 피드백');
    const body = encodeURIComponent(
      '안녕하세요. 앱 사용 중 불편한 점이나 개선 의견을 남겨주세요.\n\n사용 기기: \n앱 버전: \n내용: '
    );
    const mailtoUrl = `mailto:${feedbackEmail}?subject=${subject}&body=${body}`;
    const gmailUrl = `googlegmail:///co?to=${feedbackEmail}&subject=${subject}&body=${body}`;

    try {
      if (Platform.OS === 'android') {
        const canOpenGmail = await Linking.canOpenURL(gmailUrl);
        if (canOpenGmail) {
          await Linking.openURL(gmailUrl);
          return;
        }
      }

      await Linking.openURL(mailtoUrl);
    } catch {
      await Linking.openURL(mailtoUrl);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: isDark ? '#111111' : '#FFFFFF' }]}
      edges={['top']}>
      <View className="mx-10 mt-10 flex flex-col items-start justify-start gap-5">
        <Pressable
          className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#d1d1d1]'}`}
          onPress={handleClose}
          hitSlop={8}>
          <Ionicons name="close" size={28} color={isDark ? '#FFFFFF' : '#222631'} />
        </Pressable>
        <Text className={`mt-6 text-3xl font-medium ${isDark ? 'text-white' : 'text-black'}`}>
          설정
        </Text>
      </View>

      <View className="pb-10 pt-1">
        <SettingSection title="일반" />

        <SettingSection title="계정" />

        <Text className="mx-10 mt-7 text-[13px] font-medium  text-[#7C7C7C]">피드백</Text>
        <View
          className={`mx-10 mt-3 rounded-[18px] border px-7 py-4 ${isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-[#F1F1F1] bg-white'}`}>
          <Pressable
            className=" h-10 flex-row items-center justify-between"
            onPress={handleOpenFeedback}
            hitSlop={8}>
            <View className="flex-row items-center gap-3">
              <Ionicons name="mail-outline" size={18} color={isDark ? '#FFFFFF' : '#222631'} />
              <View>
                <Text
                  className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#222631]'}`}>
                  피드백 보내기
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={isDark ? '#8A8A8A' : '#888888'} />
          </Pressable>
        </View>
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
