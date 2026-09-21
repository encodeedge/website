import React, { useState, useEffect } from 'react';
import { PlayCircle, FileText, HelpCircle, Briefcase, CheckCircle2, ChevronDown, Clock, FlaskConical } from 'lucide-react';

export type CurriculumItem = {
  id: string;
  type: 'lesson' | 'quiz' | 'assignment';
  title: string;
  lessonType?: string;
  duration?: number;
  url: string;
};

export type Chapter = {
  title: string;
  description?: string;
  items: CurriculumItem[];
};

interface CourseCurriculumAccordionProps {
  courseId: string;
  chapters: Chapter[];
}

export const CourseCurriculumAccordion: React.FC<CourseCurriculumAccordionProps> = ({ courseId, chapters }) => {
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({ 0: true });
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`course_progress_${courseId}`);
      if (stored) {
        setCompletedItems(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, [courseId]);

  const toggleChapter = (idx: number) => {
    setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getItemIcon = (type: string, lessonType?: string) => {
    if (type === 'quiz') {
      return <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />;
    }
    if (type === 'assignment') {
      return <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />;
    }
    if (lessonType === 'video') {
      return <PlayCircle className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    if (lessonType === 'lab') {
      return <FlaskConical className="w-4 h-4 text-cyan-500 shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-emerald-500 shrink-0" />;
  };

  const getItemBadge = (type: string, lessonType?: string) => {
    if (type === 'quiz') {
      return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">Quiz</span>;
    }
    if (type === 'assignment') {
      return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">Project</span>;
    }
    if (lessonType === 'video') {
      return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">Video</span>;
    }
    if (lessonType === 'lab') {
      return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/40">Lab</span>;
    }
    return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">Article</span>;
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter, chIdx) => {
        const isOpen = openChapters[chIdx] ?? false;
        const totalItems = chapter.items.length;
        const finishedInChapter = chapter.items.filter(item => completedItems.includes(item.id)).length;

        return (
          <div 
            key={chIdx} 
            className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all shadow-sm"
          >
            <button
              onClick={() => toggleChapter(chIdx)}
              className="w-full flex items-center justify-between p-5 text-left bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Chapter {chIdx + 1}
                  </span>
                  {finishedInChapter === totalItems && totalItems > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  {chapter.title}
                </h3>
                {chapter.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {chapter.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border">
                  {finishedInChapter}/{totalItems} done
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isOpen && (
              <div className="divide-y divide-border/60 border-t border-border/60 bg-background/50">
                {chapter.items.map((item, itemIdx) => {
                  const isDone = completedItems.includes(item.id);

                  return (
                    <div 
                      key={itemIdx}
                      className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                        <div className="shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            getItemIcon(item.type, item.lessonType)
                          )}
                        </div>

                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          {getItemBadge(item.type, item.lessonType)}
                          <a 
                            href={item.url}
                            className={`text-sm font-medium hover:underline truncate group-hover:text-primary transition-colors ${
                              isDone ? 'text-muted-foreground' : 'text-foreground'
                            }`}
                          >
                            {item.title}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {item.duration && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {item.duration} min
                          </span>
                        )}
                        <a 
                          href={item.url}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                        >
                          {isDone ? 'Review' : 'Start →'}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

