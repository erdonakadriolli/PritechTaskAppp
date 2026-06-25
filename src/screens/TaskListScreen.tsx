import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { Fab } from '../components/Fab';
import { FilterTabs } from '../components/FilterTabs';
import { SearchBar } from '../components/SearchBar';
import { TaskItem } from '../components/TaskItem';
import { TaskStats } from '../components/TaskStats';
import { useTasks } from '../context/TasksContext';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import type { TaskFilter } from '../types';

export function TaskListScreen({ navigation }: RootStackScreenProps<'TaskList'>) {
  const { tasks, ready, seedError, toggleTask } = useTasks();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return {
      all: tasks.length,
      pending: tasks.length - completed,
      completed,
    };
  }, [tasks]);

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
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello 👋</Text>
        <Text style={styles.subtitle}>
          {counts.pending > 0
            ? `You have ${counts.pending} task${counts.pending === 1 ? '' : 's'} to complete`
            : 'All caught up. Nice work!'}
        </Text>
      </View>

      <View style={styles.controls}>
        <TaskStats total={counts.all} completed={counts.completed} />
        <SearchBar value={query} onChange={setQuery} />
        <FilterTabs value={filter} onChange={setFilter} counts={counts} />
        {seedError && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Couldn’t fetch sample tasks ({seedError}). You can still add your own.
            </Text>
          </View>
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
              icon="rocket-outline"
              title="No tasks yet"
              message="Tap the + button to create your first task."
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title="No matching tasks"
              message="Try a different search term or filter."
            />
          )
        }
      />

      <Fab
        accessibilityLabel="Add task"
        onPress={() => navigation.navigate('AddTask')}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  banner: {
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: 12,
  },
  bannerText: {
    color: colors.warning,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    paddingTop: spacing.sm,
  },
  emptyContent: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm + 2,
  },
});
