import React, { useState, useEffect, useRef } from 'react';
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
import { TODO_COLORS, type TodoColor } from '@/types/todo';
import { TODO_ICONS } from '@/utils/constants';

const COLOR_OPTIONS = Object.keys(TODO_COLORS) as TodoColor[];

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

export default function EditTodoScreen({ route, navigation }: any) {
  const {
    todoId,
    previewMode = 'calendar',
  }: {
    todoId: string;
    previewMode?: 'calendar' | 'list';
  } = route.params;

  const todo = useTodoStore((state) => state.todos.find((item) => item.id === todoId));

  const [title, setTitle] = useState('');

  const iconScrollX = useRef(new Animated.Value(0)).current;

  const [iconViewportWidth, setIconViewportWidth] = useState(0);

  const [iconContentWidth, setIconContentWidth] = useState(0);

  useEffect(() => {
    if (!todo) {
      return;
    }

    setTitle(todo.title);
    setSelectedIcon(todo.icon);
    setSelectedColor(todo.color);
  }, [todo]);
  const [selectedIcon, setSelectedIcon] = useState<SFSymbol>('checkmark.circle');
  const [selectedColor, setSelectedColor] = useState<TodoColor>('blue');
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
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

    if (!trimmedTitle || !todo) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    updateTodo(todo.id, {
      title: trimmedTitle,
      icon: selectedIcon,
      color: selectedColor,
    });

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Keyboard.dismiss();
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!todo) {
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    removeTodo(todo.id);
    navigation.goBack();
  };

  const selectedPalette = TODO_COLORS[selectedColor];

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between">
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-[#F0F0F0]"
              style={({ pressed }) => [pressed && styles.buttonPressed]}
              onPress={handleClose}
              hitSlop={8}>
              <Ionicons name="close" size={23} color="#222631" />
            </Pressable>

            <View className="flex-row items-center gap-2">
              <Pressable
                className="rounded-full bg-[#FF5A5F] px-4 py-3"
                style={({ pressed }) => [pressed && styles.buttonPressed]}
                onPress={handleDelete}>
                <Text className="text-sm font-semibold text-white">삭제</Text>
              </Pressable>

              <Pressable
                className="rounded-full bg-black px-5 py-3"
                style={({ pressed }) => [
                  isSaveDisabled && styles.saveButtonDisabled,
                  pressed && !isSaveDisabled && styles.buttonPressed,
                ]}
                disabled={isSaveDisabled}
                onPress={handleSave}>
                <Text className="text-sm font-semibold text-white">저장하기</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-8 gap-2">
            <Text className="text-3xl font-medium text-[#181A21]">할 일 편집</Text>

            <Text className="text-sm text-[#A5A5A5]">on {todo?.date}</Text>
          </View>

          <View className="mt-9">
            <Text className="mb-3 text-sm font-semibold text-[#181A21]">제목</Text>

            <View className="flex-row items-center rounded-[20px] bg-[#F4F4F4] px-5">
              <SymbolView
                name={selectedIcon}
                tintColor={selectedPalette.color}
                style={styles.titleIcon}
              />

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="어떤 일을 할까요?"
                placeholderTextColor="#A5A5A5"
                returnKeyType="done"
                maxLength={15}
                className="ml-3 h-16 flex-1 text-[16px] text-[#181A21]"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            <Text className="mt-2 text-right text-xs text-[#B0B0B0]">{title.length}/15</Text>
          </View>

          <View className="mt-7">
            <Text className="mb-4 text-sm font-semibold text-[#181A21]">아이콘</Text>

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
                                  ? selectedPalette.backgroundColor
                                  : '#F4F4F4',

                                borderWidth: isSelected ? 1.5 : 0,

                                borderColor: isSelected ? selectedPalette.color : 'transparent',
                              },

                              pressed && styles.optionPressed,
                            ]}
                            onPress={() => handleSelectIcon(icon)}>
                            <SymbolView
                              name={icon}
                              type="monochrome"
                              tintColor={isSelected ? selectedPalette.color : '#777777'}
                              style={styles.symbol}
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
                  marginHorizontal: 8,

                  borderRadius: 2,
                  backgroundColor: '#EEEEEE',

                  overflow: 'hidden',
                }}>
                <Animated.View
                  style={{
                    width: iconThumbWidth,
                    height: 3,

                    borderRadius: 2,
                    backgroundColor: '#B5B5B5',

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
            <Text className="mb-4 text-sm font-semibold text-[#181A21]">색상</Text>

            <View className="flex-row items-center gap-4">
              {COLOR_OPTIONS.map((color) => {
                const palette = TODO_COLORS[color];
                const isSelected = selectedColor === color;

                return (
                  <Pressable
                    key={color}
                    className="items-center justify-center rounded-full"
                    style={({ pressed }) => [
                      styles.colorButton,
                      {
                        borderColor: isSelected ? '#181A21' : 'transparent',
                      },
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelectColor(color)}>
                    <View
                      className="h-8 w-8 rounded-full"
                      style={{
                        backgroundColor: palette.color,
                      }}
                    />

                    {isSelected && (
                      <View style={styles.colorCheck}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-9">
            <View className="mb-3 flex-row items-center justify-start">
              <Text className="text-sm font-semibold text-[#181A21]">미리보기</Text>
            </View>

            {previewMode === 'calendar' ? (
              <View
                className="h-[58px] flex-row items-center rounded-full px-5"
                style={{
                  backgroundColor: selectedPalette.backgroundColor,
                }}>
                <SymbolView
                  name={selectedIcon}
                  tintColor={selectedPalette.color}
                  style={styles.previewIcon}
                />

                <Text
                  className="ml-3 flex-1 text-[15px] font-semibold"
                  style={{
                    color: selectedPalette.color,
                  }}
                  numberOfLines={1}>
                  {title.trim() || '할 일'}
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
                        tintColor={selectedPalette.color}
                      />
                    </View>

                    <Text
                      className="ml-3 flex-1 text-[15px] font-semibold"
                      style={{
                        color: selectedPalette.color,
                        textDecorationLine: todo?.done ? 'line-through' : 'none',
                        textDecorationColor: selectedPalette.color,
                      }}
                      numberOfLines={1}>
                      {title.trim() || '할 일'}
                    </Text>
                  </View>

                  <View className="h-[34px] w-[34px] items-center justify-center">
                    <Ionicons
                      name="checkmark-done"
                      size={29}
                      color={todo?.done ? selectedPalette.color : '#B7B7B7'}
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

                <View className="ml-12 h-px bg-[#EEEEEE]" />
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
