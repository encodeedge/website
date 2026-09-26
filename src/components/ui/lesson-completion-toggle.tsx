import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { trackLessonCompletion } from '@/lib/analytics';

interface LessonCompletionToggleProps {
  itemId: string;
}

export const LessonCompletionToggle: React.FC<LessonCompletionToggleProps> = ({ itemId }) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('course');
    if (cId) {
      setCourseId(cId);
      try {
        const stored = localStorage.getItem(`lms_completed_${cId}`);
        if (stored) {
          const list: string[] = JSON.parse(stored);
          setIsCompleted(list.includes(itemId));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [itemId]);

  if (!courseId) return null;

  const toggle = () => {
    try {
      const stored = localStorage.getItem(`lms_completed_${courseId}`);
      let list: string[] = stored ? JSON.parse(stored) : [];

      if (list.includes(itemId)) {
        list = list.filter(id => id !== itemId);
        setIsCompleted(false);
      } else {
        list.push(itemId);
        setIsCompleted(true);
        trackLessonCompletion(courseId, itemId);
      }

      localStorage.setItem(`lms_completed_${courseId}`, JSON.stringify(list));
      window.dispatchEvent(new Event('lms_progress_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
        isCompleted
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Completed</span>
        </>
      ) : (
        <>
          <Circle className="w-4 h-4 text-muted-foreground" />
          <span>Mark as Complete</span>
        </>
      )}
    </button>
  );
};

