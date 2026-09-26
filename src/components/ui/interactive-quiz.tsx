import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './button';
import { CheckCircle2, AlertCircle, RotateCcw, Trophy, Sparkles, Brain, RefreshCw, Flame, Zap, Star } from 'lucide-react';
import {
  recordQuizAttempt,
  getWrongIndicesForQuiz,
  unlockAchievement,
  getStreak,
  computeXPState,
  getXP,
} from '@/lib/achievements';
import { trackQuizAttempt } from '@/lib/analytics';

type Question = {
  question: string;
  type?: 'mcq' | 'msq' | 'answer';
  options?: string[] | null;
  correctAnswer?: number | null;
  correctAnswers?: number[] | null;
  numericAnswer?: number | null;
  explanation?: string;
};

// ─── Achievement Toast ──────────────────────────────────────────────────────
const AchievementToast = () => {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const LABELS: Record<string, string> = {
      first_quiz: '🎯 First Blood unlocked!',
      perfect_quiz: '🏆 Perfect Score!',
      quiz_5: '📚 Quiz Veteran!',
      review_mode: '🔄 Second Chance!',
      review_perfect: '🧠 Mastered It!',
      roadmap_first_topic: '🚀 First Step!',
      roadmap_25: '🗺️ Quarter Way!',
      roadmap_50: '⚡ Halfway Hero!',
      roadmap_100: '🎓 Roadmap Complete!',
      streak_3: '🔥 3-Day Streak!',
      streak_7: '⚔️ Week Warrior!',
      streak_30: '💎 Monthly Master!',
      early_adopter: '🌟 Early Adopter!',
    };
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string;
      setLabel(LABELS[id] ?? '🎖️ Achievement Unlocked!');
      setVisible(true);
      setTimeout(() => setVisible(false), 3500);
    };
    window.addEventListener('ee_achievement_unlocked', handler);
    return () => window.removeEventListener('ee_achievement_unlocked', handler);
  }, []);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[10010] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-2xl flex items-center gap-2 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <Sparkles className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </div>
  );
};

// ─── XP Flash ───────────────────────────────────────────────────────────────
const XPFlash = ({ amount }: { amount: number | null }) => {
  if (!amount) return null;
  return (
    <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-in fade-in duration-300">
      +{amount} XP
    </div>
  );
};

// ─── Main Quiz Component ─────────────────────────────────────────────────────
export const InteractiveQuiz = ({
  questions,
  quizId,
  spacedRepetitionEnabled = true,
  gamificationEnabled = true,
}: {
  questions: Question[];
  quizId?: string;
  spacedRepetitionEnabled?: boolean;
  gamificationEnabled?: boolean;
}) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [correctResults, setCorrectResults] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Spaced repetition
  const [mode, setMode] = useState<'normal' | 'review'>('normal');
  const [reviewIndices, setReviewIndices] = useState<number[]>([]);
  const [reviewResults, setReviewResults] = useState<Record<number, boolean>>({});
  const [reviewCompleted, setReviewCompleted] = useState(false);

  // Streak / XP display
  const [currentStreak, setCurrentStreak] = useState(0);
  const [xpState, setXPState] = useState(() => {
    try { return computeXPState(getXP()); } catch { return computeXPState(0); }
  });

  // Track whether we've already recorded the attempt (avoid double-recording)
  const attemptRecorded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('course');
    if (cId) {
      setCourseId(cId);
      if (quizId) {
        try {
          const stored = localStorage.getItem(`lms_completed_${cId}`);
          if (stored) {
            const list: string[] = JSON.parse(stored);
            if (list.includes(quizId)) setIsCompleted(true);
          }
        } catch (e) { console.error(e); }
      }
    }
    try {
      const streak = getStreak();
      setCurrentStreak(streak.currentStreak);
    } catch { /* noop */ }

    const xpHandler = () => {
      try { setXPState(computeXPState(getXP())); } catch { /* noop */ }
    };
    window.addEventListener('ee_xp_updated', xpHandler);
    return () => window.removeEventListener('ee_xp_updated', xpHandler);
  }, [quizId]);

  // ── Handle quiz completion side-effects in useEffect (NOT inside setState updater) ──
  useEffect(() => {
    const answeredCount = Object.keys(correctResults).length;
    if (answeredCount !== questions.length || attemptRecorded.current) return;

    attemptRecorded.current = true;
    const totalCorrect = Object.values(correctResults).filter(Boolean).length;
    const wrongIndices = Object.entries(correctResults)
      .filter(([, v]) => !v)
      .map(([k]) => parseInt(k, 10));

    // Record in achievements
    if (quizId) {
      try {
        recordQuizAttempt({
          quizId,
          date: new Date().toISOString(),
          score: totalCorrect,
          total: questions.length,
          wrongIndices,
        });
        trackQuizAttempt(quizId, totalCorrect, questions.length, totalCorrect >= Math.ceil(questions.length * 0.7));
      } catch { /* noop */ }
    }

    // LMS completion (if all correct)
    if (totalCorrect === questions.length && courseId && quizId) {
      setIsCompleted(true);
      try {
        const stored = localStorage.getItem(`lms_completed_${courseId}`);
        let list: string[] = stored ? JSON.parse(stored) : [];
        if (!list.includes(quizId)) {
          list.push(quizId);
          localStorage.setItem(`lms_completed_${courseId}`, JSON.stringify(list));
          window.dispatchEvent(new Event('lms_progress_updated'));
        }
      } catch { /* noop */ }
    }

    // Update streak display
    try {
      const streak = getStreak();
      setCurrentStreak(streak.currentStreak);
    } catch { /* noop */ }
  }, [correctResults, questions.length, quizId, courseId]);

  // ── Simple, pure state updater (no side effects here) ───────────────────
  const handleQuestionResult = useCallback((index: number, correct: boolean) => {
    setCorrectResults(prev => ({ ...prev, [index]: correct }));
  }, []);

  const handleReviewResult = useCallback((questionIndex: number, correct: boolean) => {
    setReviewResults(prev => {
      const updated = { ...prev, [questionIndex]: correct };
      return updated;
    });
  }, []);

  // Detect review completion
  useEffect(() => {
    if (mode !== 'review' || reviewIndices.length === 0) return;
    if (Object.keys(reviewResults).length !== reviewIndices.length) return;

    const allCorrect = Object.values(reviewResults).every(Boolean);
    setReviewCompleted(true);
    try {
      unlockAchievement('review_mode');
      if (allCorrect) unlockAchievement('review_perfect');
      if (quizId) {
        recordQuizAttempt({
          quizId: `${quizId}_review`,
          date: new Date().toISOString(),
          score: Object.values(reviewResults).filter(Boolean).length,
          total: reviewIndices.length,
          wrongIndices: Object.entries(reviewResults).filter(([, v]) => !v).map(([k]) => parseInt(k, 10)),
        });
      }
    } catch { /* noop */ }
  }, [reviewResults, reviewIndices.length, mode, quizId]);

  const startReviewMode = () => {
    const wrong = quizId ? getWrongIndicesForQuiz(quizId) : [];
    const indices = wrong.length > 0
      ? wrong
      : Object.entries(correctResults).filter(([, v]) => !v).map(([k]) => parseInt(k, 10));
    if (indices.length === 0) return;
    setReviewIndices(indices);
    setReviewResults({});
    setReviewCompleted(false);
    attemptRecorded.current = false;
    setMode('review');
  };

  const resetQuiz = () => {
    setCorrectResults({});
    setIsCompleted(false);
    setMode('normal');
    setReviewResults({});
    setReviewCompleted(false);
    attemptRecorded.current = false;
  };

  const score = Object.values(correctResults).filter(Boolean).length;
  const answeredCount = Object.keys(correctResults).length;
  const wrongCount = Object.values(correctResults).filter(v => !v).length;
  const allAnswered = answeredCount === questions.length;
  const reviewScore = Object.values(reviewResults).filter(Boolean).length;

  const activeQuestions = mode === 'review'
    ? reviewIndices.map(i => questions[i])
    : questions;

  return (
    <>
      {gamificationEnabled && <AchievementToast />}

      <div className="space-y-8 mt-6">
        {/* ─── Quiz Header Bar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              {mode === 'review' ? <Brain className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {mode === 'review' ? 'Review Mode' : 'Checkpoint Score'}
              </div>
              <div className="text-base font-bold font-display text-foreground">
                {mode === 'review'
                  ? `${reviewScore} / ${reviewIndices.length} Correct`
                  : `${score} / ${questions.length} Correct`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* XP Level Badge */}
            {gamificationEnabled && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                <Star className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{xpState.levelName}</span>
                <span className="text-[10px] text-muted-foreground">({xpState.total} XP)</span>
              </div>
            )}

            {/* Streak Badge */}
            {gamificationEnabled && currentStreak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{currentStreak} day streak</span>
              </div>
            )}

            {/* Review Mode badge */}
            {spacedRepetitionEnabled && mode === 'review' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Brain className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Spaced Review · {reviewIndices.length} Qs</span>
              </div>
            )}

            {/* Completed badge */}
            {isCompleted && mode === 'normal' && (
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Quiz Complete & Saved!</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Review Mode completion screen ──────────────────────── */}
        {mode === 'review' && reviewCompleted && (
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 text-center space-y-4">
            <div className="text-4xl">{reviewScore === reviewIndices.length ? '🧠' : '🔄'}</div>
            <h3 className="text-xl font-bold font-display text-foreground">
              {reviewScore === reviewIndices.length ? 'Perfectly Reviewed!' : `${reviewScore}/${reviewIndices.length} Correct in Review`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {reviewScore === reviewIndices.length
                ? "You've mastered these topics through spaced repetition!"
                : 'Keep practicing — review again to strengthen your memory.'}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button onClick={resetQuiz} variant="outline" size="sm" className="gap-2">
                <RotateCcw className="w-3.5 h-3.5" /> Full Quiz Again
              </Button>
              {reviewScore < reviewIndices.length && (
                <Button onClick={() => { setReviewResults({}); setReviewCompleted(false); }} size="sm" className="gap-2">
                  <RefreshCw className="w-3.5 h-3.5" /> Review Again
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ─── Normal Mode: All Answered Summary ──────────────────── */}
        {mode === 'normal' && allAnswered && (
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            score === questions.length
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : wrongCount > 0
              ? 'border-amber-500/30 bg-amber-500/5'
              : 'border-border/60 bg-card'
          }`}>
            <div>
              <div className="text-lg font-bold font-display text-foreground">
                {score === questions.length
                  ? '🎉 Perfect! All correct!'
                  : `${score}/${questions.length} correct — keep going!`}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                +{score * 10 + (score === questions.length ? 25 : 0)} XP earned
                {wrongCount > 0 && ` · ${wrongCount} wrong answer${wrongCount > 1 ? 's' : ''}`}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={resetQuiz} variant="outline" size="sm" className="gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Retry All
              </Button>
              {spacedRepetitionEnabled && wrongCount > 0 && (
                <Button onClick={startReviewMode} size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-0">
                  <Brain className="w-3.5 h-3.5" /> Review Wrong ({wrongCount})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ─── Question Cards ──────────────────────────────────────── */}
        {!(mode === 'review' && reviewCompleted) && (
          <div className="space-y-6">
            {activeQuestions.map((q, displayIndex) => {
              const realIndex = mode === 'review' ? reviewIndices[displayIndex] : displayIndex;
              return (
                <QuestionItem
                  key={`${mode}-${realIndex}`}
                  q={q}
                  index={displayIndex}
                  isReview={mode === 'review'}
                  onResult={(correct) =>
                    mode === 'review'
                      ? handleReviewResult(realIndex, correct)
                      : handleQuestionResult(realIndex, correct)
                  }
                />
              );
            })}
          </div>
        )}

        {/* ─── Previous session wrong answers CTA ─────────────────── */}
        {spacedRepetitionEnabled && mode === 'normal' && !allAnswered && quizId && (() => {
          let prevWrong: number[] = [];
          try { prevWrong = getWrongIndicesForQuiz(quizId); } catch { /* noop */ }
          if (prevWrong.length === 0) return null;
          return (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <Brain className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">Previous session: {prevWrong.length} wrong answer{prevWrong.length > 1 ? 's' : ''}</div>
                <div className="text-xs text-muted-foreground">Jump into Review Mode to practice only those questions.</div>
              </div>
              <Button onClick={startReviewMode} size="sm" variant="outline" className="shrink-0 gap-1.5 text-blue-600 border-blue-500/30 hover:bg-blue-500/10">
                <Brain className="w-3.5 h-3.5" /> Review
              </Button>
            </div>
          );
        })()}
      </div>
    </>
  );
};

// ─── QuestionItem ────────────────────────────────────────────────────────────
const QuestionItem = ({
  q,
  index,
  isReview,
  onResult,
}: {
  q: Question;
  index: number;
  isReview: boolean;
  onResult: (correct: boolean) => void;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedMCQ, setSelectedMCQ] = useState<number | null>(null);
  const [selectedMSQ, setSelectedMSQ] = useState<number[]>([]);
  const [numericValue, setNumericValue] = useState<string>('');
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  // Track if we've reported to parent (so re-checking Try Again doesn't double-count)
  const reported = useRef(false);

  const type = q.type || 'mcq';

  const toggleMSQ = (optIndex: number) => {
    setSelectedMSQ(prev =>
      prev.includes(optIndex) ? prev.filter(i => i !== optIndex) : [...prev, optIndex]
    );
  };

  const checkIsCorrect = () => {
    if (type === 'mcq') return selectedMCQ === q.correctAnswer;
    if (type === 'msq') {
      const correct = q.correctAnswers || [];
      if (selectedMSQ.length !== correct.length) return false;
      return correct.every(c => selectedMSQ.includes(c));
    }
    if (type === 'answer') {
      return parseFloat(numericValue).toFixed(2) === (q.numericAnswer !== null && q.numericAnswer !== undefined ? q.numericAnswer.toFixed(2) : '');
    }
    return false;
  };

  const handleCheck = () => {
    const correct = checkIsCorrect();
    setShowAnswer(true);
    if (!reported.current) {
      onResult(correct);
      reported.current = true;
      setXpEarned(correct ? 10 : 0);
    }
  };

  const tryAgain = () => {
    setShowAnswer(false);
    setSelectedMCQ(null);
    setSelectedMSQ([]);
    setNumericValue('');
    setXpEarned(null);
    // Note: we don't reset reported — can't change the score for parent
  };

  const correct = showAnswer ? checkIsCorrect() : false;

  return (
    <div className={`p-6 bg-card border rounded-2xl shadow-sm space-y-4 transition-all ${
      isReview ? 'border-blue-500/30 ring-1 ring-blue-500/10' : 'border-border/80'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold font-display text-foreground leading-snug">
          <span className={`mr-2 ${isReview ? 'text-blue-500' : 'text-primary'}`}>
            {isReview ? '🔄' : `Q${index + 1}.`}
          </span>
          {q.question}
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded-full uppercase tracking-wider text-muted-foreground shrink-0 border border-border">
          {type}
        </span>
      </div>

      <div className="space-y-2.5 pt-2">
        {type === 'mcq' && q.options?.map((opt, optIndex) => (
          <div
            key={optIndex}
            onClick={() => !showAnswer && setSelectedMCQ(optIndex)}
            className={`flex items-center p-3.5 border rounded-xl transition-all cursor-pointer text-sm select-none ${
              showAnswer
                ? optIndex === q.correctAnswer
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-medium'
                  : selectedMCQ === optIndex
                  ? 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-100'
                  : 'border-border opacity-60'
                : selectedMCQ === optIndex
                ? 'border-primary bg-primary/10 text-foreground font-medium shadow-sm'
                : 'border-border/80 hover:bg-muted/50 text-foreground hover:border-primary/40'
            }`}
          >
            <div className={`mr-3 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              selectedMCQ === optIndex ? 'border-primary' : 'border-muted-foreground/40'
            }`}>
              {selectedMCQ === optIndex && <div className="w-2 h-2 bg-primary rounded-full" />}
            </div>
            <span className="flex-1">{opt}</span>
            {showAnswer && optIndex === q.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
            {showAnswer && selectedMCQ === optIndex && optIndex !== q.correctAnswer && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />}
          </div>
        ))}

        {type === 'msq' && q.options?.map((opt, optIndex) => (
          <div
            key={optIndex}
            onClick={() => !showAnswer && toggleMSQ(optIndex)}
            className={`flex items-center p-3.5 border rounded-xl transition-all cursor-pointer text-sm select-none ${
              showAnswer
                ? (q.correctAnswers || []).includes(optIndex)
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-medium'
                  : selectedMSQ.includes(optIndex)
                  ? 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-100'
                  : 'border-border opacity-60'
                : selectedMSQ.includes(optIndex)
                ? 'border-primary bg-primary/10 text-foreground font-medium shadow-sm'
                : 'border-border/80 hover:bg-muted/50 text-foreground hover:border-primary/40'
            }`}
          >
            <div className={`mr-3 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
              selectedMSQ.includes(optIndex) ? 'border-primary bg-primary' : 'border-muted-foreground/40'
            }`}>
              {selectedMSQ.includes(optIndex) && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
            </div>
            <span className="flex-1">{opt}</span>
          </div>
        ))}

        {type === 'answer' && (
          <input
            type="number"
            step="any"
            disabled={showAnswer}
            value={numericValue}
            onChange={(e) => setNumericValue(e.target.value)}
            placeholder="Enter numeric decimal answer..."
            className="w-full p-3 border rounded-xl bg-background text-foreground text-sm font-mono focus:ring-2 focus:ring-primary/40 focus:outline-none disabled:opacity-60"
          />
        )}
      </div>

      <div className="pt-3 border-t border-border/60">
        {!showAnswer ? (
          <Button
            onClick={handleCheck}
            size="sm"
            disabled={
              (type === 'mcq' && selectedMCQ === null) ||
              (type === 'msq' && selectedMSQ.length === 0) ||
              (type === 'answer' && !numericValue)
            }
          >
            Check Answer
          </Button>
        ) : (
          <div className="space-y-3 animate-in fade-in">
            <div className={`font-bold text-sm flex items-center gap-2 ${correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {correct ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{correct ? 'Correct!' : 'Incorrect.'}</span>
              {xpEarned !== null && xpEarned > 0 && <XPFlash amount={xpEarned} />}
            </div>

            {!correct && (
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Correct Answer: </span>
                {type === 'mcq' && q.options && q.correctAnswer !== null && q.correctAnswer !== undefined && q.options[q.correctAnswer]}
                {type === 'msq' && q.options && q.correctAnswers && q.correctAnswers.map(c => q.options![c]).join(', ')}
                {type === 'answer' && q.numericAnswer !== null && q.numericAnswer !== undefined && q.numericAnswer.toFixed(2)}
              </div>
            )}

            {q.explanation && (
              <div className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/40 leading-relaxed">
                <span className="font-semibold text-foreground">Explanation: </span>
                {q.explanation}
              </div>
            )}

            <Button onClick={tryAgain} variant="ghost" size="sm" className="text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
