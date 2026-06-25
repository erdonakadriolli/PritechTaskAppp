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
import { colors, radius, spacing } from '../theme';

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
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
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
            {liveErrors.title ? (
              <Text style={styles.errorText}>{liveErrors.title}</Text>
            ) : (
              <Text style={styles.helperText}>
                {title.trim().length}/{TITLE_MAX}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              accessibilityLabel="Task description"
              value={description}
              onChangeText={setDescription}
              placeholder="Optional details"
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
            {liveErrors.description ? (
              <Text style={styles.errorText}>{liveErrors.description}</Text>
            ) : (
              <Text style={styles.helperText}>
                {description.trim().length}/{DESCRIPTION_MAX}
              </Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <PrimaryButton
            label="Cancel"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
          <PrimaryButton label="Save task" onPress={handleSubmit} />
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
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 120,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
