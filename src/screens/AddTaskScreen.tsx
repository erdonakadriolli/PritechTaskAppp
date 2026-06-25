import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTasks } from '../context/TasksContext';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, radius, shadow, spacing, typography } from '../theme';

const TITLE_MAX = 80;
const DESCRIPTION_MAX = 280;

interface FormErrors {
  title?: string;
  description?: string;
}

function validate(title: string, description: string): FormErrors {
  const errors: FormErrors = {};
  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 2) {
    errors.title = 'Title must be at least 2 characters.';
  } else if (trimmedTitle.length > TITLE_MAX) {
    errors.title = `Title must be at most ${TITLE_MAX} characters.`;
  }
  if (description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX} characters.`;
  }
  return errors;
}

export function AddTaskScreen({ navigation }: RootStackScreenProps<'AddTask'>) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const liveErrors = submitted ? validate(title, description) : errors;

  const handleSubmit = () => {
    const nextErrors = validate(title, description);
    setSubmitted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    addTask({ title, description });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </View>
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Create a new task</Text>
              <Text style={styles.introSubtitle}>
                Add details below — title is required.
              </Text>
            </View>
          </View>

          <View style={[styles.field, shadow.sm]}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.required}>Required</Text>
            </View>
            <TextInput
              accessibilityLabel="Task title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Buy groceries"
              placeholderTextColor={colors.textMuted}
              maxLength={TITLE_MAX + 1}
              style={[styles.input, liveErrors.title && styles.inputError]}
              returnKeyType="next"
            />
            <View style={styles.helperRow}>
              {liveErrors.title ? (
                <Text style={styles.errorText}>{liveErrors.title}</Text>
              ) : (
                <View />
              )}
              <Text style={styles.counter}>
                {title.trim().length}/{TITLE_MAX}
              </Text>
            </View>
          </View>

          <View style={[styles.field, shadow.sm]}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.optional}>Optional</Text>
            </View>
            <TextInput
              accessibilityLabel="Task description"
              value={description}
              onChangeText={setDescription}
              placeholder="Add a few details to remember later…"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              maxLength={DESCRIPTION_MAX + 1}
              style={[
                styles.input,
                styles.inputMultiline,
                liveErrors.description && styles.inputError,
              ]}
              textAlignVertical="top"
            />
            <View style={styles.helperRow}>
              {liveErrors.description ? (
                <Text style={styles.errorText}>{liveErrors.description}</Text>
              ) : (
                <View />
              )}
              <Text style={styles.counter}>
                {description.trim().length}/{DESCRIPTION_MAX}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <PrimaryButton
            label="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            label="Save task"
            icon="checkmark"
            onPress={handleSubmit}
            style={{ flex: 1.4 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  intro: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  introIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    ...typography.h2,
    color: colors.text,
  },
  introSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  field: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography.h3,
    color: colors.text,
  },
  required: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  optional: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 130,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '500',
  },
  counter: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
});
