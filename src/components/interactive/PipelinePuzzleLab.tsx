import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowDown, 
  HelpCircle, 
  ChevronRight, 
  Flame, 
  Zap, 
  Layers, 
  Check, 
  ShieldCheck,
  Brain,
  ArrowUp,
  Move,
  Server,
  Database,
  Cpu,
  Radio,
  Lock,
  Box,
  Eye,
  Activity,
  Plus
} from 'lucide-react';
import { trackBlueprintValidate, trackBlueprintScenarioSelect, trackEvent } from '@/lib/analytics';

export type ServiceDomain = 'compute' | 'storage' | 'ml' | 'streaming' | 'security' | 'gateway';

export interface PipelineComponent {
  id: string;
  title: string;
  domain: ServiceDomain;
  awsService: string;
  badge: string;
  description: string;
  techExample: string;
  latencyBudgetMs: number;
  correctOrder: number; // 1 to 6
}

export interface NodePosition {
  x: number;
  y: number;
  label: string;
}

export interface PuzzleScenario {
  id: string;
  title: string;
  systemName: string;
  slaTarget: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  scenarioDescription: string;
  objective: string;
  vpcName: string;
  subnets: { name: string; x: number; y: number; width: number; height: number; stroke: string }[];
  components: PipelineComponent[];
  engineeringInsight: string;
  hint: string;
}

const DOMAIN_CONFIG: Record<ServiceDomain, { 
  color: string;
  glow: string;
  border: string;
  bg: string;
  badgeBg: string;
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
  domainName: string;
}> = {
  gateway: {
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    border: 'border-cyan-500/60 hover:border-cyan-500',
    bg: 'bg-cyan-500/10',
    badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    iconBg: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
    icon: Server,
    domainName: 'Networking & API Gateway'
  },
  compute: {
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    border: 'border-amber-500/60 hover:border-amber-500',
    bg: 'bg-amber-500/10',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
    icon: Cpu,
    domainName: 'Compute / Containers'
  },
  storage: {
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.4)',
    border: 'border-blue-500/60 hover:border-blue-500',
    bg: 'bg-blue-500/10',
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    iconBg: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    icon: Database,
    domainName: 'Storage & Vector Databases'
  },
  ml: {
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    border: 'border-emerald-500/60 hover:border-emerald-500',
    bg: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    iconBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    icon: Brain,
    domainName: 'Machine Learning & Models'
  },
  streaming: {
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    border: 'border-purple-500/60 hover:border-purple-500',
    bg: 'bg-purple-500/10',
    badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    iconBg: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
    icon: Radio,
    domainName: 'Streaming & Event Bus'
  },
  security: {
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)',
    border: 'border-rose-500/60 hover:border-rose-500',
    bg: 'bg-rose-500/10',
    badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    iconBg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
    icon: Lock,
    domainName: 'Security & Quality Gate'
  }
};

// SVG Node positions for the 6-stage architecture graph (2 tiers of 3 nodes)
const GRAPH_NODE_POSITIONS: NodePosition[] = [
  // Tier 1: Ingestion & Fast Filter (Left to Right)
  { x: 190, y: 125, label: 'Stage 01: Ingress & Classification' },
  { x: 490, y: 125, label: 'Stage 02: Expansion / Feature Lookup' },
  { x: 790, y: 125, label: 'Stage 03: Coarse ANN Vector Retrieval' },
  // Tier 2: Deep Inference & Response (Right to Left with curve)
  { x: 790, y: 315, label: 'Stage 04: Deep Scoring & Reranking' },
  { x: 490, y: 315, label: 'Stage 05: Context Guard & Deduplication' },
  { x: 190, y: 315, label: 'Stage 06: Final Synthesis & Edge Delivery' }
];

const PUZZLE_SCENARIOS: PuzzleScenario[] = [
  {
    id: 'rag-enterprise',
    title: 'Enterprise Multi-Tenant RAG Architecture',
    systemName: 'aws-rag-production-vpc',
    slaTarget: 'P99 < 320ms SLA • 10M Document Chunks',
    difficulty: 'Beginner',
    xpReward: 200,
    vpcName: 'VPC: 10.0.0.0/16 [Region: us-east-1]',
    subnets: [
      { name: 'Public Ingress Subnet (API Gateway / Auth)', x: 40, y: 45, width: 880, height: 140, stroke: '#06b6d4' },
      { name: 'Private ML & Vector Subnet (OpenSearch / Bedrock / EKS)', x: 40, y: 230, width: 880, height: 145, stroke: '#10b981' }
    ],
    scenarioDescription: 'Design the production retrieval and generation dataflow for 10M internal technical documents with sub-second latency, tenant isolation, and strict source attribution.',
    objective: 'Drag AWS service nodes from the stencil palette onto the graph sockets to form an unbroken dataflow graph.',
    hint: 'Cross-Encoders are too computationally expensive to score all 10M vectors. Use fast sub-linear HNSW vector search to narrow to 100 before running neural reranking!',
    engineeringInsight: 'High-throughput RAG follows the Funnel Architecture: (1) Query routing & HyDE expansion enrich the search vector; (2) Bi-Encoder HNSW vector search prunes 10M chunks down to 100 candidates in <15ms; (3) A Cross-Encoder reranks to the top 5; (4) Context is packed to avoid LLM context bloat; (5) LLM synthesizes cited answers with verifiable grounding.',
    components: [
      {
        id: 'query-classification',
        title: 'API Gateway & Intent Router',
        domain: 'gateway',
        awsService: 'Amazon API Gateway',
        badge: 'AWS API Gateway + Lambda',
        description: 'Sanitizes input payload, validates JWT auth, and classifies if retrieval is required.',
        techExample: 'FastText / Llama-Guard / Kong',
        latencyBudgetMs: 12,
        correctOrder: 1
      },
      {
        id: 'query-expansion',
        title: 'HyDE Query Rewriting Engine',
        domain: 'compute',
        awsService: 'Amazon ECS (Fargate)',
        badge: 'ECS Task / Prompt Worker',
        description: 'Transforms terse human queries into dense hypothetical passage vectors.',
        techExample: 'HyDE / Multi-Query Embeddings',
        latencyBudgetMs: 45,
        correctOrder: 2
      },
      {
        id: 'vector-retrieval',
        title: 'HNSW Vector ANN Cluster',
        domain: 'storage',
        awsService: 'Amazon OpenSearch Serverless',
        badge: 'OpenSearch / Qdrant on EKS',
        description: 'Executes sub-linear Cosine search across 10M vector chunks to yield top 100 candidate IDs.',
        techExample: 'Qdrant / Milvus / pgvector',
        latencyBudgetMs: 18,
        correctOrder: 3
      },
      {
        id: 'cross-reranker',
        title: 'Cross-Encoder Neural Reranker',
        domain: 'ml',
        awsService: 'SageMaker Real-Time Endpoint',
        badge: 'SageMaker Real-Time Endpoint',
        description: 'Full cross-attention scoring between query and 100 chunks, pruning down to top 5.',
        techExample: 'BGE-Reranker-Large / Cohere API',
        latencyBudgetMs: 65,
        correctOrder: 4
      },
      {
        id: 'context-packing',
        title: 'Context Budgeter & Token Guard',
        domain: 'security',
        awsService: 'AWS Lambda (Guardrail)',
        badge: 'Lambda Post-Filter',
        description: 'Deduplicates chunks, fits within token window, and injects citation markdown anchors.',
        techExample: 'Token Budgeter / Guardrails AI',
        latencyBudgetMs: 8,
        correctOrder: 5
      },
      {
        id: 'llm-generation',
        title: 'Frontier LLM Streaming Node',
        domain: 'ml',
        awsService: 'Amazon Bedrock (Claude 3.5)',
        badge: 'Bedrock / vLLM GPU Node',
        description: 'Streams cited response with factual grounding verification.',
        techExample: 'Claude 3.5 / DeepSeek-V3 / vLLM',
        latencyBudgetMs: 160,
        correctOrder: 6
      }
    ]
  },
  {
    id: 'recommendation-system',
    title: 'Real-Time E-Commerce Recommendation Funnel',
    systemName: 'aws-rec-pipeline-vpc',
    slaTarget: 'P99 < 45ms SLA • 50M Products • 100k QPS',
    difficulty: 'Intermediate',
    xpReward: 250,
    vpcName: 'VPC: 172.16.0.0/16 [Region: us-west-2]',
    subnets: [
      { name: 'Streaming & In-Memory Cache Subnet', x: 40, y: 45, width: 880, height: 140, stroke: '#a855f7' },
      { name: 'Accelerated Deep Neural Ranking & Edge Subnet', x: 40, y: 230, width: 880, height: 145, stroke: '#f59e0b' }
    ],
    scenarioDescription: 'When 100,000 active shoppers browse product catalogs, rank 50M candidate items within a strict 45ms SLA based on their live in-session click history.',
    objective: 'Order the graph nodes to stream events from Kafka into feature stores, Two-Tower ANN, deep ranking, and edge dispatch.',
    hint: 'You cannot run deep neural rankers on 50M items! Ingest stream -> pull features -> coarse retrieval (2000) -> deep neural ranking (50) -> diversity filter (20).',
    engineeringInsight: 'Real-world e-commerce systems enforce strict latency budgets: Kafka ingests streaming events; Redis provides sub-5ms feature lookups; Two-Tower embeddings compress 50M items down to 2,000; Deep neural networks score those 2,000; and Determinantal Point Processes ensure brand and category diversity.',
    components: [
      {
        id: 'click-stream',
        title: 'Kinesis / Kafka Event Stream',
        domain: 'streaming',
        awsService: 'Amazon MSK (Kafka)',
        badge: 'Amazon MSK (Kafka)',
        description: 'Captures live clicks, add-to-carts, and dwell time telemetry from mobile and web apps.',
        techExample: 'Apache Kafka / Amazon MSK',
        latencyBudgetMs: 5,
        correctOrder: 1
      },
      {
        id: 'online-feature-store',
        title: 'In-Memory Feature Store Lookup',
        domain: 'storage',
        awsService: 'Amazon ElastiCache (Redis)',
        badge: 'Amazon ElastiCache (Redis)',
        description: 'Pulls rolling 30-min user engagement vectors and merchant inventory levels in sub-3ms.',
        techExample: 'Feast / Redis / Dragonfly',
        latencyBudgetMs: 4,
        correctOrder: 2
      },
      {
        id: 'two-tower-ann',
        title: 'Two-Tower Candidate Retrieval',
        domain: 'ml',
        awsService: 'Amazon SageMaker ANN',
        badge: 'SageMaker ANN Server',
        description: 'Computes dot-product of User Vector vs 50M Precomputed Item Vectors to yield top 2,000 candidates.',
        techExample: 'ScaNN / Faiss / Two-Tower',
        latencyBudgetMs: 14,
        correctOrder: 3
      },
      {
        id: 'deep-ranking-model',
        title: 'Multi-Task Deep Ranking Network',
        domain: 'compute',
        awsService: 'AWS Inferentia / Triton',
        badge: 'GPU Triton Inference Server',
        description: 'Heavy PyTorch DLRM network scores CTR and Conversion probabilities for the 2,000 items.',
        techExample: 'Triton / TensorRT-LLM / DLRM',
        latencyBudgetMs: 16,
        correctOrder: 4
      },
      {
        id: 'business-rules-diversity',
        title: 'Diversity & Deduplication Gate',
        domain: 'security',
        awsService: 'AWS Lambda (Rules Engine)',
        badge: 'Business Rules Engine',
        description: 'Filters out-of-stock items, enforces merchant brand diversity, and caps repeat categories.',
        techExample: 'DPP Diversity Algorithm',
        latencyBudgetMs: 3,
        correctOrder: 5
      },
      {
        id: 'ui-delivery',
        title: 'Edge CDN GraphQL Dispatcher',
        domain: 'gateway',
        awsService: 'Amazon CloudFront Edge',
        badge: 'CloudFront Edge Worker',
        description: 'Formats top 20 recommendations and caches localized payload at edge PoPs.',
        techExample: 'GraphQL API / Cloudflare Workers',
        latencyBudgetMs: 2,
        correctOrder: 6
      }
    ]
  },
  {
    id: 'mlops-continuous-train',
    title: 'Continuous MLOps Pipeline & Canary Gate',
    systemName: 'aws-mlops-governance-vpc',
    slaTarget: 'Automated CI/CD • Zero Regressions',
    difficulty: 'Advanced',
    xpReward: 300,
    vpcName: 'VPC: 10.100.0.0/16 [Region: eu-west-1]',
    subnets: [
      { name: 'Data Validation & Distributed Training Subnet', x: 40, y: 45, width: 880, height: 140, stroke: '#f43f5e' },
      { name: 'Model Registry & Canary Mesh Subnet', x: 40, y: 230, width: 880, height: 145, stroke: '#06b6d4' }
    ],
    scenarioDescription: 'When concept drift is detected in production inference, trigger automated retraining, validate data and model metrics, and roll out a canary container safely.',
    objective: 'Connect the automated MLOps pipeline stages to ensure bad models never hit 100% traffic.',
    hint: 'Quality checks must bookend the training phase: validate data before training, and validate model metrics against production champion baselines before registry signing!',
    engineeringInsight: 'Enterprise MLOps avoids silent production outages by placing automated gates: data validation prevents garbage-in; champion-vs-challenger comparisons on holdout sets prevent accuracy drops; and Istio canary routes test real traffic on 5% of users before complete promotion.',
    components: [
      {
        id: 'data-drift-trigger',
        title: 'Drift Monitor & Labeled Batch Query',
        domain: 'streaming',
        awsService: 'Amazon CloudWatch / Evidently',
        badge: 'CloudWatch / Evidently AI',
        description: 'Detects Kolmogorov-Smirnov distribution shifts in features and triggers retraining pipeline.',
        techExample: 'Evidently AI / SageMaker Clarify',
        latencyBudgetMs: 30,
        correctOrder: 1
      },
      {
        id: 'data-validation-gate',
        title: 'Data Quality & Schema Assertion Gate',
        domain: 'security',
        awsService: 'AWS Step Functions (Gate)',
        badge: 'Great Expectations Step',
        description: 'Fails pipeline if unexpected nulls, schema drifts, or corrupted target distributions are found.',
        techExample: 'Great Expectations / Pandera',
        latencyBudgetMs: 120,
        correctOrder: 2
      },
      {
        id: 'distributed-training',
        title: 'Distributed GPU Cluster Training',
        domain: 'compute',
        awsService: 'SageMaker HyperPod / Ray',
        badge: 'SageMaker HyperPod / Ray',
        description: 'Trains deep model across multi-GPU cluster with gradient accumulation and early stopping.',
        techExample: 'Ray Train / PyTorch DDP',
        latencyBudgetMs: 900,
        correctOrder: 3
      },
      {
        id: 'champion-challenger-gate',
        title: 'Champion vs Challenger Metrics Gate',
        domain: 'ml',
        awsService: 'SageMaker Model Cards / MLflow',
        badge: 'MLflow Automated Gate',
        description: 'Compares F1/AUC against current production champion model on golden holdout set.',
        techExample: 'MLflow / Weights & Biases',
        latencyBudgetMs: 180,
        correctOrder: 4
      },
      {
        id: 'model-registry',
        title: 'Signed Container & Model Registry',
        domain: 'storage',
        awsService: 'Amazon ECR / SageMaker Registry',
        badge: 'Amazon ECR / SageMaker Registry',
        description: 'Freezes model weights, signs artifact with SHA256 digest, and tags production container.',
        techExample: 'MLflow Registry / S3 Artifacts',
        latencyBudgetMs: 40,
        correctOrder: 5
      },
      {
        id: 'canary-deployment',
        title: '5% Canary Traffic Shift & Monitoring',
        domain: 'gateway',
        awsService: 'Amazon EKS / App Mesh',
        badge: 'EKS / Istio Service Mesh',
        description: 'Routes 5% live user requests to new model while monitoring P99 latency and error anomalies.',
        techExample: 'Istio / Argo Rollouts / Envoy',
        latencyBudgetMs: 25,
        correctOrder: 6
      }
    ]
  }
];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export interface PipelinePuzzleLabProps {
  scenarios?: PuzzleScenario[];
}

export const PipelinePuzzleLab: React.FC<PipelinePuzzleLabProps> = ({ scenarios }) => {
  const activeScenarios = scenarios && scenarios.length > 0 ? scenarios : PUZZLE_SCENARIOS;
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const scenario = activeScenarios[selectedScenarioIndex] || activeScenarios[0];

  // Placed slots (6 nodes on the graph)
  const [placedSlots, setPlacedSlots] = useState<(PipelineComponent | null)[]>([]);
  // Available stencil tray items
  const [trayItems, setTrayItems] = useState<PipelineComponent[]>([]);
  // Active selected slot for click-to-place targeting
  const [activeTargetSlot, setActiveTargetSlot] = useState<number>(0);

  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    mistakeIndex?: number;
  }>({ status: 'idle', message: '' });

  const [totalXp, setTotalXp] = useState<number>(0);
  const [solvedScenarios, setSolvedScenarios] = useState<string[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<PipelineComponent | null>(null);

  const initScenario = (scen: PuzzleScenario) => {
    setPlacedSlots(new Array(scen.components.length).fill(null));
    setTrayItems(shuffleArray(scen.components));
    setVerificationResult({ status: 'idle', message: '' });
    setActiveTargetSlot(0);
    setShowHint(false);
  };

  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('encodeedge_pipeline_xp');
      if (savedXp) setTotalXp(parseInt(savedXp, 10));

      const savedSolved = localStorage.getItem('encodeedge_solved_puzzles');
      if (savedSolved) setSolvedScenarios(JSON.parse(savedSolved));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    initScenario(scenario);
  }, [selectedScenarioIndex]);

  const placeInSlot = (component: PipelineComponent, slotIndex: number) => {
    const currentItemInSlot = placedSlots[slotIndex];
    const newSlots = [...placedSlots];
    newSlots[slotIndex] = component;
    setPlacedSlots(newSlots);

    setTrayItems(prev => {
      const filtered = prev.filter(c => c.id !== component.id);
      if (currentItemInSlot) {
        return [...filtered, currentItemInSlot];
      }
      return filtered;
    });

    // Advance active slot target to next empty
    const nextEmpty = newSlots.findIndex(s => s === null);
    if (nextEmpty !== -1) {
      setActiveTargetSlot(nextEmpty);
    }

    setVerificationResult({ status: 'idle', message: '' });
  };

  const handleTrayItemClick = (component: PipelineComponent) => {
    // If activeTargetSlot is empty, place there; otherwise find first empty slot
    let target = activeTargetSlot;
    if (placedSlots[target] !== null) {
      const firstEmpty = placedSlots.findIndex(s => s === null);
      target = firstEmpty !== -1 ? firstEmpty : target;
    }
    placeInSlot(component, target);
  };

  const handleSlotItemClick = (slotIndex: number) => {
    const component = placedSlots[slotIndex];
    if (!component) {
      setActiveTargetSlot(slotIndex);
      return;
    }

    // Remove from slot back to tray
    const newSlots = [...placedSlots];
    newSlots[slotIndex] = null;
    setPlacedSlots(newSlots);
    setActiveTargetSlot(slotIndex);

    setTrayItems(prev => [...prev, component]);
    setVerificationResult({ status: 'idle', message: '' });
  };

  const handleDragStart = (component: PipelineComponent) => {
    setDraggedItem(component);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (slotIndex: number) => {
    if (!draggedItem) return;
    placeInSlot(draggedItem, slotIndex);
    setDraggedItem(null);
  };

  const handleVerify = () => {
    const unplacedCount = placedSlots.filter(s => s === null).length;
    if (unplacedCount > 0) {
      setVerificationResult({
        status: 'error',
        message: `Graph topology broken! Position all ${scenario.components.length} architectural service nodes on the SVG graph.`
      });
      return;
    }

    let firstMistakeIndex = -1;
    for (let i = 0; i < placedSlots.length; i++) {
      const comp = placedSlots[i];
      if (comp && comp.correctOrder !== i + 1) {
        firstMistakeIndex = i;
        break;
      }
    }

    if (firstMistakeIndex === -1) {
      const isFirstSolve = !solvedScenarios.includes(scenario.id);
      const pointsEarned = isFirstSolve ? scenario.xpReward : Math.round(scenario.xpReward * 0.25);
      const updatedXp = totalXp + pointsEarned;
      const updatedSolved = isFirstSolve ? [...solvedScenarios, scenario.id] : solvedScenarios;

      setTotalXp(updatedXp);
      setSolvedScenarios(updatedSolved);

      trackBlueprintValidate(scenario.id, scenario.title, true, totalCalculatedLatency);

      try {
        localStorage.setItem('encodeedge_pipeline_xp', updatedXp.toString());
        localStorage.setItem('encodeedge_solved_puzzles', JSON.stringify(updatedSolved));
      } catch (e) {
        // ignore
      }

      setVerificationResult({
        status: 'success',
        message: isFirstSolve
          ? `AWS Architecture Verified! Dataflow paths illuminated across all VPC subnets! (+${pointsEarned} XP)`
          : `Valid Architecture Diagram! (+${pointsEarned} repeat XP)`
      });
    } else {
      const wrongComp = placedSlots[firstMistakeIndex];
      trackBlueprintValidate(scenario.id, scenario.title, false, totalCalculatedLatency, firstMistakeIndex);
      setVerificationResult({
        status: 'error',
        mistakeIndex: firstMistakeIndex,
        message: `Architectural bottleneck at Node 0${firstMistakeIndex + 1}! "${wrongComp?.title}" cannot precede upstream dependencies. Check prerequisite data availability.`
      });
    }
  };

  const totalCalculatedLatency = placedSlots.reduce((acc, curr) => acc + (curr ? curr.latencyBudgetMs : 0), 0);
  const isAllFilled = placedSlots.every(s => s !== null);
  const isVerifiedSuccess = verificationResult.status === 'success';

  const getRank = (xp: number) => {
    if (xp >= 800) return { title: 'Principal Systems Architect', icon: '👑', color: 'text-amber-400' };
    if (xp >= 400) return { title: 'Senior ML Systems Engineer', icon: '🥇', color: 'text-emerald-400' };
    if (xp >= 150) return { title: 'Cloud ML Solutions Architect', icon: '🥈', color: 'text-indigo-400' };
    return { title: 'Associate Solutions Architect', icon: '🥉', color: 'text-zinc-400' };
  };

  const rank = getRank(totalXp);

  // Theme-aware SVG connector colors
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const emptyStroke = isDark ? '#334155' : '#cbd5e1';
  const activeStroke = '#06b6d4';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none font-sans">
      {/* Top Architecture Console Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-[#E5E795]/20 border border-[#E5E795]/40 text-[#2a2c07] dark:text-[#E5E795] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                AWS Graph Architecture Canvas
              </span>
              <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                {scenario.systemName}.svg
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              {scenario.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                {scenario.slaTarget}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Accumulated Latency: <strong className="text-foreground">{totalCalculatedLatency}ms</strong></span>
            </div>
          </div>

          {/* User Architect Rank & Score Counter */}
          <div className="flex items-center gap-4 shrink-0 bg-secondary/60 p-3 sm:p-4 rounded-2xl border border-border shadow-2xs backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-[#E5E795]/20 border border-[#E5E795]/40 flex items-center justify-center text-xl shrink-0">
                {rank.icon}
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                  Architect Rank
                </div>
                <div className={`text-xs font-bold font-mono ${rank.color}`}>
                  {rank.title}
                </div>
              </div>
            </div>

            <div className="w-px h-8 bg-border" />

            <div>
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Total XP</div>
              <div className="text-base sm:text-lg font-bold font-mono text-foreground leading-none">
                {totalXp} XP
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint Scenario Tabs */}
        <div className="relative z-10 mt-6 pt-5 border-t border-border flex items-center gap-2 overflow-x-auto pb-1">
          {activeScenarios.map((scen, idx) => {
            const isSelected = idx === selectedScenarioIndex;
            const isSolved = solvedScenarios.includes(scen.id);

            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  trackBlueprintScenarioSelect(scen.id, scen.title);
                }}
                className={`px-4 py-2 rounded-xl border text-left shrink-0 transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#E5E795] text-black font-bold border-[#E5E795] shadow-xs'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {isSolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="text-xs font-mono">0{idx + 1}</span>
                )}
                <span className="text-xs whitespace-nowrap">{scen.title.split(' ')[0]} {scen.title.split(' ')[1]}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-black/10 text-black font-semibold' : 'bg-muted text-muted-foreground'
                }`}>
                  +{scen.xpReward} XP
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Architecture Design Briefing & Canvas Controls */}
      <div className="p-5 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="text-xs font-mono text-indigo-600 dark:text-[#E5E795] uppercase tracking-wider font-bold">
            System Design Requirement:
          </div>
          <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-body">
            {scenario.scenarioDescription} <strong>{scenario.objective}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Hide Hint' : 'Architecture Hint'}</span>
          </button>
          <button
            type="button"
            onClick={() => initScenario(scenario)}
            className="px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Graph</span>
          </button>
        </div>
      </div>

      {showHint && (
        <div className="p-4 rounded-2xl bg-[#E5E795]/15 border border-[#E5E795]/30 text-amber-900 dark:text-[#E5E795] text-xs flex items-start gap-3 animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <span className="font-bold font-mono uppercase tracking-wider block text-[11px] mb-0.5">Architect Advisory Note:</span>
            <span>{scenario.hint}</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* THE INTERACTIVE AWS GRAPH CANVAS (SVG + PATH CONNECTORS) */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-6 rounded-3xl bg-card border border-border relative overflow-hidden shadow-xs">
        {/* Subtle SVG Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* VPC Header Band */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-border text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isVerifiedSuccess ? 'bg-emerald-500 shadow-xs shadow-emerald-500' : 'bg-cyan-500'} animate-pulse`} />
            <span className="text-foreground font-bold tracking-wider">{scenario.vpcName}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Active Target Socket: <strong className="text-indigo-600 dark:text-[#E5E795]">Node 0{activeTargetSlot + 1}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">Interactive Dataflow Paths</span>
          </div>
        </div>

        {/* SVG Topology Graph Diagram */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox="0 0 980 430"
            className="w-full min-w-[760px] h-auto overflow-visible select-none"
          >
            <defs>
              {/* Arrow Marker Definitions */}
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
              </marker>

              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>

              <marker
                id="arrow-success"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>

              {/* Linear Gradient for Inter-tier Curve */}
              <linearGradient id="curveGradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* AWS Subnet Boundary Boxes */}
            {scenario.subnets.map((sub, i) => (
              <g key={i}>
                <rect
                  x={sub.x}
                  y={sub.y}
                  width={sub.width}
                  height={sub.height}
                  rx="16"
                  fill="transparent"
                  stroke={sub.stroke}
                  strokeWidth="1.2"
                  strokeDasharray="6,4"
                  className="opacity-60"
                />
                <text
                  x={sub.x + 16}
                  y={sub.y + 22}
                  fill={sub.stroke}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="tracking-wider uppercase"
                >
                  [Subnet: {sub.name}]
                </text>
              </g>
            ))}

            {/* Client Ingress Source (Left of Node 1) */}
            <g transform="translate(10, 95)">
              <rect
                x="0"
                y="0"
                width="85"
                height="60"
                rx="12"
                className="fill-card stroke-border"
                strokeWidth="1.5"
              />
              <text x="42" y="24" textAnchor="middle" className="fill-muted-foreground" fontSize="10" fontWeight="bold" fontFamily="monospace">
                CLIENT
              </text>
              <text x="42" y="42" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">
                Traffic In
              </text>
            </g>

            {/* Path: Client Ingress -> Node 1 */}
            <path
              d="M 95 125 L 140 125"
              stroke={placedSlots[0] ? activeStroke : emptyStroke}
              strokeWidth="2.5"
              strokeDasharray={placedSlots[0] ? '4,3' : '2,2'}
              markerEnd={placedSlots[0] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Path: Node 1 -> Node 2 */}
            <path
              d="M 240 125 L 440 125"
              stroke={isVerifiedSuccess ? '#10b981' : placedSlots[0] && placedSlots[1] ? activeStroke : emptyStroke}
              strokeWidth={isVerifiedSuccess ? '3' : '2.5'}
              strokeDasharray={placedSlots[0] && placedSlots[1] ? '5,3' : '2,2'}
              markerEnd={isVerifiedSuccess ? 'url(#arrow-success)' : placedSlots[0] && placedSlots[1] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Path: Node 2 -> Node 3 */}
            <path
              d="M 540 125 L 740 125"
              stroke={isVerifiedSuccess ? '#10b981' : placedSlots[1] && placedSlots[2] ? activeStroke : emptyStroke}
              strokeWidth={isVerifiedSuccess ? '3' : '2.5'}
              strokeDasharray={placedSlots[1] && placedSlots[2] ? '5,3' : '2,2'}
              markerEnd={isVerifiedSuccess ? 'url(#arrow-success)' : placedSlots[1] && placedSlots[2] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Curving Inter-Tier Connector Path: Node 3 (Top-Right) -> Node 4 (Bottom-Right) */}
            <path
              d="M 840 125 C 930 125, 930 315, 840 315"
              fill="none"
              stroke={isVerifiedSuccess ? '#10b981' : placedSlots[2] && placedSlots[3] ? 'url(#curveGradient)' : emptyStroke}
              strokeWidth={isVerifiedSuccess ? '3.5' : '2.5'}
              strokeDasharray={placedSlots[2] && placedSlots[3] ? '6,4' : '3,3'}
              markerEnd={isVerifiedSuccess ? 'url(#arrow-success)' : placedSlots[2] && placedSlots[3] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Path: Node 4 -> Node 5 (Bottom Tier, Right to Left) */}
            <path
              d="M 740 315 L 540 315"
              stroke={isVerifiedSuccess ? '#10b981' : placedSlots[3] && placedSlots[4] ? activeStroke : emptyStroke}
              strokeWidth={isVerifiedSuccess ? '3' : '2.5'}
              strokeDasharray={placedSlots[3] && placedSlots[4] ? '5,3' : '2,2'}
              markerEnd={isVerifiedSuccess ? 'url(#arrow-success)' : placedSlots[3] && placedSlots[4] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Path: Node 5 -> Node 6 */}
            <path
              d="M 440 315 L 240 315"
              stroke={isVerifiedSuccess ? '#10b981' : placedSlots[4] && placedSlots[5] ? activeStroke : emptyStroke}
              strokeWidth={isVerifiedSuccess ? '3' : '2.5'}
              strokeDasharray={placedSlots[4] && placedSlots[5] ? '5,3' : '2,2'}
              markerEnd={isVerifiedSuccess ? 'url(#arrow-success)' : placedSlots[4] && placedSlots[5] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Path: Node 6 -> Output Client Response */}
            <path
              d="M 140 315 L 95 315"
              stroke={isVerifiedSuccess ? '#10b981' : placedSlots[5] ? activeStroke : emptyStroke}
              strokeWidth="2.5"
              strokeDasharray={placedSlots[5] ? '4,3' : '2,2'}
              markerEnd={isVerifiedSuccess ? 'url(#arrow-success)' : placedSlots[5] ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />

            {/* Client Egress Destination (Left of Node 6) */}
            <g transform="translate(10, 285)">
              <rect
                x="0"
                y="0"
                width="85"
                height="60"
                rx="12"
                className={`fill-card ${isVerifiedSuccess ? '' : 'stroke-border'}`}
                stroke={isVerifiedSuccess ? '#10b981' : undefined}
                strokeWidth="1.5"
              />
              <text x="42" y="24" textAnchor="middle" className="fill-muted-foreground" fontSize="10" fontWeight="bold" fontFamily="monospace">
                RESPONSE
              </text>
              <text x="42" y="42" textAnchor="middle" fill={isVerifiedSuccess ? '#34d399' : '#06b6d4'} fontSize="11" fontWeight="bold">
                200 OK / SSE
              </text>
            </g>

            {/* Animated Data Packets (Active when verified) */}
            {isVerifiedSuccess && (
              <>
                <circle r="4" fill="#34d399" filter="drop-shadow(0 0 6px #10b981)">
                  <animateMotion
                    path="M 95 125 L 440 125 L 740 125 C 930 125, 930 315, 740 315 L 440 315 L 140 315 L 95 315"
                    dur="3.2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)">
                  <animateMotion
                    path="M 95 125 L 440 125 L 740 125 C 930 125, 930 315, 740 315 L 440 315 L 140 315 L 95 315"
                    dur="3.2s"
                    begin="1.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {/* The 6 Interactive Graph Node foreignObjects */}
            {GRAPH_NODE_POSITIONS.map((pos, idx) => {
              const item = placedSlots[idx];
              const isTarget = activeTargetSlot === idx;
              const isMistake = verificationResult.status === 'error' && verificationResult.mistakeIndex === idx;
              const domain = item ? DOMAIN_CONFIG[item.domain] : null;
              const Icon = domain ? domain.icon : Box;

              return (
                <foreignObject
                  key={idx}
                  x={pos.x - 50}
                  y={pos.y - 45}
                  width="100"
                  height="90"
                  className="overflow-visible"
                >
                  <div
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropOnSlot(idx)}
                    onClick={() => handleSlotItemClick(idx)}
                    className={`size-full rounded-2xl p-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center relative group shadow-xs ${
                      item
                        ? isVerifiedSuccess
                          ? 'bg-emerald-500/10 border-2 border-emerald-500 shadow-emerald-500/20'
                          : isMistake
                          ? 'bg-rose-500/10 border-2 border-rose-500 shadow-rose-500/20 animate-shake'
                          : `bg-card border-2 ${domain?.border}`
                        : isTarget
                        ? 'bg-secondary border-2 border-[#E5E795] ring-4 ring-[#E5E795]/20'
                        : 'bg-card/80 border-2 border-dashed border-border hover:border-foreground/40'
                    }`}
                  >
                    {/* Node Header Badge */}
                    <div className="w-full flex items-center justify-between text-[9px] font-mono leading-none">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${item ? 'bg-secondary text-foreground' : 'bg-secondary/60 text-muted-foreground'}`}>
                        0{idx + 1}
                      </span>
                      {item ? (
                        <span className="text-[10px] text-muted-foreground hover:text-rose-500">✕</span>
                      ) : (
                        <span className="text-[10px] text-indigo-600 dark:text-[#E5E795]">+</span>
                      )}
                    </div>

                    {/* Node Icon / Service Glyph */}
                    {item && domain ? (
                      <div className="flex flex-col items-center space-y-1">
                        <div className={`p-1.5 rounded-lg ${domain.iconBg} shadow-inner`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-[10px] font-bold text-foreground line-clamp-1 leading-tight tracking-tight">
                          {item.title}
                        </div>
                        <div className="text-[8px] font-mono text-indigo-600 dark:text-[#E5E795] truncate max-w-[85px] font-semibold">
                          {item.awsService}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1 py-1">
                        <div className={`p-1 rounded-full ${isTarget ? 'bg-[#E5E795]/30 text-slate-900 dark:text-[#E5E795]' : 'bg-muted text-muted-foreground'}`}>
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {isTarget ? 'Target Socket' : `Slot 0${idx + 1}`}
                        </span>
                      </div>
                    )}

                    {/* Node Footer Latency Tag */}
                    <div className="text-[8px] font-mono text-muted-foreground">
                      {item ? `${item.latencyBudgetMs}ms` : 'Empty'}
                    </div>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ======================================================== */}
      {/* AWS SERVICE STENCIL PALETTE (AVAILABLE NODES TO PLUG IN) */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
            <span className="text-foreground font-bold uppercase tracking-wider">
              AWS Service Stencil Palette ({trayItems.length} Available Nodes)
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Click any block to place into <strong className="text-indigo-600 dark:text-[#E5E795]">Socket 0{activeTargetSlot + 1}</strong> or drag onto the graph
          </span>
        </div>

        {trayItems.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All architectural nodes positioned on the graph! Click <strong>Validate Architecture Dataflow</strong> below.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trayItems.map((comp) => {
              const domain = DOMAIN_CONFIG[comp.domain];
              const Icon = domain.icon;

              return (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={() => handleDragStart(comp)}
                  onClick={() => handleTrayItemClick(comp)}
                  title={`${comp.title} (${comp.awsService}) — ${comp.description} [${comp.latencyBudgetMs}ms]`}
                  className={`px-3.5 py-2.5 rounded-xl border-2 ${domain.border} bg-secondary/40 hover:bg-secondary/80 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs group select-none`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg ${domain.iconBg} shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {/* Small box with just the title */}
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary truncate">
                      {comp.title}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${domain.badgeBg} shrink-0 font-bold uppercase`}>
                    {comp.awsService}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verification & Dataflow Audit Console */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border shadow-xs">
        <div className="w-full sm:w-auto">
          {verificationResult.status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{verificationResult.message}</span>
            </div>
          )}

          {verificationResult.status === 'error' && (
            <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{verificationResult.message}</span>
            </div>
          )}

          {verificationResult.status === 'idle' && (
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              <span>Assemble all 6 graph nodes sequentially to connect client ingress to 200 OK egress.</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleVerify}
            disabled={!isAllFilled}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              isAllFilled
                ? 'bg-[#E5E795] hover:bg-[#dada75] text-black active:scale-95'
                : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Validate Architecture Dataflow</span>
          </button>

          {verificationResult.status === 'success' && selectedScenarioIndex < activeScenarios.length - 1 && (
            <button
              type="button"
              onClick={() => setSelectedScenarioIndex(prev => prev + 1)}
              className="px-5 py-3 rounded-2xl bg-[#E5E795] hover:bg-[#dada75] text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Next Blueprint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Engineering Walkthrough Breakdown (Unlocked upon success) */}
      {verificationResult.status === 'success' && (
        <div className="p-6 rounded-3xl bg-card border border-emerald-500/40 space-y-3 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>AWS ML Well-Architected Framework: Architectural Analysis</span>
          </div>
          <h4 className="text-base font-bold font-display text-foreground">
            Why this pipeline order satisfies enterprise latency and consistency SLAs:
          </h4>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-body">
            {scenario.engineeringInsight}
          </p>
        </div>
      )}
    </div>
  );
};

export default PipelinePuzzleLab;
