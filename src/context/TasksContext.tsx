import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchSeedTasks } from '../api/todosApi';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import type { Task } from '../types';

interface AddTaskInput {
  title: string;
  description: string;
}

interface TasksContextValue {
  tasks: Task[];
  ready: boolean;
  seedError: string | null;
  addTask: (input: AddTaskInput) => Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await loadTasks();
        if (cancelled) return;
        if (stored && stored.length > 0) {
          setTasks(stored);
        } else {
          try {
            const seeded = await fetchSeedTasks();
            if (cancelled) return;
            setTasks(seeded);
          } catch (err) {
            if (cancelled) return;
            setSeedError(err instanceof Error ? err.message : 'Unknown error');
            setTasks([]);
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveTasks(tasks).catch(() => {
      // Persistence is best-effort; surfacing this would require a toast system.
    });
  }, [tasks, ready]);

  const addTask = useCallback((input: AddTaskInput): Task => {
    const task: Task = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
            }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const getTaskById = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks]
  );

  const value = useMemo<TasksContextValue>(
    () => ({ tasks, ready, seedError, addTask, toggleTask, deleteTask, getTaskById }),
    [tasks, ready, seedError, addTask, toggleTask, deleteTask, getTaskById]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used inside a TasksProvider');
  }
  return ctx;
}
