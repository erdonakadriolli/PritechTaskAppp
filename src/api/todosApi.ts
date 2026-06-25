import type { Task } from '../types';

interface RemoteTodo {
  id: number;
  title: string;
  completed: boolean;
}

const ENDPOINT = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

export async function fetchSeedTasks(): Promise<Task[]> {
  const response = await fetch(ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch seed tasks: ${response.status}`);
  }
  const data = (await response.json()) as RemoteTodo[];
  const now = new Date().toISOString();
  return data.map((todo) => ({
    id: `seed-${todo.id}`,
    title: todo.title,
    description: 'Imported from JSONPlaceholder on first launch.',
    status: todo.completed ? 'completed' : 'pending',
    createdAt: now,
  }));
}
