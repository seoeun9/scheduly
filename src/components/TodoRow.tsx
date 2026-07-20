import { Animated, FlatList, Pressable, Text, View } from 'react-native';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { Todo } from '@/stores/useTodoStore';
import { SymbolView } from 'expo-symbols';
import { TODO_COLORS } from '@/utils/constants';
import * as Haptics from 'expo-haptics';

type TodoRowProps = {
  title: string;
  todos: Todo[];
  completed: boolean;
  emptyMessage: string;
  onPressTodo: (id: string) => void;
  onEditTodo: (id: string) => void;
  onAddTodo?: () => void;
};

type TodoCardProps = {
  item: Todo;
  onPress: () => void;
  onLongPress: () => void;
};

function TodoCard({ item, onPress, onLongPress }: TodoCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const palette = TODO_COLORS[item.color ?? 'blue'];

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 180,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}>
      <Pressable
        className="h-[38px] min-w-[120px] flex-row items-center rounded-[22px] px-5"
        style={{
          backgroundColor: item.done ? palette.backgroundColor : '#F4F4F4',
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}>
        <View className="mr-3 h-7 items-center justify-center">
          <SymbolView name={item.icon} type="monochrome" size={15} tintColor={palette.color} />
        </View>

        <Text
          className="flex-1 text-[13px] font-semibold"
          style={{
            color: palette.color,
          }}
          numberOfLines={1}>
          {item.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function TodoRow({
  title,
  todos,
  completed,
  emptyMessage,
  onPressTodo,
  onEditTodo,
  onAddTodo,
}: TodoRowProps) {
  const handleLongPress = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    onEditTodo(id);
  };

  return (
    <View className="h-[90px]">
      <View className="mb-4 flex-row items-center">
        <Text
          className={`font-manrope text-2xl font-medium ${
            completed ? 'text-black' : 'text-[#909090]'
          }`}>
          {todos.length}{' '}
        </Text>

        <Text className="text-[17px] font-medium text-black">{title}</Text>

        {!completed && onAddTodo && (
          <Pressable
            className="ml-3 h-[20px] w-[20px] items-center justify-center rounded-full bg-black"
            style={({ pressed }) => ({
              opacity: pressed ? 0.72 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
            onPress={onAddTodo}
            hitSlop={8}>
            <Ionicons name="add" size={15} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        data={todos}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 3,
          paddingVertical: 4,
          paddingRight: 20,
        }}
        ListEmptyComponent={
          <View className="h-[45px] justify-center">
            <Text className="text-sm text-[#A5A5A5]">{emptyMessage}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TodoCard
            item={item}
            onPress={() => onPressTodo(item.id)}
            onLongPress={() => handleLongPress(item.id)}
          />
        )}
      />
    </View>
  );
}
