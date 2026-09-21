import React, { useState, useEffect } from 'react';
import { Layers, X, RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Brain, Award } from 'lucide-react';

interface Flashcard {
  id: string;
  course: string;
  category: string;
  front: string;
  back: string;
  tip: string;
}

const CARDS: Flashcard[] = [
  {
    id: 'dl-attn-formula',
    course: 'applied-deep-learning',
    category: 'Deep Learning',
    front: 'What is the mathematical equation for Scaled Dot-Product Attention?',
    back: 'Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V\n\nThe factor 1/sqrt(d_k) prevents the dot products from growing excessively large in high dimensions, which would push softmax into regions with vanishing gradients.',
    tip: 'Introduced by Vaswani et al. in "Attention Is All You Need" (2017).'
  },
  {
    id: 'dl-vanishing-grad',
    course: 'applied-deep-learning',
    category: 'Deep Learning',
    front: 'Why do deep networks suffer from Vanishing Gradients when using Sigmoid activations?',
    back: 'The derivative of Sigmoid peaks at only 0.25 (σ\'(0) = 0.25). By the chain rule, multiplying several sub-0.25 terms across 10+ layers causes gradients at earlier layers to decay exponentially toward zero, halting parameter updates.',
    tip: 'ReLU solves this because its positive derivative is constantly 1.0.'
  },
  {
    id: 'ml-bias-variance',
    course: 'foundations-of-machine-learning',
    category: 'Machine Learning',
    front: 'How do L1 (Lasso) and L2 (Ridge) regularization differ in parameter shrinkage?',
    back: 'L1 adds λΣ|w_i| causing sparse weight vectors where uninformative feature weights shrink exactly to zero (acting as feature selection).\n\nL2 adds λΣ(w_i)^2 driving weights toward zero smoothly without setting them strictly to zero.',
    tip: 'L1 has diamond-shaped constraint boundaries; L2 has spherical boundaries.'
  },
  {
    id: 'ml-gradient-descent',
    course: 'foundations-of-machine-learning',
    category: 'Machine Learning',
    front: 'What is the role of the Momentum term β in gradient descent optimization?',
    back: 'Momentum accumulates exponentially decaying moving averages of past gradients: v_t = β v_{t-1} + η ∇J(w).\n\nIt dampens high-frequency oscillations across steep ravine walls and accelerates velocity through gentle plateaus.',
    tip: 'Typically set between β = 0.85 and 0.95.'
  },
  {
    id: 'py-interning',
    course: 'python-mastery-for-ai',
    category: 'Python Mastery',
    front: 'Why does "a = 256; b = 256; a is b" evaluate to True, but 257 may evaluate to False?',
    back: 'CPython pre-allocates an array of small integer PyObject singletons in memory for integers in the range [-5, 256]. Any reference to these values shares the exact same memory address. Beyond 256, new objects are allocated dynamically.',
    tip: 'Use "is" for singleton identity checks (None, True, False); use "==" for value equality.'
  },
  {
    id: 'py-gil',
    course: 'python-mastery-for-ai',
    category: 'Python Mastery',
    front: 'Why does Python\'s GIL restrict CPU-bound multi-threading, and how is it mitigated?',
    back: 'The GIL prevents race conditions on CPython\'s internal reference counting (ob_refcnt) by allowing only one OS thread to execute Python bytecode at a time.\n\nMitigation: Use "multiprocessing" (forking separate interpreter heaps) or offload computation to C/CUDA extensions (e.g. NumPy, PyTorch) that release the GIL during execution.',
    tip: 'Python 3.13 introduces experimental free-threaded (No-GIL) builds.'
  },
  {
    id: 'rag-hnsw',
    course: 'practical-rag-and-llm-engineering',
    category: 'LLMs & RAG',
    front: 'How does HNSW (Hierarchical Navigable Small World) achieve sub-linear vector search?',
    back: 'HNSW builds a multi-layer geometric graph analogous to skip-lists. Upper layers have sparse long-range links for rapid coarse routing across vector space, while lower layers have dense short-range links for precise nearest-neighbor clustering.',
    tip: 'Provides logarithmic O(log N) search complexity vs O(N) brute-force cosine scans.'
  },
  {
    id: 'rag-reranking',
    course: 'practical-rag-and-llm-engineering',
    category: 'LLMs & RAG',
    front: 'What is the benefit of a Cross-Encoder Reranker after initial bi-encoder vector retrieval?',
    back: 'Bi-encoders embed query and documents independently into vector representations. A Cross-Encoder feeds (query + document) simultaneously through all transformer attention layers, capturing subtle token-to-token semantic interactions that bi-encoders miss.',
    tip: 'Typically used to re-rank the top-20 retrieved candidates down to top-3.'
  }
];

export const CourseFlashcardsDrawer: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lms_mastered_flashcards');
      if (stored) {
        setMasteredIds(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const filteredCards = activeCategory === 'All' 
    ? CARDS 
    : CARDS.filter(c => c.category === activeCategory || c.course === activeCategory);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleMastered = (id: string) => {
    let next: string[];
    if (masteredIds.includes(id)) {
      next = masteredIds.filter(i => i !== id);
    } else {
      next = [...masteredIds, id];
    }
    setMasteredIds(next);
    localStorage.setItem('lms_mastered_flashcards', JSON.stringify(next));
  };

  const isCurrentMastered = activeCard && masteredIds.includes(activeCard.id);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        title="Open Concept Flashcards"
      >
        <Layers className="size-3.5" />
        <span>Study Flashcards</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground font-bold">
          {masteredIds.length}/{CARDS.length}
        </span>
      </button>

      {/* Slide-out Backdrop & Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-border/80 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Brain className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-base text-foreground">AI Concept Flashcards</h3>
                  <p className="text-xs text-muted-foreground font-body">
                    Active recall &amp; spaced repetition practice.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-3 border-b border-border/60 bg-muted/10 flex items-center gap-2 overflow-x-auto text-xs">
              {['All', 'Deep Learning', 'Machine Learning', 'Python Mastery', 'LLMs & RAG'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Card Body with 3D Flip */}
            <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[320px] bg-muted/5">
              <div 
                onClick={handleFlip}
                className="w-full max-w-md min-h-[240px] rounded-2xl border border-border/80 bg-card p-6 shadow-md flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-all select-none relative group"
              >
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/40">
                  <span className="font-semibold text-primary">{activeCard?.category}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono">{currentIndex + 1} / {filteredCards.length}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="text-[11px] flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                      <RotateCw className="size-3" />
                      Click to flip
                    </span>
                  </div>
                </div>

                {/* Question / Answer Content */}
                <div className="py-4 my-auto">
                  {!isFlipped ? (
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        Question / Concept
                      </span>
                      <h4 className="font-bold font-display text-lg text-foreground leading-snug">
                        {activeCard?.front}
                      </h4>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Answer &amp; Breakdown
                      </span>
                      <p className="text-xs sm:text-sm text-foreground/90 font-body leading-relaxed whitespace-pre-line">
                        {activeCard?.back}
                      </p>
                      {activeCard?.tip && (
                        <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-2">
                          💡 {activeCard.tip}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Status */}
                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {isFlipped ? 'Answer revealed' : 'Tap card to reveal answer'}
                  </span>
                  {isCurrentMastered && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      Mastered
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Controls */}
            <div className="p-4 border-t border-border/80 bg-muted/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                  title="Previous card"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                  title="Next card"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <button
                onClick={() => activeCard && toggleMastered(activeCard.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isCurrentMastered
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                }`}
              >
                <CheckCircle2 className="size-3.5" />
                <span>{isCurrentMastered ? 'Marked as Mastered' : 'Mark as Mastered'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

