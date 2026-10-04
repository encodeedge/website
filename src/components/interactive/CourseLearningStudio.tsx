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
  Minimize2,
  Code2,
  Zap,
  Keyboard,
  X,
} from 'lucide-react';
import { persistentStorage } from '@/lib/storage';
import PostComments from '@/components/ui/PostComments';
import { CodeSandboxRunner } from '@/components/interactive/CodeSandboxRunner';
import { hasSnippetForContent } from '@/lib/code-snippets';
import {
  trackLessonCompletion,
  trackLessonRating,
  trackLmsTabSwitch,
  trackLmsModeSwitch,
  trackNotesExport,
  trackEvent,
} from '@/lib/analytics';

export interface CurriculumItem {
  id: string;
  type: 'lesson' | 'quiz' | 'assignment';
  title: string;
  lessonType?: string;
  duration?: number;
  url: string;
  isFree?: boolean;
  comingSoon?: boolean;
  draft?: boolean;
  comingSoonMessage?: string;
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
    comingSoon?: boolean;
    draft?: boolean;
    comingSoonMessage?: string;
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
  // Sidebar states & refs
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const activeLessonRef = useRef<HTMLAnchorElement>(null);
  const prevLessonRef = useRef<HTMLAnchorElement>(null);
  const nextLessonRef = useRef<HTMLAnchorElement>(null);
  const finishCourseRef = useRef<HTMLAnchorElement>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'about' | 'discussions' | 'notes' | 'resources'>('about');
  const [modeTab, setModeTab] = useState<'learn' | 'practice'>('learn');
  const [searchQuery, setSearchQuery] = useState('');

  // Find chapter containing active lesson
  const currentChapterIndex = useMemo(() => {
    return chapters.findIndex(ch => ch.items.some(it => it.id === currentLesson.id));
  }, [chapters, currentLesson.id]);

  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = { 0: true };
    const chIdx = chapters.findIndex(ch => ch.items.some(it => it.id === currentLesson.id));
    if (chIdx >= 0) {
      initial[chIdx] = true;
    }
    return initial;
  });

  // Whenever lesson changes, ensure its chapter is automatically opened
  useEffect(() => {
    if (currentChapterIndex >= 0) {
      setOpenChapters(prev => ({
        ...prev,
        [currentChapterIndex]: true,
      }));
    }
  }, [currentChapterIndex, currentLesson.id]);

  // Auto-scroll the sidebar container to center on the active lesson without visible blip or jump
  useEffect(() => {
    // 1. Immediately restore saved scroll position if available
    try {
      const saved = sessionStorage.getItem(`sidebar_scroll_${courseId}`);
      if (saved && sidebarScrollRef.current) {
        sidebarScrollRef.current.scrollTop = Number(saved);
      }
    } catch {}

    const ensureActiveInView = () => {
      if (activeLessonRef.current && sidebarScrollRef.current) {
        const container = sidebarScrollRef.current;
        const target = activeLessonRef.current;

        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        // If active lesson is already visible in the viewport (e.g. user just clicked it),
        // DO NOT scroll at all! This prevents any jarring jump or scroll blip under the user's eyes.
        const isAlreadyVisible = (
          targetRect.top >= containerRect.top + 24 &&
          targetRect.bottom <= containerRect.bottom - 24
        );

        if (isAlreadyVisible) {
          try {
            sessionStorage.setItem(`sidebar_scroll_${courseId}`, String(container.scrollTop));
          } catch {}
          return;
        }

        // If it's outside the view (e.g. initial load directly to deep lesson, or keyboard nav),
        // position it instantly ('instant') with zero animation blip
        const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
        const centeredTop = relativeTop - (container.clientHeight / 2) + (target.clientHeight / 2);

        container.scrollTo({
          top: Math.max(0, centeredTop),
          behavior: 'instant' as ScrollBehavior,
        });

        try {
          sessionStorage.setItem(`sidebar_scroll_${courseId}`, String(container.scrollTop));
        } catch {}
      }
    };

    // Run immediately without delays to eliminate any visual blip or lag
    ensureActiveInView();
    const rId = requestAnimationFrame(ensureActiveInView);

    return () => {
      cancelAnimationFrame(rId);
    };
  }, [currentLesson.id, currentChapterIndex, openChapters, sidebarOpen, courseId]);
  
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

  // Fullscreen state with session persistence
  const studioRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        sessionStorage.getItem('lms_fullscreen') === 'true' ||
        new URLSearchParams(window.location.search).get('fullscreen') === '1'
      );
    } catch {
      return false;
    }
  });

  // Sync body and documentElement classes & sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('lms_fullscreen', isFullscreen ? 'true' : 'false');
    } catch {}
    if (isFullscreen) {
      document.body.classList.add('in-course-fullscreen');
      document.documentElement.classList.add('in-course-fullscreen');
    } else {
      document.body.classList.remove('in-course-fullscreen');
      document.documentElement.classList.remove('in-course-fullscreen');
    }
  }, [isFullscreen]);

  // If in fullscreen and browser dropped native fullscreen on navigation, re-engage on first user click or keypress
  useEffect(() => {
    if (isFullscreen && !document.fullscreenElement) {
      const handleUserGesture = () => {
        if (!document.fullscreenElement) {
          const el = document.documentElement;
          if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
          } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen();
          }
        }
      };

      window.addEventListener('click', handleUserGesture, { once: true });
      window.addEventListener('keydown', handleUserGesture, { once: true });
      return () => {
        window.removeEventListener('click', handleUserGesture);
        window.removeEventListener('keydown', handleUserGesture);
      };
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      // Only set to false if native fullscreen was exited via user action while not in session full screen
      if (!active && !isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    try {
      const isCurrentlyFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement) || isFullscreen;

      if (!isCurrentlyFs) {
        setIsFullscreen(true);
        try {
          sessionStorage.setItem('lms_fullscreen', 'true');
        } catch {}
        document.body.classList.add('in-course-fullscreen');
        document.documentElement.classList.add('in-course-fullscreen');

        const el = document.documentElement;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        }
      } else {
        exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen toggle issue, CSS fullscreen active:', err);
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    try {
      sessionStorage.setItem('lms_fullscreen', 'false');
    } catch {}
    document.body.classList.remove('in-course-fullscreen');
    document.documentElement.classList.remove('in-course-fullscreen');

    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }

    if (window.location.search.includes('fullscreen=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('fullscreen');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const getLessonUrl = (url: string) => {
    if (!isFullscreen) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}fullscreen=1`;
  };

  const handleLessonClick = (_url: string) => {
    if (sidebarScrollRef.current) {
      try {
        sessionStorage.setItem(`sidebar_scroll_${courseId}`, String(sidebarScrollRef.current.scrollTop));
      } catch {}
    }
    if (isFullscreen) {
      try {
        sessionStorage.setItem('lms_fullscreen', 'true');
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else if (!document.fullscreenElement && (document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        }
      } catch {}
    }
  };

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

  const isComingSoon = Boolean(currentLesson.comingSoon || currentLesson.draft);

  const nextReadyItem = useMemo(() => {
    if (currentIndex < 0) return null;
    for (let i = currentIndex + 1; i < flatItems.length; i++) {
      if (!flatItems[i].comingSoon && !flatItems[i].draft) {
        return flatItems[i];
      }
    }
    return null;
  }, [currentIndex, flatItems]);


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

  // Auto-collapse sidebar on mobile screens on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Handle Mark Complete toggle
  const toggleComplete = async () => {
    const current = (persistentStorage.getSync<string[]>(`lms_completed_${courseId}`, []) || []) as string[];
    let updated: string[];

    if (current.includes(currentLesson.id)) {
      updated = current.filter(id => id !== currentLesson.id);
      trackEvent('lesson_uncomplete', { course_id: courseId, lesson_slug: currentLesson.id });
    } else {
      updated = [...current, currentLesson.id];
      trackLessonCompletion(courseId, currentLesson.id, currentLesson.title);
    }

    await persistentStorage.set(`lms_completed_${courseId}`, updated);
    setCompletedItems(updated);
    window.dispatchEvent(new Event('lms_progress_updated'));
  };

  // Programmatic keyboard navigation helpers
  const navigateToPrevious = () => {
    if (prevLessonRef.current) {
      prevLessonRef.current.click();
    } else if (prevItem) {
      handleLessonClick(prevItem.url);
      const url = getLessonUrl(prevItem.url);
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const navigateToNext = () => {
    if (nextLessonRef.current) {
      nextLessonRef.current.click();
    } else if (finishCourseRef.current) {
      finishCourseRef.current.click();
    } else if (nextItem) {
      handleLessonClick(nextItem.url);
      const url = getLessonUrl(nextItem.url);
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (isComingSoon && nextReadyItem) {
      handleLessonClick(nextReadyItem.url);
      const url = getLessonUrl(nextReadyItem.url);
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  // Keyboard navigation & control shortcuts
  useEffect(() => {
    const isEditableTarget = (el: EventTarget | null): boolean => {
      if (!el || !(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (el.isContentEditable) return true;
      if (el.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .cm-editor, #post-comments')) {
        return true;
      }
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Never intercept when user is typing in form controls or editors
      if (isEditableTarget(e.target)) {
        return;
      }

      // 2. Escape: Close shortcuts modal or exit fullscreen
      if (e.key === 'Escape') {
        if (showShortcutsModal) {
          e.preventDefault();
          setShowShortcutsModal(false);
          return;
        }
        if (isFullscreen) {
          exitFullscreen();
          return;
        }
      }

      // 3. Question mark (?) or 'h' / 'H': Toggle keyboard shortcuts help dialog
      if ((e.key === '?' || e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      // If shortcuts modal is currently open, ignore other navigation shortcuts
      if (showShortcutsModal) {
        return;
      }

      // 4. Do not hijack if Ctrl, Cmd, or Alt is active (preserves browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // 5. Next Lesson: ArrowRight, 'n', 'N', ']'
      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N' || e.key === ']') {
        e.preventDefault();
        navigateToNext();
        return;
      }

      // 6. Previous Lesson: ArrowLeft, 'p', 'P', '['
      if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P' || e.key === '[') {
        e.preventDefault();
        navigateToPrevious();
        return;
      }

      // 7. Fullscreen toggle: 'f' or 'F'
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // 8. Sidebar / Syllabus toggle: 's' or 'S' or 'b' or 'B'
      if (e.key === 's' || e.key === 'S' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
        return;
      }

      // 9. Mark complete toggle: 'c' or 'C'
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        toggleComplete();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    showShortcutsModal,
    isFullscreen,
    prevItem,
    nextItem,
    nextReadyItem,
    isComingSoon,
    courseId,
    currentLesson.id,
    completedItems
  ]);

  // Handle Star Rating
  const handleRate = (stars: number) => {
    setRating(stars);
    setRatingSubmitted(true);
    trackLessonRating(courseId, currentLesson.id, stars);
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
    <div 
      ref={studioRef}
      id="course-learning-studio"
      className={`min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E5E795]/30 selection:text-foreground ${
        isFullscreen ? 'fixed inset-0 z-[99999] w-screen h-screen overflow-y-auto course-studio-fullscreen' : ''
      }`}
    >
      
      {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
      <header className="course-studio-header h-14 border-b border-border bg-card/90 px-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <a
            href={`/courses/${courseId}`}
            onClick={exitFullscreen}
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

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Full Screen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Full Screen (Esc or F)" : "Enter Full Screen (F)"}
            aria-label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                <span className="hidden sm:inline">Exit Full Screen</span>
                <kbd className="hidden lg:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border">F</kbd>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                <span className="hidden sm:inline">Full Screen</span>
                <kbd className="hidden lg:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border">F</kbd>
              </>
            )}
          </button>

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={sidebarOpen ? "Hide syllabus sidebar (S)" : "Show syllabus sidebar (S)"}
            aria-label={sidebarOpen ? "Hide syllabus sidebar" : "Show syllabus sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <kbd className="hidden lg:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border">S</kbd>
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay when Drawer is open */}
      {sidebarOpen && (
        <div
          className="course-studio-backdrop fixed inset-0 bg-background/60 backdrop-blur-xs z-25 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main Two-Column Layout ────────────────────────────────────────────── */}
      <div className="flex-1 flex relative items-start">

        {/* ── Left Sidebar (Curriculum Drawer) ────────────────────────────────── */}
        <aside 
          className={`course-studio-sidebar flex flex-col shrink-0 z-30 border-r border-border bg-card/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-84 max-w-[85vw] md:w-88 lg:w-96' : 'w-0 -translate-x-full overflow-hidden border-none pointer-events-none'
          }`}
        >
          {/* Mode Switcher: Learn vs Practice */}
          <div className="p-3 border-b border-border flex items-center gap-2 bg-secondary/40">
            <button
              type="button"
              onClick={() => { setModeTab('learn'); trackLmsModeSwitch('learn', courseId); }}
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
              onClick={() => { setModeTab('practice'); trackLmsModeSwitch('practice', courseId); }}
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
          <div 
            ref={sidebarScrollRef}
            className="flex-1 min-h-0 overflow-y-auto divide-y divide-border/40 overscroll-contain lesson-list-scroll"
          >
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
                            ref={isActive ? activeLessonRef : null}
                            href={getLessonUrl(item.url)}
                            onClick={() => handleLessonClick(item.url)}
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

                            {/* Coming Soon Tag */}
                            {item.comingSoon && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/35 shrink-0 flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Soon
                              </span>
                            )}

                            {/* Draft Tag */}
                            {!item.comingSoon && item.draft && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
                                Draft
                              </span>
                            )}

                            {/* Practice Tag */}
                            {isPractice && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                                {item.type === 'quiz' ? 'Quiz' : item.type === 'assignment' ? 'Project' : 'Lab'}
                              </span>
                            )}

                            {/* Free Preview Tag */}
                            {item.isFree && !isPractice && !item.comingSoon && (
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
        <div className="flex-1 bg-background flex flex-col min-w-0">
          
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
            
            {isComingSoon ? (
              <div className="py-20 sm:py-32 flex flex-col items-center justify-center text-center max-w-lg mx-auto px-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
                  <Clock className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Coming Soon
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                    {currentLesson.title}
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {currentLesson.comingSoonMessage || "The contents for this lesson will be updated soon."}
                </p>

                {nextReadyItem && (
                  <div className="pt-2">
                    <a
                      ref={nextLessonRef}
                      href={getLessonUrl(nextReadyItem.url)}
                      onClick={() => handleLessonClick(nextReadyItem.url)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors shadow-xs"
                      title="Next available lesson (→ or N)"
                    >
                      <span>Next Available Lesson</span>
                      <kbd className="hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-black/20 text-white border border-white/20">→</kbd>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <>
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
                            href={getLessonUrl(nextPracticeItem.url)}
                            onClick={() => handleLessonClick(nextPracticeItem.url)}
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
                      hasSnippetForContent(currentLesson.id) ? (
                        <div className="pt-2">
                          <CodeSandboxRunner contentId={currentLesson.id} />
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-muted/40 border border-border text-center space-y-2 text-xs text-muted-foreground">
                          <p>This lesson focuses on theoretical architecture. Interactive code labs are integrated into dedicated practice lessons.</p>
                          {nextPracticeItem && (
                            <a
                              href={getLessonUrl(nextPracticeItem.url)}
                              onClick={() => handleLessonClick(nextPracticeItem.url)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              Jump to hands-on lab: {nextPracticeItem.title} &rarr;
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* 1. Video Player Container */}
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
                    {currentLesson.comingSoon && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Coming Soon
                      </span>
                    )}
                    {!currentLesson.comingSoon && currentLesson.draft && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border border-zinc-500/40 font-mono">
                        Draft Mode
                      </span>
                    )}
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
                    title={isCompleted ? "Completed (C to toggle)" : "Mark complete (C)"}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-500' : 'text-primary-foreground'}`} />
                    <span>{isCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                    <kbd className={`hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 rounded border ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-white/20 text-white border-white/30'
                    }`}>C</kbd>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Four Tabs: About, Discussions, Notes, Resources */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-border flex items-center gap-6 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => { setActiveTab('about'); trackLmsTabSwitch(courseId, currentLesson.id, 'about'); }}
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
                  onClick={() => { setActiveTab('discussions'); trackLmsTabSwitch(courseId, currentLesson.id, 'discussions'); }}
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
                  onClick={() => { setActiveTab('notes'); trackLmsTabSwitch(courseId, currentLesson.id, 'notes'); }}
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
                  onClick={() => { setActiveTab('resources'); trackLmsTabSwitch(courseId, currentLesson.id, 'resources'); }}
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
                          trackNotesExport(courseId, currentLesson.id, notes.length);
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
          </>
        )}

            {/* 4. Bottom Sticky Navigation Bar: Prev & Next Lesson */}
            <div className="pt-8 border-t border-border flex items-center justify-between gap-4 flex-wrap">
              {prevItem ? (
                <a
                  ref={prevLessonRef}
                  href={getLessonUrl(prevItem.url)}
                  onClick={() => handleLessonClick(prevItem.url)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-xs font-semibold text-foreground transition-colors group cursor-pointer shadow-xs"
                  title="Previous lesson (← or P)"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <span>Previous</span>
                      <kbd className="hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border">←</kbd>
                    </div>
                    <div className="font-bold text-foreground truncate max-w-[180px] sm:max-w-xs">{prevItem.title}</div>
                  </div>
                </a>
              ) : (
                <div />
              )}

              {nextItem ? (
                <a
                  ref={nextLessonRef}
                  href={getLessonUrl(nextItem.url)}
                  onClick={() => handleLessonClick(nextItem.url)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground transition-all shadow-xs group cursor-pointer ml-auto"
                  title="Next lesson (→ or N)"
                >
                  <div className="text-right">
                    <div className="text-[10px] opacity-80 flex items-center justify-end gap-1.5">
                      <span>Next Lesson</span>
                      <kbd className="hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-black/20 text-white border border-white/20">→</kbd>
                    </div>
                    <div className="font-bold truncate max-w-[180px] sm:max-w-xs">{nextItem.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <a
                  ref={finishCourseRef}
                  href={`/courses/${courseId}`}
                  onClick={exitFullscreen}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-xs cursor-pointer ml-auto"
                  title="Finish course overview"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish Course</span>
                </a>
              )}
          </div>
          </div>
        </div>
      </div>

      {/* ── Keyboard Shortcuts Modal ────────────────────────────────────────── */}
      {showShortcutsModal && (
        <div 
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowShortcutsModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div 
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="shortcuts-title" className="font-bold text-foreground text-base font-display">Keyboard Shortcuts</h3>
                  <p className="text-xs text-muted-foreground">Quickly navigate and control your study session</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                title="Close (Esc)"
                aria-label="Close keyboard shortcuts dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Lesson Navigation</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-foreground font-medium">Next lesson</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">→</kbd>
                      <span className="text-muted-foreground">or</span>
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">N</kbd>
                      <span className="text-muted-foreground">or</span>
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">]</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-foreground font-medium">Previous lesson</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">←</kbd>
                      <span className="text-muted-foreground">or</span>
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">P</kbd>
                      <span className="text-muted-foreground">or</span>
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">[</kbd>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">View &amp; Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-foreground font-medium">Toggle Full Screen</span>
                    <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">F</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-foreground font-medium">Toggle Syllabus Sidebar</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">S</kbd>
                      <span className="text-muted-foreground">or</span>
                      <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">B</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-foreground font-medium">Toggle Mark Completed</span>
                    <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">C</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-foreground font-medium">Exit Full Screen / Close Modal</span>
                    <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-foreground font-medium">Show / Hide Shortcuts</span>
                    <kbd className="px-2 py-0.5 rounded bg-secondary border border-border font-mono font-semibold text-foreground">?</kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">
                Shortcuts are disabled while typing in notes or comments.
              </p>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
