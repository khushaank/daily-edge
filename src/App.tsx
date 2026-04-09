/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bolt, 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  History as HistoryIcon, 
  User,
  CheckCircle2,
  XCircle,
  RefreshCw,
  SkipForward,
  Trophy,
  TrendingUp,
  Dumbbell,
  Droplets,
  Accessibility,
  Ban,
  Footprints,
  BookOpen,
  Brain,
  PenLine,
  Puzzle,
  Podcast,
  Smartphone,
  Snowflake,
  AlarmClock,
  Briefcase,
  Eraser,
  Languages,
  Play,
  Wallet,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertTriangle,
  Download,
  Trash2,
  Camera,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { TASKS, CATEGORIES } from './constants';
import { AppState, UserTask, Task, Category } from './types';
import { getTodayDateString, formatDate, cn } from './lib/utils';

const ICON_MAP: Record<string, any> = {
  fitness_center: Dumbbell,
  water_drop: Droplets,
  accessibility: Accessibility,
  block: Ban,
  directions_walk: Footprints,
  menu_book: BookOpen,
  psychology: Brain,
  edit_note: PenLine,
  extension: Puzzle,
  podcasts: Podcast,
  phonelink_erase: Smartphone,
  ac_unit: Snowflake,
  alarm: AlarmClock,
  work_history: Briefcase,
  cleaning_services: Eraser,
  translate: Languages,
  smart_display: Play,
  event_note: CalendarIcon,
  payments: Wallet,
  person_add: UserPlus,
};

const STORAGE_KEY = 'daily_edge_state';

const INITIAL_STATE: AppState = {
  history: [],
  stats: {
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0
  },
  lastVisit: getTodayDateString()
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'history' | 'profile'>('dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Daily Task Initialization
  useEffect(() => {
    const today = getTodayDateString();
    const todayTask = state.history.find(h => h.date === today);

    if (!todayTask) {
      // Generate new task for today
      // Deterministic selection based on date to keep it consistent if they refresh
      const dateHash = today.split('-').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const category = CATEGORIES[dateHash % CATEGORIES.length];
      const categoryTasks = TASKS.filter(t => t.category === category);
      const task = categoryTasks[dateHash % categoryTasks.length];

      const newUserTask: UserTask = {
        date: today,
        taskId: task.id,
        completed: false,
        skipped: false,
        regenerated: false
      };

      setState(prev => ({
        ...prev,
        history: [newUserTask, ...prev.history],
        lastVisit: today
      }));
    }
  }, []);

  const todayTask = useMemo(() => {
    const today = getTodayDateString();
    const ut = state.history.find(h => h.date === today);
    if (!ut) return null;
    return {
      ...ut,
      details: TASKS.find(t => t.id === ut.taskId)!
    };
  }, [state.history]);

  const handleComplete = () => {
    if (!todayTask || todayTask.completed || todayTask.skipped) return;

    setState(prev => {
      const today = getTodayDateString();
      const newHistory = prev.history.map(h => 
        h.date === today ? { ...h, completed: true, completedAt: new Date().toISOString() } : h
      );

      // Update streaks
      let currentStreak = prev.stats.currentStreak + 1;
      let longestStreak = Math.max(prev.stats.longestStreak, currentStreak);

      return {
        ...prev,
        history: newHistory,
        stats: {
          currentStreak,
          longestStreak,
          totalCompleted: prev.stats.totalCompleted + 1
        }
      };
    });
  };

  const handleRegenerate = () => {
    if (!todayTask || todayTask.completed || todayTask.skipped || todayTask.regenerated) return;

    setState(prev => {
      const today = getTodayDateString();
      const currentTask = TASKS.find(t => t.id === todayTask.taskId)!;
      const otherTasks = TASKS.filter(t => t.category === currentTask.category && t.id !== currentTask.id);
      const newTask = otherTasks[Math.floor(Math.random() * otherTasks.length)];

      return {
        ...prev,
        history: prev.history.map(h => 
          h.date === today ? { ...h, taskId: newTask.id, regenerated: true } : h
        )
      };
    });
  };

  const handleSkip = () => {
    if (!todayTask || todayTask.completed || todayTask.skipped) return;

    setState(prev => {
      const today = getTodayDateString();
      return {
        ...prev,
        history: prev.history.map(h => h.date === today ? { ...h, skipped: true } : h),
        stats: {
          ...prev.stats,
          currentStreak: 0
        }
      };
    });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64 bg-background">
      {/* Header - Mobile Only */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/5 flex justify-between items-center px-6 h-16 lg:hidden">
        <div className="flex items-center gap-2">
          <Bolt className="text-accent w-5 h-5" fill="currentColor" />
          <h1 className="text-lg font-bold tracking-tight text-primary uppercase font-headline">DAILY EDGE</h1>
        </div>
        <div className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="text-on-surface-variant font-headline text-[9px] font-bold uppercase tracking-widest">STREAK</span>
          <span className="text-primary font-bold font-headline tracking-tight text-xs">{state.stats.currentStreak} DAYS</span>
        </div>
      </header>

      {/* Sidebar - Desktop Only */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-black/5 hidden lg:flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-16">
          <Bolt className="text-accent w-8 h-8" fill="currentColor" />
          <h1 className="text-2xl font-bold tracking-tight text-primary uppercase font-headline">DAILY EDGE</h1>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <SidebarNavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
          />
          <SidebarNavButton 
            active={activeTab === 'tracker'} 
            onClick={() => setActiveTab('tracker')} 
            icon={<CalendarIcon />} 
            label="Tracker" 
          />
          <SidebarNavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<HistoryIcon />} 
            label="History" 
          />
          <SidebarNavButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User />} 
            label="Profile" 
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-black/5">
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Current Streak</p>
              <p className="text-sm font-bold text-primary">{state.stats.currentStreak} Days</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="pt-24 lg:pt-16 px-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard 
              key="dashboard"
              todayTask={todayTask} 
              onComplete={handleComplete}
              onRegenerate={handleRegenerate}
              onSkip={handleSkip}
              stats={state.stats}
              history={state.history}
            />
          )}
          {activeTab === 'tracker' && (
            <Tracker 
              key="tracker"
              history={state.history}
              stats={state.stats}
            />
          )}
          {activeTab === 'history' && (
            <HistoryView 
              key="history"
              history={state.history}
            />
          )}
          {activeTab === 'profile' && (
            <Profile 
              key="profile"
              stats={state.stats}
              onClear={() => {
                if (window.confirm('Are you sure you want to clear all data?')) {
                  setState(INITIAL_STATE);
                }
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-2xl border-t border-black/5 flex justify-around items-center px-4 z-50 lg:hidden">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
        />
        <NavButton 
          active={activeTab === 'tracker'} 
          onClick={() => setActiveTab('tracker')} 
          icon={<CalendarIcon />} 
          label="Tracker" 
        />
        <NavButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<HistoryIcon />} 
          label="History" 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User />} 
          label="Profile" 
        />
      </nav>
    </div>
  );
}

function SidebarNavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left w-full",
        active ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-on-surface-variant hover:bg-black/5 hover:text-primary"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      <span className="font-headline text-sm font-semibold tracking-tight">{label}</span>
    </motion.button>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300 px-4 py-2 rounded-2xl",
        active ? "text-primary scale-105" : "text-on-surface-variant hover:text-primary"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: cn("w-5 h-5", active && "fill-current") 
      })}
      <span className="font-headline text-[9px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </motion.button>
  );
}

// --- Sub-components ---

function Dashboard({ todayTask, onComplete, onRegenerate, onSkip, stats, history }: any) {
  const Icon = todayTask?.details ? ICON_MAP[todayTask.details.icon] : Bolt;

  const weeklyProgress = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const record = history.find((h: any) => h.date === dStr);
      days.push(record?.completed ? 100 : 20);
    }
    return days;
  }, [history]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16"
    >
      {/* Reminder Banner */}
      {!todayTask?.completed && !todayTask?.skipped && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 luxury-card flex items-center gap-4 group border-accent/20 bg-accent/5"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-primary font-semibold text-sm italic">Your daily curation is ready for review.</p>
        </motion.div>
      )}

      {/* Today's Task */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 border border-accent text-accent text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
            {todayTask?.details.category || 'Daily'}
          </span>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Priority High</span>
        </div>

        <div className="luxury-card p-10 relative overflow-hidden bg-white">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10"
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          </div>

          <h2 className="text-5xl md:text-6xl leading-tight font-bold tracking-tight mb-8 text-primary">
            {todayTask?.details.title.split(' ')[0]} <i className="text-accent font-light">{todayTask?.details.title.split(' ').slice(1).join(' ')}</i>
          </h2>

          <div className="flex flex-wrap items-center gap-8 mb-12 text-on-surface-variant">
            <div className="flex items-center gap-3">
              <HistoryIcon className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">{todayTask?.details.duration}</span>
            </div>
            <div className="flex items-center gap-3">
              <Bolt className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">+{todayTask?.details.xp} XP</span>
            </div>
          </div>

          {todayTask?.completed ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary text-white p-8 rounded-xl flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
            >
              <CheckCircle2 className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight font-headline">Task Completed</span>
            </motion.div>
          ) : todayTask?.skipped ? (
            <div className="bg-black/5 text-on-surface-variant p-8 rounded-xl flex items-center justify-center gap-4">
              <XCircle className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight font-headline">Task Skipped</span>
            </div>
          ) : (
            <div className="space-y-6">
              <motion.button 
                onClick={onComplete}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 bg-primary text-white rounded-xl flex items-center justify-center gap-4 transition-all group relative shadow-2xl shadow-primary/30 hover:bg-primary/90"
              >
                <CheckCircle2 className="w-7 h-7" />
                <span className="font-bold text-xl tracking-tight font-headline">Mark as Done</span>
              </motion.button>

              <div className="grid grid-cols-2 gap-6">
                <motion.button 
                  onClick={onRegenerate}
                  disabled={todayTask?.regenerated}
                  whileHover={!todayTask?.regenerated ? { backgroundColor: 'rgba(0,0,0,0.02)' } : {}}
                  whileTap={!todayTask?.regenerated ? { scale: 0.95 } : {}}
                  className="h-16 border border-black/10 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-5 h-5 text-accent", !todayTask?.regenerated && "group-hover:rotate-180 transition-transform duration-500")} />
                  <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">
                    {todayTask?.regenerated ? 'Used' : 'Regenerate'}
                  </span>
                </motion.button>
                <motion.button 
                  onClick={onSkip}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 border border-black/10 rounded-xl flex items-center justify-center gap-3 transition-colors"
                >
                  <SkipForward className="w-5 h-5 text-accent" />
                  <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">Skip Task</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="md:col-span-3 luxury-card p-8 bg-white"
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-1">Weekly Performance</h3>
              <p className="text-2xl font-bold text-primary">Consistency Index</p>
            </div>
            <span className="text-accent font-black text-4xl tracking-tighter italic">
              {Math.round((weeklyProgress.filter(h => h === 100).length / 7) * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-end gap-3 h-32">
            {weeklyProgress.map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
                className={cn(
                  "w-full rounded-lg transition-all duration-700",
                  h === 100 ? "bg-primary shadow-lg shadow-primary/10" : "bg-black/5"
                )}
              />
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="luxury-card p-8 flex flex-col justify-between h-48 bg-white">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">Focus</h3>
          <div className="flex flex-col">
            <span className="text-primary font-bold text-4xl tracking-tight font-headline">MIND</span>
            <span className="text-accent text-[10px] uppercase font-bold tracking-widest mt-2">Next: 8PM</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="luxury-card p-8 flex flex-col justify-between h-48 overflow-hidden relative bg-white">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">Intensity</h3>
          <div className="flex flex-col">
            <span className="text-primary font-bold text-4xl tracking-tight font-headline">ELITE</span>
            <span className="text-accent text-[10px] uppercase font-bold tracking-widest mt-2">Top 5%</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="luxury-card p-8 flex flex-col justify-between h-48 bg-primary text-white">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Streak</h3>
          <div className="flex flex-col">
            <span className="font-bold text-5xl tracking-tighter font-headline">{stats.currentStreak}</span>
            <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest mt-2">Days of Focus</span>
          </div>
        </motion.div>
      </div>

      {/* Inspiration */}
      <div className="relative rounded-xl overflow-hidden h-64 group border border-black/5">
        <img 
          src="https://picsum.photos/seed/luxury/1200/600" 
          alt="Inspiration" 
          className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-primary font-headline italic font-medium tracking-tight text-3xl leading-tight max-w-md">
            "The edge is where you find yourself."
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px w-12 bg-accent"></div>
            <p className="text-accent text-[11px] font-bold uppercase tracking-[0.3em]">Daily Mantra</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Tracker({ history, stats }: any) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const getDayStatus = (day: number) => {
    const date = new Date(year, currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const today = getTodayDateString();
    
    if (dateStr > today) return 'future';
    
    const record = history.find((h: any) => h.date === dateStr);
    if (record?.completed) return 'completed';
    if (record?.skipped || (dateStr < today && !record)) return 'missed';
    return 'pending';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-16"
    >
      <section>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent font-headline">Monthly Performance</span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight mt-4">
          The Kinetic <br/><i className="text-accent font-light">Edge</i>
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -4 }} className="luxury-card p-8 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-2">This Month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-headline text-primary">{stats.totalCompleted}</span>
            <span className="text-on-surface-variant font-headline font-medium text-xl">/ {daysInMonth}</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 font-medium italic">Days Completed</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="luxury-card p-8 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-2">Best Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-headline text-accent">{stats.longestStreak}</span>
            <span className="text-on-surface-variant font-headline font-medium text-[10px] uppercase tracking-[0.2em]">DAYS</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 font-medium italic">All Time Record</p>
        </motion.div>
      </div>

      <section className="luxury-card p-10 bg-white">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">{monthName} {year}</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1 italic">82% Discipline achieved</p>
          </div>
          <div className="flex gap-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
            <span key={d} className="text-center text-[10px] font-bold uppercase text-on-surface-variant/40 tracking-[0.3em]">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-6 gap-x-2 justify-items-center">
          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const status = getDayStatus(day);
            const isToday = getTodayDateString() === new Date(year, currentMonth.getMonth(), day).toISOString().split('T')[0];

            return (
              <motion.div 
                key={day} 
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center relative transition-all cursor-default",
                  status === 'completed' && "bg-primary/10 text-primary",
                  status === 'missed' && "bg-red-500/10 text-red-500",
                  status === 'future' && "text-on-surface-variant/20",
                  status === 'pending' && "text-on-surface-variant",
                  isToday && "ring-2 ring-accent ring-offset-4 ring-offset-white"
                )}
              >
                <span className="text-sm font-bold">{day.toString().padStart(2, '0')}</span>
                {status === 'completed' && <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />}
                {status === 'missed' && <div className="absolute -bottom-2 w-1 h-1 bg-red-500 rounded-full" />}
              </motion.div>
            );
          })}
        </div>
      </section>

      <motion.div whileHover={{ y: -4 }} className="luxury-card p-8 flex items-center gap-8 bg-white">
        <div className="w-20 h-20 rounded-full border-[4px] border-primary/10 flex items-center justify-center relative">
          <svg className="w-full h-full -rotate-90">
            <circle className="text-primary" cx="40" cy="40" fill="none" r="36" stroke="currentColor" strokeDasharray="226" strokeDashoffset="40" strokeLinecap="round" strokeWidth="6"></circle>
          </svg>
          <span className="absolute text-sm font-bold font-headline">82%</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold tracking-tight font-headline mb-1 text-primary">Consistency Score</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed italic">Top 5% performer this month. Outstanding work.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HistoryView({ history }: any) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const filteredHistory = useMemo(() => {
    return history.filter((h: any) => {
      const task = TASKS.find(t => t.id === h.taskId)!;
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || task.category === filter;
      return matchesSearch && matchesFilter;
    }).sort((a: any, b: any) => b.date.localeCompare(a.date));
  }, [history, search, filter]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-12"
    >
      <section>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent font-headline">Archival Records</span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight mt-4">
          The Legacy <br/><i className="text-accent font-light">Vault</i>
        </h1>
      </section>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-6 luxury-card bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {['All', ...CATEGORIES].map(cat => (
            <motion.button 
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat as any)}
              className={cn(
                "px-6 h-14 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border",
                filter === cat 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white text-on-surface-variant border-black/5 hover:bg-black/5"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((h: any) => {
              const task = TASKS.find(t => t.id === h.taskId)!;
              const Icon = ICON_MAP[task.icon];
              return (
                <motion.div 
                  key={h.date}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ x: 4 }}
                  className="luxury-card p-6 flex items-center gap-6 group hover:border-accent/30 transition-all bg-white"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border",
                    h.completed ? "bg-primary/5 text-primary border-primary/10" : "bg-red-500/5 text-red-500 border-red-500/10"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{task.category}</span>
                      <span className="text-[10px] text-on-surface-variant/40">•</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{formatDate(h.date)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-primary truncate font-headline tracking-tight">{task.title}</h3>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-primary">+{task.xp} XP</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">{task.duration}</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="luxury-card p-20 flex flex-col items-center justify-center text-center bg-white"
            >
              <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center text-on-surface-variant mb-6">
                <HistoryIcon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-primary font-headline">No records found</h3>
              <p className="text-on-surface-variant mt-2 max-w-xs mx-auto text-sm italic">Your legacy is waiting to be written. Complete your first task today.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Profile({ stats, onClear }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16"
    >
      <section className="text-center">
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 rounded-full border border-black/5 p-1.5 bg-white shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Avatar" 
              className="w-full h-full rounded-full bg-primary/5 grayscale object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -bottom-1 -right-1 w-9 h-9 bg-accent text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg"
          >
            <Trophy className="w-4 h-4" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">The Curator</h1>
        <p className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mt-2 italic">Elite Status • Level 42</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Tasks" value={stats.totalCompleted} sub="Completed" />
        <StatCard label="Longest Streak" value={stats.longestStreak} sub="Days of Focus" color="text-accent" />
        <StatCard label="Current Streak" value={stats.currentStreak} sub="Active Momentum" color="text-primary" />
      </div>

      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] px-2">Notifications</h3>
        <div className="luxury-card overflow-hidden bg-white">
          <ToggleItem icon={<Bell />} title="Daily Reminder" sub="System check-in at 8:00 AM" active={true} />
          <ToggleItem icon={<AlertTriangle />} title="Streak at Risk" sub="Alert when focus session is missing" active={true} />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] px-2">Data & Privacy</h3>
        <div className="luxury-card overflow-hidden bg-white">
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
            className="w-full flex items-center justify-between p-6 transition-all group border-b border-black/5 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Download className="w-5 h-5" />
              </div>
              <span className="font-bold text-primary font-headline text-lg">Export Performance Data</span>
            </div>
            <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button 
            onClick={onClear}
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
            className="w-full flex items-center justify-between p-6 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-red-500 font-headline text-lg">Clear Local Storage</span>
            </div>
            <ChevronRight className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      <footer className="pt-12 pb-8 text-center">
        <p className="font-headline text-2xl font-bold tracking-tight text-primary/20 italic leading-tight max-w-sm mx-auto">
          'One small win a day leads to massive growth.'
        </p>
        <p className="text-[10px] text-on-surface-variant/30 font-bold uppercase tracking-[0.4em] mt-8">Daily Edge v2.0 • Established 2026</p>
      </footer>
    </motion.div>
  );
}

function StatCard({ label, value, sub, color = "text-primary" }: any) {
  return (
    <div className="luxury-card p-8 flex flex-col justify-between h-48 bg-white">
      <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">{label}</span>
      <div className="space-y-1">
        <span className={cn("font-headline font-bold text-5xl tracking-tighter block", color)}>{value}</span>
        <span className="text-on-surface-variant text-xs font-medium italic">{sub}</span>
      </div>
    </div>
  );
}

function ToggleItem({ icon, title, sub, active }: any) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-black/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
          {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
        <div>
          <span className="font-bold text-primary font-headline text-lg block">{title}</span>
          <span className="text-xs text-on-surface-variant">{sub}</span>
        </div>
      </div>
      <div className={cn(
        "w-12 h-6 rounded-full relative flex items-center px-1 transition-all duration-500",
        active ? "bg-primary" : "bg-black/10"
      )}>
        <div className={cn(
          "w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500",
          active ? "translate-x-6" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}

