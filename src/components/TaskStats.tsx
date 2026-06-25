import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

interface TaskStatsProps {
  total: number;
  completed: number;
}

export function TaskStats({ total, completed }: TaskStatsProps) {
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <View style={[styles.container, shadow.sm]}>
      <View style={styles.cell}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="list" size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.value}>{total}</Text>
          <Text style={styles.label}>Total</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cell}>
        <View style={[styles.iconWrap, { backgroundColor: colors.warningSoft }]}>
          <Ionicons name="hourglass-outline" size={18} color={colors.warning} />
        </View>
        <View>
          <Text style={styles.value}>{pending}</Text>
          <Text style={styles.label}>Active</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cell}>
        <View style={[styles.iconWrap, { backgroundColor: colors.successSoft }]}>
          <Ionicons name="checkmark-done" size={18} color={colors.success} />
        </View>
        <View>
          <Text style={styles.value}>{percent}%</Text>
          <Text style={styles.label}>Done</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xs,
  },
});
