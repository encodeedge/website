import React, { useState, useEffect } from 'react';
import { Award, Clock, BookOpen, CheckCircle, ArrowRight, RotateCcw, Users, Sparkles } from 'lucide-react';
import { CourseCertificateModal } from '../interactive/CourseCertificateModal';

interface FlatItem {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface CourseProgressCardProps {
  courseId: string;
  flatItems: FlatItem[];
  totalDurationMinutes: number;
  courseTitle: string;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  courseId,
  flatItems,
  totalDurationMinutes,
  courseTitle,
}) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateProgress = () => {
      try {
        const stored = localStorage.getItem(`lms_completed_${courseId}`);
        if (stored) {
          setCompletedIds(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateProgress();
    window.addEventListener('lms_progress_updated', updateProgress);
    return () => window.removeEventListener('lms_progress_updated', updateProgress);
  }, [courseId]);

  const total = flatItems.length;
  const completedCount = completedIds.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Find next uncompleted item
  const nextItem = flatItems.find(item => !completedIds.includes(item.id)) || flatItems[0];

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your progress for this course?')) {
      localStorage.removeItem(`lms_completed_${courseId}`);
      setCompletedIds([]);
      window.dispatchEvent(new Event('lms_progress_updated'));
    }
  };

  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = totalDurationMinutes % 60;
  const durationString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <>
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Course Progress</span>
            <span className="font-bold text-foreground">{percent}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>{completedCount} of {total} items completed</span>
            {completedCount > 0 && (
              <button 
                onClick={handleReset}
                className="text-[11px] hover:text-foreground flex items-center gap-1 transition-colors"
                title="Reset progress"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Main Action Button */}
        <div className="space-y-2">
          {percent === 100 ? (
            <button 
              onClick={() => setShowCertModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>Claim Certificate 🏆</span>
            </button>
          ) : nextItem ? (
            <a href={nextItem.url} className="block w-full">
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-sm">
                <span>{completedCount === 0 ? 'Start Course' : 'Continue Learning'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          ) : (
            <button disabled className="w-full py-3 px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-sm">
              Course Complete! 🎉
            </button>
          )}

          {/* Certificate Preview trigger */}
          {percent < 100 && (
            <button
              onClick={() => setShowCertModal(true)}
              className="w-full text-center text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 pt-1"
            >
              <Award className="w-3.5 h-3.5" /> Preview Certificate of Completion
            </button>
          )}
        </div>

        {/* Course Features */}
        <div className="pt-4 border-t border-border/60 space-y-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Total Duration
            </span>
            <span className="font-semibold text-foreground">{durationString}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Curriculum
            </span>
            <span className="font-semibold text-foreground">{total} lessons & labs</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Certificate
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Included on completion</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Access
            </span>
            <span className="font-semibold text-foreground">Self-paced lifetime</span>
          </div>
        </div>

        {/* Live Batch Callout */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Prefer Live Mentorship?</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Join an upcoming live cohort for code reviews, weekly Q&amp;A, and capstone project critiques.
          </p>
          <a 
            href="/batches"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 pt-1"
          >
            View live cohorts →
          </a>
        </div>
      </div>

      <CourseCertificateModal
        courseId={courseId}
        courseTitle={courseTitle}
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />
    </>
  );
};
