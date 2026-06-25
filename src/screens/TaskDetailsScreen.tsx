import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTasks } from '../context/TasksContext';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { confirm } from '../utils/confirm';

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function TaskDetailsScreen({
  route,
  navigation,
}: RootStackScreenProps<'TaskDetails'>) {
  const { taskId } = route.params;
  const { getTaskById, toggleTask, deleteTask } = useTasks();
  const task = getTaskById(taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.missing}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.missingText}>This task no longer exists.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'completed';

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete task',
      message: 'This task will be removed permanently.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    navigation.goBack();
    deleteTask(task.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, shadow.sm]}>
          <View
            style={[
              styles.statusPill,
              isCompleted ? styles.pillDone : styles.pillPending,
            ]}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={isCompleted ? colors.success : colors.warning}
            />
            <Text
              style={[
                styles.statusText,
                isCompleted ? styles.statusTextDone : styles.statusTextPending,
              ]}
            >
              {isCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>

          <Text style={styles.title}>{task.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.meta}>Created {formatDate(task.createdAt)}</Text>
          </View>
        </View>

        <View style={[styles.card, shadow.sm]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          {task.description.length > 0 ? (
            <Text style={styles.description}>{task.description}</Text>
          ) : (
            <Text style={[styles.description, styles.descriptionEmpty]}>
              No description provided.
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <PrimaryButton
          label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          icon={isCompleted ? 'refresh' : 'checkmark-circle'}
          onPress={() => toggleTask(task.id)}
        />
        <PrimaryButton
          label="Delete task"
          icon="trash"
          variant="danger"
          onPress={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  missingText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  pillPending: {
    backgroundColor: colors.warningSoft,
  },
  pillDone: {
    backgroundColor: colors.successSoft,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTextPending: {
    color: colors.warning,
  },
  statusTextDone: {
    color: colors.success,
  },
  title: {
    ...typography.h2,
    fontSize: 24,
    color: colors.text,
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
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
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
});
