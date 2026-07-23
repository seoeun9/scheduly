import React, { useState, useRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { useTodoStore } from '@/stores/useTodoStore';
import { type TodoColor } from '@/types/todo';
import { TODO_ICONS, TODO_COLORS } from '@/utils/constants';
import { useTheme } from '@/hooks/useTheme';

const ICON_ROWS = 3;

const TODO_ICON_COLUMNS = Array.from(
  {
    length: Math.ceil(TODO_ICONS.length / ICON_ROWS),
  },
  (_, columnIndex) => {
    const startIndex = columnIndex * ICON_ROWS;

    return TODO_ICONS.slice(startIndex, startIndex + ICON_ROWS);
  }
);
const COLOR_OPTIONS = Object.keys(TODO_COLORS) as TodoColor[];

export default function AddTodoScreen({ navigation, route }: any) {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<SFSymbol>('checkmark.circle');
  const [selectedColor, setSelectedColor] = useState<TodoColor>('blue');
  const previewMode: 'calendar' | 'list' = route.params?.previewMode ?? 'calendar';
  const { isDark } = useTheme();
  const iconScrollX = useRef(new Animated.Value(0)).current;

  const [iconViewportWidth, setIconViewportWidth] = useState(0);

  const [iconContentWidth, setIconContentWidth] = useState(0);

  const selectedDate = useTodoStore((state) => state.selectedDate);
  const addTodo = useTodoStore((state) => state.addTodo);

  const isSaveDisabled = !title.trim();

  const handleClose = () => {
    void Haptics.selectionAsync();
    navigation.goBack();
  };

  const handleSelectIcon = (icon: SFSymbol) => {
    void Haptics.selectionAsync();
    setSelectedIcon(icon);
  };

  const handleSelectColor = (color: TodoColor) => {
    void Haptics.selectionAsync();
    setSelectedColor(color);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    addTodo({
      title: trimmedTitle,
      icon: selectedIcon,
      color: selectedColor,
    });

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    navigation.goBack();
  };

  const selectedPalette = TODO_COLORS[selectedColor];
  const selectedPaletteColor =
    'color' in selectedPalette
      ? selectedPalette.color
      : isDark
        ? selectedPalette.darkColor
        : selectedPalette.lightColor;
  const iconMaxScroll = Math.max(iconContentWidth - iconViewportWidth, 1);

  const iconThumbWidth =
    iconContentWidth > iconViewportWidth
      ? Math.max(40, iconViewportWidth * (iconViewportWidth / iconContentWidth))
      : iconViewportWidth;

  const iconThumbMaxTranslate = Math.max(iconViewportWidth - iconThumbWidth, 0);

  const iconThumbTranslateX = iconScrollX.interpolate({
    inputRange: [0, iconMaxScroll],
    outputRange: [0, iconThumbMaxTranslate],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
      edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between">
            <Pressable
              className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#F0F0F0]'}`}
              style={({ pressed }) => [pressed && styles.buttonPressed]}
              onPress={handleClose}
              hitSlop={8}>
              <Ionicons name="close" size={23} color={isDark ? '#FFFFFF' : '#222631'} />
            </Pressable>

            <Pressable
              className={`rounded-full px-5 py-3 ${isDark ? 'bg-white' : 'bg-black'}`}
              style={({ pressed }) => [
                isSaveDisabled && styles.saveButtonDisabled,
                pressed && !isSaveDisabled && styles.buttonPressed,
              ]}
              disabled={isSaveDisabled}
              onPress={handleSave}>
              <Text className={`text-sm font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
                추가하기
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 gap-2">
            <Text className={`text-3xl font-medium ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              새로운 할 일 추가
            </Text>

            <Text className="text-sm text-[#A5A5A5]">
              on {selectedDate || '날짜를 선택해주세요'}
            </Text>
          </View>

          <View className="mt-9">
            <Text
              className={`mb-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              제목
            </Text>

            <View
              className={`flex-row items-center rounded-[20px] px-5 ${isDark ? 'bg-[#1A1A1A]' : 'bg-[#F4F4F4]'}`}>
              <SymbolView
                name={selectedIcon}
                tintColor={selectedPaletteColor}
                style={styles.titleIcon}
              />

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="어떤 일을 할까요?"
                placeholderTextColor="#A5A5A5"
                returnKeyType="done"
                maxLength={15}
                className={`ml-3 h-16 flex-1 text-[16px] ${isDark ? 'text-white' : 'text-[#181A21]'}`}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            <Text className="mt-2 text-right text-xs text-[#B0B0B0]">{title.length}/15</Text>
          </View>

          <View className="mt-7">
            <Text
              className={`mb-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              아이콘
            </Text>

            <View
              onLayout={(event) => {
                setIconViewportWidth(event.nativeEvent.layout.width);
              }}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onContentSizeChange={(width) => {
                  setIconContentWidth(width);
                }}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: iconScrollX,
                        },
                      },
                    },
                  ],
                  {
                    useNativeDriver: false,
                  }
                )}
                contentContainerStyle={{
                  paddingRight: 24,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                  }}>
                  {TODO_ICON_COLUMNS.map((iconColumn, columnIndex) => (
                    <View
                      key={`icon-column-${columnIndex}`}
                      style={{
                        gap: 12,
                      }}>
                      {iconColumn.map((icon) => {
                        const isSelected = selectedIcon === icon;

                        return (
                          <Pressable
                            key={icon}
                            className="h-12 w-12 items-center justify-center rounded-2xl"
                            style={({ pressed }) => [
                              {
                                backgroundColor: isSelected
                                  ? isDark
                                    ? selectedPalette.darkBackgroundColor
                                    : selectedPalette.backgroundColor
                                  : isDark
                                    ? '#1A1A1A'
                                    : '#F4F4F4',

                                borderWidth: isSelected ? 1.5 : 0,

                                borderColor: isSelected ? selectedPaletteColor : 'transparent',
                              },

                              pressed && styles.optionPressed,
                            ]}
                            onPress={() => handleSelectIcon(icon)}>
                            <SymbolView
                              name={icon}
                              type="monochrome"
                              size={22}
                              tintColor={
                                isSelected ? selectedPaletteColor : isDark ? '#888888' : '#777777'
                              }
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </Animated.ScrollView>

              <View
                style={{
                  height: 3,
                  marginTop: 13,
                  borderRadius: 2,
                  backgroundColor: isDark ? '#2A2A2A' : '#EEEEEE',
                  overflow: 'hidden',
                }}>
                <Animated.View
                  style={{
                    width: iconThumbWidth,
                    height: 3,

                    borderRadius: 2,
                    backgroundColor: isDark ? '#555555' : '#8A8A8A',

                    transform: [
                      {
                        translateX: iconThumbTranslateX,
                      },
                    ],
                  }}
                />
              </View>
            </View>
            {/* <View className="flex-row flex-wrap gap-3">
              {TODO_ICONS.map((icon) => {
                const isSelected = selectedIcon === icon;

                return (
                  <Pressable
                    key={icon}
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={({ pressed }) => [
                      {
                        backgroundColor: isSelected ? selectedPalette.backgroundColor : '#F4F4F4',

                        borderWidth: isSelected ? 1.5 : 0,
                        borderColor: isSelected ? selectedPalette.color : 'transparent',
                      },

                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelectIcon(icon)}>
                    <SymbolView
                      name={icon}
                      tintColor={isSelected ? selectedPalette.color : '#777777'}
                      style={styles.symbol}
                    />
                  </Pressable>
                );
              })}
            </View> */}
          </View>

          <View className="mt-8">
            <Text
              className={`mb-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
              색상
            </Text>

            <View className="flex-row items-center gap-4">
              {COLOR_OPTIONS.map((color) => {
                const palette = TODO_COLORS[color];
                const paletteColor =
                  'color' in palette
                    ? palette.color
                    : isDark
                      ? palette.darkColor
                      : palette.lightColor;
                const isSelected = selectedColor === color;

                return (
                  <Pressable
                    key={color}
                    className="items-center justify-center rounded-full"
                    style={({ pressed }) => [
                      styles.colorButton,
                      {
                        borderColor: isSelected ? (isDark ? '#FFFFFF' : '#181A21') : 'transparent',
                      },
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelectColor(color)}>
                    <View
                      className="h-8 w-8 rounded-full"
                      style={{
                        backgroundColor: paletteColor,
                      }}
                    />

                    {isSelected && (
                      <View
                        style={[styles.colorCheck, { overflow: 'hidden', flexDirection: 'row' }]}>
                        <View style={{ flex: 1, backgroundColor: '#000000' }} />
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
                        <View
                          style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                          }}>
                          <Ionicons name="checkmark" size={10} color="#808080" />
                        </View>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-9">
            <View className="mb-3 flex-row items-center justify-start">
              <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
                미리보기
              </Text>
            </View>

            {previewMode === 'calendar' ? (
              <View
                className="h-[58px] flex-row items-center rounded-full px-5"
                style={{
                  backgroundColor: isDark
                    ? selectedPalette.darkBackgroundColor
                    : selectedPalette.backgroundColor,
                }}>
                <SymbolView
                  name={selectedIcon}
                  tintColor={selectedPaletteColor}
                  style={styles.previewIcon}
                />

                <Text
                  className="ml-3 flex-1 text-[15px] font-semibold"
                  style={{
                    color: selectedPaletteColor,
                  }}
                  numberOfLines={1}>
                  {title.trim() || '새로운 할 일'}
                </Text>
              </View>
            ) : (
              <View>
                <View className="h-16 flex-row items-center px-3">
                  <View className="min-w-0 flex-1 flex-row items-center pr-3">
                    <View className="h-9 w-9 items-center justify-center">
                      <SymbolView
                        name={selectedIcon}
                        type="monochrome"
                        size={21}
                        tintColor={selectedPaletteColor}
                      />
                    </View>

                    <Text
                      className="ml-3 flex-1 text-[15px] font-semibold"
                      style={{
                        color: selectedPaletteColor,
                      }}
                      numberOfLines={1}>
                      {title.trim() || '새로운 할 일'}
                    </Text>
                  </View>

                  <View className="h-[34px] w-[34px] items-center justify-center">
                    <Ionicons
                      name="checkmark-done"
                      size={28}
                      color="#B7B7B7"
                      style={{
                        transform: [
                          {
                            translateX: 1,
                          },
                          {
                            translateY: -2,
                          },
                          {
                            rotate: '-8deg',
                          },
                        ],
                      }}
                    />
                  </View>
                </View>

                <View className={`ml-12 h-px ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#EEEEEE]'}`} />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },

  content: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
  },

  titleIcon: {
    width: 23,
    height: 23,
  },

  symbol: {
    width: 22,
    height: 22,
  },

  previewIcon: {
    width: 24,
    height: 24,
  },

  colorButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },

  colorCheck: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#181A21',
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },

  optionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },

  saveButtonDisabled: {
    opacity: 0.3,
  },
});
