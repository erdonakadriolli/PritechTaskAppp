import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '../types';

const STORAGE_KEY = '@pritech-task-manager/tasks/v1';

export async function loadTasks(): Promise<Task[] | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw == null) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : null;
  } catch {
    return null;
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
