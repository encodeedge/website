import React, { useState, useMemo } from 'react';
import {
  Radar as RadarIcon,
  Layers,
  Cpu,
  Database,
  Sliders,
  Sparkles,
  Download,
  Copy,
  Check,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  DollarSign,
  Binary,
  ArrowRight,
  Info,
  Maximize2,
  BarChart2,
  Activity,
  Terminal,
  Server,
  RefreshCw
} from 'lucide-react';

export interface ModelProfile {
  id: string;
  name: string;
  creator: string;
  type: 'frontier' | 'open-weights' | 'hybrid-reasoning';
  pricing: { input1M: number; output1M: number };
  contextWindow: string;
  scores: {
    costEfficiency: number;      // 0-100
    latencyTtft: number;         // 0-100
    contextRetention: number;    // 0-100
    reasoningCoding: number;     // 0-100
    toolCallingAgentic: number;  // 0-100
    privacySelfHost: number;     // 0-100
  };
  metrics: {
    ttftMs: number;
    tokensPerSec: number;
    aimeScore: string;
    vramFootprint: string;
  };
  highlight: string;
  color: string;
}

export interface VectorDbProfile {
  id: string;
  name: string;
  type: 'specialized-rust' | 'cloud-serverless' | 'relational-extension' | 'distributed-scale' | 'embedded';
  license: string;
  quantization: string;
  filteringSpeed: 'Ultra' | 'High' | 'Moderate';
  selfHostEase: 'Trivial' | 'Standard' | 'Complex';
  costTier: 'Free/Self-host' | 'Low' | 'Medium' | 'High';
  bestFor: string;
  scores: {
    throughput: number;
    p99Latency: number;
    payloadFiltering: number;
    hybridSearch: number;
    operationalSimplicity: number;
  };
}

export interface ServingEngineProfile {
  id: string;
  name: string;
  specialty: string;
  keyFeature: string;
  latencyRating: 'S+' | 'S' | 'A';
  hardware: string;
}

const MODELS_CATALOG: ModelProfile[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    creator: 'DeepSeek',
    type: 'hybrid-reasoning',
    pricing: { input1M: 0.55, output1M: 2.19 },
    contextWindow: '128K',
    scores: {
      costEfficiency: 92,
      latencyTtft: 45,
      contextRetention: 86,
      reasoningCoding: 98,
      toolCallingAgentic: 82,
      privacySelfHost: 88,
    },
    metrics: {
      ttftMs: 950,
      tokensPerSec: 38,
      aimeScore: '79.8%',
      vramFootprint: 'MoE 37B active / ~150GB FP8',
    },
    highlight: 'Open-weights reasoning champion matching OpenAI o1 on math & algorithms at 1/20th the cost.',
    color: '#06b6d4', // cyan-500
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    creator: 'Anthropic',
    type: 'frontier',
    pricing: { input1M: 3.00, output1M: 15.00 },
    contextWindow: '200K',
    scores: {
      costEfficiency: 68,
      latencyTtft: 75,
      contextRetention: 95,
      reasoningCoding: 99,
      toolCallingAgentic: 99,
      privacySelfHost: 15,
    },
    metrics: {
      ttftMs: 420,
      tokensPerSec: 72,
      aimeScore: '84.2%',
      vramFootprint: 'Cloud API Only',
    },
    highlight: 'State-of-the-art hybrid reasoning with unmatched tool reliability and computer-use agentics.',
    color: '#f97316', // orange-500
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    creator: 'OpenAI',
    type: 'frontier',
    pricing: { input1M: 2.50, output1M: 10.00 },
    contextWindow: '128K',
    scores: {
      costEfficiency: 74,
      latencyTtft: 88,
      contextRetention: 91,
      reasoningCoding: 90,
      toolCallingAgentic: 96,
      privacySelfHost: 15,
    },
    metrics: {
      ttftMs: 340,
      tokensPerSec: 88,
      aimeScore: '76.6%',
      vramFootprint: 'Cloud API Only',
    },
    highlight: 'Ultra-low latency multimodal API with rock-solid parallel function calling and JSON schema guarantees.',
    color: '#10b981', // emerald-500
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    creator: 'Google',
    type: 'frontier',
    pricing: { input1M: 0.10, output1M: 0.40 },
    contextWindow: '1M (1,048,576)',
    scores: {
      costEfficiency: 99,
      latencyTtft: 98,
      contextRetention: 98,
      reasoningCoding: 85,
      toolCallingAgentic: 91,
      privacySelfHost: 15,
    },
    metrics: {
      ttftMs: 210,
      tokensPerSec: 145,
      aimeScore: '71.2%',
      vramFootprint: 'Cloud API Only',
    },
    highlight: 'Astronomical 1M token needle-in-haystack context at fractional pennies, with sub-250ms TTFT.',
    color: '#6366f1', // indigo-500
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    creator: 'Meta',
    type: 'open-weights',
    pricing: { input1M: 0.35, output1M: 0.60 },
    contextWindow: '128K',
    scores: {
      costEfficiency: 90,
      latencyTtft: 82,
      contextRetention: 83,
      reasoningCoding: 86,
      toolCallingAgentic: 88,
      privacySelfHost: 96,
    },
    metrics: {
      ttftMs: 380,
      tokensPerSec: 90,
      aimeScore: '68.4%',
      vramFootprint: '42GB (4-bit AWQ) / 80GB (FP8)',
    },
    highlight: 'Industry enterprise workhorse. Runs on a single 80GB H100 or dual RTX 4090s with quantization.',
    color: '#ec4899', // pink-500
  },
  {
    id: 'qwen-2-5-72b',
    name: 'Qwen 2.5 72B Instruct',
    creator: 'Alibaba Cloud',
    type: 'open-weights',
    pricing: { input1M: 0.35, output1M: 0.65 },
    contextWindow: '128K',
    scores: {
      costEfficiency: 89,
      latencyTtft: 80,
      contextRetention: 89,
      reasoningCoding: 94,
      toolCallingAgentic: 89,
      privacySelfHost: 95,
    },
    metrics: {
      ttftMs: 410,
      tokensPerSec: 85,
      aimeScore: '78.5%',
      vramFootprint: '44GB (4-bit AWQ) / 85GB (FP8)',
    },
    highlight: 'Superior coding, multilingual, and synthetic dataset synthesis capabilities matching early frontier models.',
    color: '#eab308', // yellow-500
  }
];

const VECTOR_DBS_CATALOG: VectorDbProfile[] = [
  {
    id: 'qdrant',
    name: 'Qdrant',
    type: 'specialized-rust',
    license: 'Apache 2.0 Open Source',
    quantization: 'Binary, Scalar, Product (PQ)',
    filteringSpeed: 'Ultra',
    selfHostEase: 'Standard',
    costTier: 'Free/Self-host',
    bestFor: 'High-throughput RAG with complex metadata payload filtering & quantization savings',
    scores: { throughput: 96, p99Latency: 94, payloadFiltering: 98, hybridSearch: 95, operationalSimplicity: 90 }
  },
  {
    id: 'pinecone',
    name: 'Pinecone Serverless',
    type: 'cloud-serverless',
    license: 'Proprietary Cloud',
    quantization: 'Automated Managed',
    filteringSpeed: 'High',
    selfHostEase: 'Trivial',
    costTier: 'Medium',
    bestFor: 'Zero-DevOps teams wanting instant serverless scale without managing indexes or nodes',
    scores: { throughput: 88, p99Latency: 91, payloadFiltering: 85, hybridSearch: 88, operationalSimplicity: 99 }
  },
  {
    id: 'pgvector',
    name: 'pgvector + pgvectorscale',
    type: 'relational-extension',
    license: 'PostgreSQL License',
    quantization: 'StreamingDiskANN & SBQ',
    filteringSpeed: 'High',
    selfHostEase: 'Trivial',
    costTier: 'Free/Self-host',
    bestFor: 'Companies with existing PostgreSQL data seeking unified ACID transactions & vector queries',
    scores: { throughput: 82, p99Latency: 84, payloadFiltering: 96, hybridSearch: 92, operationalSimplicity: 94 }
  },
  {
    id: 'milvus',
    name: 'Milvus / Zilliz',
    type: 'distributed-scale',
    license: 'Apache 2.0 Open Source',
    quantization: 'IVF-PQ, HNSW-SQ, CAGRA (GPU)',
    filteringSpeed: 'Ultra',
    selfHostEase: 'Complex',
    costTier: 'Medium',
    bestFor: 'Hyper-scale platforms with 100M+ vectors, GPU index acceleration, and Kubernetes infra',
    scores: { throughput: 99, p99Latency: 96, payloadFiltering: 90, hybridSearch: 91, operationalSimplicity: 68 }
  },
  {
    id: 'chroma',
    name: 'Chroma DB',
    type: 'embedded',
    license: 'Apache 2.0 Open Source',
    quantization: 'HNSW baseline',
    filteringSpeed: 'Moderate',
    selfHostEase: 'Trivial',
    costTier: 'Free/Self-host',
    bestFor: 'Local development, hackathons, and lightweight desktop agent prototypes',
    scores: { throughput: 65, p99Latency: 72, payloadFiltering: 75, hybridSearch: 70, operationalSimplicity: 98 }
  }
];

const SERVING_ENGINES: ServingEngineProfile[] = [
  { id: 'sglang', name: 'SGLang', specialty: 'RadixAttention Prefix Caching', keyFeature: '3.2x faster multi-turn agent latency via tree cache sharing', latencyRating: 'S+', hardware: 'NVIDIA Tensor Core GPUs (Ampere / Hopper)' },
  { id: 'vllm', name: 'vLLM', specialty: 'PagedAttention & Continuous Batching', keyFeature: 'De-facto industry standard for high-throughput concurrent inference', latencyRating: 'S', hardware: 'NVIDIA, AMD ROCm, AWS Neuron' },
  { id: 'tensorrt-llm', name: 'TensorRT-LLM', specialty: 'NVIDIA Low-Level Kernel Fusion', keyFeature: 'Maximum raw hardware saturation & FP8 gemm throughput', latencyRating: 'S+', hardware: 'NVIDIA H100 / B200 exclusively' },
  { id: 'ollama', name: 'Ollama / llama.cpp', specialty: 'Local GGUF & CPU/Metal Offload', keyFeature: 'Effortless on-device offline testing & workstation development', latencyRating: 'A', hardware: 'Apple Silicon, Consumer GPUs, x86 CPU' },
];

const PRESETS = [
  {
    id: 'enterprise-security',
    label: 'Enterprise Sovereign (Air-Gapped)',
    icon: '🛡️',
    description: 'Zero external API egress, strict data governance, local weights, and self-hosted vector stores.',
    weights: { costEfficiency: 1.0, latencyTtft: 1.0, contextRetention: 1.0, reasoningCoding: 1.2, toolCallingAgentic: 1.4, privacySelfHost: 2.0 },
    primaryModelId: 'llama-3-3-70b',
    compareModelId: 'deepseek-r1',
    vectorDbId: 'qdrant',
    servingEngineId: 'sglang'
  },
  {
    id: 'realtime-voice',
    label: 'Real-Time Voice & Live Streams',
    icon: '⚡',
    description: 'Sub-300ms time-to-first-token requirement, ultra-fast streaming responses, and high concurrency.',
    weights: { costEfficiency: 1.2, latencyTtft: 2.0, contextRetention: 0.8, reasoningCoding: 0.7, toolCallingAgentic: 1.3, privacySelfHost: 0.5 },
    primaryModelId: 'gemini-2-0-flash',
    compareModelId: 'gpt-4o',
    vectorDbId: 'qdrant',
    servingEngineId: 'vllm'
  },
  {
    id: 'deep-reasoning',
    label: 'Autonomous Coding & Deep Reasoning',
    icon: '🧠',
    description: 'Maximum algorithmic precision, multi-step problem solving, math proofs, and complex agentic workflows.',
    weights: { costEfficiency: 0.6, latencyTtft: 0.6, contextRetention: 1.3, reasoningCoding: 2.0, toolCallingAgentic: 1.8, privacySelfHost: 0.8 },
    primaryModelId: 'claude-3-7-sonnet',
    compareModelId: 'deepseek-r1',
    vectorDbId: 'qdrant',
    servingEngineId: 'sglang'
  },
  {
    id: 'lean-startup',
    label: 'Bootstrapped / Cost-Optimized',
    icon: '💰',
    description: 'Maximum performance per dollar spent, managed zero-ops architecture, and generous free-tier headroom.',
    weights: { costEfficiency: 2.0, latencyTtft: 1.2, contextRetention: 1.4, reasoningCoding: 1.0, toolCallingAgentic: 1.1, privacySelfHost: 0.4 },
    primaryModelId: 'gemini-2-0-flash',
    compareModelId: 'qwen-2-5-72b',
    vectorDbId: 'pinecone',
    servingEngineId: 'vllm'
  }
];

const DIMENSIONS = [
  { key: 'costEfficiency', label: 'Cost Efficiency', icon: DollarSign, unit: '$/token' },
  { key: 'latencyTtft', label: 'TTFT & Latency', icon: Zap, unit: 'ms' },
  { key: 'contextRetention', label: '128k+ Context Needle', icon: Layers, unit: 'Accuracy' },
  { key: 'reasoningCoding', label: 'Reasoning & Coding', icon: Terminal, unit: 'AIME/SWE' },
  { key: 'toolCallingAgentic', label: 'Tool Calling & Agents', icon: Sparkles, unit: 'Reliability' },
  { key: 'privacySelfHost', label: 'Privacy & Self-Host', icon: ShieldCheck, unit: 'On-prem' },
] as const;

export const TechStackRadar: React.FC = () => {
  // State
  const [selectedPrimaryId, setSelectedPrimaryId] = useState<string>('claude-3-7-sonnet');
  const [selectedCompareId, setSelectedCompareId] = useState<string>('deepseek-r1');
  const [selectedVectorDbId, setSelectedVectorDbId] = useState<string>('qdrant');
  const [selectedServingId, setSelectedServingId] = useState<string>('sglang');
  const [activeTab, setActiveTab] = useState<'radar' | 'vectordb' | 'matrix' | 'spec'>('radar');
  const [copied, setCopied] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('deep-reasoning');

  // Dimension weights (1.0 default)
  const [weights, setWeights] = useState<Record<string, number>>({
    costEfficiency: 0.6,
    latencyTtft: 0.6,
    contextRetention: 1.3,
    reasoningCoding: 2.0,
    toolCallingAgentic: 1.8,
    privacySelfHost: 0.8
  });

  const primaryModel = useMemo(
    () => MODELS_CATALOG.find((m) => m.id === selectedPrimaryId) || MODELS_CATALOG[0],
    [selectedPrimaryId]
  );

  const compareModel = useMemo(
    () => MODELS_CATALOG.find((m) => m.id === selectedCompareId) || MODELS_CATALOG[1],
    [selectedCompareId]
  );

  const vectorDb = useMemo(
    () => VECTOR_DBS_CATALOG.find((v) => v.id === selectedVectorDbId) || VECTOR_DBS_CATALOG[0],
    [selectedVectorDbId]
  );

  const servingEngine = useMemo(
    () => SERVING_ENGINES.find((s) => s.id === selectedServingId) || SERVING_ENGINES[0],
    [selectedServingId]
  );

  // Apply preset
  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setWeights(preset.weights);
    setSelectedPrimaryId(preset.primaryModelId);
    setSelectedCompareId(preset.compareModelId);
    setSelectedVectorDbId(preset.vectorDbId);
    setSelectedServingId(preset.servingEngineId);
  };

  // Compute weighted composite fitness score for any model (0-100)
  const calculateFitness = (model: ModelProfile) => {
    let totalScore = 0;
    let totalWeight = 0;
    DIMENSIONS.forEach((dim) => {
      const w = weights[dim.key] ?? 1.0;
      totalScore += model.scores[dim.key] * w;
      totalWeight += w;
    });
    return Math.round(totalScore / totalWeight);
  };

  const primaryFitness = useMemo(() => calculateFitness(primaryModel), [primaryModel, weights]);
  const compareFitness = useMemo(() => calculateFitness(compareModel), [compareModel, weights]);

  // Compute Radar SVG Geometry (6 vertices)
  const radarGeometry = useMemo(() => {
    const size = 320;
    const center = size / 2;
    const radius = size * 0.40;
    const count = DIMENSIONS.length; // 6

    const getCoordinates = (index: number, score: number) => {
      // Rotate by -90 deg so first axis points straight UP
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      const r = (score / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    };

    // Concentric grid rings: 20%, 40%, 60%, 80%, 100%
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0].map((level) => {
      const points = DIMENSIONS.map((_, i) => {
        const { x, y } = getCoordinates(i, level * 100);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return { level: Math.round(level * 100), points };
    });

    // Axis lines & labels
    const axes = DIMENSIONS.map((dim, i) => {
      const outer = getCoordinates(i, 100);
      const labelPos = getCoordinates(i, 118);
      return {
        ...dim,
        x1: center,
        y1: center,
        x2: outer.x,
        y2: outer.y,
        lx: labelPos.x,
        ly: labelPos.y,
      };
    });

    // Primary model polygon
    const primaryPoints = DIMENSIONS.map((dim, i) => {
      const { x, y } = getCoordinates(i, primaryModel.scores[dim.key]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Compare model polygon
    const comparePoints = DIMENSIONS.map((dim, i) => {
      const { x, y } = getCoordinates(i, compareModel.scores[dim.key]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return { size, center, rings, axes, primaryPoints, comparePoints };
  }, [primaryModel, compareModel]);

  // Copy Architectural Blueprint as Markdown
  const copySpec = () => {
    const markdown = `# EncodeEdge AI Architecture Blueprint
**Generated:** ${new Date().toLocaleDateString()}
**Workload Target:** ${PRESETS.find((p) => p.id === activePreset)?.label || 'Custom Weighted Architecture'}

## 1. Primary Foundation Model
- **Model:** ${primaryModel.name} (${primaryModel.creator})
- **Type:** ${primaryModel.type}
- **Context Window:** ${primaryModel.contextWindow}
- **Pricing:** \$${primaryModel.pricing.input1M} / 1M In, \$${primaryModel.pricing.output1M} / 1M Out
- **Composite Fitness Score:** ${primaryFitness} / 100
- **Benchmark Highlights:** AIME: ${primaryModel.metrics.aimeScore} | TTFT: ${primaryModel.metrics.ttftMs}ms | VRAM: ${primaryModel.metrics.vramFootprint}

## 2. Compared Alternative
- **Model:** ${compareModel.name} (${compareModel.creator})
- **Composite Fitness Score:** ${compareFitness} / 100

## 3. Vector Database & Indexing Layer
- **Engine:** ${vectorDb.name} (${vectorDb.type})
- **License:** ${vectorDb.license}
- **Quantization:** ${vectorDb.quantization}
- **Best For:** ${vectorDb.bestFor}
- **Throughput Index Score:** ${vectorDb.scores.throughput}/100 | P99 Latency Score: ${vectorDb.scores.p99Latency}/100

## 4. Serving / Inference Runtime
- **Runtime:** ${servingEngine.name}
- **Acceleration Specialty:** ${servingEngine.specialty}
- **Key Advantage:** ${servingEngine.keyFeature}
- **Recommended Hardware:** ${servingEngine.hardware}

## 5. Architectural Dimension Weights
${DIMENSIONS.map((d) => `- ${d.label}: ${weights[d.key]}x priority`).join('\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <RadarIcon className="w-3.5 h-3.5" />
                Live Benchmark Matrix
              </span>
              <span className="text-xs text-zinc-500 font-mono">Q1 2025 Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
              AI Tech Stack & Benchmark Radar
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl">
              Multi-dimensional Pareto matrix evaluating Frontier vs Open-Weights models, vector search engines, and inference runtimes across enterprise latency, cost, and reliability metrics.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={copySpec}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Spec Copied!' : 'Copy Architecture Spec'}</span>
            </button>
          </div>
        </div>

        {/* Workload Presets */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Architecture Target / Enterprise Profile:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{preset.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">{preset.label}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-1 text-sm font-medium">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <RadarIcon className="w-4 h-4 text-indigo-400" />
          <span>Interactive Radar Chart</span>
        </button>
        <button
          onClick={() => setActiveTab('vectordb')}
          className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'vectordb'
              ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Vector DB & Retrieval Layer</span>
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          <span>Full Model Benchmark Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('spec')}
          className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'spec'
              ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Engineered Stack Spec</span>
        </button>
      </div>

      {/* Main Tab 1: Interactive Radar Chart View */}
      {activeTab === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Radar & Comparison Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col items-center">
              {/* Model Selectors */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800/80">
                <div className="w-full sm:w-1/2 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>Primary Stack Target:</span>
                  </div>
                  <select
                    value={selectedPrimaryId}
                    onChange={(e) => setSelectedPrimaryId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
                  >
                    {MODELS_CATALOG.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.creator} • {m.contextWindow})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-1/2 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    <span>Comparison Baseline:</span>
                  </div>
                  <select
                    value={selectedCompareId}
                    onChange={(e) => setSelectedCompareId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-orange-400"
                  >
                    {MODELS_CATALOG.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.creator} • {m.contextWindow})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* The SVG Radar Polygon Canvas */}
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center py-2">
                <svg
                  viewBox={`0 0 ${radarGeometry.size} ${radarGeometry.size}`}
                  className="w-full h-full overflow-visible"
                >
                  {/* Concentric rings */}
                  {radarGeometry.rings.map((ring) => (
                    <polygon
                      key={ring.level}
                      points={ring.points}
                      fill="none"
                      stroke="#27272a" // zinc-800
                      strokeWidth="1"
                      strokeDasharray={ring.level === 100 ? undefined : '2,3'}
                    />
                  ))}

                  {/* Axes lines */}
                  {radarGeometry.axes.map((axis, i) => (
                    <g key={i}>
                      <line
                        x1={axis.x1}
                        y1={axis.y1}
                        x2={axis.x2}
                        y2={axis.y2}
                        stroke="#3f3f46" // zinc-700
                        strokeWidth="1"
                      />
                      {/* Label */}
                      <text
                        x={axis.lx}
                        y={axis.ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#a1a1aa" // zinc-400
                        fontSize="9"
                        fontWeight="600"
                        className="font-mono select-none"
                      >
                        {axis.label}
                      </text>
                    </g>
                  ))}

                  {/* Primary Model Polygon */}
                  <polygon
                    points={radarGeometry.primaryPoints}
                    fill="#06b6d4" // cyan-500
                    fillOpacity="0.28"
                    stroke="#22d3ee" // cyan-400
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                  />

                  {/* Compare Model Polygon */}
                  <polygon
                    points={radarGeometry.comparePoints}
                    fill="#f97316" // orange-500
                    fillOpacity="0.22"
                    stroke="#fb923c" // orange-400
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeDasharray="4,2"
                    className="transition-all duration-500"
                  />

                  {/* Center Dot */}
                  <circle cx={radarGeometry.center} cy={radarGeometry.center} r="3" fill="#71717a" />
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-white font-semibold">{primaryModel.name}</span>
                  <span className="text-cyan-400 font-bold">({primaryFitness} pts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1.5 rounded-full bg-orange-400 border border-dashed border-orange-300" />
                  <span className="text-zinc-300">{compareModel.name}</span>
                  <span className="text-orange-400 font-bold">({compareFitness} pts)</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400">P90 Latency (TTFT)</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {primaryModel.metrics.ttftMs}ms
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  vs {compareModel.metrics.ttftMs}ms
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400">Generation Speed</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {primaryModel.metrics.tokensPerSec} t/s
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  vs {compareModel.metrics.tokensPerSec} t/s
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400">AIME Reasoning</div>
                <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                  {primaryModel.metrics.aimeScore}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  vs {compareModel.metrics.aimeScore}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-mono text-zinc-400">Context Window</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {primaryModel.contextWindow}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  vs {compareModel.contextWindow}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Dimension Weight Sliders & Bottleneck Audit */}
          <div className="lg:col-span-5 space-y-6">
            {/* Weight Sliders */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Workload Priority Weights
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setWeights({
                      costEfficiency: 1.0,
                      latencyTtft: 1.0,
                      contextRetention: 1.0,
                      reasoningCoding: 1.0,
                      toolCallingAgentic: 1.0,
                      privacySelfHost: 1.0,
                    })
                  }
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset 1.0x</span>
                </button>
              </div>

              <div className="space-y-4">
                {DIMENSIONS.map((dim) => {
                  const Icon = dim.icon;
                  const currentWeight = weights[dim.key] ?? 1.0;
                  return (
                    <div key={dim.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                          <Icon className="w-3.5 h-3.5 text-zinc-400" />
                          {dim.label}
                        </span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {currentWeight.toFixed(1)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="2.0"
                        step="0.1"
                        value={currentWeight}
                        onChange={(e) =>
                          setWeights((prev) => ({
                            ...prev,
                            [dim.key]: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Low Priority</span>
                        <span>Standard</span>
                        <span>Critical (2x)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture Bottleneck & Compatibility Warning */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Stack Synergy & Guardrail Audit
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                {primaryModel.type === 'hybrid-reasoning' && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <span className="font-bold">Reasoning Token Expansion:</span> {primaryModel.name} emits 2,000 to 12,000 internal thinking tokens. Set downstream client timeouts &gt; 30s and implement token streaming buffering.
                  </div>
                )}

                {primaryModel.type === 'open-weights' && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                    <span className="font-bold">Hardware Sizing Note:</span> {primaryModel.metrics.vramFootprint}. Pair with <strong>{servingEngine.name}</strong> for continuous batching and PagedAttention memory reuse.
                  </div>
                )}

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <span className="font-bold text-white">Recommended Vector DB Pairing:</span> For {primaryModel.name}, <strong>{vectorDb.name}</strong> provides {vectorDb.quantization} with {vectorDb.filteringSpeed} metadata filter indexing.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Vector DB & Retrieval Layer */}
      {activeTab === 'vectordb' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {VECTOR_DBS_CATALOG.map((db) => {
              const isSelected = selectedVectorDbId === db.id;
              return (
                <button
                  key={db.id}
                  onClick={() => setSelectedVectorDbId(db.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      {db.type}
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">{db.name}</div>
                  </div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2">{db.bestFor}</div>
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{db.costTier}</span>
                    <span>Q: {db.filteringSpeed}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Vector DB Deep Dive */}
          <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold uppercase">
                    {vectorDb.type}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{vectorDb.license}</span>
                </div>
                <h2 className="text-2xl font-bold font-serif text-white mt-1">{vectorDb.name}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-400">Throughput Rating</div>
                  <div className="text-xl font-bold font-mono text-cyan-400">
                    {vectorDb.scores.throughput} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Scores Bar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs text-zinc-400 font-mono">QPS / Throughput</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {vectorDb.scores.throughput}%
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full"
                    style={{ width: `${vectorDb.scores.throughput}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs text-zinc-400 font-mono">P99 Latency SLA</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {vectorDb.scores.p99Latency}%
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full"
                    style={{ width: `${vectorDb.scores.p99Latency}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs text-zinc-400 font-mono">Payload Filter Speed</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {vectorDb.scores.payloadFiltering}%
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full"
                    style={{ width: `${vectorDb.scores.payloadFiltering}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs text-zinc-400 font-mono">Dense + Sparse Hybrid</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {vectorDb.scores.hybridSearch}%
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-400 h-full"
                    style={{ width: `${vectorDb.scores.hybridSearch}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-xs text-zinc-400 font-mono">DevOps Simplicity</div>
                <div className="text-2xl font-bold font-mono text-white">
                  {vectorDb.scores.operationalSimplicity}%
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${vectorDb.scores.operationalSimplicity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quantization & Engineering Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  <span>Supported Quantization Tech:</span>
                </div>
                <div className="text-sm font-semibold text-white">{vectorDb.quantization}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Reduces vector index RAM footprint by 75% to 95% while retaining up to 98% Recall@10 accuracy during candidate retrieval.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Production Recommendation:</span>
                </div>
                <div className="text-sm font-semibold text-white">{vectorDb.bestFor}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Self-hosting difficulty is <strong>{vectorDb.selfHostEase}</strong> with an operating cost baseline rated at <strong>{vectorDb.costTier}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Full Benchmark Matrix Table */}
      {activeTab === 'matrix' && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
          <div className="mb-4">
            <h3 className="text-lg font-bold font-serif text-white">Comprehensive 2025 Model Benchmark Grid</h3>
            <p className="text-xs text-zinc-400">Normalized across standard MMLU-Pro, AIME 2024, SWE-bench Verified, and real-world API pricing.</p>
          </div>
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-3">Model</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Input $/1M</th>
                <th className="py-3 px-3">Output $/1M</th>
                <th className="py-3 px-3">Context</th>
                <th className="py-3 px-3">TTFT (ms)</th>
                <th className="py-3 px-3">AIME %</th>
                <th className="py-3 px-3">Fit Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {MODELS_CATALOG.map((m) => {
                const fit = calculateFitness(m);
                const isPrimary = m.id === selectedPrimaryId;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedPrimaryId(m.id)}
                    className={`hover:bg-zinc-900/60 transition-colors cursor-pointer ${
                      isPrimary ? 'bg-cyan-950/30 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-white flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-400">\${m.pricing.input1M.toFixed(2)}</td>
                    <td className="py-3 px-3 text-emerald-400">\${m.pricing.output1M.toFixed(2)}</td>
                    <td className="py-3 px-3 text-zinc-300">{m.contextWindow}</td>
                    <td className="py-3 px-3 text-zinc-300">{m.metrics.ttftMs}ms</td>
                    <td className="py-3 px-3 text-cyan-400">{m.metrics.aimeScore}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        {fit} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Main Tab 4: Engineered Stack Spec */}
      {activeTab === 'spec' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                  Synthesized Production Stack Blueprint
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  {primaryModel.name} + {vectorDb.name} + {servingEngine.name}
                </h2>
              </div>
              <button
                onClick={copySpec}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Spec Markdown'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Layer 1: Model */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Cpu className="w-4 h-4" />
                  <span>Layer 1: Reasoning & Synthesis</span>
                </div>
                <div className="text-lg font-bold text-white">{primaryModel.name}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {primaryModel.highlight}
                </div>
                <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Pricing: \${primaryModel.pricing.input1M} in / \${primaryModel.pricing.output1M} out</div>
                  <div>Context: {primaryModel.contextWindow}</div>
                  <div>AIME: {primaryModel.metrics.aimeScore}</div>
                </div>
              </div>

              {/* Layer 2: Vector Search */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                  <Database className="w-4 h-4" />
                  <span>Layer 2: Indexing & Retrieval</span>
                </div>
                <div className="text-lg font-bold text-white">{vectorDb.name}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {vectorDb.bestFor}
                </div>
                <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Quantization: {vectorDb.quantization}</div>
                  <div>Filter Speed: {vectorDb.filteringSpeed}</div>
                  <div>Cost Tier: {vectorDb.costTier}</div>
                </div>
              </div>

              {/* Layer 3: Serving & Orchestration */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Server className="w-4 h-4" />
                  <span>Layer 3: Serving & Batching</span>
                </div>
                <div className="text-lg font-bold text-white">{servingEngine.name}</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {servingEngine.keyFeature}
                </div>
                <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Latency Tier: {servingEngine.latencyRating}</div>
                  <div>Hardware: {servingEngine.hardware}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackRadar;
