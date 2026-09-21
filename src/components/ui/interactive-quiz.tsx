import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { CheckCircle2, AlertCircle, RotateCcw, Trophy, Sparkles } from 'lucide-react';

type Question = {
  question: string;
  type?: 'mcq' | 'msq' | 'answer';
  options?: string[] | null;
  correctAnswer?: number | null;
  correctAnswers?: number[] | null;
  numericAnswer?: number | null;
  explanation?: string;
};

export const InteractiveQuiz = ({ questions, quizId }: { questions: Question[]; quizId?: string }) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [correctResults, setCorrectResults] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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
            if (list.includes(quizId)) {
              setIsCompleted(true);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [quizId]);

  const handleQuestionResult = (index: number, correct: boolean) => {
    setCorrectResults(prev => {
      const updated = { ...prev, [index]: correct };
      // Check if all questions have been answered correctly
      const totalAnswered = Object.keys(updated).length;
      const totalCorrect = Object.values(updated).filter(Boolean).length;

      if (totalAnswered === questions.length && totalCorrect === questions.length && courseId && quizId) {
        setIsCompleted(true);
        try {
          const stored = localStorage.getItem(`lms_completed_${courseId}`);
          let list: string[] = stored ? JSON.parse(stored) : [];
          if (!list.includes(quizId)) {
            list.push(quizId);
            localStorage.setItem(`lms_completed_${courseId}`, JSON.stringify(list));
            window.dispatchEvent(new Event('lms_progress_updated'));
          }
        } catch (e) {
          console.error(e);
        }
      }
      return updated;
    });
  };

  const score = Object.values(correctResults).filter(Boolean).length;
  const answeredCount = Object.keys(correctResults).length;

  return (
    <div className="space-y-8 mt-6">
      { /* Quiz Progress Header */ }
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/80 shadow-sm flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Checkpoint Score
            </div>
            <div className="text-base font-bold font-display text-foreground">
              {score} / {questions.length} Correct
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Quiz Complete &amp; Saved!</span>
          </div>
        )}
      </div>

      { /* Question Cards */ }
      <div className="space-y-6">
        {questions.map((q, index) => (
          <QuestionItem 
            key={index} 
            q={q} 
            index={index} 
            onResult={(correct) => handleQuestionResult(index, correct)}
          />
        ))}
      </div>
    </div>
  );
};

const QuestionItem = ({ 
  q, 
  index, 
  onResult 
}: { 
  q: Question; 
  index: number;
  onResult: (correct: boolean) => void;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedMCQ, setSelectedMCQ] = useState<number | null>(null);
  const [selectedMSQ, setSelectedMSQ] = useState<number[]>([]);
  const [numericValue, setNumericValue] = useState<string>('');

  const type = q.type || 'mcq';

  const toggleMSQ = (optIndex: number) => {
    setSelectedMSQ(prev =>
      prev.includes(optIndex)
        ? prev.filter(i => i !== optIndex)
        : [...prev, optIndex]
    );
  };

  const isCorrect = () => {
    if (type === 'mcq') {
      return selectedMCQ === q.correctAnswer;
    } else if (type === 'msq') {
      const correct = q.correctAnswers || [];
      if (selectedMSQ.length !== correct.length) return false;
      return correct.every(c => selectedMSQ.includes(c));
    } else if (type === 'answer') {
      return parseFloat(numericValue).toFixed(2) === (q.numericAnswer !== null && q.numericAnswer !== undefined ? q.numericAnswer.toFixed(2) : '');
    }
    return false;
  };

  const handleCheck = () => {
    setShowAnswer(true);
    onResult(isCorrect());
  };

  return (
    <div className="p-6 bg-card border border-border/80 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold font-display text-foreground leading-snug">
          <span className="text-primary mr-2">Q{index + 1}.</span> {q.question}
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
            className={`flex items-center p-3.5 border rounded-xl transition-all cursor-pointer text-sm ${
              showAnswer 
                ? optIndex === q.correctAnswer 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-medium' 
                  : selectedMCQ === optIndex 
                    ? 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-100'
                    : 'border-border opacity-70'
                : selectedMCQ === optIndex
                  ? 'border-primary bg-primary/10 text-foreground font-medium shadow-sm'
                  : 'border-border/80 hover:bg-muted/50 text-foreground'
            }`}
          >
            <div className={`mr-3 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedMCQ === optIndex ? 'border-primary' : 'border-muted-foreground'}`}>
              {selectedMCQ === optIndex && <div className="w-2 h-2 bg-primary rounded-full" />}
            </div>
            <span className="flex-1">{opt}</span>
          </div>
        ))}

        {type === 'msq' && q.options?.map((opt, optIndex) => (
          <div
            key={optIndex}
            onClick={() => !showAnswer && toggleMSQ(optIndex)}
            className={`flex items-center p-3.5 border rounded-xl transition-all cursor-pointer text-sm ${
              showAnswer 
                ? (q.correctAnswers || []).includes(optIndex)
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-medium' 
                  : selectedMSQ.includes(optIndex)
                    ? 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-100'
                    : 'border-border opacity-70'
                : selectedMSQ.includes(optIndex)
                  ? 'border-primary bg-primary/10 text-foreground font-medium shadow-sm'
                  : 'border-border/80 hover:bg-muted/50 text-foreground'
            }`}
          >
            <div className={`mr-3 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedMSQ.includes(optIndex) ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
              {selectedMSQ.includes(optIndex) && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
            </div>
            <span className="flex-1">{opt}</span>
          </div>
        ))}

        {type === 'answer' && (
          <div className="space-y-2">
            <input
              type="number"
              step="any"
              disabled={showAnswer}
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              placeholder="Enter numeric decimal answer..."
              className="w-full p-3 border rounded-xl bg-background text-foreground text-sm font-mono focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/60">
        {!showAnswer ? (
          <Button 
            onClick={handleCheck} 
            size="sm"
            disabled={type === 'mcq' && selectedMCQ === null || type === 'msq' && selectedMSQ.length === 0 || type === 'answer' && !numericValue}
          >
            Check Answer
          </Button>
        ) : (
          <div className="space-y-3 animate-in fade-in">
            <div className={`font-bold text-sm flex items-center gap-1.5 ${isCorrect() ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isCorrect() ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{isCorrect() ? 'Correct!' : 'Incorrect.'}</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Correct Answer: </span>
              {type === 'mcq' && q.options && q.correctAnswer !== null && q.correctAnswer !== undefined && q.options[q.correctAnswer]}
              {type === 'msq' && q.options && q.correctAnswers && q.correctAnswers.map(c => q.options![c]).join(', ')}
              {type === 'answer' && q.numericAnswer !== null && q.numericAnswer !== undefined && q.numericAnswer.toFixed(2)}
            </div>
            
            {q.explanation && (
              <div className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/40 leading-relaxed">
                <span className="font-semibold text-foreground">Explanation: </span> 
                {q.explanation}
              </div>
            )}

            <Button onClick={() => {
              setShowAnswer(false);
              setSelectedMCQ(null);
              setSelectedMSQ([]);
              setNumericValue('');
            }} variant="ghost" size="sm" className="text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
