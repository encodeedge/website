import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { trackLessonCompletion } from '@/lib/analytics';
import { persistentStorage } from '@/lib/storage';

interface LessonCompletionToggleProps {
  itemId: string;
  courseId?: string;
  coursesMap?: Record<string, any>;
}

export const LessonCompletionToggle: React.FC<LessonCompletionToggleProps> = ({ 
  itemId, 
  courseId: initialCourseId,
  coursesMap
}) => {
  const [effectiveCourseId, setEffectiveCourseId] = useState<string | null>(initialCourseId || null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    let cId = initialCourseId;

    if (!cId && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      cId = params.get('course') || undefined;
    }

    if (!cId && coursesMap) {
      cId = Object.keys(coursesMap).find(id => 
        coursesMap[id]?.flatItems?.some((i: any) => i.id === itemId)
      );
    }

    if (cId) {
      setEffectiveCourseId(cId);

      // Check synchronous cache & localStorage
      const syncList = persistentStorage.getSync<string[]>(`lms_completed_${cId}`, []);
      if (Array.isArray(syncList) && syncList.includes(itemId)) {
        setIsCompleted(true);
      } else if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`lms_completed_${cId}`);
          if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list) && list.includes(itemId)) {
              setIsCompleted(true);
            }
          }
        } catch {}
      }

      // Reconcile with IndexedDB asynchronously
      persistentStorage.get<string[]>(`lms_completed_${cId}`, []).then((list) => {
        if (Array.isArray(list)) {
          setIsCompleted(list.includes(itemId));
        }
      }).catch(() => {});
    }
  }, [itemId, initialCourseId, coursesMap]);

  // Listen to external progress updates
  useEffect(() => {
    if (!effectiveCourseId) return;

    const handleUpdate = () => {
      const list = persistentStorage.getSync<string[]>(`lms_completed_${effectiveCourseId}`, []);
      if (Array.isArray(list)) {
        setIsCompleted(list.includes(itemId));
      }
    };

    window.addEventListener('lms_progress_updated', handleUpdate);
    return () => window.removeEventListener('lms_progress_updated', handleUpdate);
  }, [effectiveCourseId, itemId]);

  const toggle = async () => {
    if (!effectiveCourseId) return;

    try {
      const list = await persistentStorage.get<string[]>(`lms_completed_${effectiveCourseId}`, []) || [];
      let updatedList: string[];

      if (list.includes(itemId)) {
        updatedList = list.filter(id => id !== itemId);
        setIsCompleted(false);
      } else {
        updatedList = [...list, itemId];
        setIsCompleted(true);
        trackLessonCompletion(effectiveCourseId, itemId);
      }

      await persistentStorage.set(`lms_completed_${effectiveCourseId}`, updatedList);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lms_completed_${effectiveCourseId}`, JSON.stringify(updatedList));
      }

      window.dispatchEvent(new CustomEvent('lms_progress_updated', {
        detail: { courseId: effectiveCourseId, itemId }
      }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to toggle lesson completion:', e);
    }
  };

  return (
    <button
      onClick={toggle}
      type="button"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border shadow-xs cursor-pointer select-none ${
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

export default LessonCompletionToggle;
