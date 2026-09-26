import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Clock, Video, Users, Bell, BellOff, CheckCircle2, X, ExternalLink, ChevronLeft, ChevronRight, Sparkles, MapPin, PlayCircle, BookOpen } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface LiveClass {
  id: string;
  title: string;
  description?: string;
  course?: string;
  instructor?: string;
  scheduledAt: string; // ISO string
  durationMinutes: number;
  meetingUrl?: string;
  recordingUrl?: string;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  tags?: string[];
}

// ─── Utilities ───────────────────────────────────────────────────────────────
const RSVP_KEY = 'ee_live_rsvp';

function getRSVPs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(RSVP_KEY) || '[]')); } catch { return new Set(); }
}
function toggleRSVP(id: string): boolean {
  const rsvps = getRSVPs();
  if (rsvps.has(id)) { rsvps.delete(id); } else { rsvps.add(id); }
  try { localStorage.setItem(RSVP_KEY, JSON.stringify([...rsvps])); } catch { /* noop */ }
  return rsvps.has(id);
}

const STATUS_CONFIG = {
  scheduled: { label: 'Upcoming', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
  live: { label: '🔴 LIVE NOW', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10 animate-pulse', dot: 'bg-red-500' },
  completed: { label: 'Recording Available', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-muted-foreground', bg: 'bg-muted', dot: 'bg-muted-foreground' },
};

function formatDate(iso: string): { day: string; month: string; year: string; time: string; relative: string } {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  let relative = '';
  if (diffMs < 0) relative = 'Past';
  else if (diffH < 1) relative = 'Starting soon!';
  else if (diffH < 24) relative = `In ${diffH}h`;
  else if (diffD === 1) relative = 'Tomorrow';
  else if (diffD < 7) relative = `In ${diffD} days`;
  else relative = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: d.getFullYear().toString(),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    relative,
  };
}

// ─── Class Card ───────────────────────────────────────────────────────────────
const ClassCard = ({ cls, onSelect }: { cls: LiveClass; onSelect: (c: LiveClass) => void }) => {
  const [rsvped, setRsvped] = useState(() => getRSVPs().has(cls.id));
  const cfg = STATUS_CONFIG[cls.status];
  const dt = formatDate(cls.scheduledAt);

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleRSVP(cls.id);
    setRsvped(next);
  };

  return (
    <div
      onClick={() => onSelect(cls)}
      className="group relative flex gap-4 p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Date block */}
      <div className="flex flex-col items-center justify-center w-14 shrink-0 bg-muted rounded-xl p-2 text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{dt.month}</span>
        <span className="text-2xl font-extrabold font-display text-foreground leading-none">{dt.day}</span>
        <span className="text-[10px] text-muted-foreground">{dt.year}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          {cls.status === 'live' && (
            <span className="text-[10px] font-semibold text-red-500">Join now →</span>
          )}
        </div>
        <h3 className="font-bold text-sm text-foreground leading-snug truncate group-hover:text-primary transition-colors">
          {cls.title}
        </h3>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dt.time} · {cls.durationMinutes}min</span>
          {cls.instructor && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{cls.instructor}</span>}
          <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">{dt.relative}</span>
        </div>
      </div>

      {/* RSVP Button */}
      {(cls.status === 'scheduled' || cls.status === 'live') && (
        <button
          onClick={handleRSVP}
          className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            rsvped
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:border-primary/60 hover:bg-primary/5 text-foreground'
          }`}
        >
          {rsvped ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          {rsvped ? 'Cancel' : 'RSVP'}
        </button>
      )}
      {cls.status === 'completed' && cls.recordingUrl && (
        <a
          href={cls.recordingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-all"
        >
          <PlayCircle className="w-3.5 h-3.5" /> Watch
        </a>
      )}
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const ClassDetail = ({ cls, onClose }: { cls: LiveClass; onClose: () => void }) => {
  const [rsvped, setRsvped] = useState(() => getRSVPs().has(cls.id));
  const cfg = STATUS_CONFIG[cls.status];
  const dt = formatDate(cls.scheduledAt);

  const handleRSVP = () => {
    const next = toggleRSVP(cls.id);
    setRsvped(next);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10060] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-blue-500/5">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${cfg.bg} ${cfg.color}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
          <h2 className="text-xl font-bold font-display text-foreground pr-8">{cls.title}</h2>
          {cls.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{cls.description}</p>}
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Date</div>
                <div className="text-sm font-semibold">{dt.month} {dt.day}, {dt.year}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Time</div>
                <div className="text-sm font-semibold">{dt.time} · {cls.durationMinutes}min</div>
              </div>
            </div>
            {cls.instructor && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Instructor</div>
                  <div className="text-sm font-semibold">{cls.instructor}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Capacity</div>
                <div className="text-sm font-semibold">{cls.maxParticipants} students</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {cls.tags && cls.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cls.tags.map(t => (
                <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {(cls.status === 'scheduled' || cls.status === 'live') && (
              <>
                <button
                  onClick={handleRSVP}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    rsvped ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-primary/60 hover:bg-primary/5 text-foreground'
                  }`}
                >
                  {rsvped ? <><BellOff className="w-4 h-4" /> Cancel RSVP</> : <><Bell className="w-4 h-4" /> RSVP to Attend</>}
                </button>
                {cls.meetingUrl && cls.status === 'live' && (
                  <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition-all">
                    <Video className="w-4 h-4" /> Join Live Session
                  </a>
                )}
              </>
            )}
            {cls.status === 'completed' && cls.recordingUrl && (
              <a href={cls.recordingUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                <PlayCircle className="w-4 h-4" /> Watch Recording
              </a>
            )}
          </div>

          {rsvped && cls.status === 'scheduled' && cls.meetingUrl && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-700 dark:text-emerald-300">
                <span className="font-bold">You're registered!</span> Save this link for when the class starts:&nbsp;
                <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold flex items-center gap-0.5 mt-0.5">
                  Join Meeting <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─── Filter Bar ───────────────────────────────────────────────────────────────
type FilterStatus = 'all' | 'live' | 'scheduled' | 'completed';

// ─── Main Component ───────────────────────────────────────────────────────────
interface LiveClassSchedulerProps {
  classes?: LiveClass[];
}

const DEMO_CLASSES: LiveClass[] = [
  {
    id: 'lc-001',
    title: 'Deep Learning Fundamentals — Q&A Office Hours',
    description: 'Live walkthrough of backpropagation, vanishing gradients, and the math behind attention mechanisms. Open Q&A for all enrolled students.',
    course: 'deep-learning-complete',
    instructor: 'Atul Jha',
    scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    durationMinutes: 90,
    meetingUrl: 'https://meet.google.com/example',
    maxParticipants: 150,
    status: 'live',
    tags: ['Deep Learning', 'Backprop', 'Q&A'],
  },
  {
    id: 'lc-002',
    title: 'Python Closures & Decorators — Code-Along Workshop',
    description: 'Build real decorator patterns from scratch — logging, caching, retry logic, and type checking decorators you can use in production.',
    course: 'python-mastery',
    instructor: 'Atul Jha',
    scheduledAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    durationMinutes: 60,
    meetingUrl: 'https://meet.google.com/example-2',
    maxParticipants: 100,
    status: 'scheduled',
    tags: ['Python', 'Decorators', 'Workshop'],
  },
  {
    id: 'lc-003',
    title: 'ML Project Review — Capstone Presentations',
    description: 'Students present their ML capstone projects. Peer feedback and instructor evaluation session.',
    course: 'machine-learning',
    instructor: 'Atul Jha',
    scheduledAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    durationMinutes: 120,
    meetingUrl: 'https://meet.google.com/example-3',
    maxParticipants: 50,
    status: 'scheduled',
    tags: ['ML', 'Capstone', 'Presentations'],
  },
  {
    id: 'lc-004',
    title: 'LLM Prompt Engineering Masterclass',
    description: 'Advanced prompt patterns: chain-of-thought, few-shot, self-consistency, and tree-of-thought reasoning.',
    course: 'llm-engineering',
    instructor: 'Atul Jha',
    scheduledAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    durationMinutes: 75,
    recordingUrl: 'https://youtube.com/example',
    maxParticipants: 200,
    status: 'completed',
    tags: ['LLM', 'Prompting', 'GPT'],
  },
];

export const LiveClassScheduler = ({ classes = DEMO_CLASSES }: LiveClassSchedulerProps) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<LiveClass | null>(null);
  const [rsvpCount, setRsvpCount] = useState(0);

  useEffect(() => {
    setRsvpCount(getRSVPs().size);
  }, []);

  const filtered = classes.filter(c => filter === 'all' || c.status === filter);
  const liveCount = classes.filter(c => c.status === 'live').length;

  const FILTERS: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: `All (${classes.length})` },
    { key: 'live', label: `🔴 Live${liveCount > 0 ? ` (${liveCount})` : ''}` },
    { key: 'scheduled', label: 'Upcoming' },
    { key: 'completed', label: 'Past & Recordings' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground flex items-center gap-2.5">
            <Video className="w-6 h-6 text-primary" /> Live Classes
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Attend live sessions, ask questions, and watch recordings at your own pace.
          </p>
        </div>
        {rsvpCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Bell className="w-4 h-4" />
            {rsvpCount} RSVP{rsvpCount > 1 ? 's' : ''} saved
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Classes List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No classes in this category</p>
          <p className="text-sm mt-1">Check back soon for new sessions!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(cls => (
            <ClassCard key={cls.id} cls={cls} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && <ClassDetail cls={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default LiveClassScheduler;
