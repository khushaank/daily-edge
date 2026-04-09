import { Task } from './types';

export const TASKS: Task[] = [
  // Health
  { id: 'h1', title: '20 Pushups', category: 'Health', duration: '5 MIN', xp: 50, icon: 'fitness_center' },
  { id: 'h2', title: 'Drink 2L Water', category: 'Health', duration: 'ALL DAY', xp: 40, icon: 'water_drop' },
  { id: 'h3', title: '10 Min Stretching', category: 'Health', duration: '10 MIN', xp: 30, icon: 'accessibility' },
  { id: 'h4', title: 'No Sugar Today', category: 'Health', duration: 'ALL DAY', xp: 60, icon: 'block' },
  { id: 'h5', title: 'Go for a 15m Walk', category: 'Health', duration: '15 MIN', xp: 40, icon: 'directions_walk' },
  
  // Mind
  { id: 'm1', title: 'Read 10 Pages', category: 'Mind', duration: '15 MIN', xp: 50, icon: 'menu_book' },
  { id: 'm2', title: 'Meditate 5 Min', category: 'Mind', duration: '5 MIN', xp: 30, icon: 'psychology' },
  { id: 'm3', title: 'Write 3 Gratitudes', category: 'Mind', duration: '5 MIN', xp: 40, icon: 'edit_note' },
  { id: 'm4', title: 'Solve a Puzzle', category: 'Mind', duration: '10 MIN', xp: 40, icon: 'extension' },
  { id: 'm5', title: 'Listen to a Podcast', category: 'Mind', duration: '20 MIN', xp: 30, icon: 'podcasts' },

  // Discipline
  { id: 'd1', title: 'No Social Media (2h)', category: 'Discipline', duration: '2 HR', xp: 70, icon: 'phonelink_erase' },
  { id: 'd2', title: 'Cold Shower', category: 'Discipline', duration: '3 MIN', xp: 80, icon: 'ac_unit' },
  { id: 'd3', title: 'Wake up at 6 AM', category: 'Discipline', duration: 'INSTANT', xp: 100, icon: 'alarm' },
  { id: 'd4', title: 'Deep Work (1h)', category: 'Discipline', duration: '1 HR', xp: 60, icon: 'work_history' },
  { id: 'd5', title: 'Clean Your Desk', category: 'Discipline', duration: '10 MIN', xp: 40, icon: 'cleaning_services' },

  // Growth
  { id: 'g1', title: 'Learn 5 New Words', category: 'Growth', duration: '10 MIN', xp: 50, icon: 'translate' },
  { id: 'g2', title: 'Watch a Tutorial', category: 'Growth', duration: '15 MIN', xp: 40, icon: 'smart_display' },
  { id: 'g3', title: 'Plan Tomorrow', category: 'Growth', duration: '5 MIN', xp: 30, icon: 'event_note' },
  { id: 'g4', title: 'Review Finances', category: 'Growth', duration: '15 MIN', xp: 50, icon: 'payments' },
  { id: 'g5', title: 'Connect with a Peer', category: 'Growth', duration: '10 MIN', xp: 60, icon: 'person_add' },
];

export const CATEGORIES = ['Health', 'Mind', 'Discipline', 'Growth'] as const;
