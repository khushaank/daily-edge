export type Category = 'Health' | 'Mind' | 'Discipline' | 'Growth';

export interface Task {
  id: string;
  title: string;
  category: Category;
  duration: string;
  xp: number;
  icon: string;
}

export interface UserTask {
  date: string; // ISO date string (YYYY-MM-DD)
  taskId: string;
  completed: boolean;
  completedAt?: string;
  skipped: boolean;
  regenerated: boolean;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export interface AppState {
  history: UserTask[];
  stats: UserStats;
  lastVisit: string;
}
