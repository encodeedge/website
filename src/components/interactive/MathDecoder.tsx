import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Filter, 
  AlertTriangle,
  Lightbulb,
  Volume2,
  Code2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MATH_GLOSSARY_ITEMS, type MathSymbolItem } from '@/lib/math-glossary-data';

interface MathDecoderProps {
  onSelectLab?: (labId: string) => void;
}

export const MathDecoder: React.FC<MathDecoderProps> = ({ onSelectLab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Notations' },
    { id: 'deep-learning', label: 'Deep Learning & Attention' },
    { id: 'optimization', label: 'Optimization & Gradients' },
    { id: 'linear-algebra', label: 'Linear Algebra & Tensors' },
    { id: 'probability', label: 'Probability & Loss' },
    { id: 'inference', label: 'Inference & System Scaling' },
  ];

  const filteredItems = useMemo(() => {
    return MATH_GLOSSARY_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        item.name.toLowerCase().includes(q) ||
        item.glyph.toLowerCase().includes(q) ||
        item.latex.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyLatex = (item: MathSymbolItem) => {
    navigator.clipboard.writeText(item.latex);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Header */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider">
                Math Decoder & AI Notation Library
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {filteredItems.length} of {MATH_GLOSSARY_ITEMS.length} entries
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground mt-1">
              Decode Mathematical Notation in AI Papers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-0.5">
              Demystify mathematical symbols, formulas, pronunciation, and LaTeX definitions across machine learning research.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search symbol, LaTeX, concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-muted/40 border border-border focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Notation Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
          <BookOpen className="size-10 text-muted-foreground mx-auto opacity-50" />
          <h4 className="font-bold text-foreground">No matching symbols found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try searching for terms like "attention", "gradient", "softmax", "L2", or "convolution".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Card Header: Glyph & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {item.category.replace('-', ' ')}
                      </span>
                      <h3 className="font-bold font-display text-lg text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopyLatex(item)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                      title="Copy LaTeX markup to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>LaTeX</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Math Glyph Showcase Box */}
                  <div className="p-3.5 rounded-2xl bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-sm sm:text-base font-bold overflow-x-auto flex items-center justify-between gap-2 shadow-inner">
                    <code>{item.glyph}</code>
                    <span className="text-[10px] text-neutral-500 font-sans uppercase shrink-0">Notation</span>
                  </div>

                  {/* Pronunciation Guide */}
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl border border-border/50">
                    <Volume2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Pronunciation: </strong>
                      <span className="italic">{item.pronunciation}</span>
                    </div>
                  </div>

                  {/* Plain English Meaning */}
                  <p className="text-xs sm:text-sm text-foreground/90 font-body leading-relaxed">
                    {item.meaning}
                  </p>

                  {/* Practical ML Example */}
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-primary text-[11px]">
                      <Lightbulb className="size-3.5" />
                      <span>Production Application:</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.example}
                    </p>
                  </div>

                  {/* Ambiguity / Gotcha */}
                  <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                      <AlertTriangle className="size-3.5" />
                      <span>Ambiguity & Common Pitfall:</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.ambiguity}
                    </p>
                  </div>
                </div>

                {/* Footer Link to Interactive Lab (if available) */}
                {item.relatedLabId && (
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Interactive Simulator available
                    </span>
                    {onSelectLab ? (
                      <button
                        onClick={() => onSelectLab(item.relatedLabId!)}
                        className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Launch {item.relatedLabTitle || 'Simulator'}</span>
                        <ArrowRight className="size-3" />
                      </button>
                    ) : (
                      <a
                        href={`/labs#${item.relatedLabId}`}
                        className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Launch {item.relatedLabTitle || 'Simulator'}</span>
                        <ArrowRight className="size-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
