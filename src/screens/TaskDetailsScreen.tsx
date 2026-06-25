import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTasks } from '../context/TasksContext';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, radius, spacing } from '../theme';

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

export function TaskDetailsScreen({
  route,
  navigation,
}: RootStackScreenProps<'TaskDetails'>) {
  const { taskId } = route.params;
  const { getTaskById, toggleTask, deleteTask } = useTasks();
  const task = getTaskById(taskId);

  useEffect(() => {
    if (!task) {
      navigation.goBack();
    }
  }, [task, navigation]);

  if (!task) return null;

  const isCompleted = task.status === 'completed';

  const handleDelete = () => {
    Alert.alert('Delete task', 'This task will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.statusPill, isCompleted ? styles.pillDone : styles.pillPending]}>
          <Text style={[styles.statusText, isCompleted && styles.statusTextDone]}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.metaLabel}>Created</Text>
        <Text style={styles.meta}>{formatDate(task.createdAt)}</Text>

        <Text style={styles.metaLabel}>Description</Text>
        {task.description.length > 0 ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : (
          <Text style={[styles.description, styles.descriptionEmpty]}>
            No description provided.
          </Text>
        )}
      </ScrollView>
      <View style={styles.actions}>
        <PrimaryButton
          label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          onPress={() => toggleTask(task.id)}
        />
        <PrimaryButton label="Delete task" variant="danger" onPress={handleDelete} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  pillPending: {
    backgroundColor: '#FEF3C7',
  },
  pillDone: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTextDone: {
    color: colors.success,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
  },
  meta: {
    fontSize: 15,
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  descriptionEmpty: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
