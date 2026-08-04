import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import * as Haptics from '@/utils/haptics';
import { useTheme } from '@/hooks/useTheme';

const ROUTINE_QUOTE_TEXT_KEY = 'routine-quote-text';
const ROUTINE_QUOTE_AUTHOR_KEY = 'routine-quote-author';

const DEFAULT_ROUTINE_QUOTE_TEXT = '습관이란 인간으로 하여금\n어떤 일이든 하게 만든다.';
const DEFAULT_ROUTINE_QUOTE_AUTHOR = '도스토예프스키';

export default function EditRoutineQuoteScreen({ navigation }: any) {
  const { isDark } = useTheme();

  const [quoteText, setQuoteText] = useState(DEFAULT_ROUTINE_QUOTE_TEXT);
  const [author, setAuthor] = useState(DEFAULT_ROUTINE_QUOTE_AUTHOR);

  useEffect(() => {
    const loadStoredQuote = async () => {
      try {
        const [savedQuoteText, savedAuthor] = await Promise.all([
          AsyncStorage.getItem(ROUTINE_QUOTE_TEXT_KEY),
          AsyncStorage.getItem(ROUTINE_QUOTE_AUTHOR_KEY),
        ]);

        if (savedQuoteText) {
          setQuoteText(savedQuoteText);
        }

        if (savedAuthor) {
          setAuthor(savedAuthor);
        }
      } catch (error) {
        console.log(error);
      }
    };

    void loadStoredQuote();
  }, []);

  const handleClose = () => {
    void Haptics.selectionAsync();
    navigation.goBack();
  };

  const handleSave = async () => {
    const nextQuoteText = quoteText.trim() || DEFAULT_ROUTINE_QUOTE_TEXT;
    const nextAuthor = author.trim() || DEFAULT_ROUTINE_QUOTE_AUTHOR;

    try {
      await Promise.all([
        AsyncStorage.setItem(ROUTINE_QUOTE_TEXT_KEY, nextQuoteText),
        AsyncStorage.setItem(ROUTINE_QUOTE_AUTHOR_KEY, nextAuthor),
      ]);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Keyboard.dismiss();
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`} edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 px-6 pt-8">
          <View className="flex-row items-center justify-between">
            <Pressable
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDark ? 'bg-[#2A2A2A]' : 'bg-[#F0F0F0]'
              }`}
              onPress={handleClose}
              hitSlop={8}>
              <Ionicons name="close" size={22} color={isDark ? '#FFFFFF' : '#222631'} />
            </Pressable>

            <Pressable
              className={`rounded-full px-5 py-3 active:scale-95 active:opacity-70 ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              onPress={handleSave}>
              <Text className={`text-sm font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
                저장하기
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 gap-2">
            <Text className={`text-3xl font-medium ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              루틴 인용구
            </Text>
            <Text className="text-sm text-[#A5A5A5]">루틴 화면에 표시할 문구를 설정해 주세요</Text>
          </View>

          <ScrollView
            className="mt-8 flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 36 }}>
            <View
              className={`rounded-[24px] px-5 py-5 ${isDark ? 'bg-[#161616]' : 'bg-[#F5F5F5]'}`}>
              <Text
                className={`mb-3 text-sm font-semibold ${
                  isDark ? 'text-white' : 'text-[#181A21]'
                }`}>
                문구
              </Text>

              <TextInput
                value={quoteText}
                onChangeText={(text) => setQuoteText(text.slice(0, 40))}
                placeholder={DEFAULT_ROUTINE_QUOTE_TEXT}
                placeholderTextColor={isDark ? '#676767' : '#A5A5A5'}
                multiline
                textAlignVertical="top"
                className={`min-h-[150px] text-[16px] leading-7 ${
                  isDark ? 'text-white' : 'text-[#181A21]'
                }`}
              />

              <Text className="mt-2 text-right text-xs text-[#A5A5A5]">{quoteText.length}/40</Text>
            </View>

            <View
              className={`mt-4 rounded-[24px] px-5 py-5 ${
                isDark ? 'bg-[#161616]' : 'bg-[#F5F5F5]'
              }`}>
              <Text
                className={`mb-3 text-sm font-semibold ${
                  isDark ? 'text-white' : 'text-[#181A21]'
                }`}>
                작가
              </Text>

              <TextInput
                value={author}
                onChangeText={(text) => setAuthor(text.slice(0, 24))}
                placeholder={DEFAULT_ROUTINE_QUOTE_AUTHOR}
                placeholderTextColor={isDark ? '#676767' : '#A5A5A5'}
                className={`text-[16px] ${isDark ? 'text-white' : 'text-[#181A21]'}`}
              />
            </View>

            <View
              className={`mt-5 rounded-[24px] px-5 py-5 ${
                isDark ? 'bg-[#101010]' : 'bg-[#FAFAFA]'
              }`}>
              <View className="mb-4 flex-row items-center justify-between">
                <Text
                  className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
                  미리보기
                </Text>
              </View>

              <Text
                className={`text-[20px] font-medium leading-8 ${
                  isDark ? 'text-[#F4F4F4]' : 'text-[#212121]'
                }`}>
                {quoteText.trim() || DEFAULT_ROUTINE_QUOTE_TEXT}
              </Text>

              <Text
                className={`mt-4 text-right text-sm font-medium ${
                  isDark ? 'text-[#A5A5A5]' : 'text-[#777777]'
                }`}>
                - {author.trim() || DEFAULT_ROUTINE_QUOTE_AUTHOR}
              </Text>
            </View>

            <Text className="mt-4 px-1 text-xs leading-5 text-[#A5A5A5]">
              비워두고 저장하면 기본 문구와 작가로 돌아가요.
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
