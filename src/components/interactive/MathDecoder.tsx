import React, { useState, useMemo } from 'react';
import katex from 'katex';
import { 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  LayoutGrid, 
  List, 
  Sparkles, 
  ArrowRight,
  FlaskConical
} from 'lucide-react';
import { MATH_GLOSSARY_ITEMS, type MathSymbolItem } from '@/lib/math-glossary-data';

interface MathDecoderProps {
  items?: MathSymbolItem[];
  onSelectLab?: (labId: string) => void;
}

interface MathFormulaRendererProps {
  latex?: string;
  glyph?: string;
  inline?: boolean;
}

const MathFormulaRenderer: React.FC<MathFormulaRendererProps> = ({ latex, glyph, inline = false }) => {
  const renderedHtml = useMemo(() => {
    const raw = latex || glyph;
    if (!raw) return null;
    try {
      return katex.renderToString(raw, {
        displayMode: !inline,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [latex, glyph, inline]);

  if (renderedHtml) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        className="katex-rendered inline-block text-foreground align-middle"
      />
    );
  }

  return <code className="font-mono text-primary dark:text-[#E5E795] text-xs sm:text-sm">{glyph || latex}</code>;
};

const CATEGORIES = [
  { id: 'all', label: 'All Subjects' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'machine-learning', label: 'Machine Learning' },
  { id: 'deep-learning', label: 'Deep Learning & AI' },
  { id: 'linear-algebra', label: 'Linear Algebra' },
  { id: 'optimization', label: 'Optimization & Calculus' },
  { id: 'probability', label: 'Probability' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const MathDecoder: React.FC<MathDecoderProps> = ({ items, onSelectLab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const baseItems = items && items.length > 0 ? items : MATH_GLOSSARY_ITEMS;

  // Compute available starting letters in the current dataset
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    baseItems.forEach(item => {
      const firstChar = item.name.trim().charAt(0).toUpperCase();
      if (firstChar >= 'A' && firstChar <= 'Z') {
        letters.add(firstChar);
      }
    });
    return letters;
  }, [baseItems]);

  // Filter items by category, letter, and search query
  const filteredItems = useMemo(() => {
    return baseItems
      .filter((item) => {
        // Category filter
        const matchesCategory = 
          selectedCategory === 'all' || 
          item.category === selectedCategory ||
          (selectedCategory === 'deep-learning' && (item.category === 'deep-learning' || item.category === 'nlp')) ||
          (selectedCategory === 'statistics' && (item.category === 'statistics' || item.category === 'mathematics'));

        // Alphabetical filter
        const firstLetter = item.name.trim().charAt(0).toUpperCase();
        const matchesLetter = selectedLetter === 'all' || firstLetter === selectedLetter;

        // Search query
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory && matchesLetter;

        const matchesSearch = 
          item.name.toLowerCase().includes(q) ||
          item.glyph.toLowerCase().includes(q) ||
          (item.latex && item.latex.toLowerCase().includes(q)) ||
          item.meaning.toLowerCase().includes(q) ||
          (item.example && item.example.toLowerCase().includes(q));

        return matchesCategory && matchesLetter && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [baseItems, searchQuery, selectedCategory, selectedLetter]);

  const handleCopy = (item: MathSymbolItem) => {
    const textToCopy = item.latex || item.glyph;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'statistics':
      case 'mathematics':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'machine-learning':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'deep-learning':
      case 'nlp':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      case 'linear-algebra':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'optimization':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-secondary text-foreground/80 border-border';
    }
  };

  const formatCategoryLabel = (category: string) => {
    switch (category) {
      case 'statistics': return 'Statistics';
      case 'mathematics': return 'Math';
      case 'machine-learning': return 'Machine Learning';
      case 'deep-learning': return 'Deep Learning';
      case 'linear-algebra': return 'Linear Algebra';
      case 'optimization': return 'Optimization';
      case 'probability': return 'Probability';
      default: return category.replace('-', ' ');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header & Search Console ────────────────────────────────────── */}
      <div className="p-5 sm:p-7 rounded-3xl bg-card border border-border shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary dark:text-[#E5E795] border border-primary/25 text-[11px] font-bold uppercase tracking-wider">
                Math, AI &amp; ML Glossary
              </span>
              <span className="text-xs text-muted-foreground font-mono font-medium">
                {filteredItems.length} concepts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
              Essential Math &amp; AI Definitions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Clear, concise explanations and formulas for core concepts in statistics, mathematics, machine learning, and deep learning.
            </p>
          </div>

          {/* Search Bar & View Mode Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mean, gradient, softmax..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="p-1 rounded-xl bg-secondary border border-border flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-card text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' 
                    ? 'bg-card text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List view"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E5E795] text-black font-bold shadow-xs'
                    : 'bg-secondary/60 text-foreground/75 dark:text-zinc-300 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Alphabetical A-Z Quick Filter */}
        <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-border text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setSelectedLetter('all')}
            className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              selectedLetter === 'all'
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            All A–Z
          </button>
          {ALPHABET.map((char) => {
            const hasItems = availableLetters.has(char);
            const isSelected = selectedLetter === char;

            return (
              <button
                key={char}
                type="button"
                disabled={!hasItems}
                onClick={() => setSelectedLetter(char)}
                className={`w-6 h-6 rounded-md font-bold transition-all text-center ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : hasItems
                      ? 'text-foreground/80 hover:text-foreground hover:bg-secondary cursor-pointer'
                      : 'text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
          <BookOpen className="size-10 text-muted-foreground mx-auto opacity-50" />
          <h4 className="font-bold text-foreground text-base">No concepts matched your filters</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or reset the category and letter filters.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLetter('all'); }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Grid View ──────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between space-y-3.5 group hover:shadow-sm"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category Pill & Copy Button */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(item.category)}`}>
                      {formatCategoryLabel(item.category)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold'
                          : 'border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title="Copy formula / LaTeX"
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Formula</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Term Name */}
                  <h3 className="font-bold font-display text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.name}
                  </h3>

                  {/* Mathematical Formula Rendered with KaTeX */}
                  {(item.latex || item.glyph) && (
                    <div className="py-2.5 px-3.5 rounded-xl bg-secondary/60 border border-border flex items-center justify-between overflow-x-auto custom-scrollbar text-sm sm:text-base min-h-[44px]">
                      <div className="overflow-x-auto text-foreground">
                        <MathFormulaRenderer latex={item.latex} glyph={item.glyph} inline={false} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase shrink-0 ml-2">Formula</span>
                    </div>
                  )}

                  {/* Concise Definition */}
                  <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-sans">
                    {item.meaning}
                  </p>

                  {/* Brief Example / Takeaway */}
                  {item.example && (
                    <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-primary text-[11px]">
                        <Sparkles className="size-3" />
                        <span>Example / Note:</span>
                      </div>
                      <p className="leading-relaxed text-foreground/80">
                        {item.example}
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional Lab Simulator Link */}
                {item.relatedLabId && (
                  <div className="pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">Interactive Simulator:</span>
                    {onSelectLab ? (
                      <button
                        type="button"
                        onClick={() => onSelectLab(item.relatedLabId!)}
                        className="text-primary font-bold text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>Try Simulator</span>
                        <ArrowRight className="size-3" />
                      </button>
                    ) : (
                      <a
                        href={`/labs#${item.relatedLabId}`}
                        className="text-primary font-bold text-xs inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Try Simulator</span>
                        <ArrowRight className="size-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Compact Table / Dictionary View ───────────────────────────────── */
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Concept / Term</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Formula / Notation</th>
                  <th className="py-3 px-4">Definition &amp; Key Insight</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const isCopied = copiedId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors group">
                      <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap align-top">
                        <span className="font-display group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(item.category)}`}>
                          {formatCategoryLabel(item.category)}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        <div className="bg-secondary/60 px-3 py-1.5 rounded-lg border border-border inline-flex items-center text-xs sm:text-sm text-foreground overflow-x-auto max-w-[220px]">
                          <MathFormulaRenderer latex={item.latex} glyph={item.glyph} inline={true} />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs sm:text-sm text-foreground/85 leading-relaxed align-top max-w-md">
                        <p>{item.meaning}</p>
                        {item.example && (
                          <p className="mt-1 text-xs text-muted-foreground font-mono">
                            ↳ {item.example}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right align-top whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(item)}
                            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                            }`}
                            title="Copy formula"
                          >
                            {isCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                          </button>

                          {item.relatedLabId && (
                            onSelectLab ? (
                              <button
                                type="button"
                                onClick={() => onSelectLab(item.relatedLabId!)}
                                className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-primary transition-colors cursor-pointer"
                                title="Open interactive simulator"
                              >
                                <FlaskConical className="size-3.5" />
                              </button>
                            ) : (
                              <a
                                href={`/labs#${item.relatedLabId}`}
                                className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-primary transition-colors"
                                title="Open interactive simulator"
                              >
                                <FlaskConical className="size-3.5" />
                              </a>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
