import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, BookOpen, Map, HelpCircle, GraduationCap, ArrowRight, Loader2, Clock, Sparkles } from 'lucide-react';
import { trackSearchQuery } from '@/lib/analytics';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SearchItem {
  id: string;
  type: 'blog' | 'roadmap' | 'quiz' | 'course';
  title: string;
  description: string;
  tags: string[];
  topics: string[];
  url: string;
  image: string | null;
  readTime: number | null;
  questionCount?: number;
}

// ─── Fuzzy search — no external deps ────────────────────────────────────────
function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return q.length * 3; // substring match wins
  let score = 0, qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) { score++; qi++; }
  }
  return qi === q.length ? score : 0;
}

function searchItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) return [];
  const results = items
    .map(item => {
      const titleScore = fuzzyScore(query, item.title) * 3;
      const descScore = fuzzyScore(query, item.description);
      const tagScore = item.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ? 5 : 0;
      const topicScore = item.topics.some(t => t.toLowerCase().includes(query.toLowerCase())) ? 4 : 0;
      const total = titleScore + descScore + tagScore + topicScore;
      return { item, score: total };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(r => r.item);
  return results;
}

// ─── Type metadata ───────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  blog: { label: 'Article', Icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  roadmap: { label: 'Roadmap', Icon: Map, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  quiz: { label: 'Quiz', Icon: HelpCircle, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  course: { label: 'Course', Icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

const RECENT_KEY = 'ee_recent_searches';
function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function addRecent(query: string) {
  const prev = getRecent().filter(q => q !== query);
  const next = [query, ...prev].slice(0, 5);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* noop */ }
}

// ─── Search Result Row ───────────────────────────────────────────────────────
const ResultRow = ({
  item,
  active,
  onClick,
}: {
  item: SearchItem;
  active: boolean;
  onClick: () => void;
}) => {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.Icon;
  return (
    <a
      href={item.url}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer no-underline ${
        active ? 'bg-primary/10 text-foreground' : 'hover:bg-muted/60 text-foreground'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{item.title}</div>
        <div className="text-xs text-muted-foreground truncate">{item.description}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
      </div>
    </a>
  );
};

// ─── Main Search Overlay ─────────────────────────────────────────────────────
export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Fetch index on first open
  useEffect(() => {
    if (!open) return;
    setRecent(getRecent());
    if (allItems.length > 0) {
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }
    setLoading(true);
    fetch('/search.json')
      .then(r => r.json())
      .then((data: SearchItem[]) => { setAllItems(data); setLoading(false); })
      .catch(() => setLoading(false));
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Search as you type & track search query
  useEffect(() => {
    setActiveIndex(0);
    const matched = searchItems(allItems, query);
    setResults(matched);

    if (query.trim().length >= 3) {
      const timer = setTimeout(() => {
        trackSearchQuery(query, matched.length);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [query, allItems]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const handleSelect = useCallback((item?: SearchItem) => {
    if (item) {
      addRecent(query.trim());
      window.location.href = item.url;
    }
    close();
  }, [query, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); handleSelect(results[activeIndex]); }
  };

  const handleRecentClick = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  // Group results by type
  const grouped: Record<string, SearchItem[]> = {};
  for (const item of results) {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/60 border border-border/60 rounded-lg hover:bg-muted transition-colors"
        aria-label="Search (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          {loading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search articles, roadmaps, quizzes, courses..."
            className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-1 rounded font-mono">Esc</kbd>
        </div>

        {/* Results / Empty state */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-4">
              {recent.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    <Clock className="w-3 h-3" /> Recent
                  </div>
                  <div className="space-y-1">
                    {recent.map(q => (
                      <button
                        key={q}
                        onClick={() => handleRecentClick(q)}
                        className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted/60 rounded-lg transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-2">
                <Sparkles className="w-3 h-3" /> Quick access
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['blog', 'roadmap', 'quiz', 'course'] as const).map(type => {
                  const cfg = TYPE_CONFIG[type];
                  const Icon = cfg.Icon;
                  const urls: Record<string, string> = { blog: '/blog/', roadmap: '/roadmaps/', quiz: '/quizzes/', course: '/courses/' };
                  return (
                    <a key={type} href={urls[type]} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${cfg.bg} no-underline hover:opacity-80 transition-opacity`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                      <span className={`text-sm font-semibold ${cfg.color}`}>All {cfg.label}s</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">No results for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or browse by category</p>
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(grouped).map(([type, items]) => {
                const cfg = TYPE_CONFIG[type as SearchItem['type']];
                return (
                  <div key={type}>
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {cfg.label}s
                    </div>
                    {items.map(item => (
                      <ResultRow
                        key={item.id}
                        item={item}
                        active={results[activeIndex]?.id === item.id}
                        onClick={() => { addRecent(query.trim()); }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded">↵</kbd> open</span>
          </div>
          <span>{results.length > 0 ? `${results.length} result${results.length > 1 ? 's' : ''}` : allItems.length > 0 ? `${allItems.length} items indexed` : ''}</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GlobalSearch;
