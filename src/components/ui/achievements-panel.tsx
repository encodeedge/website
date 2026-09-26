import React, { useState, useEffect } from 'react';
import {
  getEarnedAchievements,
  ACHIEVEMENTS,
  computeXPState,
  getXP,
  getStreak,
  getQuizHistory,
  type Achievement,
  type XPState,
  type StreakState,
} from '@/lib/achievements';
import { Trophy, Star, Flame, Zap, Lock, ChevronDown, X, Award } from 'lucide-react';

// ─── Mini Floating Trigger Button ──────────────────────────────────────────
export const AchievementsTrigger = () => {
  const [open, setOpen] = useState(false);
  const [xpState, setXPState] = useState<XPState>(() => computeXPState(getXP()));
  const [streak, setStreak] = useState<StreakState>(() => getStreak());
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const onXP = () => setXPState(computeXPState(getXP()));
    const onStreak = (e: Event) => setStreak((e as CustomEvent).detail as StreakState);
    const onAchievement = () => setNewCount(c => c + 1);
    const onRoadmapProgress = (e: Event) => {
      const { completedCount, totalCount } = (e as CustomEvent).detail as { completedCount: number; totalCount: number; percent: number };
      // Dynamically import to avoid SSR issues
      import('@/lib/achievements').then(({ checkRoadmapAchievements }) => {
        checkRoadmapAchievements(completedCount, totalCount);
      });
    };

    window.addEventListener('ee_xp_updated', onXP);
    window.addEventListener('ee_streak_updated', onStreak);
    window.addEventListener('ee_achievement_unlocked', onAchievement);
    window.addEventListener('ee_roadmap_progress', onRoadmapProgress);
    return () => {
      window.removeEventListener('ee_xp_updated', onXP);
      window.removeEventListener('ee_streak_updated', onStreak);
      window.removeEventListener('ee_achievement_unlocked', onAchievement);
      window.removeEventListener('ee_roadmap_progress', onRoadmapProgress);
    };
  }, []);

  const clearNew = () => setNewCount(0);

  return (
    <>
      {/* Floating Trigger — bottom-LEFT so it doesn't clash with the Study Progress pill (bottom-right) */}
      <button
        onClick={() => { setOpen(true); clearNew(); }}
        className="fixed bottom-6 left-6 z-[9990] flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-zinc-900 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/10"
        aria-label="Open Achievements"
      >
        <div className="relative">
          <Trophy className="w-4 h-4 text-amber-400" />
          {newCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {newCount}
            </span>
          )}
        </div>
        <div className="text-left">
          <div className="text-xs font-bold leading-none">{xpState.levelName}</div>
          <div className="text-[10px] text-slate-400 leading-none mt-0.5">{xpState.total} XP</div>
        </div>
        {streak.currentStreak > 0 && (
          <div className="flex items-center gap-1 pl-2 border-l border-white/10">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-bold text-orange-300">{streak.currentStreak}</span>
          </div>
        )}
      </button>

      {/* Panel */}
      {open && <AchievementsPanel onClose={() => setOpen(false)} />}
    </>
  );
};

// ─── Full Achievements Panel ────────────────────────────────────────────────
const AchievementsPanel = ({ onClose }: { onClose: () => void }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [xpState, setXPState] = useState<XPState>(() => computeXPState(getXP()));
  const [streak, setStreak] = useState<StreakState>(() => getStreak());
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  useEffect(() => {
    setAchievements(getEarnedAchievements());
    const onXP = () => { setXPState(computeXPState(getXP())); };
    const onAch = () => { setAchievements(getEarnedAchievements()); };
    window.addEventListener('ee_xp_updated', onXP);
    window.addEventListener('ee_achievement_unlocked', onAch);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('ee_xp_updated', onXP);
      window.removeEventListener('ee_achievement_unlocked', onAch);
    };
  }, []);

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const lockedAchievements = achievements.filter(a => !a.earnedAt);
  const quizHistory = getQuizHistory().filter(h => !h.quizId.includes('_review'));
  const totalCorrect = quizHistory.reduce((sum, h) => sum + h.score, 0);
  const totalQuestions = quizHistory.reduce((sum, h) => sum + h.total, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const displayed = filter === 'all'
    ? achievements
    : filter === 'earned'
    ? earnedAchievements
    : lockedAchievements;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6"
      onClick={handleBackdrop}
    >
      <div className="w-full sm:w-[400px] max-h-[92vh] bg-background border border-border rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-base font-display text-foreground">Achievements</h2>
              <p className="text-xs text-muted-foreground">{earnedAchievements.length} / {ACHIEVEMENTS.length} unlocked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* XP & Stats Strip */}
        <div className="p-4 border-b border-border shrink-0 space-y-3">
          {/* Level + XP bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-bold text-foreground">{xpState.levelName}</span>
              <span className="text-xs text-muted-foreground">Lv.{xpState.level}</span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{xpState.total} XP</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${xpState.progressToNext}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground text-right">{xpState.progressToNext}% to next level</div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="text-center p-2.5 rounded-xl bg-muted/60">
              <div className="text-base font-bold text-foreground font-display">{streak.currentStreak}</div>
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-orange-400" /> Day Streak
              </div>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-muted/60">
              <div className="text-base font-bold text-foreground font-display">{quizHistory.length}</div>
              <div className="text-[10px] text-muted-foreground font-semibold">Quizzes Done</div>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-muted/60">
              <div className="text-base font-bold text-foreground font-display">{accuracy}%</div>
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-0.5">
                <Zap className="w-3 h-3 text-emerald-400" /> Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-3 border-b border-border shrink-0">
          {(['all', 'earned', 'locked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {f === 'earned' ? `Earned (${earnedAchievements.length})` : f === 'locked' ? `Locked (${lockedAchievements.length})` : 'All'}
            </button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {displayed.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">No achievements here yet</p>
              <p className="text-xs mt-1">Complete quizzes and roadmap topics to earn badges!</p>
            </div>
          )}
          {displayed.map(achievement => (
            <AchievementRow key={achievement.id} achievement={achievement} />
          ))}
        </div>

        {/* Close button */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-semibold text-muted-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Single Achievement Row ─────────────────────────────────────────────────
const AchievementRow = ({ achievement }: { achievement: Achievement }) => {
  const earned = !!achievement.earnedAt;
  const CATEGORY_COLOR: Record<string, string> = {
    quiz: 'bg-blue-500/10 text-blue-500',
    roadmap: 'bg-emerald-500/10 text-emerald-500',
    streak: 'bg-orange-500/10 text-orange-500',
    milestone: 'bg-violet-500/10 text-violet-500',
  };

  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
      earned
        ? 'border-border/80 bg-card'
        : 'border-dashed border-border/40 bg-muted/30 opacity-60'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
        earned ? '' : 'grayscale'
      }`}>
        {earned ? achievement.emoji : <Lock className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground truncate">{achievement.title}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLOR[achievement.category]}`}>
            {achievement.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
        {earned && achievement.earnedAt && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      {earned && (
        <div className="shrink-0">
          <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export { AchievementsPanel };
