import type { Task } from '../types';

interface RemoteTodo {
  id: number;
  title: string;
  completed: boolean;
}

const ENDPOINT = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

interface SeedTemplate {
  title: string;
  description: string;
}

const SEED_TEMPLATES: ReadonlyArray<SeedTemplate> = [
  {
    title: 'Prepare quarterly review deck',
    description:
      'Pull together team metrics, key wins, and next-quarter priorities for Friday’s presentation.',
  },
  {
    title: 'Follow up with design partners',
    description:
      'Send a recap email summarising action items from the latest review session.',
  },
  {
    title: 'Review open pull requests',
    description:
      'Three PRs on the auth module are waiting for a final review before merge.',
  },
  {
    title: 'Plan sprint kickoff agenda',
    description:
      'Draft topics, assign owners, and circulate the agenda before Monday’s standup.',
  },
  {
    title: 'Refresh project documentation',
    description:
      'Update the README setup steps and document the new environment variables.',
  },
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function fetchSeedTasks(): Promise<Task[]> {
  const response = await fetch(ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch seed tasks: ${response.status}`);
  }
  const data = (await response.json()) as RemoteTodo[];
  const now = Date.now();
  return data.slice(0, SEED_TEMPLATES.length).map((todo, index) => {
    const template = SEED_TEMPLATES[index];
    return {
      id: `seed-${todo.id}`,
      title: template.title,
      description: template.description,
      status: todo.completed ? 'completed' : 'pending',
      createdAt: new Date(now - index * ONE_DAY_MS).toISOString(),
    };
  });
}
