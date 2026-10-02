import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  FlaskConical, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Star, 
  MessageSquare, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Share2, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Bookmark,
  Check,
  Video,
  ListOrdered,
  Maximize2,
  Code2,
  Zap
} from 'lucide-react';
import { persistentStorage } from '@/lib/storage';
import PostComments from '@/components/ui/PostComments';
import { CodeSandboxRunner } from '@/components/interactive/CodeSandboxRunner';

export interface CurriculumItem {
  id: string;
  type: 'lesson' | 'quiz' | 'assignment';
  title: string;
  lessonType?: string;
  duration?: number;
  url: string;
  isFree?: boolean;
}

export interface Chapter {
  title: string;
  description?: string;
  items: CurriculumItem[];
}

export interface CourseLearningStudioProps {
  courseId: string;
  courseTitle: string;
  currentLesson: {
    id: string;
    title: string;
    description?: string;
    lessonType?: string;
    duration?: number;
    videoUrl?: string;
    interactiveLab?: string;
  };
  chapters: Chapter[];
  children?: React.ReactNode;
}

export const CourseLearningStudio: React.FC<CourseLearningStudioProps> = ({
  courseId,
  courseTitle,
  currentLesson,
  chapters,
  children
}) => {
  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'discussions' | 'notes' | 'resources'>('about');
  const [modeTab, setModeTab] = useState<'learn' | 'practice'>('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({ 0: true, 1: true });
  
  // Progress & Completion state
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const isCompleted = completedItems.includes(currentLesson.id);

  // Star Rating state
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Notes state
  const [notes, setNotes] = useState<string>('');
  const [notesSavedStatus, setNotesSavedStatus] = useState<string>('');
  const notesSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Flat list of all items for prev/next
  const flatItems = useMemo(() => {
    const list: CurriculumItem[] = [];
    chapters.forEach(ch => {
      ch.items.forEach(it => {
        list.push(it);
      });
    });
    return list;
  }, [chapters]);

  const currentIndex = flatItems.findIndex(it => it.id === currentLesson.id);
  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;

  // Load completion state from persistent storage
  useEffect(() => {
    const loadState = () => {
      const stored = (persistentStorage.getSync<string[]>(`lms_completed_${courseId}`, []) || []) as string[];
      if (Array.isArray(stored)) {
        setCompletedItems(stored);
      }
      
      // Load saved rating
      const savedRating = localStorage.getItem(`lms_rating_${courseId}_${currentLesson.id}`);
      if (savedRating) {
        setRating(Number(savedRating));
        setRatingSubmitted(true);
      }

      // Load saved notes
      const savedNotes = localStorage.getItem(`lms_notes_${courseId}_${currentLesson.id}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    };

    loadState();
    window.addEventListener('lms_progress_updated', loadState);
    return () => {
      window.removeEventListener('lms_progress_updated', loadState);
    };
  }, [courseId, currentLesson.id]);

  // Auto-expand the chapter containing current lesson
  useEffect(() => {
    chapters.forEach((ch, idx) => {
      if (ch.items.some(it => it.id === currentLesson.id)) {
        setOpenChapters(prev => ({ ...prev, [idx]: true }));
      }
    });
  }, [currentLesson.id, chapters]);

  // Handle Mark Complete toggle
  const toggleComplete = async () => {
    const current = (persistentStorage.getSync<string[]>(`lms_completed_${courseId}`, []) || []) as string[];
    let updated: string[];

    if (current.includes(currentLesson.id)) {
      updated = current.filter(id => id !== currentLesson.id);
    } else {
      updated = [...current, currentLesson.id];
    }

    await persistentStorage.set(`lms_completed_${courseId}`, updated);
    setCompletedItems(updated);
    window.dispatchEvent(new Event('lms_progress_updated'));
  };

  // Handle Star Rating
  const handleRate = (stars: number) => {
    setRating(stars);
    setRatingSubmitted(true);
    localStorage.setItem(`lms_rating_${courseId}_${currentLesson.id}`, String(stars));
  };

  // Handle Notes input with debounce save
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    setNotesSavedStatus('Saving...');

    if (notesSaveTimeout.current) clearTimeout(notesSaveTimeout.current);
    notesSaveTimeout.current = setTimeout(() => {
      localStorage.setItem(`lms_notes_${courseId}_${currentLesson.id}`, val);
      setNotesSavedStatus('Saved to browser');
      setTimeout(() => setNotesSavedStatus(''), 2500);
    }, 600);
  };


  // Format Video Embed URL (Vimeo, YouTube, etc.)
  const formattedVideoUrl = useMemo(() => {
    if (!currentLesson.videoUrl) return null;
    const url = currentLesson.videoUrl.trim();

    // Vimeo detection
    if (url.includes('vimeo.com')) {
      if (url.includes('player.vimeo.com/video/')) {
        return url;
      }
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      if (match && match[3]) {
        return `https://player.vimeo.com/video/${match[3]}?badge=0&autopause=0&player_id=0`;
      }
      const idMatch = url.match(/vimeo\.com\/(\d+)/);
      if (idMatch && idMatch[1]) {
        return `https://player.vimeo.com/video/${idMatch[1]}`;
      }
    }

    // YouTube detection
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      if (url.includes('youtube.com/embed/')) return url;
      const id = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
      }
    }

    return url;
  }, [currentLesson.videoUrl]);

  // Overall course progress percentage
  const totalCourseItems = flatItems.length;
  const completedCourseItems = completedItems.length;
  const coursePercent = totalCourseItems > 0 ? Math.round((completedCourseItems / totalCourseItems) * 100) : 0;

  // Practice item classification helper
  const isPracticeItem = (it: CurriculumItem) => {
    const t = it.type;
    const lt = (it.lessonType || '').toLowerCase();
    const title = it.title.toLowerCase();
    return (
      t === 'quiz' ||
      t === 'assignment' ||
      lt === 'lab' ||
      lt === 'quiz' ||
      title.includes('lab') ||
      title.includes('quiz') ||
      title.includes('challenge') ||
      title.includes('exercise') ||
      title.includes('puzzle') ||
      title.includes('practice') ||
      title.includes('simulation')
    );
  };

  // All practice items in this course
  const allPracticeItems = useMemo(() => {
    const list: CurriculumItem[] = [];
    chapters.forEach(ch => {
      ch.items.forEach(it => {
        if (isPracticeItem(it)) list.push(it);
      });
    });
    return list;
  }, [chapters]);

  const totalPracticeCount = allPracticeItems.length;

  // Next available hands-on practice item
  const nextPracticeItem = useMemo(() => {
    return (
      allPracticeItems.find(it => it.id !== currentLesson.id && !completedItems.includes(it.id)) ||
      allPracticeItems.find(it => it.id !== currentLesson.id) ||
      null
    );
  }, [allPracticeItems, currentLesson.id, completedItems]);

  // Is current lesson an interactive lab or quiz
  const isCurrentLessonPractice = useMemo(() => {
    const lt = (currentLesson.lessonType || '').toLowerCase();
    const title = currentLesson.title.toLowerCase();
    return (
      Boolean(currentLesson.interactiveLab) ||
      lt === 'lab' ||
      lt === 'quiz' ||
      title.includes('lab') ||
      title.includes('quiz') ||
      title.includes('challenge') ||
      title.includes('exercise') ||
      title.includes('puzzle')
    );
  }, [currentLesson]);

  // Filter items by search and mode (Learn vs Practice)
  const filteredChapters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return chapters
      .map(ch => {
        let items = ch.items;

        // If in practice mode and course has practice items, filter to practice items
        if (modeTab === 'practice' && totalPracticeCount > 0) {
          items = items.filter(isPracticeItem);
        }

        // Apply search query filter if typed
        if (q) {
          items = items.filter(it => it.title.toLowerCase().includes(q));
        }

        return {
          ...ch,
          items
        };
      })
      .filter(ch => ch.items.length > 0);
  }, [chapters, searchQuery, modeTab, totalPracticeCount]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E5E795]/30 selection:text-foreground">
      
      {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
      <header className="h-14 border-b border-border bg-card/90 px-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <a
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 px-2.5 py-1.5 rounded-lg border border-border shrink-0"
            title="Return to course overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Course Overview</span>
          </a>

          <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

          <div className="flex items-center gap-2 truncate text-xs">
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">{courseTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate max-w-[160px] sm:max-w-sm">{currentLesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Course Progress Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-secondary border border-border px-3 py-1 rounded-full text-xs">
            <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
            <span className="text-foreground font-mono text-[11px] font-semibold">{coursePercent}% Done</span>
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-[#E5E795] rounded-full transition-all duration-300"
                style={{ width: `${coursePercent}%` }}
              />
            </div>
          </div>

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={sidebarOpen ? "Hide syllabus sidebar" : "Show syllabus sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Main Two-Column Layout ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Left Sidebar (Curriculum Drawer) ────────────────────────────────── */}
        <aside 
          className={`transition-all duration-300 ease-in-out border-r border-border bg-card/95 backdrop-blur-md flex flex-col shrink-0 z-30 ${
            sidebarOpen ? 'w-84 md:w-88 lg:w-96' : 'w-0 -translate-x-full overflow-hidden border-none'
          }`}
        >
          {/* Mode Switcher: Learn vs Practice */}
          <div className="p-3 border-b border-border flex items-center gap-2 bg-secondary/40">
            <button
              type="button"
              onClick={() => setModeTab('learn')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                modeTab === 'learn' 
                  ? 'bg-[#E5E795] text-zinc-950 font-bold shadow-xs' 
                  : 'text-foreground/75 dark:text-zinc-300 hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Learn Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setModeTab('practice')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                modeTab === 'practice' 
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs' 
                  : 'text-foreground/75 dark:text-zinc-300 hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Practice Mode</span>
              {totalPracticeCount > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  modeTab === 'practice' ? 'bg-black/15 text-zinc-950 font-bold' : 'bg-secondary text-foreground'
                }`}>
                  {totalPracticeCount}
                </span>
              )}
            </button>
          </div>

          {/* Practice Mode Active Filter Strip */}
          {modeTab === 'practice' && (
            <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  {totalPracticeCount > 0 
                    ? `Showing ${totalPracticeCount} Practice Labs & Quizzes` 
                    : 'Interactive Sandbox Practice Mode'}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setModeTab('learn')}
                className="text-[11px] text-amber-700 dark:text-amber-300 underline hover:text-foreground cursor-pointer font-medium"
              >
                Reset
              </button>
            </div>
          )}

          {/* Search bar inside sidebar */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 text-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={modeTab === 'practice' ? "Filter labs & quizzes..." : "Search lessons in course..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-background border border-border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Curriculum Chapters Accordion */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
            {filteredChapters.map((chapter, chIdx) => {
              const isOpen = openChapters[chIdx] ?? false;
              const chTotal = chapter.items.length;
              const chCompleted = chapter.items.filter(it => completedItems.includes(it.id)).length;
              const chDuration = chapter.items.reduce((acc, it) => acc + (it.duration || 15), 0);

              return (
                <div key={chIdx} className="bg-card/40">
                  {/* Chapter Header */}
                  <button
                    type="button"
                    onClick={() => setOpenChapters(prev => ({ ...prev, [chIdx]: !isOpen }))}
                    className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-secondary/50 transition-colors cursor-pointer group border-b border-border/20"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary dark:text-[#E5E795] mb-1 font-mono">
                        Module {chIdx + 1}
                      </div>
                      <h4 className="text-sm sm:text-[15px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {chapter.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-foreground/75 dark:text-zinc-300 font-mono font-medium">
                        <span>{chCompleted}/{chTotal} complete</span>
                        <span>•</span>
                        <span>{chDuration}m</span>
                      </div>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-foreground/70 transition-transform duration-200 shrink-0 mt-1 group-hover:text-primary ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  {/* Chapter Lessons Items */}
                  {isOpen && (
                    <div className="bg-background/90 py-1.5 border-t border-border/40 space-y-0.5">
                      {chapter.items.map((item) => {
                        const isActive = item.id === currentLesson.id;
                        const isDone = completedItems.includes(item.id);
                        const isPractice = isPracticeItem(item);

                        return (
                          <a
                            key={item.id}
                            href={item.url}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all relative group ${
                              isActive
                                ? 'bg-primary/15 text-primary dark:text-[#E5E795] border-l-4 border-primary dark:border-[#E5E795] font-bold shadow-xs'
                                : 'text-foreground/90 dark:text-zinc-200 hover:bg-secondary/70 hover:text-foreground border-l-4 border-transparent font-medium'
                            }`}
                          >
                            {/* Type Icon */}
                            <div className="shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : item.type === 'lesson' && item.lessonType === 'video' ? (
                                <PlayCircle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'}`} />
                              ) : item.type === 'lesson' && item.lessonType === 'lab' ? (
                                <FlaskConical className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500'}`} />
                              ) : item.type === 'quiz' ? (
                                <HelpCircle className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-amber-600 dark:text-amber-400 group-hover:text-amber-500'}`} />
                              ) : item.type === 'assignment' ? (
                                <Award className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500'}`} />
                              ) : (
                                <FileText className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'}`} />
                              )}
                            </div>

                            {/* Lesson Title */}
                            <span className="truncate flex-1 leading-snug">
                              {item.title}
                            </span>

                            {/* Duration or Badge */}
                            {item.duration && (
                              <span className="text-xs font-mono text-foreground/60 dark:text-zinc-400 group-hover:text-foreground shrink-0">
                                {item.duration}m
                              </span>
                            )}

                            {/* Practice Tag */}
                            {isPractice && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                                {item.type === 'quiz' ? 'Quiz' : item.type === 'assignment' ? 'Project' : 'Lab'}
                              </span>
                            )}

                            {/* Free Preview Tag */}
                            {item.isFree && !isPractice && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                                Free
                              </span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty State when in Practice Mode with 0 matches */}
            {filteredChapters.length === 0 && (
              <div className="p-6 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto opacity-80" />
                <p className="text-sm font-semibold text-foreground">No practice items found</p>
                <p className="text-xs text-muted-foreground">Try clearing your search query or return to Learn Mode to explore all theory lessons.</p>
                <button
                  type="button"
                  onClick={() => { setModeTab('learn'); setSearchQuery(''); }}
                  className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-colors cursor-pointer"
                >
                  Return to Learn Mode
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Content Area ──────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-background flex flex-col">
          
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
            
            {/* Practice Arena Workspace (when Practice Mode is active) */}
            {modeTab === 'practice' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-foreground font-display">
                          Hands-On Practice Workspace
                        </h2>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                          Active
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/80 dark:text-zinc-300">
                        {isCurrentLessonPractice
                          ? "This lesson features a hands-on interactive challenge or lab below."
                          : "Write, test, and run code live in the sandbox. Reinforce theory with real implementation."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {nextPracticeItem && nextPracticeItem.id !== currentLesson.id && (
                      <a
                        href={nextPracticeItem.url}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Next Lab: {nextPracticeItem.title.slice(0, 18)}...</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setModeTab('learn')}
                      className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                    >
                      Switch to Learn Mode
                    </button>
                  </div>
                </div>

                {/* Live Code Sandbox runner when not already a standalone lab component */}
                {!isCurrentLessonPractice && (
                  <div className="pt-2">
                    <CodeSandboxRunner contentId={currentLesson.id} />
                  </div>
                )}
              </div>
            )}

            {/* 1. Video Player Container (or Interactive Lab Runner) */}
            <div className="space-y-4">
              {formattedVideoUrl ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-xl group">
                  <iframe
                    src={formattedVideoUrl}
                    className="w-full h-full border-0 absolute inset-0 video-player-frame"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              ) : currentLesson.lessonType === 'video' ? (
                <div className="w-full aspect-video rounded-2xl bg-card border border-border flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <PlayCircle className="w-12 h-12 text-primary mb-3 opacity-60" />
                  <p className="text-sm font-medium text-foreground">Video lecture placeholder</p>
                  <p className="text-xs text-muted-foreground mt-1">Lecture video source will stream here once published.</p>
                </div>
              ) : null}

              {/* 2. Action Strip Below Video: Title, Duration, Mark as Complete, Star Rating */}
              <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E5E795]/20 text-[#303305] dark:text-[#E5E795] border border-[#E5E795]/40">
                      {currentLesson.lessonType === 'lab' 
                        ? 'Interactive Lab' 
                        : currentLesson.lessonType === 'quiz'
                          ? 'Knowledge Checkpoint Quiz'
                          : currentLesson.lessonType === 'assignment'
                            ? 'Capstone Project'
                            : currentLesson.lessonType === 'video'
                              ? 'Video Lesson'
                              : 'Written Guide'}
                    </span>
                    {currentLesson.duration && (
                      <span className="text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        {currentLesson.duration} minutes
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                    {currentLesson.title}
                  </h1>
                </div>

                {/* Right controls: Rating & Mark Complete button */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {/* Star Rating Widget */}
                  <div className="flex items-center gap-1 bg-secondary border border-border px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-muted-foreground mr-1 hidden lg:inline">Rate:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer transition-transform hover:scale-110 p-0.5"
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star 
                          className={`w-3.5 h-3.5 ${
                            (hoverRating || rating) >= star 
                              ? 'text-amber-500 fill-amber-500' 
                              : 'text-muted-foreground/40'
                          }`} 
                        />
                      </button>
                    ))}
                    {ratingSubmitted && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold ml-1">Saved</span>
                    )}
                  </div>

                  {/* Mark as Complete Toggle */}
                  <button
                    type="button"
                    onClick={toggleComplete}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground font-bold'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-500' : 'text-primary-foreground'}`} />
                    <span>{isCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Four Tabs: About, Discussions, Notes, Resources */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-border flex items-center gap-6 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('about')}
                  className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'about'
                      ? 'border-primary text-foreground font-bold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>About &amp; Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('discussions')}
                  className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'discussions'
                      ? 'border-primary text-foreground font-bold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Discussions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'notes'
                      ? 'border-primary text-foreground font-bold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4 text-primary" />
                  <span>My Notes {notes.length > 0 && '•'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'resources'
                      ? 'border-primary text-foreground font-bold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Resources &amp; Code</span>
                </button>
              </div>

              {/* Tab 1: About / Lecture Walkthrough & MDX */}
              {activeTab === 'about' && (
                <div className="space-y-6 pt-2">
                  {currentLesson.description && (
                    <div className="p-4 rounded-xl bg-card border border-border text-sm text-foreground leading-relaxed shadow-xs">
                      <strong className="text-foreground">Lesson Summary:</strong> {currentLesson.description}
                    </div>
                  )}

                  {/* Rendered Prose & Interactive Labs passed as children */}
                  <div className="prose dark:prose-invert max-w-none text-foreground text-sm sm:text-base leading-relaxed">
                    {children}
                  </div>
                </div>
              )}

              {/* Tab 2: Discussions (GitHub Giscus Community Q&A) */}
              {activeTab === 'discussions' && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-bold text-foreground font-display">Lesson Discussions &amp; Community Q&amp;A</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Join the conversation, ask questions about this lesson, and collaborate with other engineers via GitHub Discussions.
                    </p>
                  </div>

                  <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-xs min-h-[300px]">
                    <PostComments />
                  </div>
                </div>
              )}

              {/* Tab 3: My Notes (Auto-saved private learner pad) */}
              {activeTab === 'notes' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Your notes are private and automatically saved to your browser local storage.
                    </span>
                    {notesSavedStatus && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] animate-pulse">
                        {notesSavedStatus}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-xs">
                    <textarea
                      rows={12}
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Take notes while watching the lecture... Key architectural decisions, formulas, or questions for review before interviews."
                      className="w-full p-4 rounded-lg bg-background border border-border text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {notes.length} characters
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const blob = new Blob([notes], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${currentLesson.id}-notes.md`;
                          a.click();
                        }}
                        disabled={!notes.trim()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 border border-border text-xs font-semibold text-foreground transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Notes (.md)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Resources & Code downloads */}
              {activeTab === 'resources' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2 hover:border-primary/40 transition-colors shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Source Code</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Lesson Implementation Notebook</h4>
                      <p className="text-xs text-muted-foreground">Complete Jupyter notebook with PyTorch implementation and benchmark suite.</p>
                      <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                      >
                        <span>Open on GitHub</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-2 hover:border-emerald-500/40 transition-colors shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">System Diagram</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Full Resolution Architecture Chart</h4>
                      <p className="text-xs text-muted-foreground">Vector SVG flowchart showing all microservices, caches, and database replicas.</p>
                      <a 
                        href="/system-design" 
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                      >
                        <span>View System Blueprint</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-2 hover:border-amber-500/40 transition-colors shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Cheat Sheet</span>
                        <Download className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Latency &amp; Capacity Formula Sheet</h4>
                      <p className="text-xs text-muted-foreground">Quick-reference formulas for QPS calculations, storage estimation, and cache hit ratios.</p>
                      <a 
                        href="/labs" 
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline pt-1"
                      >
                        <span>Open Formula Lab</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-2 hover:border-cyan-500/40 transition-colors shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Research Paper</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Foundational Industry Paper (PDF)</h4>
                      <p className="text-xs text-muted-foreground">Original research paper describing the distributed consensus and replication model.</p>
                      <a 
                        href="/blog" 
                        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline pt-1"
                      >
                        <span>Read Paper Walkthrough</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Bottom Sticky Navigation Bar: Prev & Next Lesson */}
            <div className="pt-8 border-t border-border flex items-center justify-between gap-4 flex-wrap">
              {prevItem ? (
                <a
                  href={prevItem.url}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-xs font-semibold text-foreground transition-colors group cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground">Previous</div>
                    <div className="font-bold text-foreground truncate max-w-[180px] sm:max-w-xs">{prevItem.title}</div>
                  </div>
                </a>
              ) : (
                <div />
              )}

              {nextItem ? (
                <a
                  href={nextItem.url}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground transition-all shadow-xs group cursor-pointer ml-auto"
                >
                  <div className="text-right">
                    <div className="text-[10px] opacity-80">Next Lesson</div>
                    <div className="font-bold truncate max-w-[180px] sm:max-w-xs">{nextItem.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <a
                  href={`/courses/${courseId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-xs cursor-pointer ml-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish Course</span>
                </a>
              )}
            </div>

          </div>
        </main>
      </div>

    </div>
  );
};
