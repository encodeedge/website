import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flame, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  PlayCircle, 
  Sparkles, 
  Calendar, 
  Layers, 
  FileText, 
  ExternalLink,
  GraduationCap,
  Trophy,
  Activity,
  BookmarkCheck,
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  Database
} from 'lucide-react';
import { persistentStorage } from '@/lib/storage';
import { CourseCertificateModal } from './CourseCertificateModal';
import { useMembership } from '@/lib/membership';

interface ChapterItem {
  discriminant: 'lesson' | 'quiz' | 'assignment';
  value: {
    lessonRef?: string;
    quizRef?: string;
    assignmentRef?: string;
  };
}

interface Chapter {
  title: string;
  description?: string;
  items?: ChapterItem[];
}

interface CourseData {
  id: string;
  title: string;
  shortDescription?: string;
  coverImage?: string;
  level: string;
  chapters?: Chapter[];
}

interface StudentDashboardProps {
  courses: CourseData[];
}

interface CourseProgress {
  courseId: string;
  totalItems: number;
  completedItems: number;
  percentage: number;
  lastActiveItem?: {
    id: string;
    type: 'lesson' | 'quiz' | 'assignment';
    title: string;
  };
  isComplete: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ courses }) => {
  const { isPro, activateLicenseKey } = useMembership();
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});
  const [streakDays, setStreakDays] = useState(3);
  const [totalCompletedCount, setTotalCompletedCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [selectedCertCourse, setSelectedCertCourse] = useState<CourseData | null>(null);
  const [savedNotes, setSavedNotes] = useState<{ lessonId: string; note: string }[]>([]);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically activate Pro when redirected back from Polar checkout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const checkoutId = params.get('checkout_id') || params.get('session_id') || params.get('order_id');
    const status = params.get('status');

    if (checkoutId || status === 'success') {
      const key = checkoutId ? `POLAR-${checkoutId}` : 'POLAR-SUCCESS';
      activateLicenseKey(key);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleExportBackup = async () => {
    try {
      const json = await persistentStorage.exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encodeedge-learning-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupStatus('Backup exported successfully!');
      setTimeout(() => setBackupStatus(null), 3500);
    } catch {
      setBackupStatus('Export failed.');
      setTimeout(() => setBackupStatus(null), 3000);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        const res = await persistentStorage.importBackup(content);
        if (res.success) {
          setBackupStatus(`Restored ${res.importedCount} items! Reloading...`);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setBackupStatus('Failed to import backup file.');
          setTimeout(() => setBackupStatus(null), 3000);
        }
      } catch {
        setBackupStatus('Invalid backup file.');
        setTimeout(() => setBackupStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    // 1. Compute streak from persistentStorage / localStorage
    try {
      const storedStreak = parseInt(String(persistentStorage.getSync('lms_streak_days', 4)), 10);
      setStreakDays(isNaN(storedStreak) ? 4 : storedStreak);
    } catch {
      setStreakDays(4);
    }

    // 2. Scan completion status for all courses
    const nextMap: Record<string, CourseProgress> = {};
    let grandTotalCompleted = 0;

    courses.forEach(course => {
      let totalItems = 0;
      const allItemIds: { id: string; type: 'lesson' | 'quiz' | 'assignment' }[] = [];

      (course.chapters || []).forEach(ch => {
        (ch.items || []).forEach(item => {
          totalItems++;
          const ref = item.value.lessonRef || item.value.quizRef || item.value.assignmentRef;
          if (ref) {
            allItemIds.push({ id: ref, type: item.discriminant });
          }
        });
      });

      let completedList: string[] = persistentStorage.getSync<string[]>(`lms_completed_${course.id}`, []) || [];

      const completedCount = completedList.length;
      grandTotalCompleted += completedCount;
      const pct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

      // Find first uncompleted item as next resume target
      const nextUncompleted = allItemIds.find(i => !completedList.includes(i.id)) || allItemIds[0];

      nextMap[course.id] = {
        courseId: course.id,
        totalItems,
        completedItems: completedCount,
        percentage: pct,
        lastActiveItem: nextUncompleted ? {
          id: nextUncompleted.id,
          type: nextUncompleted.type,
          title: nextUncompleted.id.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        } : undefined,
        isComplete: pct === 100 && totalItems > 0
      };
    });

    setProgressMap(nextMap);
    setTotalCompletedCount(grandTotalCompleted);

    // 3. Scan for saved notes in storage
    const notes: { lessonId: string; note: string }[] = [];
    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        if (key.startsWith('lms_notes_')) {
          const lessonId = key.replace('lms_notes_', '');
          const note = persistentStorage.getSync<string>(key, '') || '';
          if (note.trim()) {
            notes.push({ lessonId, note: note.trim() });
          }
        }
      }
    }
    setSavedNotes(notes);
  }, [courses]);

  // Find most relevant course to resume (highest progress < 100% or first)
  const resumeCourse = useMemo(() => {
    const inProgress = courses.filter(c => {
      const p = progressMap[c.id];
      return p && p.percentage > 0 && p.percentage < 100;
    });

    if (inProgress.length > 0) return inProgress[0];
    return courses[0] || null;
  }, [courses, progressMap]);

  const resumeProgress = resumeCourse ? progressMap[resumeCourse.id] : null;

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const p = progressMap[c.id];
      if (activeTab === 'completed') return p && p.isComplete;
      if (activeTab === 'in-progress') return p && p.percentage > 0 && !p.isComplete;
      return true;
    });
  }, [courses, progressMap, activeTab]);

  return (
    <div className="space-y-10">
      {/* 1. Hero Learner Overview Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-muted/30 to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Sparkles className="size-3.5" />
              <span>Personalized Learning Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
              Welcome back, <span className="text-primary">Learner</span>!
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground font-body leading-relaxed max-w-xl">
              You are actively building industry-grade AI & deep learning mastery. Keep your daily streak going and finish your next module.
            </p>

            {/* Quick Resume CTA */}
            {resumeCourse && resumeProgress?.lastActiveItem && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`/${resumeProgress.lastActiveItem.type === 'lesson' ? 'lessons' : resumeProgress.lastActiveItem.type === 'quiz' ? 'quizzes' : 'assignments'}/${resumeProgress.lastActiveItem.id}?course=${resumeCourse.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  <PlayCircle className="size-4" />
                  <span>Resume: {resumeProgress.lastActiveItem.title}</span>
                  <ArrowRight className="size-4 ml-1" />
                </a>

                <span className="text-xs text-muted-foreground">
                  in <strong className="text-foreground">{resumeCourse.title}</strong> ({resumeProgress.percentage}% complete)
                </span>
              </div>
            )}

            {/* Membership Tier Status */}
            <div className="pt-2 flex items-center gap-3">
              {isPro ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Pro Member Active • All Labs & Credentials Unlocked</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted border border-border text-xs text-muted-foreground font-medium">
                    <span>Community Plan (Free)</span>
                  </div>
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
                  >
                    <span>Upgrade to Pro</span>
                    <ArrowRight className="size-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics 2x2 Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Daily Streak</span>
                <Flame className="size-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-2xl font-bold font-display text-foreground">{streakDays} Days</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">🔥 Active Today!</div>
            </div>

            <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Modules Done</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-display text-foreground">{totalCompletedCount}</div>
              <div className="text-[11px] text-muted-foreground">Across all tracks</div>
            </div>

            <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Enrolled Tracks</span>
                <BookOpen className="size-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-display text-foreground">{courses.length}</div>
              <div className="text-[11px] text-muted-foreground">Mastery Curricula</div>
            </div>

            <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/80 space-y-1 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Certificates</span>
                <Award className="size-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-display text-foreground">
                {Object.values(progressMap).filter(p => p.isComplete).length}
              </div>
              <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Verified Credentials</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Course Curricula Progress Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">
              My Learning Path
            </h2>
            <p className="text-xs text-muted-foreground font-body">
              Track your individual course milestones and earn official credentials.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Tracks ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('in-progress')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'in-progress'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              In Progress
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Completed ({Object.values(progressMap).filter(p => p.isComplete).length})
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const prog = progressMap[course.id] || {
              totalItems: 0,
              completedItems: 0,
              percentage: 0,
              isComplete: false
            };

            return (
              <div
                key={course.id}
                className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Image or Header */}
                  {course.coverImage && (
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                        <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                          {course.level}
                        </span>
                        {prog.isComplete && (
                          <span className="font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="size-3.5" /> 100% Completed
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                        {course.title}
                      </h3>
                      {course.shortDescription && (
                        <p className="text-xs text-muted-foreground font-body line-clamp-2 mt-1 leading-relaxed">
                          {course.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-muted-foreground">Progress</span>
                        <span className="font-mono font-bold text-foreground">
                          {prog.completedItems} / {prog.totalItems} Modules ({prog.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${prog.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Next Up Item */}
                    {prog.lastActiveItem && !prog.isComplete && (
                      <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs flex items-center justify-between">
                        <div className="truncate mr-2">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                            Up Next:
                          </span>
                          <span className="font-semibold text-foreground truncate block">
                            {prog.lastActiveItem.title}
                          </span>
                        </div>
                        <a
                          href={`/${prog.lastActiveItem.type === 'lesson' ? 'lessons' : prog.lastActiveItem.type === 'quiz' ? 'quizzes' : 'assignments'}/${prog.lastActiveItem.id}?course=${course.id}`}
                          className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 cursor-pointer"
                          title="Open module"
                        >
                          <PlayCircle className="size-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 pt-0 border-t border-border/60 flex items-center justify-between gap-3 flex-wrap">
                  <a
                    href={`/courses/${course.id}`}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Syllabus</span>
                    <ExternalLink className="size-3" />
                  </a>

                  {prog.isComplete ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCertCourse(course)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Award className="size-3.5" />
                      <span>View Certificate</span>
                    </button>
                  ) : (
                    <a
                      href={
                        prog.lastActiveItem
                          ? `/${prog.lastActiveItem.type === 'lesson' ? 'lessons' : prog.lastActiveItem.type === 'quiz' ? 'quizzes' : 'assignments'}/${prog.lastActiveItem.id}?course=${course.id}`
                          : `/courses/${course.id}`
                      }
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity"
                    >
                      <span>{prog.completedItems > 0 ? 'Continue' : 'Start Course'}</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. My Lesson Notes & Highlights Hub */}
      {savedNotes.length > 0 && (
        <div className="p-6 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <BookmarkCheck className="size-4" />
              </div>
              <h3 className="font-bold font-display text-base text-foreground">
                My Saved Lesson Notes ({savedNotes.length})
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              Stored locally on your browser
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedNotes.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-foreground font-mono text-[11px] mb-1">
                    Lesson: {item.lessonId}
                  </div>
                  <p className="text-muted-foreground font-body line-clamp-3 leading-relaxed">
                    "{item.note}"
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={`/lessons/${item.lessonId}`}
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Jump to lesson</span>
                    <ArrowRight className="size-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Local Learning Data & Portability */}
      <div className="p-6 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Database className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold font-display text-base text-foreground">
                  Learning Data & Portability
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] font-bold inline-flex items-center gap-1 font-sans">
                  <ShieldCheck className="size-3" /> Auto-Saved Locally
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                All your lesson notes, quiz completions, and code sandbox solutions are automatically preserved in your browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {backupStatus && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
                {backupStatus}
              </span>
            )}

            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3.5 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Download a JSON snapshot of all your course completions, quiz answers, and study notes"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Export Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Restore your learning records from a JSON backup file"
            >
              <Upload className="size-3.5 text-muted-foreground" />
              <span>Restore Backup</span>
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".json" 
              onChange={handleImportBackup} 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertCourse && (
        <CourseCertificateModal
          courseTitle={selectedCertCourse.title}
          courseId={selectedCertCourse.id}
          isOpen={true}
          onClose={() => setSelectedCertCourse(null)}
          isCourseCompleted={progressMap[selectedCertCourse.id]?.isComplete}
          totalItems={progressMap[selectedCertCourse.id]?.totalItems}
          completedItems={progressMap[selectedCertCourse.id]?.completedItems}
        />
      )}
    </div>
  );
};
