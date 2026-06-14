import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';

const todos = [
  { id: 1, title: 'Study English', accent: false },
  { id: 2, title: 'Study English', accent: false },
  { id: 3, title: 'Study English', accent: true },
  { id: 4, title: 'Study English', accent: false },
  { id: 5, title: 'Study English', accent: false },
];

export default function TodoList() {
  return (
    <View className="h-[550px] w-full items-center justify-start bg-white/60 px-10 pt-10">
      <Text style={styles.titleText}>To-do List</Text>
      <Text style={styles.subTitleText} className="mt-2">
        꾹 눌러 편집
      </Text>

      <ScrollView
        className="mt-7 w-full"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.todoContent}>
        {todos.map((todo) => (
          <Pressable key={todo.id} style={[styles.todoItem, todo.accent && styles.todoItemAccent]}>
            <Text style={[styles.todoText, todo.accent && styles.todoTextAccent]}>
              {todo.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#715F66',
    fontFamily: 'McLaren',
  },
  subTitleText: {
    fontSize: 12,
    color: '#715F66',
    fontFamily: 'McLaren',
  },

  todoContent: {
    paddingBottom: 40,
    gap: 20,
  },

  todoItem: {
    width: '100%',
    height: 53,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8C7F85',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  todoItemAccent: {
    borderColor: '#F8B4D2',
  },

  todoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#715F66',
    fontFamily: 'McLaren',
  },

  todoTextAccent: {
    color: '#FF8DCA',
  },
});
