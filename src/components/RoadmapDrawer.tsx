import React, { useEffect, useState } from 'react';
import { 
  Check, 
  Clock, 
  SkipForward, 
  RotateCcw, 
  X, 
  Copy, 
  ExternalLink, 
  Video, 
  BookOpen, 
  CheckCircle2, 
  ListChecks, 
  Sparkles 
} from 'lucide-react';

export type TopicStatus = 'done' | 'learning' | 'skipped' | 'todo';

export interface TopicData {
  id?: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  optional?: boolean;
  duration?: string;
  prerequisites?: string[];
  takeaways?: string[];
  codeSnippet?: string;
  videoUrl?: string;
  links?: { title: string; url: string }[];
  references?: { title: string; url: string }[];
  status?: TopicStatus;
}

export function RoadmapDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TopicData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TopicStatus>('todo');

  useEffect(() => {
    const handleOpen = (event: CustomEvent<TopicData>) => {
      setData(event.detail);
      setCurrentStatus(event.detail.status || 'todo');
      setIsOpen(true);
      setActiveTab('overview');
      setCopiedCode(false);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('roadmap:open-drawer', handleOpen as EventListener);
    window.addEventListener('roadmap:close-drawer', handleClose);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('roadmap:open-drawer', handleOpen as EventListener);
      window.removeEventListener('roadmap:close-drawer', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const difficultyBadges = {
    beginner: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    advanced: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  };

  const setStatus = (status: TopicStatus) => {
    setCurrentStatus(status);
    window.dispatchEvent(
      new CustomEvent('roadmap:update-status', {
        detail: {
          topicName: data.name,
          status,
        },
      })
    );
  };

  const handleCopyCode = () => {
    if (data.codeSnippet) {
      navigator.clipboard.writeText(data.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-background border-l border-border h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex justify-between items-start bg-card/60 backdrop-blur-md">
          <div className="space-y-2 max-w-[85%]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadges[data.difficulty]}`}>
                {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}
              </span>
              {data.optional && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Optional
                </span>
              )}
              {data.duration && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  <Clock className="size-3" />
                  {data.duration}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold font-display text-foreground leading-tight tracking-tight">
              {data.name}
            </h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close topic drawer"
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Roadmap.sh style Topic Status Bar */}
        <div className="px-6 py-3 bg-secondary/40 border-b border-border flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-muted-foreground shrink-0 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            Topic Status:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setStatus(currentStatus === 'done' ? 'todo' : 'done')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                currentStatus === 'done'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-card hover:bg-secondary border border-border text-foreground'
              }`}
            >
              <Check className="size-3.5" />
              <span>Done</span>
            </button>
            <button
              onClick={() => setStatus(currentStatus === 'learning' ? 'todo' : 'learning')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                currentStatus === 'learning'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-card hover:bg-secondary border border-border text-foreground'
              }`}
            >
              <Clock className="size-3.5" />
              <span>Learning</span>
            </button>
            <button
              onClick={() => setStatus(currentStatus === 'skipped' ? 'todo' : 'skipped')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                currentStatus === 'skipped'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-card hover:bg-secondary border border-border text-muted-foreground'
              }`}
            >
              <SkipForward className="size-3.5" />
              <span>Skip</span>
            </button>
            {currentStatus !== 'todo' && (
              <button
                onClick={() => setStatus('todo')}
                title="Reset status"
                className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6 bg-card/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 mr-6 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'resources' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Resources &amp; Links
            {((data.links?.length || 0) + (data.references?.length || 0) + (data.videoUrl ? 1 : 0)) > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-secondary text-secondary-foreground font-mono">
                {(data.links?.length || 0) + (data.references?.length || 0) + (data.videoUrl ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  What You Need to Know
                </h3>
                <p className="text-foreground/90 leading-relaxed font-body text-sm bg-card p-4 rounded-xl border border-border">
                  {data.description}
                </p>
              </div>

              {/* Code Example */}
              {data.codeSnippet && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                      Code Blueprint
                    </h3>
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#12161f] text-slate-100 p-4 rounded-xl overflow-x-auto text-xs font-mono border border-border/70 leading-relaxed">
                    <code>{data.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Key Takeaways */}
              {data.takeaways && data.takeaways.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <ListChecks className="size-3.5" />
                    Key Milestones
                  </h3>
                  <ul className="space-y-2.5">
                    {data.takeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90 bg-card p-3 rounded-xl border border-border">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {data.prerequisites && data.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-3">
                    Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {data.prerequisites.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              {(!data.links?.length && !data.references?.length && !data.videoUrl) ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  <p>No external resources attached to this topic yet.</p>
                </div>
              ) : (
                <>
                  {/* Video Tutorial */}
                  {data.videoUrl && (
                    <div>
                      <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-2">
                        Video Masterclass
                      </h3>
                      <a 
                        href={data.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <Video className="size-5 shrink-0" />
                          <span className="text-xs font-semibold">Watch Tutorial Video</span>
                        </div>
                        <ExternalLink className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  )}

                  {/* Recommended Links */}
                  {data.links && data.links.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-3">
                        Curated Guides &amp; Docs
                      </h3>
                      <div className="space-y-2.5">
                        {data.links.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-secondary/40 transition-all group"
                          >
                            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                              {link.title}
                            </span>
                            <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* References */}
                  {data.references && data.references.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground mb-3">
                        Further Reading &amp; Standards
                      </h3>
                      <div className="space-y-2">
                        {data.references.map((ref, idx) => (
                          <a 
                            key={idx}
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors group"
                          >
                            <span>{ref.title}</span>
                            <ExternalLink className="size-3 opacity-60 group-hover:opacity-100" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}