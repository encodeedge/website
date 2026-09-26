// ─── Achievements & Gamification Library ───────────────────────────────────
// Handles: quiz streaks, roadmap badges, localStorage persistence,
// unlock detection, and the shared event bus.

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'quiz' | 'roadmap' | 'streak' | 'milestone';
  earnedAt?: number; // unix ms timestamp, set when unlocked
}

// ─── Badge Definitions ─────────────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  // Quiz-based
  {
    id: 'first_quiz',
    title: 'First Blood',
    description: 'Complete your first quiz',
    emoji: '🎯',
    category: 'quiz',
  },
  {
    id: 'perfect_quiz',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    emoji: '🏆',
    category: 'quiz',
  },
  {
    id: 'quiz_5',
    title: 'Quiz Veteran',
    description: 'Complete 5 different quizzes',
    emoji: '📚',
    category: 'quiz',
  },
  {
    id: 'review_mode',
    title: 'Second Chance',
    description: 'Complete a Review Mode session',
    emoji: '🔄',
    category: 'quiz',
  },
  {
    id: 'review_perfect',
    title: 'Mastered It',
    description: 'Get 100% in a Review Mode session',
    emoji: '🧠',
    category: 'quiz',
  },

  // Roadmap-based
  {
    id: 'roadmap_first_topic',
    title: 'First Step',
    description: 'Complete your first roadmap topic',
    emoji: '🚀',
    category: 'roadmap',
  },
  {
    id: 'roadmap_25',
    title: 'Quarter Way',
    description: 'Complete 25% of any roadmap',
    emoji: '🗺️',
    category: 'roadmap',
  },
  {
    id: 'roadmap_50',
    title: 'Halfway Hero',
    description: 'Complete 50% of any roadmap',
    emoji: '⚡',
    category: 'roadmap',
  },
  {
    id: 'roadmap_100',
    title: 'Roadmap Complete',
    description: 'Complete 100% of any roadmap',
    emoji: '🎓',
    category: 'roadmap',
  },

  // Streak-based
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: '3-day learning streak',
    emoji: '🔥',
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: '7-day learning streak',
    emoji: '⚔️',
    category: 'streak',
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: '30-day learning streak',
    emoji: '💎',
    category: 'streak',
  },

  // Milestones
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'One of the first learners on Encode Edge',
    emoji: '🌟',
    category: 'milestone',
  },
];

// ─── localStorage Keys ──────────────────────────────────────────────────────
const STORAGE_KEY_ACHIEVEMENTS = 'ee_achievements';
const STORAGE_KEY_STREAK = 'ee_streak';
const STORAGE_KEY_QUIZ_HISTORY = 'ee_quiz_history';
const STORAGE_KEY_XP = 'ee_xp';

// ─── Persistence Helpers ────────────────────────────────────────────────────
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function safeSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {/* ignore */}
}

// ─── Achievement State ──────────────────────────────────────────────────────
export function getEarnedAchievements(): Achievement[] {
  const earned: Record<string, number> = safeGet(STORAGE_KEY_ACHIEVEMENTS, {});
  return ACHIEVEMENTS.map(a => ({
    ...a,
    earnedAt: earned[a.id],
  }));
}

export function isAchievementEarned(id: string): boolean {
  const earned: Record<string, number> = safeGet(STORAGE_KEY_ACHIEVEMENTS, {});
  return !!earned[id];
}

/** Unlock an achievement. Returns true if it was newly unlocked. */
export function unlockAchievement(id: string): boolean {
  const earned: Record<string, number> = safeGet(STORAGE_KEY_ACHIEVEMENTS, {});
  if (earned[id]) return false; // Already earned
  earned[id] = Date.now();
  safeSet(STORAGE_KEY_ACHIEVEMENTS, earned);
  // Fire global event for toast notifications
  window.dispatchEvent(new CustomEvent('ee_achievement_unlocked', { detail: { id } }));
  return true;
}

// ─── XP System ─────────────────────────────────────────────────────────────
export interface XPState {
  total: number;
  level: number;
  levelName: string;
  progressToNext: number; // 0–100
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
const LEVEL_NAMES = ['Novice', 'Apprentice', 'Learner', 'Practitioner', 'Analyst', 'Engineer', 'Expert', 'Mentor', 'Scholar', 'Grand Master'];

export function getXP(): number {
  return safeGet<number>(STORAGE_KEY_XP, 0);
}

export function addXP(amount: number): XPState {
  const current = getXP();
  const next = current + amount;
  safeSet(STORAGE_KEY_XP, next);
  window.dispatchEvent(new CustomEvent('ee_xp_updated', { detail: { xp: next, added: amount } }));
  return computeXPState(next);
}

export function computeXPState(total: number): XPState {
  let level = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (total >= LEVEL_THRESHOLDS[i]) { level = i; break; }
  }
  const currentThreshold = LEVEL_THRESHOLDS[level] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] ?? currentThreshold + 10000;
  const progressToNext = Math.min(100, Math.round(((total - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
  return {
    total,
    level,
    levelName: LEVEL_NAMES[level] ?? 'Grand Master',
    progressToNext,
  };
}

// ─── Streak System ──────────────────────────────────────────────────────────
export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // 'YYYY-MM-DD'
  todayActive: boolean;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreak(): StreakState {
  return safeGet<StreakState>(STORAGE_KEY_STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    todayActive: false,
  });
}

/** Call this whenever the user does any learning activity. */
export function recordActivity(): StreakState {
  const state = getStreak();
  const today = todayStr();
  if (state.lastActivityDate === today) return state; // Already counted today

  let newStreak = 1;
  if (state.lastActivityDate === yesterdayStr()) {
    newStreak = state.currentStreak + 1; // Extend streak
  }
  const updated: StreakState = {
    currentStreak: newStreak,
    longestStreak: Math.max(state.longestStreak, newStreak),
    lastActivityDate: today,
    todayActive: true,
  };
  safeSet(STORAGE_KEY_STREAK, updated);

  // Check streak achievements
  if (newStreak >= 3) unlockAchievement('streak_3');
  if (newStreak >= 7) unlockAchievement('streak_7');
  if (newStreak >= 30) unlockAchievement('streak_30');
  if (newStreak === 1 && !state.lastActivityDate) unlockAchievement('early_adopter');

  window.dispatchEvent(new CustomEvent('ee_streak_updated', { detail: updated }));
  return updated;
}

// ─── Quiz History (for spaced repetition) ──────────────────────────────────
export interface QuizAttempt {
  quizId: string;
  date: string; // ISO
  score: number;
  total: number;
  wrongIndices: number[]; // indices of incorrect questions
}

export function getQuizHistory(): QuizAttempt[] {
  return safeGet<QuizAttempt[]>(STORAGE_KEY_QUIZ_HISTORY, []);
}

export function recordQuizAttempt(attempt: QuizAttempt) {
  const history = getQuizHistory();
  // Keep last 20 attempts per quiz
  const filtered = history.filter(h => h.quizId !== attempt.quizId).slice(0, 100);
  filtered.unshift(attempt);
  safeSet(STORAGE_KEY_QUIZ_HISTORY, filtered);

  // Record activity for streak
  recordActivity();

  // XP: 10 per correct + 25 bonus for perfect
  const xpEarned = attempt.score * 10 + (attempt.score === attempt.total ? 25 : 0);
  addXP(xpEarned);

  // Unlock quiz achievements
  const allHistory = getQuizHistory();
  const uniqueQuizIds = new Set(allHistory.map(h => h.quizId));

  if (uniqueQuizIds.size >= 1) unlockAchievement('first_quiz');
  if (uniqueQuizIds.size >= 5) unlockAchievement('quiz_5');
  if (attempt.score === attempt.total) unlockAchievement('perfect_quiz');
}

/** Get wrong question indices for the most recent attempt of a quiz */
export function getWrongIndicesForQuiz(quizId: string): number[] {
  const history = getQuizHistory();
  const last = history.find(h => h.quizId === quizId);
  return last?.wrongIndices ?? [];
}

// ─── Roadmap Achievement Triggers ───────────────────────────────────────────
export function checkRoadmapAchievements(completedCount: number, totalCount: number) {
  recordActivity();
  if (completedCount >= 1) unlockAchievement('roadmap_first_topic');
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  if (pct >= 25) unlockAchievement('roadmap_25');
  if (pct >= 50) unlockAchievement('roadmap_50');
  if (pct >= 100) unlockAchievement('roadmap_100');
}
