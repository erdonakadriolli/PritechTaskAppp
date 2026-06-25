import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function TaskItem({ task, onPress, onToggle }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        shadow.sm,
        pressed && styles.rowPressed,
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        onPress={onToggle}
        hitSlop={12}
        style={[styles.checkbox, isCompleted && styles.checkboxChecked]}
      >
        {isCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </Pressable>
      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[styles.title, isCompleted && styles.titleCompleted]}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          {task.description.length > 0 && (
            <Text numberOfLines={1} style={styles.description}>
              {task.description}
            </Text>
          )}
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={11} color={colors.textMuted} />
            <Text style={styles.dateText}>{formatRelativeDate(task.createdAt)}</Text>
          </View>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  rowPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  description: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 'auto',
  },
});
