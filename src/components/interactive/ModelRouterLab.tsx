import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  DollarSign, 
  Zap, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Cpu, 
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ModelSpecs {
  id: string;
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  contextWindow: number;
  qualityScore: number; // 1-100 benchmark
  medianLatencyMs: number;
  tokensPerSec: number;
  isParetoOptimal: boolean;
  tier: 'frontier-reasoning' | 'workhorse' | 'ultra-fast';
}

const MODELS_CATALOG: ModelSpecs[] = [
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    inputPer1M: 0.10,
    outputPer1M: 0.40,
    contextWindow: 1048576,
    qualityScore: 84,
    medianLatencyMs: 310,
    tokensPerSec: 135,
    isParetoOptimal: true,
    tier: 'ultra-fast'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    contextWindow: 128000,
    qualityScore: 89,
    medianLatencyMs: 480,
    tokensPerSec: 75,
    isParetoOptimal: true,
    tier: 'workhorse'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    contextWindow: 128000,
    qualityScore: 82,
    medianLatencyMs: 390,
    tokensPerSec: 110,
    isParetoOptimal: false,
    tier: 'ultra-fast'
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B (Groq/Together)',
    provider: 'Meta (Open Weights)',
    inputPer1M: 0.59,
    outputPer1M: 0.79,
    contextWindow: 128000,
    qualityScore: 86,
    medianLatencyMs: 280,
    tokensPerSec: 180,
    isParetoOptimal: true,
    tier: 'workhorse'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek',
    inputPer1M: 0.55,
    outputPer1M: 2.19,
    contextWindow: 128000,
    qualityScore: 95,
    medianLatencyMs: 1400,
    tokensPerSec: 45,
    isParetoOptimal: true,
    tier: 'frontier-reasoning'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    contextWindow: 200000,
    qualityScore: 94,
    medianLatencyMs: 650,
    tokensPerSec: 68,
    isParetoOptimal: false,
    tier: 'workhorse'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    inputPer1M: 2.50,
    outputPer1M: 10.00,
    contextWindow: 128000,
    qualityScore: 92,
    medianLatencyMs: 580,
    tokensPerSec: 85,
    isParetoOptimal: false,
    tier: 'workhorse'
  }
];

export const ModelRouterLab: React.FC = () => {
  const [inputTokens, setInputTokens] = useState<number>(1500);
  const [outputTokens, setOutputTokens] = useState<number>(500);
  const [monthlyRequests, setMonthlyRequests] = useState<number>(100000);
  const [minQuality, setMinQuality] = useState<number>(80);

  const modelCalculations = useMemo(() => {
    return MODELS_CATALOG.map(model => {
      const inputCostPerReq = (inputTokens / 1_000_000) * model.inputPer1M;
      const outputCostPerReq = (outputTokens / 1_000_000) * model.outputPer1M;
      const totalCostPerReq = inputCostPerReq + outputCostPerReq;
      const monthlyCost = totalCostPerReq * monthlyRequests;

      const meetsFilter = model.qualityScore >= minQuality;

      return {
        ...model,
        totalCostPerReq,
        monthlyCost,
        meetsFilter
      };
    }).sort((a, b) => a.monthlyCost - b.monthlyCost);
  }, [inputTokens, outputTokens, monthlyRequests, minQuality]);

  const recommendedModel = modelCalculations.find(m => m.meetsFilter && m.isParetoOptimal) || modelCalculations[0];

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-bold uppercase tracking-wider">
              System Design & Inference Engineering
            </span>
            <span className="text-xs font-mono text-muted-foreground">Fanout-Inspired</span>
          </div>
          <h3 className="font-bold font-display text-xl sm:text-2xl text-foreground mt-1">
            Model Router & Cost-Context Pareto Explorer
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-0.5">
            Model routing simulator. Build a transparent cost-context Pareto frontier across LLM models for production inference workloads.
          </p>
        </div>

        {recommendedModel && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs shrink-0 space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
              <Sparkles className="size-3.5" />
              <span>Recommended Pareto Winner</span>
            </div>
            <div className="font-bold text-foreground text-sm font-display">
              {recommendedModel.name}
            </div>
            <div className="text-[11px] text-muted-foreground">
              ${recommendedModel.monthlyCost.toFixed(2)}/mo @ {recommendedModel.qualityScore} Benchmark
            </div>
          </div>
        )}
      </div>

      {/* Interactive Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
        {/* Slider 1: Input Tokens */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Prompt Tokens:</span>
            <span className="font-mono text-primary font-bold">{inputTokens.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="200"
            max="32000"
            step="200"
            value={inputTokens}
            onChange={(e) => setInputTokens(parseInt(e.target.value, 10))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>200</span>
            <span>16k</span>
            <span>32k</span>
          </div>
        </div>

        {/* Slider 2: Output Tokens */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Completion Tokens:</span>
            <span className="font-mono text-primary font-bold">{outputTokens.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="50"
            max="4000"
            step="50"
            value={outputTokens}
            onChange={(e) => setOutputTokens(parseInt(e.target.value, 10))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>50</span>
            <span>2k</span>
            <span>4k</span>
          </div>
        </div>

        {/* Slider 3: Monthly Requests */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Monthly Requests:</span>
            <span className="font-mono text-primary font-bold">
              {monthlyRequests >= 1_000_000 ? `${(monthlyRequests / 1_000_000).toFixed(1)}M` : `${monthlyRequests / 1000}k`}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="2000000"
            step="10000"
            value={monthlyRequests}
            onChange={(e) => setMonthlyRequests(parseInt(e.target.value, 10))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>10k</span>
            <span>1M</span>
            <span>2M</span>
          </div>
        </div>

        {/* Slider 4: Quality Threshold */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Min Benchmark Score:</span>
            <span className="font-mono text-primary font-bold">{minQuality}/100</span>
          </div>
          <input
            type="range"
            min="75"
            max="95"
            step="1"
            value={minQuality}
            onChange={(e) => setMinQuality(parseInt(e.target.value, 10))}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>75 (Fast)</span>
            <span>85 (General)</span>
            <span>95 (Reasoning)</span>
          </div>
        </div>
      </div>

      {/* Model Catalog & Pareto Frontier Matrix */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <Scale className="size-3.5 text-primary" /> Cost vs Quality Frontier Ranking
          </h4>
          <span className="text-[11px] text-muted-foreground">
            Ranked by estimated monthly bill for your workload
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Model</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Quality Score</th>
                <th className="p-3">Speed (TPS)</th>
                <th className="p-3">Cost / 1k Reqs</th>
                <th className="p-3">Monthly Bill</th>
                <th className="p-3">Pareto Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {modelCalculations.map((m) => {
                const isSelected = m.id === recommendedModel?.id;
                const isOverBudget = !m.meetsFilter;

                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isSelected 
                        ? 'bg-primary/5 font-semibold' 
                        : isOverBudget 
                        ? 'opacity-50 hover:bg-muted/20' 
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="p-3 font-sans font-bold text-foreground flex items-center gap-2">
                      {m.name}
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded bg-primary text-primary-foreground text-[10px]">
                          Best Pick
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-sans text-muted-foreground">{m.provider}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${m.qualityScore >= 90 ? 'bg-purple-500' : 'bg-primary'}`} 
                            style={{ width: `${m.qualityScore}%` }} 
                          />
                        </div>
                        <span className="font-bold text-foreground">{m.qualityScore}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{m.tokensPerSec} tps</td>
                    <td className="p-3 text-muted-foreground">
                      ${(m.totalCostPerReq * 1000).toFixed(3)}
                    </td>
                    <td className="p-3">
                      <span className={`font-bold ${m.monthlyCost > 1000 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        ${m.monthlyCost.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      {m.isParetoOptimal ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Pareto Optimal
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Dominated
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
