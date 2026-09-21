import React, { useState, useEffect } from 'react';
import { Flame, Zap, Award, Sparkles, Trophy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp: number;
}

const BADGES: Badge[] = [
  { id: 'first-step', title: 'First Step', description: 'Completed your first interactive lesson', icon: '🌱', requiredXp: 100 },
  { id: 'quiz-solver', title: 'Checkpoint Ace', description: 'Passed your first checkpoint quiz', icon: '🎯', requiredXp: 250 },
  { id: 'perceptron', title: 'Neural Architect', description: 'Mastered neural forward & backprop mechanics', icon: '🧠', requiredXp: 500 },
  { id: 'optimizer', title: 'Gradient Pioneer', description: 'Optimized high-dimensional loss landscapes', icon: '⚡', requiredXp: 800 },
  { id: 'full-mastery', title: 'Production Ready', description: 'Completed a full course & capstone project', icon: '🏆', requiredXp: 1200 },
];

export const LearnerGamificationBar: React.FC = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [streakDays, setStreakDays] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    try {
      // Calculate total completed items from localStorage
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('lms_completed_')) {
          if (localStorage.getItem(key) === 'true') {
            count++;
          }
        }
      }
      setCompletedCount(count);

      // Simple streak simulation based on last visit
      const lastVisit = localStorage.getItem('lms_last_active_date');
      const today = new Date().toDateString();
      if (!lastVisit) {
        localStorage.setItem('lms_last_active_date', today);
        localStorage.setItem('lms_streak_days', '1');
        setStreakDays(1);
      } else {
        const storedStreak = parseInt(localStorage.getItem('lms_streak_days') || '3', 10);
        setStreakDays(storedStreak);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Compute XP points: 100 XP per completed item, baseline 150
  const xp = (completedCount * 120) + 150;
  
  // Calculate Level (every 500 XP = 1 Level)
  const level = Math.floor(xp / 500) + 1;
  const xpInCurrentLevel = xp % 500;
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));

  const unlockedBadges = BADGES.filter(b => xp >= b.requiredXp);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xs shadow-xs overflow-hidden transition-all">
      <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Streak & Level Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold shadow-2xs">
            <Flame className="size-4 fill-current animate-pulse" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-display text-foreground">
              Level {level}
            </span>
            <div className="w-20 sm:w-28 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {xp} XP
            </span>
          </div>
        </div>

        {/* Right: Badges Counter & Accordion Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trophy className="size-3.5 text-amber-500" />
            <span>{unlockedBadges.length} / {BADGES.length} Badges</span>
            {isExpanded ? <ChevronUp className="size-3 text-muted-foreground" /> : <ChevronDown className="size-3 text-muted-foreground" />}
          </button>
        </div>

      </div>

      {/* Expandable Badges Tray */}
      {isExpanded && (
        <div className="p-4 border-t border-border/60 bg-muted/20 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Milestone Badges &amp; Unlocks
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {BADGES.map(badge => {
              const isUnlocked = xp >= badge.requiredXp;
              return (
                <div
                  key={badge.id}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isUnlocked
                      ? 'border-primary/40 bg-card shadow-xs'
                      : 'border-border/40 bg-muted/30 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-bold font-display text-foreground truncate">{badge.title}</div>
                  <div className="text-[10px] text-muted-foreground">{badge.requiredXp} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

