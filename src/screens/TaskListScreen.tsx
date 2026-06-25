import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { FilterTabs } from '../components/FilterTabs';
import { SearchBar } from '../components/SearchBar';
import { TaskItem } from '../components/TaskItem';
import { useTasks } from '../context/TasksContext';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, spacing } from '../theme';
import type { TaskFilter } from '../types';

export function TaskListScreen({ navigation }: RootStackScreenProps<'TaskList'>) {
  const { tasks, ready, seedError, toggleTask } = useTasks();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task"
          onPress={() => navigation.navigate('AddTask')}
          hitSlop={8}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
        >
          <Text style={styles.addButtonLabel}>＋</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((task) => {
      if (filter !== 'all' && task.status !== filter) return false;
      if (q.length > 0 && !task.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, query, filter]);

  if (!ready) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingLabel}>Loading your tasks…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.controls}>
        <SearchBar value={query} onChange={setQuery} />
        <FilterTabs value={filter} onChange={setFilter} />
        {seedError && (
          <Text style={styles.seedError}>
            Couldn’t fetch sample tasks ({seedError}). You can still add your own.
          </Text>
        )}
      </View>
      <FlatList
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={
          visibleTasks.length === 0 ? styles.emptyContent : styles.listContent
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggle={() => toggleTask(item.id)}
          />
        )}
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              message="Tap ＋ in the top right to add your first task."
            />
          ) : (
            <EmptyState
              title="No matching tasks"
              message="Try a different search term or filter."
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  seedError: {
    color: colors.warning,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContent: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
  addButton: {
    paddingHorizontal: spacing.sm,
  },
  addButtonPressed: {
    opacity: 0.6,
  },
  addButtonLabel: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '600',
    lineHeight: 30,
  },
});
