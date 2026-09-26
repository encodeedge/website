import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Zap, ChevronUp, ChevronDown, Award, Crown, Medal, RefreshCw } from 'lucide-react';
import { getXP, computeXPState, getStreak } from '@/lib/achievements';

// ─── Types ───────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: string;
  streak: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  isMe?: boolean;
}

// ─── Mock leaderboard data with realistic learning data ──────────────────────
function generateLeaderboard(myXp: number, myLevel: string, myStreak: number): LeaderboardEntry[] {
  const others: Omit<LeaderboardEntry, 'rank'>[] = [
    { name: 'Priya S.', xp: 4850, level: 'Expert', streak: 21, lessonsCompleted: 48, quizzesPassed: 36 },
    { name: 'Jordan K.', xp: 4200, level: 'Expert', streak: 14, lessonsCompleted: 42, quizzesPassed: 31 },
    { name: 'Aisha M.', xp: 3750, level: 'Advanced', streak: 10, lessonsCompleted: 38, quizzesPassed: 28 },
    { name: 'Liang X.', xp: 3200, level: 'Advanced', streak: 8, lessonsCompleted: 32, quizzesPassed: 24 },
    { name: 'Sam P.', xp: 2800, level: 'Intermediate', streak: 7, lessonsCompleted: 28, quizzesPassed: 20 },
    { name: 'Fatima A.', xp: 2350, level: 'Intermediate', streak: 5, lessonsCompleted: 24, quizzesPassed: 17 },
    { name: 'Alex R.', xp: 1900, level: 'Beginner', streak: 4, lessonsCompleted: 19, quizzesPassed: 13 },
    { name: 'Maya T.', xp: 1450, level: 'Beginner', streak: 3, lessonsCompleted: 15, quizzesPassed: 10 },
    { name: 'Chris B.', xp: 980, level: 'Novice', streak: 2, lessonsCompleted: 10, quizzesPassed: 7 },
  ];

  // Get real completions count
  let lessonsCompleted = 0;
  let quizzesPassed = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('lms_completed_')) {
        try {
          const val = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(val)) { lessonsCompleted += val.length; }
          else if (val === true) { lessonsCompleted++; }
        } catch { /* noop */ }
      }
      if (key.startsWith('ee_quiz_history')) quizzesPassed++;
    }
  } catch { /* noop */ }

  const me: Omit<LeaderboardEntry, 'rank'> = {
    name: 'You',
    xp: myXp,
    level: myLevel,
    streak: myStreak,
    lessonsCompleted,
    quizzesPassed,
    isMe: true,
  };

  const all = [...others, me].sort((a, b) => b.xp - a.xp);
  return all.map((e, i) => ({ ...e, rank: i + 1 }));
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────
const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-400 shrink-0" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400 shrink-0" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-700 shrink-0" />;
  return <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{rank}</span>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
type Period = 'alltime' | 'weekly';

export const CourseLeaderboard = () => {
  const [period, setPeriod] = useState<Period>('alltime');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);

  const load = () => {
    try {
      const xp = getXP();
      const xpState = computeXPState(xp);
      const streak = getStreak();
      const board = generateLeaderboard(xp, xpState.levelName, streak.currentStreak);
      setEntries(board);
      setMyEntry(board.find(e => e.isMe) || null);
    } catch {
      const board = generateLeaderboard(0, 'Novice', 0);
      setEntries(board);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('ee_xp_updated', handler);
    return () => window.removeEventListener('ee_xp_updated', handler);
  }, []);

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" /> Leaderboard
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Top learners ranked by XP earned.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          {(['alltime', 'weekly'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${period === p ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'}`}
            >
              {p === 'alltime' ? '🏆 All Time' : '📅 This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Podium — Top 3 */}
      {podium.length >= 3 && (
        <div className="flex items-end justify-center gap-3 pt-4">
          {/* 2nd place */}
          <div className="flex flex-col items-center gap-2 pb-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-black text-slate-600">
              {podium[1].name.slice(0, 2)}
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-foreground">{podium[1].name}</div>
              <div className="text-[10px] text-muted-foreground">{podium[1].xp.toLocaleString()} XP</div>
            </div>
            <div className="w-20 h-16 rounded-t-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <Medal className="w-6 h-6 text-slate-400" />
            </div>
          </div>

          {/* 1st place */}
          <div className="flex flex-col items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-base font-black text-amber-700 dark:text-amber-300">
              {podium[0].name.slice(0, 2)}
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{podium[0].name}</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{podium[0].xp.toLocaleString()} XP</div>
            </div>
            <div className="w-20 h-24 rounded-t-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-amber-500" />
            </div>
          </div>

          {/* 3rd place */}
          <div className="flex flex-col items-center gap-2 pb-4">
            <div className="w-12 h-12 rounded-full border-4 border-amber-700/50 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 flex items-center justify-center text-sm font-black text-amber-800 dark:text-amber-400">
              {podium[2].name.slice(0, 2)}
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-foreground">{podium[2].name}</div>
              <div className="text-[10px] text-muted-foreground">{podium[2].xp.toLocaleString()} XP</div>
            </div>
            <div className="w-20 h-10 rounded-t-xl bg-amber-100/60 dark:bg-amber-900/20 flex items-center justify-center">
              <Medal className="w-5 h-5 text-amber-700" />
            </div>
          </div>
        </div>
      )}

      {/* Rest of the table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2.5 bg-muted/50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>#</span>
          <span>Learner</span>
          <span className="hidden sm:block text-right">Lessons</span>
          <span className="hidden sm:block text-right">Streak</span>
          <span className="text-right">XP</span>
        </div>

        {rest.map((entry) => (
          <div
            key={entry.rank}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 items-center px-4 py-3.5 border-b border-border/60 last:border-0 transition-colors ${
              entry.isMe ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/30'
            }`}
          >
            <RankBadge rank={entry.rank} />
            <div className="min-w-0">
              <div className={`text-sm font-bold truncate ${entry.isMe ? 'text-primary' : 'text-foreground'}`}>
                {entry.name} {entry.isMe && <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">YOU</span>}
              </div>
              <div className="text-[10px] text-muted-foreground">{entry.level}</div>
            </div>
            <span className="hidden sm:block text-xs text-muted-foreground text-right font-mono">{entry.lessonsCompleted}</span>
            <div className="hidden sm:flex items-center gap-1 justify-end">
              {entry.streak > 0 && <Flame className="w-3 h-3 text-orange-500" />}
              <span className="text-xs text-muted-foreground font-mono">{entry.streak}d</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Zap className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-foreground font-mono">{entry.xp.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My Position (if not in top visible) */}
      {myEntry && myEntry.rank > 6 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-primary/30 bg-primary/5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Star className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-foreground">Your rank: #{myEntry.rank}</div>
            <div className="text-xs text-muted-foreground">{myEntry.xp} XP · Keep learning to climb the board!</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground">{entries[myEntry.rank - 2]?.xp - myEntry.xp} XP ahead</div>
            <div className="text-[10px] text-muted-foreground">to reach #{myEntry.rank - 1}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLeaderboard;
