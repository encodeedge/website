import React, { useState, useEffect } from 'react';
import { Layers, X, CheckCircle2, PlayCircle, FileText, HelpCircle, Briefcase, ChevronRight } from 'lucide-react';

type FlatItem = {
  id: string;
  type: string;
  url: string;
  chapterTitle: string;
  title?: string;
};

type CourseMap = {
  [courseId: string]: {
    title: string;
    flatItems: FlatItem[];
  };
};

interface LessonCurriculumDrawerProps {
  coursesMap: CourseMap;
  currentItemId: string;
  itemType: string;
}

export const LessonCurriculumDrawer: React.FC<LessonCurriculumDrawerProps> = ({
  coursesMap,
  currentItemId,
  itemType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('course');
    if (cId && coursesMap[cId]) {
      setCourseId(cId);
      try {
        const stored = localStorage.getItem(`lms_completed_${cId}`);
        if (stored) {
          setCompletedIds(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [coursesMap]);

  useEffect(() => {
    const handleUpdate = () => {
      if (courseId) {
        try {
          const stored = localStorage.getItem(`lms_completed_${courseId}`);
          if (stored) {
            setCompletedIds(JSON.parse(stored));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener('lms_progress_updated', handleUpdate);
    return () => window.removeEventListener('lms_progress_updated', handleUpdate);
  }, [courseId]);

  if (!courseId || !coursesMap[courseId]) return null;

  const course = coursesMap[courseId];
  const items = course.flatItems;
  const total = items.length;
  const completedCount = completedIds.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Group items by chapterTitle
  const chapters: { title: string; items: FlatItem[] }[] = [];
  items.forEach(item => {
    let ch = chapters.find(c => c.title === item.chapterTitle);
    if (!ch) {
      ch = { title: item.chapterTitle, items: [] };
      chapters.push(ch);
    }
    ch.items.push(item);
  });

  const getItemIcon = (type: string) => {
    if (type === 'quiz') return <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    if (type === 'assignment') return <Briefcase className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    return <PlayCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted/60 transition-colors shadow-sm"
      >
        <Layers className="w-3.5 h-3.5 text-primary" />
        <span>Course Syllabus ({completedCount}/{total})</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-250"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="space-y-1 pr-3 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Course Syllabus
                </span>
                <h3 className="text-base font-bold font-display text-foreground truncate">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">{percent}% done</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Syllabus List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-border/40">
              {chapters.map((ch, chIdx) => (
                <div key={chIdx} className="pt-3 first:pt-0 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                    {ch.title}
                  </h4>
                  <div className="space-y-1">
                    {ch.items.map((item, itemIdx) => {
                      const isCurrent = item.id === currentItemId && item.type === itemType;
                      const isDone = completedIds.includes(item.id);

                      return (
                        <a
                          key={itemIdx}
                          href={item.url}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                            isCurrent
                              ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                              : 'hover:bg-muted/50 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              getItemIcon(item.type)
                            )}
                            <span className="capitalize text-[10px] text-muted-foreground shrink-0 px-1.5 py-0.5 rounded bg-muted/80">
                              {item.type}
                            </span>
                            <span className="truncate">{item.id.replace(/-/g, ' ')}</span>
                          </div>

                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center text-xs">
              <a 
                href={`/courses/${courseId}`} 
                className="text-primary hover:underline font-semibold"
              >
                ← Course Overview
              </a>
              <span className="text-muted-foreground">{completedCount} of {total} completed</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

