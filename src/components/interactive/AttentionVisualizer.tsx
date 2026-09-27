import React, { useState, useMemo } from 'react';
import { Sparkles, Eye, Sliders, Layers, Info, RotateCcw, Cpu, Network } from 'lucide-react';

interface AttentionVisualizerProps {
  title?: string;
  description?: string;
  defaultSentence?: string;
}

const PRESET_SENTENCES = [
  {
    label: "Coreference Resolution",
    text: "The animal did not cross the street because it was tired",
    description: "Notice how 'it' attends strongly back to 'animal' rather than 'street' in semantic heads."
  },
  {
    label: "Syntactic Relationship",
    text: "EncodeEdge empowers deep learning engineers to build modern AI systems",
    description: "Subject-verb-object dependencies with strong cross-attentions between verbs and noun phrases."
  },
  {
    label: "Transformer Formulation",
    text: "Attention mechanism computes a weighted sum over value vectors",
    description: "Direct sequence alignment showing high self-reinforcing diagonal attention."
  }
];

export const AttentionVisualizer: React.FC<AttentionVisualizerProps> = ({
  title = "Transformer Self-Attention & Heatmap Visualizer",
  description = "Explore Query-Key dot products, multi-head attention patterns, and the impact of softmax temperature scaling.",
  defaultSentence = PRESET_SENTENCES[0].text
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [inputText, setInputText] = useState(defaultSentence);
  const [temperature, setTemperature] = useState(1.0);
  const [selectedHead, setSelectedHead] = useState<number>(0);
  const [activeTokenIdx, setActiveTokenIdx] = useState<number | null>(null);

  // Tokenize by space and punctuation
  const tokens = useMemo(() => {
    return inputText
      .trim()
      .split(/\s+/)
      .filter(t => t.length > 0)
      .slice(0, 10); // keep optimal size for visual matrix
  }, [inputText]);

  // Pseudo-learned attention weight generators for 3 heads:
  // Head 0: Semantic / Coreference (connects pronouns to antecedents)
  // Head 1: Positional / Local window (attends to neighbor tokens)
  // Head 2: Global / Syntactic (attends to roots and key verbs)
  const rawScoresMatrix = useMemo(() => {
    const N = tokens.length;
    const matrix: number[][] = Array(N).fill(0).map(() => Array(N).fill(0));

    for (let i = 0; i < N; i++) {
      const qToken = tokens[i].toLowerCase().replace(/[^a-z]/g, '');
      for (let j = 0; j < N; j++) {
        const kToken = tokens[j].toLowerCase().replace(/[^a-z]/g, '');
        let baseScore = 0.5;

        if (selectedHead === 0) {
          // Head 0: Coreference & semantics
          if (qToken === 'it' && (kToken === 'animal' || kToken === 'street')) {
            baseScore = kToken === 'animal' ? 4.5 : 1.2;
          } else if (qToken === 'tired' && (kToken === 'it' || kToken === 'animal')) {
            baseScore = 3.8;
          } else if (qToken === 'empowers' && (kToken === 'engineers' || kToken === 'encodeedge')) {
            baseScore = 4.2;
          } else if (qToken === 'systems' && (kToken === 'ai' || kToken === 'modern')) {
            baseScore = 3.6;
          } else if (i === j) {
            baseScore = 1.8;
          } else {
            baseScore = 0.8 + 0.4 * Math.sin(i * 1.5 + j);
          }
        } else if (selectedHead === 1) {
          // Head 1: Local / Positional window
          const dist = Math.abs(i - j);
          baseScore = Math.max(0.1, 5.0 - dist * 1.6);
        } else {
          // Head 2: Syntactic broadcasting
          if (j === 0 || j === 1) {
            baseScore = 3.2; // sentence root/subject bias
          } else if (i === j) {
            baseScore = 2.5;
          } else {
            baseScore = 1.0 + 0.8 * Math.cos(i + j * 0.7);
          }
        }

        matrix[i][j] = baseScore;
      }
    }
    return matrix;
  }, [tokens, selectedHead]);

  // Scaled Softmax Attention: softmax(QK^T / (sqrt(d_k) * tau))
  const attentionMatrix = useMemo(() => {
    const N = tokens.length;
    if (N === 0) return [];
    const d_k = 64; // standard head dim
    const scale = Math.sqrt(d_k) * temperature;

    return rawScoresMatrix.map(row => {
      const scaled = row.map(s => s / (scale / 4)); // scaled for intuitive temperature range
      const maxVal = Math.max(...scaled);
      const exps = scaled.map(v => Math.exp(v - maxVal));
      const sum = exps.reduce((acc, curr) => acc + curr, 0);
      return exps.map(e => e / (sum || 1));
    });
  }, [rawScoresMatrix, temperature, tokens.length]);

  const focusedRowIndex = activeTokenIdx !== null && activeTokenIdx < tokens.length ? activeTokenIdx : 0;
  const currentAttentions = attentionMatrix[focusedRowIndex] || [];

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="bg-muted/40 border-b border-border/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Cpu className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold font-display text-base text-foreground">
                {title}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Transformers & Attention
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body line-clamp-1">
              {description}
            </p>
          </div>
        </div>

        {/* Head Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setSelectedHead(0)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedHead === 0 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Head 1: Semantic
          </button>
          <button
            type="button"
            onClick={() => setSelectedHead(1)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedHead === 1 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Head 2: Local
          </button>
          <button
            type="button"
            onClick={() => setSelectedHead(2)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedHead === 2 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Head 3: Syntactic
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Presets and Sentence Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" /> Select Input Sequence Preset
            </label>
            <span className="text-xs text-muted-foreground">
              Click any token below to view its incoming/outgoing attention weights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SENTENCES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedPresetIndex(idx);
                  setInputText(preset.text);
                  setActiveTokenIdx(null);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedPresetIndex === idx
                    ? 'border-primary bg-primary/5 text-foreground shadow-xs'
                    : 'border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold text-xs text-foreground mb-1">{preset.label}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-1 italic">
                  "{preset.text}"
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sequence Tokens Interactive Bar */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Eye className="size-3.5 text-primary" /> Active Query Token:
              <strong className="text-primary font-mono text-sm underline decoration-primary decoration-2 underline-offset-4">
                "{tokens[focusedRowIndex] || 'None'}"
              </strong>
              (index #{focusedRowIndex})
            </span>
            <span className="text-muted-foreground text-[11px]">
              Weights sum to {(currentAttentions.reduce((a, b) => a + b, 0) || 0).toFixed(2)} (Softmax normalized)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tokens.map((token, idx) => {
              const isFocused = idx === focusedRowIndex;
              const weight = currentAttentions[idx] || 0;
              const opacity = Math.max(0.15, weight);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTokenIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 relative ${
                    isFocused
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                      : 'bg-card hover:bg-muted text-foreground border-border/80'
                  }`}
                  style={{
                    boxShadow: !isFocused && weight > 0.25 ? `0 0 10px rgba(99, 102, 241, ${weight * 0.8})` : undefined
                  }}
                  title={`Attention score from "${tokens[focusedRowIndex]}" to "${token}": ${(weight * 100).toFixed(1)}%`}
                >
                  <span>{token}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isFocused ? 'bg-black/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {(weight * 100).toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls: Temperature Slider */}
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Sliders className="size-3.5 text-primary" /> Softmax Temperature ($\tau$):
                <span className="font-mono text-primary font-extrabold">{temperature.toFixed(2)}</span>
              </span>
              <span className="text-[11px] text-muted-foreground">
                {temperature < 0.6 ? 'Sharp (Peak on Top Token)' : temperature > 1.4 ? 'Diffuse (Uniform Attention)' : 'Balanced Sampling'}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>0.2 (Sharp)</span>
              <span>1.0 (Standard)</span>
              <span>2.5 (Diffuse)</span>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setTemperature(1.0);
                setSelectedHead(0);
                setActiveTokenIdx(0);
              }}
              className="px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" /> Reset Controls
            </button>
          </div>
        </div>

        {/* Full 2D Attention Heatmap Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <Network className="size-3.5 text-primary" /> Full Attention Matrix ($N \times N$)
            </h4>
            <span className="text-muted-foreground text-[11px]">
              Rows: Query Tokens ($Q$) | Columns: Key Tokens ($K$)
            </span>
          </div>

          <div className="overflow-x-auto p-4 rounded-2xl bg-neutral-950 text-slate-100 border border-border/80">
            <div className="min-w-max">
              {/* Column Header (Keys) */}
              <div className="flex items-center mb-1">
                <div className="w-20 text-[10px] font-mono text-slate-500 uppercase pr-2 text-right">Q \ K</div>
                {tokens.map((kTok, j) => (
                  <div
                    key={j}
                    className="w-14 text-center font-mono text-[10px] text-slate-400 truncate px-0.5"
                    title={`Key: ${kTok}`}
                  >
                    {kTok}
                  </div>
                ))}
              </div>

              {/* Rows (Queries) */}
              {tokens.map((qTok, i) => {
                const isSelectedRow = i === focusedRowIndex;
                return (
                  <div key={i} className="flex items-center mb-1">
                    <button
                      type="button"
                      onClick={() => setActiveTokenIdx(i)}
                      className={`w-20 text-left font-mono text-[11px] truncate pr-2 font-bold cursor-pointer transition-colors ${
                        isSelectedRow ? 'text-primary' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={`Click to focus Query: ${qTok}`}
                    >
                      {isSelectedRow && '▶ '}{qTok}
                    </button>

                    {attentionMatrix[i]?.map((val, j) => {
                      // Color heat intensity
                      const opacity = Math.max(0.08, val);
                      return (
                        <div
                          key={j}
                          onClick={() => setActiveTokenIdx(i)}
                          className="w-14 h-9 flex items-center justify-center font-mono text-[10px] rounded transition-all cursor-pointer m-0.5 border"
                          style={{
                            backgroundColor: `rgba(99, 102, 241, ${opacity * 0.95})`,
                            borderColor: isSelectedRow ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                            color: val > 0.35 ? '#ffffff' : '#94a3b8',
                            fontWeight: val > 0.25 ? 700 : 400
                          }}
                          title={`Query "${qTok}" -> Key "${tokens[j]}": ${(val * 100).toFixed(1)}%`}
                        >
                          {(val * 100).toFixed(0)}%
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mathematical Insight Note */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2.5">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-foreground">Mathematical Attention Formulation:</span>
            <p className="leading-relaxed">
              Each Query token $q_i$ projects a dot product onto all Key tokens $k_j$, divided by scaling factor $\sqrt{d_k} = 8.0$. 
              Softmax normalizes the raw logits into positive probabilities that sum strictly to $1.0$ across every row, weighting which semantic context vectors are extracted into the output representation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
