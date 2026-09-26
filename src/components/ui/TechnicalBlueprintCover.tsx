import React from 'react';
import { TOPIC_METADATA } from '@/lib/topics';
import {
  Code2,
  Brain,
  Sparkles,
  LineChart,
  Bot,
  Terminal,
  BookOpen,
  Clock,
} from 'lucide-react';

interface TechnicalBlueprintCoverProps {
  title?: string;
  topic?: string;
  topics?: string[];
  readTime?: number;
  catalogId?: string;
  variant?: 'thumbnail' | 'card' | 'lead' | 'hero';
  className?: string;
  showTitle?: boolean;
  badge?: string;
}

const MONOGRAMS: Record<string, string> = {
  python: 'PY',
  'machine-learning': 'ML',
  'deep-learning': 'DL',
  'data-science': 'DS',
  'artificial-intelligence': 'AI',
  nlp: 'NLP',
  'computer-vision': 'CV',
};

const PALETTES: Record<
  string,
  { bgLight: string; bgDark: string; border: string; accent: string; text: string }
> = {
  python: {
    bgLight: 'from-[#FFF7ED] to-[#FFEDD5]',
    bgDark: 'dark:from-[#1F1710] dark:to-[#2B1E12]',
    border: '#FED7AA',
    accent: '#FFB86A',
    text: '#9A3412',
  },
  'machine-learning': {
    bgLight: 'from-[#FFF1F2] to-[#FFE4E6]',
    bgDark: 'dark:from-[#201014] dark:to-[#2E141B]',
    border: '#FECDD3',
    accent: '#FDA4AF',
    text: '#9F1239',
  },
  'deep-learning': {
    bgLight: 'from-[#FAF5FF] to-[#F3E8FF]',
    bgDark: 'dark:from-[#181126] dark:to-[#241538]',
    border: '#E9D5FF',
    accent: '#EEA9ED',
    text: '#6B21A8',
  },
  'data-science': {
    bgLight: 'from-[#F0F9FF] to-[#E0F2FE]',
    bgDark: 'dark:from-[#0C1826] dark:to-[#11243B]',
    border: '#BAE6FD',
    accent: '#A2D2FF',
    text: '#0369A1',
  },
  'artificial-intelligence': {
    bgLight: 'from-[#FEFCE8] to-[#FEF9C3]',
    bgDark: 'dark:from-[#1C1F10] dark:to-[#272B12]',
    border: '#FEF08A',
    accent: '#E5E795',
    text: '#854D0E',
  },
};

const TOPIC_SNIPPETS: Record<string, string> = {
  python: 'def __call__(self, *x):\n    return self.forward(*x)',
  'deep-learning': 'loss.backward()\noptimizer.step()',
  'machine-learning': 'w := w - α · ∇L(w)\nŷ = X · w + b',
  'data-science': 'df.groupby("cohort").agg(["mean", "std"])\nP(A|B) = P(B|A)P(A) / P(B)',
  'artificial-intelligence': "π*(s) = argmax_a ∑ P(s'|s,a)[R + γV*(s')]",
  nlp: 'Attention(Q,K,V) = softmax(QK^T / √d) · V',
};

const SCHEMATICS: Record<string, { nodes: string[]; formula: string; type: string }> = {
  python: {
    type: 'OBJECT_MEMORY_MODEL',
    nodes: ['PyObject_HEAD', 'tp_dict / Slots', 'Heap Alloc', 'GC Ref Tracker'],
    formula: 'sys.getrefcount(obj) == 1 ⟹ DECREF 0 ⟹ tp_dealloc()',
  },
  'machine-learning': {
    type: 'OPTIMIZATION_PIPELINE',
    nodes: ['Feature Tensor X', 'Hypothesis h_θ(x)', 'Loss Function J(θ)', 'AdamW ∇J Step'],
    formula: 'w_{t+1} = w_t - η / √(v̂_t + ε) · m̂_t',
  },
  'deep-learning': {
    type: 'TRANSFORMER_BLOCK',
    nodes: ['Token Embeddings', 'Multi-Head Attn', 'RMSNorm & Residual', 'SwiGLU MLP Block'],
    formula: 'Attention(Q, K, V) = softmax(Q K^T / √d_k) · V',
  },
  'data-science': {
    type: 'ANALYTIC_DECOMPOSITION',
    nodes: ['Raw Input Stream', 'Vectorized Transform', 'Covariance Σ Matrix', 'SVD Eigen Projection'],
    formula: 'X = U · Σ · V^T  |  P(Y|X) = (P(X|Y)·P(Y)) / P(X)',
  },
  'artificial-intelligence': {
    type: 'AUTONOMOUS_POLICY',
    nodes: ['Environment State S', 'Policy Network π_θ', 'Action Trajectory', 'Bellman Return Q*'],
    formula: "Q*(s, a) = E [ r + γ max_{a'} Q*(s', a') ]",
  },
  nlp: {
    type: 'SEQUENCE_ENCODING',
    nodes: ['Subword Tokenizer', 'Rotary Pos Embed', 'Masked Attention', 'Unembed Logits'],
    formula: 'softmax(logits / τ) ⟹ P(w_t | w_{<t})',
  },
};

function getTopicIcon(slug: string) {
  switch (slug) {
    case 'python':
      return Terminal;
    case 'machine-learning':
      return Brain;
    case 'deep-learning':
      return Bot;
    case 'data-science':
      return LineChart;
    case 'artificial-intelligence':
      return Sparkles;
    case 'nlp':
      return Code2;
    default:
      return BookOpen;
  }
}

export const TechnicalBlueprintCover: React.FC<TechnicalBlueprintCoverProps> = ({
  title,
  topic,
  topics,
  readTime = 6,
  catalogId = 'blueprint',
  variant = 'card',
  className = '',
  showTitle = true,
  badge,
}) => {
  const primaryTopic = topic || (topics && topics[0]) || 'machine-learning';
  const topicConfig = TOPIC_METADATA[primaryTopic] || {
    label: primaryTopic.replace(/-/g, ' ').toUpperCase(),
    color: '#E5E795',
  };

  const theme = PALETTES[primaryTopic] || PALETTES['machine-learning'];
  const IconComponent = getTopicIcon(primaryTopic);
  const monogram = MONOGRAMS[primaryTopic] || 'AI';
  const codeSnippet = TOPIC_SNIPPETS[primaryTopic] || TOPIC_SNIPPETS['machine-learning'];
  const schematic = SCHEMATICS[primaryTopic] || SCHEMATICS['machine-learning'];
  const catalogNum = Math.abs(catalogId.length % 9) + 1;

  if (variant === 'thumbnail') {
    return (
      <div
        className={`relative ${className.includes('size-') || className.includes('w-') ? '' : 'w-20 h-20'} rounded-xl shrink-0 overflow-hidden border border-border/80 bg-gradient-to-br ${theme.bgLight} ${theme.bgDark} flex flex-col items-center justify-between p-2 shadow-xs group-hover:scale-105 transition-transform duration-300 ${className}`}
      >
        <div className="w-full flex items-center justify-between">
          <span
            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-xs text-black"
            style={{ backgroundColor: topicConfig.color }}
          >
            {monogram}
          </span>
          <span className="size-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>
        <div className="my-auto text-foreground/80 group-hover:scale-110 transition-transform">
          <IconComponent className="size-6 text-foreground" />
        </div>
        <div className="text-[9px] font-mono text-muted-foreground font-semibold">
          {readTime}m read
        </div>
      </div>
    );
  }

  const aspectClass =
    variant === 'hero'
      ? 'aspect-16/9 sm:aspect-21/9'
      : variant === 'lead'
      ? 'aspect-16/10 lg:aspect-auto lg:h-full min-h-[280px] sm:min-h-[340px]'
      : 'aspect-16/10';

  return (
    <div
      className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs group-hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div
        className={`w-full h-full bg-gradient-to-br ${theme.bgLight} ${theme.bgDark} ${
          variant === 'hero' ? 'p-6 sm:p-10' : 'p-5'
        } flex flex-col justify-between relative overflow-hidden`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-12 -right-12 size-40 sm:size-56 rounded-full blur-3xl opacity-35 pointer-events-none"
          style={{ backgroundColor: theme.accent }}
        />

        {/* Technical Dot Grid */}
        <div className="absolute inset-0 opacity-[0.14] dark:opacity-[0.18] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Mathematical/Code Watermark in Background */}
        <div className="absolute right-4 bottom-10 opacity-[0.12] dark:opacity-[0.22] font-mono text-xs sm:text-sm select-none pointer-events-none text-right leading-tight whitespace-pre">
          {codeSnippet}
        </div>

        {/* Top Spec Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black shadow-xs shrink-0"
              style={{ backgroundColor: topicConfig.color }}
            >
              <IconComponent className="size-3 text-black" />
              {topicConfig.label || primaryTopic.replace(/-/g, ' ')}
            </span>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-background/90 text-foreground backdrop-blur-xs border border-border/60 shadow-xs shrink-0">
                {badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-background/80 dark:bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border/60">
              <Clock className="size-3" />
              {readTime}m
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] text-muted-foreground/80 tracking-wider">
              REF: {monogram}-0{catalogNum}
            </span>
          </div>
        </div>

        {/* Schematic Flow for Lead Variant */}
        {variant === 'lead' && (
          <div className="relative z-10 my-auto py-3 flex flex-col justify-center gap-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/90 pb-1 border-b border-black/5 dark:border-white/5">
              <span className="flex items-center gap-1.5 font-bold tracking-wider text-foreground/90">
                <span className="size-2 rounded-full animate-ping" style={{ backgroundColor: theme.accent }} />
                SCHEMATIC // {schematic.type}
              </span>
              <span className="text-[10px] tracking-widest uppercase opacity-75">SPEC v2.4</span>
            </div>

            {/* Stage Flow Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
              {schematic.nodes.map((nodeName, idx) => (
                <div
                  key={idx}
                  className="relative p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-background/70 dark:bg-black/40 backdrop-blur-xs flex flex-col justify-between shadow-2xs group-hover:border-primary/40 transition-colors"
                >
                  <span className="text-[9px] font-mono text-muted-foreground font-semibold">STAGE 0{idx + 1}</span>
                  <span className="text-[11px] font-bold font-mono text-foreground mt-1 truncate">{nodeName}</span>
                </div>
              ))}
            </div>

            {/* Formula / Kernel Row */}
            <div className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 font-mono text-[11px] text-foreground/85 border border-black/5 dark:border-white/5 flex items-center justify-between overflow-x-auto scrollbar-none">
              <span className="text-muted-foreground shrink-0 mr-2 text-[10px] font-bold">KERNEL:</span>
              <code className="text-[10px] sm:text-[11px] font-semibold text-primary truncate">{schematic.formula}</code>
            </div>
          </div>
        )}

        {/* Center Title for Hero or Card when showTitle is true */}
        {variant !== 'lead' && showTitle && title && (
          <div className="relative z-10 my-auto py-3">
            <div
              className={`text-foreground font-display font-bold ${
                variant === 'hero'
                  ? 'text-2xl sm:text-3xl md:text-4xl'
                  : 'text-lg sm:text-xl'
              } line-clamp-2 leading-[1.25] tracking-tight group-hover:text-primary transition-colors`}
            >
              {title}
            </div>
          </div>
        )}

        {/* Visual Topic Monogram for Card when showTitle is false */}
        {variant !== 'lead' && !showTitle && (
          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <div className="size-14 sm:size-16 rounded-2xl border border-black/10 dark:border-white/10 bg-background/60 dark:bg-black/40 backdrop-blur-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
              <IconComponent className="size-7 sm:size-8 text-foreground/90" />
            </div>
          </div>
        )}

        {/* Footer Technical Stamp */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-muted-foreground border-t border-black/10 dark:border-white/10 pt-2.5">
          <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-foreground/80 font-semibold">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            VERIFIED BLUEPRINT
          </span>
          <span className="font-mono font-bold text-foreground/90">
            SYS // {monogram}-REV2
          </span>
        </div>
      </div>
    </div>
  );
};

