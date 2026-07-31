import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '@/utils/haptics';
import { useTodoStore } from '@/stores/useTodoStore';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';
// import { useToggleTodoCompletion } from '@/hooks/useToggleTodoCompletion';
// import { AppSymbol } from '@/components/AppSymbol';
// import { TODO_COLORS } from '@/utils/constants';

// const PALETTE_BG_CLASS: Record<
//   keyof typeof TODO_COLORS,
//   {
//     light: string;
//     dark: string;
//   }
// > = {
//   red: {
//     light: 'bg-[#FFE8E8]',
//     dark: 'bg-[#3A1818]',
//   },
//   orange: {
//     light: 'bg-[#FFF0DE]',
//     dark: 'bg-[#3A2210]',
//   },
//   yellow: {
//     light: 'bg-[#FFF7D6]',
//     dark: 'bg-[#362A00]',
//   },
//   green: {
//     light: 'bg-[#E3F6ED]',
//     dark: 'bg-[#102918]',
//   },
//   blue: {
//     light: 'bg-[#E8F6FF]',
//     dark: 'bg-[#0C2236]',
//   },
//   navy: {
//     light: 'bg-[#ECEEFC]',
//     dark: 'bg-[#101436]',
//   },
//   purple: {
//     light: 'bg-[#F6E7FD]',
//     dark: 'bg-[#250D32]',
//   },
//   gray: {
//     light: 'bg-[#F0F0F0]',
//     dark: 'bg-[#3A3A3A]',
//   },
// };

// type TodoSectionProps = {
//   title: string;
//   todos: ReturnType<typeof useTodoStore.getState>['todos'];
//   isDark: boolean;
//   emptyMessage: string;
//   onPressTodo: (id: string) => void;
//   onEditTodo: (id: string) => void;
// };

// function TodoSection({
//   title,
//   todos,
//   isDark,
//   emptyMessage,
//   onPressTodo,
//   onEditTodo,
// }: TodoSectionProps) {
//   return (
//     <View className="mt-6">
//       <View className="mb-3 flex-row items-center justify-between">
//         <Text className={`text-[17px] font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
//           {title}
//         </Text>

//         <Text className={`text-sm ${isDark ? 'text-[#A5A5A5]' : 'text-[#777777]'}`}>
//           {todos.length}개
//         </Text>
//       </View>

//       {todos.length === 0 ? (
//         <View
//           className={`h-16 items-center justify-center rounded-2xl ${
//             isDark ? 'bg-[#171717]' : 'bg-[#F6F6F6]'
//           }`}>
//           <Text className="text-sm text-[#A5A5A5]">{emptyMessage}</Text>
//         </View>
//       ) : (
//         <View className="gap-2">
//           {todos.map((todo) => {
//             const paletteKey =
//               typeof todo.color === 'string' && todo.color in TODO_COLORS ? todo.color : 'gray';
//             const palette = TODO_COLORS[paletteKey as keyof typeof TODO_COLORS];
//             const paletteColor =
//               'color' in palette ? palette.color : isDark ? palette.darkColor : palette.lightColor;
//             const paletteBackgroundClass = isDark
//               ? PALETTE_BG_CLASS[paletteKey as keyof typeof TODO_COLORS].dark
//               : PALETTE_BG_CLASS[paletteKey as keyof typeof TODO_COLORS].light;

//             return (
//               <Pressable
//                 key={todo.id}
//                 className={`h-14 flex-row items-center rounded-2xl px-4 ${paletteBackgroundClass}`}
//                 style={({ pressed }) => ({
//                   transform: [{ scale: pressed ? 0.97 : 1 }, { translateY: pressed ? 1 : 0 }],
//                 })}
//                 onPress={() => onPressTodo(todo.id)}
//                 onLongPress={() => {
//                   void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//                   onEditTodo(todo.id);
//                 }}
//                 delayLongPress={300}>
//                 <View className="mr-3 h-8 w-8 items-center justify-center">
//                   <AppSymbol
//                     name={todo.icon}
//                     type="monochrome"
//                     size={19}
//                     tintColor={paletteColor}
//                   />
//                 </View>

//                 <Text
//                   className="flex-1 text-[14px] font-medium"
//                   numberOfLines={1}
//                   style={{
//                     color: todo.done ? paletteColor : isDark ? '#EAEAEA' : '#222631',
//                     textDecorationLine: todo.done ? 'line-through' : 'none',
//                     opacity: todo.done ? 0.65 : 1,
//                   }}>
//                   {todo.title}
//                 </Text>

//                 <Ionicons
//                   name={todo.done ? 'checkmark-circle' : 'ellipse-outline'}
//                   size={20}
//                   color={todo.done ? paletteColor : isDark ? '#5A5A5A' : '#C2C2C2'}
//                 />
//               </Pressable>
//             );
//           })}
//         </View>
//       )}
//     </View>
//   );
// }

export default function TodoCarousel() {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const todos = useTodoStore((state) => state.todos);
  // const handleToggleTodo = useToggleTodoCompletion();
  // const [detailVisible, setDetailVisible] = useState(false);
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();

  const selectedTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate]
  );

  const activeTodos = useMemo(() => selectedTodos.filter((todo) => !todo.done), [selectedTodos]);

  const completedTodos = useMemo(() => selectedTodos.filter((todo) => todo.done), [selectedTodos]);

  // const handleEditTodo = (id: string) => {
  //   // setDetailVisible(false);

  //   navigation.navigate('EditTodo', {
  //     todoId: id,
  //     previewMode: 'calendar',
  //   });
  // };

  const handleOpenDetail = () => {
    void Haptics.selectionAsync();
    navigation.navigate('Todos');
  };

  // const handleCloseDetail = () => {
  //   void Haptics.selectionAsync();
  //   setDetailVisible(false);
  // };

  // const handleAddTodo = () => {
  //   void Haptics.selectionAsync();
  //   // setDetailVisible(false);

  //   navigation.navigate('AddTodo', {
  //     previewMode: 'calendar',
  //   });
  // };

  return (
    <>
      <View
        className={`mt-6 rounded-3xl border px-5 py-5 ${
          isDark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-[#ECECEC] bg-[#FAFAFA]'
        }`}>
        <View className="flex-row items-center justify-between">
          <Text className={`text-[16px] font-semibold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
            오늘 할 일 요약
          </Text>

          <Pressable
            className={`h-9 flex-row items-center rounded-full px-3 ${
              isDark ? 'bg-white' : 'bg-black'
            }`}
            style={({ pressed }) => ({
              opacity: pressed ? 0.72 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
            onPress={handleOpenDetail}>
            <Text className={`text-xs font-semibold ${isDark ? 'text-black' : 'text-white'}`}>
              자세히 보기
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={isDark ? '#000000' : '#FFFFFF'}
              style={{ marginLeft: 2 }}
            />
          </Pressable>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View
            className={`flex-1 rounded-2xl px-4 py-4 ${isDark ? 'bg-[#1A1A1A]' : 'bg-[#FFFFFF]'}`}>
            <Text className="text-xs text-[#9B9B9B]">할 일</Text>
            <Text className={`mt-2 text-[23px] font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {activeTodos.length}
            </Text>
          </View>

          <View
            className={`flex-1 rounded-2xl px-4 py-4 ${isDark ? 'bg-[#1A1A1A]' : 'bg-[#FFFFFF]'}`}>
            <Text className="text-xs text-[#9B9B9B]">완료</Text>
            <Text className={`mt-2 text-[23px] font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {completedTodos.length}
            </Text>
          </View>
        </View>
      </View>

      {/*
      <Modal
        visible={detailVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseDetail}>
        <View className="flex-1 justify-end bg-transparent">
          <View
            className={`max-h-[82%] rounded-t-[28px] px-6 pb-8 pt-5 ${
              isDark ? 'bg-[#0F0F0F]' : 'bg-white'
            }`}>
            <View className="mb-2 flex-row items-center justify-between">
              <Text className={`text-[20px] font-bold ${isDark ? 'text-white' : 'text-[#181A21]'}`}>
                오늘 할 일 상세
              </Text>

              <View className="flex-row items-center gap-2">
                <Pressable
                  className={`h-10 w-10 items-center justify-center rounded-full ${
                    isDark ? 'bg-white' : 'bg-black'
                  }`}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.68 : 1,
                  })}
                  onPress={handleAddTodo}
                  hitSlop={6}>
                  <Ionicons name="add" size={22} color={isDark ? '#000000' : '#FFFFFF'} />
                </Pressable>

                <Pressable
                  className={`h-10 w-10 items-center justify-center rounded-full ${
                    isDark ? 'bg-[#242424]' : 'bg-[#F2F2F2]'
                  }`}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.68 : 1,
                  })}
                  onPress={handleCloseDetail}
                  hitSlop={6}>
                  <Ionicons name="close" size={20} color={isDark ? '#FFFFFF' : '#222631'} />
                </Pressable>
              </View>
            </View>

            <Text className={`text-sm ${isDark ? 'text-[#8D8D8D]' : 'text-[#777777]'}`}>
              할 일 {activeTodos.length}개 · 완료 {completedTodos.length}개
            </Text>

            <ScrollView
              className="mt-2"
              contentContainerStyle={{ paddingBottom: 18 }}
              showsVerticalScrollIndicator={false}>
              <TodoSection
                title="할 일"
                todos={activeTodos}
                isDark={isDark}
                emptyMessage={
                  completedTodos.length ? '모든 일을 완료했어요!' : '아직 할 일이 없어요'
                }
                onPressTodo={handleToggleTodo}
                onEditTodo={handleEditTodo}
              />

              <TodoSection
                title="완료"
                todos={completedTodos}
                isDark={isDark}
                emptyMessage="아직 완료한 일이 없어요"
                onPressTodo={handleToggleTodo}
                onEditTodo={handleEditTodo}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
      */}
    </>
  );
}
