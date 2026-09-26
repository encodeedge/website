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
  const catalogNum = Math.abs(catalogId.length % 9) + 1;

  if (variant === 'thumbnail') {
    return (
      <div
        className={`relative w-20 h-20 rounded-xl shrink-0 overflow-hidden border border-border/80 bg-gradient-to-br ${theme.bgLight} ${theme.bgDark} flex flex-col items-center justify-between p-2 shadow-xs group-hover:scale-105 transition-transform duration-300 ${className}`}
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
      ? 'aspect-16/10 lg:aspect-auto lg:h-full'
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
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black shadow-xs shrink-0"
            style={{ backgroundColor: topicConfig.color }}
          >
            <IconComponent className="size-3 text-black" />
            {topicConfig.label || primaryTopic.replace(/-/g, ' ')}
          </span>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-background/80 dark:bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border/60">
              <Clock className="size-3" />
              {readTime}m
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] text-muted-foreground/80 tracking-wider">
              REF: {monogram}-0{catalogNum}
            </span>
          </div>
        </div>

        {/* Center Title (Optional, used on card variants) */}
        {showTitle && title && (
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

