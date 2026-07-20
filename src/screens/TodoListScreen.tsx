// src/screens/todo/TodoListScreen.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodoListScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Todos</Text>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No todos yet</Text>

        <Text style={styles.emptyDescription}>Add a schedule to get started.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 110,
  },

  title: {
    color: '#222631',
    fontSize: 28,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: '#222631',
    fontSize: 18,
    fontWeight: '600',
  },

  emptyDescription: {
    marginTop: 7,
    color: '#95A3AD',
    fontSize: 14,
  },
});
