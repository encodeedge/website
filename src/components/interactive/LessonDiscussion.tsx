import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Send, 
  Sparkles, 
  Award, 
  Filter, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Reply,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { persistentStorage } from '@/lib/storage';

interface QuestionReply {
  id: string;
  author: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'ta';
  content: string;
  createdAt: string;
  upvotes: number;
}

interface QuestionThread {
  id: string;
  title: string;
  content: string;
  author: string;
  role: 'student' | 'instructor';
  createdAt: string;
  upvotes: number;
  isResolved: boolean;
  hasInstructorReply: boolean;
  tags: string[];
  replies: QuestionReply[];
}

interface LessonDiscussionProps {
  lessonId: string;
  lessonTitle: string;
}

const DEFAULT_SEEDS: Record<string, QuestionThread[]> = {
  default: [
    {
      id: 'seed-1',
      title: 'How should we choose between manual gradient computation and PyTorch autograd in production?',
      content: 'In practice, do engineering teams ever write custom analytical backward passes, or is torch.autograd fast enough for virtually all deep learning architectures?',
      author: 'Alex Rivera',
      role: 'student',
      createdAt: '2 days ago',
      upvotes: 18,
      isResolved: true,
      hasInstructorReply: true,
      tags: ['Autograd', 'Optimization', 'Performance'],
      replies: [
        {
          id: 'rep-1',
          author: 'Atul Jha (Instructor)',
          role: 'instructor',
          content: 'Great question Alex! 99% of the time, PyTorch autograd via C++ engine is optimal and faster than Python code. However, custom backward passes via `torch.autograd.Function` are essential when: (1) You write custom Triton/CUDA kernels, (2) You need memory-efficient gradient checkpointing, or (3) An operation has a known analytical shortcut that avoids storing massive intermediate activation tensors.',
          createdAt: '1 day ago',
          upvotes: 24
        }
      ]
    },
    {
      id: 'seed-2',
      title: 'Clarification on matrix dimensions during batch tensor operations',
      content: 'When broadcasting a 1D bias vector across a 2D batch of samples, does PyTorch create duplicate memory copies or does it just adjust the stride metadata?',
      author: 'Priya Sharma',
      role: 'student',
      createdAt: '4 days ago',
      upvotes: 12,
      isResolved: true,
      hasInstructorReply: true,
      tags: ['Tensors', 'Broadcasting', 'Memory'],
      replies: [
        {
          id: 'rep-2',
          author: 'EncodeEdge Teaching Assistant',
          role: 'ta',
          content: 'PyTorch performs zero-copy broadcasting by setting the stride along the expanded dimension to 0! This means multiple index steps read the exact same memory address without allocating any extra RAM.',
          createdAt: '3 days ago',
          upvotes: 15
        }
      ]
    }
  ]
};

export const LessonDiscussion: React.FC<LessonDiscussionProps> = ({ lessonId, lessonTitle }) => {
  const storageKey = `lms_discussions_${lessonId}`;

  const [threads, setThreads] = useState<QuestionThread[]>([]);
  const [filter, setFilter] = useState<'all' | 'instructor' | 'unresolved'>('all');
  const [isAsking, setIsAsking] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Question');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());

  // Load persisted threads or fallback to seed
  useEffect(() => {
    // Immediate synchronous load
    const stored = persistentStorage.getSync<QuestionThread[]>(storageKey);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setThreads(stored);
    } else {
      const initial = DEFAULT_SEEDS[lessonId] || DEFAULT_SEEDS['default'];
      setThreads(initial);
      persistentStorage.set(storageKey, initial);
    }

    const upvotesStored = persistentStorage.getSync<string[]>(`lms_upvotes_${lessonId}`);
    if (upvotesStored && Array.isArray(upvotesStored)) {
      setUserUpvotes(new Set(upvotesStored));
    }

    // Async hydration from IndexedDB
    persistentStorage.get<QuestionThread[]>(storageKey).then((asyncStored) => {
      if (asyncStored && Array.isArray(asyncStored) && asyncStored.length > 0) {
        setThreads(asyncStored);
      }
    });
  }, [lessonId]);

  const saveThreads = (updated: QuestionThread[]) => {
    setThreads(updated);
    persistentStorage.set(storageKey, updated);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThread: QuestionThread = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: 'You (Learner)',
      role: 'student',
      createdAt: 'Just now',
      upvotes: 1,
      isResolved: false,
      hasInstructorReply: false,
      tags: [newTag],
      replies: []
    };

    const updated = [newThread, ...threads];
    saveThreads(updated);
    setNewTitle('');
    setNewContent('');
    setIsAsking(false);
  };

  const handleToggleUpvote = (threadId: string) => {
    const nextUpvotes = new Set(userUpvotes);
    const hasUpvoted = nextUpvotes.has(threadId);

    const updated = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          upvotes: hasUpvoted ? t.upvotes - 1 : t.upvotes + 1
        };
      }
      return t;
    });

    if (hasUpvoted) {
      nextUpvotes.delete(threadId);
    } else {
      nextUpvotes.add(threadId);
    }

    setUserUpvotes(nextUpvotes);
    saveThreads(updated);
    persistentStorage.set(`lms_upvotes_${lessonId}`, [...nextUpvotes]);
  };

  const handlePostReply = (threadId: string) => {
    const text = replyTextMap[threadId];
    if (!text || !text.trim()) return;

    const newReply: QuestionReply = {
      id: `r-${Date.now()}`,
      author: 'You (Learner)',
      role: 'student',
      content: text.trim(),
      createdAt: 'Just now',
      upvotes: 0
    };

    const updated = threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    });

    saveThreads(updated);
    setReplyTextMap(prev => ({ ...prev, [threadId]: '' }));
  };

  const filteredThreads = useMemo(() => {
    if (filter === 'instructor') {
      return threads.filter(t => t.hasInstructorReply);
    }
    if (filter === 'unresolved') {
      return threads.filter(t => !t.isResolved);
    }
    return threads;
  }, [threads, filter]);

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm not-prose my-10">
      {/* Top Header Bar */}
      <div className="bg-muted/40 border-b border-border/60 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-display text-base text-foreground">
                Lesson Discussion & Q&A
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {threads.length} Questions
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Ask questions, discuss edge cases, and get answers from instructors and peers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAsking(!isAsking)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="size-3.5" />
          {isAsking ? 'Cancel' : 'Ask a Question'}
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Form: Ask a New Question */}
        {isAsking && (
          <form onSubmit={handlePostQuestion} className="p-4 rounded-2xl bg-muted/20 border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-primary" /> Post Your Question
              </span>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="text-xs bg-card border border-border/80 rounded-lg px-2 py-1 text-foreground"
              >
                <option value="Question">Question</option>
                <option value="Code Issue">Code Issue</option>
                <option value="Intuition">Intuition</option>
                <option value="Performance">Performance</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="e.g. Why do we scale dot products by sqrt(d_k) in self-attention?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-card border border-border/80 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />

            <textarea
              placeholder="Provide context, details on what you tested, or code snippets..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full text-xs px-3 py-2 rounded-xl bg-card border border-border/80 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAsking(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="size-3" /> Post Question
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Discussions
            </button>
            <button
              type="button"
              onClick={() => setFilter('instructor')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'instructor'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldCheck className="size-3 text-emerald-500" /> Instructor Answered
            </button>
            <button
              type="button"
              onClick={() => setFilter('unresolved')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'unresolved'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Unresolved
            </button>
          </div>

          <span className="text-[11px] text-muted-foreground">
            Showing {filteredThreads.length} of {threads.length} threads
          </span>
        </div>

        {/* Thread List */}
        <div className="space-y-4">
          {filteredThreads.map((thread) => {
            const hasUpvoted = userUpvotes.has(thread.id);
            return (
              <div
                key={thread.id}
                className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/10 space-y-3 transition-all hover:border-border"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold font-display text-sm text-foreground">
                        {thread.title}
                      </h4>
                      {thread.isResolved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle className="size-2.5" /> Resolved
                        </span>
                      )}
                      {thread.tags.map((tag, tidx) => (
                        <span key={tidx} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground">{thread.author}</span>
                      <span>•</span>
                      <span>{thread.createdAt}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleUpvote(thread.id)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      hasUpvoted
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title="Upvote question"
                  >
                    <ThumbsUp className="size-3" />
                    <span>{thread.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  {thread.content}
                </p>

                {/* Replies Accordion / List */}
                {thread.replies.length > 0 && (
                  <div className="pt-2 border-t border-border/60 space-y-2.5">
                    {thread.replies.map((reply) => {
                      const isInstructor = reply.role === 'instructor' || reply.role === 'ta';
                      return (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            isInstructor
                              ? 'bg-primary/5 border-primary/20 text-foreground'
                              : 'bg-card border-border/60 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-foreground">{reply.author}</span>
                              {isInstructor && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                  <ShieldCheck className="size-2.5" /> Staff Verified
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{reply.createdAt}</span>
                          </div>
                          <p className="leading-relaxed font-body text-xs text-foreground/90">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Input Box */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a helpful response or follow-up question..."
                    value={replyTextMap[thread.id] || ''}
                    onChange={(e) => setReplyTextMap(prev => ({ ...prev, [thread.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostReply(thread.id)}
                    className="flex-1 text-xs px-3 py-1.5 rounded-xl bg-card border border-border/80 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handlePostReply(thread.id)}
                    className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border/80 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Reply className="size-3" /> Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
