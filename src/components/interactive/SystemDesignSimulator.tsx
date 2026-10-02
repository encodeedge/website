import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Zap,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  Server,
  Database,
  GitBranch,
  Terminal,
  Activity,
  Award,
  Share2,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface ChoiceOption {
  id: string;
  name: string;
  tagline: string;
  latencyDelta: number; // in ms
  costDelta: number; // in USD/mo
  reliabilityDelta: number; // in %
  accuracyDelta: number; // in %
  description: string;
  pros: string[];
  cons: string[];
  crashTriggerOnSurge?: string; // If this triggers outage during stress test
}

export interface SimulationStage {
  id: string;
  title: string;
  description: string;
  iconType: 'ingest' | 'features' | 'model' | 'fallback';
  options: ChoiceOption[];
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  targetLatency: number; // max allowed ms
  budgetLimit: number; // max allowed USD/mo
  baseLatency: number;
  baseCost: number;
  baseReliability: number;
  baseAccuracy: number;
  stages: SimulationStage[];
  stressTestScenario: {
    title: string;
    description: string;
    loadMultiplier: number;
  };
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'fraud-engine',
    title: 'Fintech Real-Time Fraud & Anomaly Engine',
    subtitle: 'Process 100M card transactions/day with sub-45ms P99 latency and zero toleration for data drift.',
    badge: 'Fintech & Security',
    targetLatency: 45,
    budgetLimit: 15000,
    baseLatency: 15,
    baseCost: 2000,
    baseReliability: 90,
    baseAccuracy: 85,
    stressTestScenario: {
      title: 'Black Friday 12x Traffic Spike',
      description: 'Transaction volume leaps from 1,200 to 14,400 TPS within 90 seconds. Card networks enforce strict 50ms timeouts.',
      loadMultiplier: 12,
    },
    stages: [
      {
        id: 'ingestion',
        title: 'Stage 1: Streaming Ingestion & Buffer',
        description: 'How do transactions enter the scoring pipeline from global payment gateways?',
        iconType: 'ingest',
        options: [
          {
            id: 'redpanda',
            name: 'Redpanda (C++ Zero-JVM Cluster)',
            tagline: 'Predictable sub-5ms tail latencies without GC pauses',
            latencyDelta: 4,
            costDelta: 1800,
            reliabilityDelta: 8,
            accuracyDelta: 0,
            description: 'Thread-per-core streaming engine that avoids JVM garbage collection spikes.',
            pros: ['Predictable single-digit ms P99', 'Direct kernel bypass I/O', 'Kafka API compatible'],
            cons: ['Higher node hardware baseline requirements'],
          },
          {
            id: 'kafka',
            name: 'Apache Kafka (Managed MSK)',
            tagline: 'Standard battle-tested distributed enterprise streaming',
            latencyDelta: 12,
            costDelta: 2400,
            reliabilityDelta: 9,
            accuracyDelta: 0,
            description: 'Industry standard distributed log. Occasional JVM stop-the-world GC pauses under burst load.',
            pros: ['Unlimited ecosystem integrations', 'Decoupled consumer groups', 'Massive horizontal durability'],
            cons: ['Tuning GC parameters required to prevent 80ms latency spikes'],
          },
          {
            id: 'redis_streams',
            name: 'Redis Streams (In-Memory)',
            tagline: 'Ultra-low latency in-memory message queue',
            latencyDelta: 2,
            costDelta: 1200,
            reliabilityDelta: -4,
            accuracyDelta: 0,
            description: 'Blazing fast in-memory queues with snapshot persistence.',
            pros: ['Sub-millisecond write times', 'Extremely lightweight'],
            cons: ['Risk of memory exhaustion during upstream worker bottlenecks'],
            crashTriggerOnSurge: 'Redis memory exceeded maxmemory threshold during 12x spike. Unsaved event logs evicted.',
          },
          {
            id: 'direct_rest',
            name: 'Direct REST API to Inference Gateway',
            tagline: 'Synchronous HTTP request/response without queue buffer',
            latencyDelta: 8,
            costDelta: 400,
            reliabilityDelta: -25,
            accuracyDelta: 0,
            description: 'Directly calling the prediction servers without an intermediary durable queue.',
            pros: ['Simplest to deploy', 'Zero streaming infrastructure costs'],
            cons: ['Zero backpressure buffering: upstream spikes immediately trigger cascading 504 timeouts'],
            crashTriggerOnSurge: 'No queue buffer! HTTP connection pools exhausted at 14,000 TPS. Gateway returned 503 Service Unavailable.',
          },
        ],
      },
      {
        id: 'feature_store',
        title: 'Stage 2: Real-Time Feature Lookup & Aggregation',
        description: 'How are historic customer metrics (e.g. 10-minute transaction velocity) retrieved?',
        iconType: 'features',
        options: [
          {
            id: 'flink_redis',
            name: 'Apache Flink Stateful Stream + Redis Cluster',
            tagline: 'Sub-millisecond sliding windows with materialized online cache',
            latencyDelta: 6,
            costDelta: 3100,
            reliabilityDelta: 7,
            accuracyDelta: 8,
            description: 'Computes real-time sliding aggregation windows in Flink and materializes them into clustered Redis for 1ms lookups.',
            pros: ['Zero-lag feature freshness', 'Accurate 1-minute velocity checks', 'Sub-millisecond read latency'],
            cons: ['High infrastructure complexity & cluster management'],
          },
          {
            id: 'managed_feature_store',
            name: 'Feast Online Feature Store (DynamoDB backed)',
            tagline: 'Standardized ML feature catalog with serverless key-value backend',
            latencyDelta: 10,
            costDelta: 2600,
            reliabilityDelta: 6,
            accuracyDelta: 5,
            description: 'Clean feature repository with offline-to-online parity guarantees.',
            pros: ['Eliminates training-serving feature drift', 'Simple point-in-time joins'],
            cons: ['DynamoDB hot-partition throttling under sudden card usage bursts'],
          },
          {
            id: 'postgres_queries',
            name: 'PostgreSQL Real-Time SQL Aggregations',
            tagline: 'Direct SQL COUNT/SUM queries against transactional relational DB',
            latencyDelta: 28,
            costDelta: 900,
            reliabilityDelta: -12,
            accuracyDelta: 3,
            description: 'Running indexed SQL queries like "SELECT count(*) FROM tx WHERE user_id = ? AND time > NOW() - 10m".',
            pros: ['Zero new infrastructure required', 'Strict ACID consistency'],
            cons: ['Heavy table lock contention; query latency climbs to 250ms under concurrent traffic'],
            crashTriggerOnSurge: 'Database CPU pegged at 100% running live COUNT(*) aggregations. Read replica replication lag exceeded 45 seconds.',
          },
        ],
      },
      {
        id: 'model_serving',
        title: 'Stage 3: Inference Architecture & Serving Engine',
        description: 'Which machine learning inference setup scores the feature vector?',
        iconType: 'model',
        options: [
          {
            id: 'triton_onnx',
            name: 'Triton C++ Server + ONNX Runtime (Dynamic Batching)',
            tagline: 'GPU/CPU optimized inference server with concurrent model instances',
            latencyDelta: 7,
            costDelta: 2800,
            reliabilityDelta: 8,
            accuracyDelta: 6,
            description: 'Compiles LightGBM and Neural Network models to optimized ONNX binaries with micro-second dynamic batching.',
            pros: ['Micro-batching maximizes throughput', 'Zero Python Global Interpreter Lock (GIL)', 'P99 inference under 8ms'],
            cons: ['Requires specialized deployment configs and C++ runtime tooling'],
          },
          {
            id: 'embedded_lgbm',
            name: 'Embedded C++ LightGBM in Worker Process',
            tagline: 'Zero network hops: model runs in-process with the worker',
            latencyDelta: 3,
            costDelta: 1400,
            reliabilityDelta: 5,
            accuracyDelta: 5,
            description: 'The trained model is compiled directly into the worker memory space, eliminating RPC latency.',
            pros: ['Zero network serialization overhead', 'Ultra-fast 2ms evaluation', 'Cost efficient'],
            cons: ['Model updates require graceful rolling worker restarts'],
          },
          {
            id: 'fastapi_torch',
            name: 'Python FastAPI + Standard PyTorch (CPU Workers)',
            tagline: 'Standard Python REST microservice',
            latencyDelta: 22,
            costDelta: 1600,
            reliabilityDelta: -6,
            accuracyDelta: 6,
            description: 'Standard Python FastAPI container executing PyTorch `model(tensor)`.',
            pros: ['Rapid iteration in native Python', 'Simple debugging'],
            cons: ['Python GIL contention causes worker queue backlog under high concurrency'],
            crashTriggerOnSurge: 'FastAPI Uvicorn event loop blocked by synchronous PyTorch tensor forward passes. Request latency exceeded 350ms.',
          },
          {
            id: 'giant_llm_api',
            name: 'Cloud 70B LLM API (Prompt: "Is this transaction fraud?")',
            tagline: 'Zero feature engineering: send raw JSON to a frontier LLM',
            latencyDelta: 850,
            costDelta: 14000,
            reliabilityDelta: -18,
            accuracyDelta: -4,
            description: 'Directly calling a large language model API to evaluate fraud reasoning.',
            pros: ['Captures complex text explanations', 'No training pipeline needed'],
            cons: ['1,000ms+ latency makes real-time card authorization impossible; catastrophic cloud token costs'],
            crashTriggerOnSurge: 'Cloud LLM rate limits hit within 4 seconds (429 Too Many Requests). Average latency 1,450ms (timeout SLA is 45ms).',
          },
        ],
      },
      {
        id: 'fallback_policy',
        title: 'Stage 4: Resiliency, Fallback & Circuit Breaker',
        description: 'What happens when model scoring exceeds the 45ms strict payment gateway timeout?',
        iconType: 'fallback',
        options: [
          {
            id: 'circuit_breaker_rules',
            name: 'Circuit Breaker with Heuristic Decision Tree Fallback',
            tagline: 'Fail-safe: fall back to ultra-fast 1ms static rule engine if ML times out',
            latencyDelta: -2,
            costDelta: 600,
            reliabilityDelta: 12,
            accuracyDelta: -2,
            description: 'If the model does not respond in 35ms, a localized hardcoded rule engine (velocity, location check) approves or rejects the charge.',
            pros: ['Zero cardholder checkout failures', 'Graceful degradation protects revenue', 'Isolates downstream outages'],
            cons: ['Slight temporary dip in fraud detection precision during model brownouts'],
          },
          {
            id: 'fail_closed_strict',
            name: 'Strict Synchronous Block (Fail-Closed)',
            tagline: 'If model does not respond within 45ms, hard reject the transaction',
            latencyDelta: 5,
            costDelta: 200,
            reliabilityDelta: -14,
            accuracyDelta: 2,
            description: 'Rejects transactions if full model inference cannot complete in time.',
            pros: ['Zero fraud leaks during outages'],
            cons: ['High false-decline rate during traffic spikes, alienating genuine cardholders'],
          },
          {
            id: 'fail_open_async',
            name: 'Async Post-Auth Reconciliation (Fail-Open)',
            tagline: 'Approve transaction immediately, score asynchronously in 10s',
            latencyDelta: -10,
            costDelta: 400,
            reliabilityDelta: 8,
            accuracyDelta: -12,
            description: 'Always approve real-time; trigger charge reversal / alerts asynchronously if fraud is detected later.',
            pros: ['Zero checkout latency delay for consumers'],
            cons: ['Irreversible merchant losses for instant cash withdrawals or crypto transfers'],
          },
        ],
      },
    ],
  },
  {
    id: 'enterprise-rag',
    title: 'Enterprise Agentic RAG System (10M Docs)',
    subtitle: 'Build a multi-tenant retrieval engine answering technical queries with strict accuracy, P99 < 200ms, and cost controls.',
    badge: 'GenAI & Retrieval',
    targetLatency: 220,
    budgetLimit: 18000,
    baseLatency: 40,
    baseCost: 3500,
    baseReliability: 88,
    baseAccuracy: 80,
    stressTestScenario: {
      title: 'Company-Wide Earnings & Audit Query Surge',
      description: '10,000 corporate analysts query complex SEC filings and PDF tables concurrently. System memory spikes.',
      loadMultiplier: 8,
    },
    stages: [
      {
        id: 'chunking_embedding',
        title: 'Stage 1: Document Chunking & Embedding Strategy',
        description: 'How are dense technical PDF manuals and tables ingested into vectors?',
        iconType: 'ingest',
        options: [
          {
            id: 'semantic_hybrid_bge',
            name: 'Semantic Structure-Aware Chunking + Local BGE-M3 (Self-Hosted GPU)',
            tagline: 'Preserves tables and code blocks with dense + sparse vector outputs',
            latencyDelta: 18,
            costDelta: 2600,
            reliabilityDelta: 6,
            accuracyDelta: 12,
            description: 'Parses Markdown and HTML tables without slicing sentences. Produces dense embeddings and lexical BM25 weights.',
            pros: ['Retains tabular structure', 'Hybrid dense/sparse retrieval in a single pass', 'Zero vendor API locks'],
            cons: ['Requires dedicated GPU worker for continuous background embedding'],
          },
          {
            id: 'openai_api_embeddings',
            name: 'Fixed 512-Token Chunks + OpenAI text-embedding-3-small',
            tagline: 'Fast cloud embedding with fixed character overlapping',
            latencyDelta: 45,
            costDelta: 1800,
            reliabilityDelta: 3,
            accuracyDelta: 5,
            description: 'Splits raw text every 512 tokens and calls OpenAI API.',
            pros: ['Zero model hosting overhead', 'High dimension quality'],
            cons: ['Splits tables awkwardly across chunk boundaries; external API rate limit risks'],
          },
          {
            id: 'giant_raw_chunks',
            name: 'Large 4,000-Token Chunks (Minimal Splitting)',
            tagline: 'Fewer chunks with massive context footprints',
            latencyDelta: 85,
            costDelta: 4200,
            reliabilityDelta: -4,
            accuracyDelta: -8,
            description: 'Feeds giant 4,000-token chunks to avoid segmentation.',
            pros: ['Context is rarely cut in half'],
            cons: ['Dilutes semantic similarity scores; balloons LLM prompt token costs on retrieval'],
          },
        ],
      },
      {
        id: 'vector_retrieval',
        title: 'Stage 2: Vector Search & Hybrid Indexing',
        description: 'Which vector database engine indexes and filters 15 million vectors across tenants?',
        iconType: 'features',
        options: [
          {
            id: 'qdrant_quantized',
            name: 'Qdrant Distributed (Scalar Quantization INT8 + In-Memory HNSW)',
            tagline: '75% RAM reduction with 99% vector recall and metadata filtering',
            latencyDelta: 12,
            costDelta: 2200,
            reliabilityDelta: 7,
            accuracyDelta: 8,
            description: 'Compresses 1536-dim vectors into INT8 with memory-mapped storage and Rust-based SIMD vector math.',
            pros: ['Lightning fast 8ms P99 search', 'Payload filter matching during HNSW traversal', 'Low RAM footprint'],
            cons: ['Requires proper disk-backed quantization tuning'],
          },
          {
            id: 'pgvector_rds',
            name: 'PostgreSQL + pgvector (HNSW Index on AWS RDS)',
            tagline: 'Single database for relational user data and vector embeddings',
            latencyDelta: 35,
            costDelta: 3100,
            reliabilityDelta: 5,
            accuracyDelta: 4,
            description: 'Keeps vectors inside existing enterprise PostgreSQL tables.',
            pros: ['Unified backup, ACID transactions, and standard relational joins', 'No new database cluster to operate'],
            cons: ['RDS memory saturation under 10M+ vectors; vacuum locks during heavy updates'],
            crashTriggerOnSurge: 'PostgreSQL shared_buffers exhausted during simultaneous vector search and document upserts. HNSW index scans stalled.',
          },
          {
            id: 'pinecone_serverless',
            name: 'Pinecone Serverless (Fully Managed Cloud)',
            tagline: 'Turnkey vector index with cloud auto-scaling',
            latencyDelta: 28,
            costDelta: 4800,
            reliabilityDelta: 5,
            accuracyDelta: 6,
            description: 'Fully managed vector search with tiered storage.',
            pros: ['Zero infrastructure maintenance', 'Instant scale from zero'],
            cons: ['High variable costs at scale; data leaves private VPC'],
          },
        ],
      },
      {
        id: 'reranking',
        title: 'Stage 3: Cross-Encoder Reranking & Compression',
        description: 'How do you filter initial 50 candidates down to top-5 most relevant context chunks?',
        iconType: 'model',
        options: [
          {
            id: 'flashrank_local',
            name: 'FlashRank (Ultra-Fast ONNX Cross-Encoder on CPU)',
            tagline: 'Sub-15ms local reranker with zero network roundtrips',
            latencyDelta: 14,
            costDelta: 400,
            reliabilityDelta: 6,
            accuracyDelta: 10,
            description: 'Quantized transformer reranker running directly on worker CPU threads.',
            pros: ['Boosts retrieval accuracy by 20%', 'Runs locally in 12ms', 'Virtually zero cloud cost'],
            cons: ['Slightly lower ranking precision than 500M parameter cloud models'],
          },
          {
            id: 'cohere_rerank',
            name: 'Cohere Rerank API (Cloud)',
            tagline: 'State-of-the-art hosted multilingual cross-encoder',
            latencyDelta: 75,
            costDelta: 3400,
            reliabilityDelta: 3,
            accuracyDelta: 12,
            description: 'Calls remote cross-encoder API on top-50 results.',
            pros: ['Exceptional relevance ranking on complex queries'],
            cons: ['Adds 70ms network roundtrip latency to every query; high per-search API costs'],
          },
          {
            id: 'no_rerank',
            name: 'No Reranking (Pass Raw Top-5 Vector Matches to LLM)',
            tagline: 'Zero reranking overhead; trust raw vector similarity scores',
            latencyDelta: 0,
            costDelta: 0,
            reliabilityDelta: 0,
            accuracyDelta: -14,
            description: 'Feeds raw vector cosine distance matches directly to LLM context.',
            pros: ['Zero latency impact', 'Zero cost'],
            cons: ['Vector cosine similarity often ranks irrelevant chunks high, causing model hallucinations'],
          },
        ],
      },
      {
        id: 'generation_engine',
        title: 'Stage 4: LLM Generation & Serving Engine',
        description: 'Which model and runtime synthesizes the final verified response?',
        iconType: 'fallback',
        options: [
          {
            id: 'vllm_llama_fp8',
            name: 'vLLM on 2x A100 (Llama 3.3 70B FP8 PagedAttention)',
            tagline: 'Self-hosted open weights with chunked prefill and KV-cache reuse',
            latencyDelta: 65,
            costDelta: 4400,
            reliabilityDelta: 8,
            accuracyDelta: 9,
            description: 'High-throughput engine with PagedAttention and continuous batching.',
            pros: ['Strict data privacy (no customer data leaves VPC)', 'High concurrency throughput', 'Zero per-token cloud bill'],
            cons: ['Requires reserved GPU capacity'],
          },
          {
            id: 'cloud_gpt4o',
            name: 'OpenAI GPT-4o Cloud API',
            tagline: 'Commercial frontier intelligence with serverless autoscaling',
            latencyDelta: 110,
            costDelta: 6200,
            reliabilityDelta: 4,
            accuracyDelta: 11,
            description: 'Streams response directly from OpenAI infrastructure.',
            pros: ['Highest linguistic polish and reasoning quality', 'Zero GPU operations'],
            cons: ['Vulnerable to external API outages; token fees scale linearly with user queries'],
          },
          {
            id: 'cpu_small_model',
            name: 'Small 3B Model on Worker CPU (Llama 3.2 3B)',
            tagline: 'Super cheap local model running on CPU cores',
            latencyDelta: 40,
            costDelta: 800,
            reliabilityDelta: 6,
            accuracyDelta: -16,
            description: 'Lightweight model running directly on web server CPU.',
            pros: ['Ultra-cheap hosting', 'Instant startup'],
            cons: ['High hallucination rate on dense technical SEC filings and table synthesis'],
          },
        ],
      },
    ],
  },
];

export const SystemDesignSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('fraud-engine');
  const scenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  // Selected option IDs map: { [stageId]: optionId }
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    SCENARIOS[0].stages.forEach((st) => {
      initial[st.id] = st.options[0].id;
    });
    return initial;
  });

  // Simulation test state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<Array<{ text: string; type: 'info' | 'warn' | 'error' | 'success' }>>([]);
  const [simulationResult, setSimulationResult] = useState<'survived' | 'crashed' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Switch scenario handler
  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const target = SCENARIOS.find((s) => s.id === id);
    if (target) {
      const initial: Record<string, string> = {};
      target.stages.forEach((st) => {
        initial[st.id] = st.options[0].id;
      });
      setSelections(initial);
      setSimulationLogs([]);
      setSimulationResult(null);
    }
  };

  // Select option handler
  const handleSelectOption = (stageId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [stageId]: optionId }));
    setSimulationLogs([]);
    setSimulationResult(null);
  };

  // Calculated metrics
  const telemetry = useMemo(() => {
    let latency = scenario.baseLatency;
    let cost = scenario.baseCost;
    let reliability = scenario.baseReliability;
    let accuracy = scenario.baseAccuracy;
    let crashTriggers: string[] = [];

    scenario.stages.forEach((st) => {
      const selectedOptionId = selections[st.id];
      const opt = st.options.find((o) => o.id === selectedOptionId);
      if (opt) {
        latency += opt.latencyDelta;
        cost += opt.costDelta;
        reliability += opt.reliabilityDelta;
        accuracy += opt.accuracyDelta;
        if (opt.crashTriggerOnSurge) {
          crashTriggers.push(opt.crashTriggerOnSurge);
        }
      }
    });

    reliability = Math.min(99.9, Math.max(15, reliability));
    accuracy = Math.min(99.5, Math.max(30, accuracy));

    return {
      latency: Math.max(2, latency),
      cost,
      reliability,
      accuracy,
      crashTriggers,
      isLatencySafe: latency <= scenario.targetLatency,
      isBudgetSafe: cost <= scenario.budgetLimit,
    };
  }, [scenario, selections]);

  // Overall Architecture Grade
  const scorecard = useMemo(() => {
    const { latency, cost, reliability, accuracy, isLatencySafe, isBudgetSafe } = telemetry;
    let score = 100;

    // Penalties
    if (!isLatencySafe) score -= 35;
    if (!isBudgetSafe) score -= 25;
    if (reliability < 80) score -= (80 - reliability) * 1.2;
    if (accuracy < 80) score -= (80 - accuracy) * 1.0;

    score = Math.max(10, Math.min(100, Math.round(score)));

    let grade = 'A';
    let title = 'Senior ML Systems Architect';
    let summary = 'A balanced, resilient production architecture that meets enterprise SLAs.';

    if (score >= 93) {
      grade = 'S';
      title = 'Principal Staff Architect (Tier 1)';
      summary = 'Exceptional engineering maturity! Strict latency budgets respected with rock-solid fault tolerance and sustainable cloud economics.';
    } else if (score >= 82) {
      grade = 'A';
      title = 'Senior Systems Architect';
      summary = 'Solid production pipeline with balanced latency and high reliability.';
    } else if (score >= 70) {
      grade = 'B';
      title = 'Production ML Engineer';
      summary = 'Viable architecture with minor operational risks or near-budget ceiling limits.';
    } else if (score >= 50) {
      grade = 'C';
      title = 'Technical Debt Collector';
      summary = 'Architecture exceeds budget limits or latency SLAs under high throughput. Likely to experience maintenance fatigue.';
    } else {
      grade = 'F';
      title = 'Outage Generator';
      summary = 'Critical architectural bottlenecks. System will fail SLA contracts or crash during traffic surges.';
    }

    return { score, grade, title, summary };
  }, [telemetry]);

  // Run Stress Test Simulation
  const runStressTest = () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    setSimulationResult(null);

    const logs: Array<{ text: string; type: 'info' | 'warn' | 'error' | 'success'; delay: number }> = [
      { text: `[T+0.0s] Triggering ${scenario.stressTestScenario.title}...`, type: 'info', delay: 400 },
      { text: `[T+0.5s] Ingress traffic surge: ${scenario.stressTestScenario.loadMultiplier}x volume injected into gateways.`, type: 'info', delay: 1100 },
      { text: `[T+1.2s] Observing cluster telemetry: P99 latency tracking at ${telemetry.latency}ms...`, type: 'info', delay: 1800 },
    ];

    if (telemetry.crashTriggers.length > 0) {
      logs.push({
        text: `[T+2.1s] 🚨 BOTTLENECK DETECTED: ${telemetry.crashTriggers[0]}`,
        type: 'error',
        delay: 2600,
      });
      logs.push({
        text: `[T+2.8s] 💥 CASCADING FAILURE: Downstream queue buffer overflowed. Error budget exhausted.`,
        type: 'error',
        delay: 3400,
      });
    } else if (!telemetry.isLatencySafe) {
      logs.push({
        text: `[T+2.2s] ⚠️ SLA BREACH: Current latency (${telemetry.latency}ms) exceeds customer timeout SLA (${scenario.targetLatency}ms). Transactions rejected.`,
        type: 'warn',
        delay: 2600,
      });
      logs.push({
        text: `[T+3.0s] 💥 System brownout. 24% of requests timed out at gateway.`,
        type: 'error',
        delay: 3400,
      });
    } else {
      logs.push({
        text: `[T+2.2s] Backpressure mechanism holding steady. Queues draining at 99.8% capacity.`,
        type: 'success',
        delay: 2600,
      });
      logs.push({
        text: `[T+3.1s] ✅ STRESS TEST PASSED: Zero dropped requests. P99 latency held at ${telemetry.latency}ms with ${telemetry.reliability}% uptime!`,
        type: 'success',
        delay: 3400,
      });
    }

    logs.forEach((logItem) => {
      setTimeout(() => {
        setSimulationLogs((prev) => [...prev, { text: logItem.text, type: logItem.type }]);
        if (logItem.delay === 3400) {
          setIsSimulating(false);
          setSimulationResult(telemetry.crashTriggers.length > 0 || !telemetry.isLatencySafe ? 'crashed' : 'survived');
        }
      }, logItem.delay);
    });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/simulator/?scenario=${scenario.id}`;
      navigator.clipboard.writeText(
        `I scored Grade ${scorecard.grade} (${scorecard.score}/100) as ${scorecard.title} on EncodeEdge ML System Design Simulator! Can your architecture survive Black Friday? ${shareUrl}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 text-zinc-100">
      {/* Scenario Selector & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              {scenario.badge}
            </span>
            <span className="text-xs text-zinc-400 font-mono">Interactive Decision RPG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            {scenario.title}
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl font-body">
            {scenario.subtitle}
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                sc.id === selectedScenarioId
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              {sc.id === 'fraud-engine' ? 'Fintech Fraud (100M/day)' : 'Enterprise RAG (10M Docs)'}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Telemetry Cockpit (HUD) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Latency Gauge */}
        <div className={`p-4 rounded-2xl border transition-all ${
          telemetry.isLatencySafe
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-red-950/20 border-red-800/80 shadow-red-950/20 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              P99 Latency
            </span>
            <span className="text-[11px] font-mono">SLA: &lt;{scenario.targetLatency}ms</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${
              telemetry.isLatencySafe ? 'text-white' : 'text-red-400'
            }`}>
              {telemetry.latency}
            </span>
            <span className="text-xs text-zinc-400">ms</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                telemetry.isLatencySafe ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (telemetry.latency / scenario.targetLatency) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cloud Cost Gauge */}
        <div className={`p-4 rounded-2xl border transition-all ${
          telemetry.isBudgetSafe
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-red-950/20 border-red-800/80 shadow-red-950/20 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Monthly Cloud Bill
            </span>
            <span className="text-[11px] font-mono">Cap: ${scenario.budgetLimit.toLocaleString()}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${
              telemetry.isBudgetSafe ? 'text-white' : 'text-red-400'
            }`}>
              ${telemetry.cost.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">/mo</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                telemetry.isBudgetSafe ? 'bg-emerald-400' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (telemetry.cost / scenario.budgetLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Reliability & Fault Tolerance */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Uptime & Reliability
            </span>
            <span className="text-[11px] font-mono">{telemetry.reliability > 92 ? 'High HA' : 'Fragile'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {telemetry.reliability.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 transition-all duration-500"
              style={{ width: `${telemetry.reliability}%` }}
            />
          </div>
        </div>

        {/* Accuracy / Task Quality */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              Model Precision / F1
            </span>
            <span className="text-[11px] font-mono">Target: &gt;85%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {telemetry.accuracy.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all duration-500"
              style={{ width: `${telemetry.accuracy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Architecture Stages & Choices */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Architecture Decision Pipeline</span>
          </h3>
          <span className="text-xs text-zinc-400">Click any component to swap your production stack</span>
        </div>

        <div className="space-y-6">
          {scenario.stages.map((stage, stageIdx) => (
            <div
              key={stage.id}
              className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800/80 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {stageIdx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-white">{stage.title}</h4>
                    <p className="text-xs text-zinc-400">{stage.description}</p>
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stage.options.map((opt) => {
                  const isSelected = selections[stage.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(stage.id, opt.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-950/30 ring-1 ring-indigo-500'
                          : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/40'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-sm text-zinc-100 leading-snug">
                            {opt.name}
                          </span>
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          ) : (
                            <div className="size-4 rounded-full border border-zinc-700 shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-body">
                          {opt.tagline}
                        </p>
                      </div>

                      {/* Trade-off delta badges */}
                      <div className="pt-3 mt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className={`px-2 py-0.5 rounded ${
                          opt.latencyDelta <= 5 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                        }`}>
                          {opt.latencyDelta > 0 ? `+${opt.latencyDelta}ms` : `${opt.latencyDelta}ms`}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          +${opt.costDelta}/mo
                        </span>
                        {opt.accuracyDelta !== 0 && (
                          <span className={`px-2 py-0.5 rounded ${
                            opt.accuracyDelta > 0 ? 'bg-purple-500/10 text-purple-300' : 'bg-red-500/10 text-red-300'
                          }`}>
                            {opt.accuracyDelta > 0 ? `+${opt.accuracyDelta}%` : `${opt.accuracyDelta}%`} Acc
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Test Simulation & Outage Console */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Production Stress Test Simulator</span>
            </div>
            <h4 className="text-lg font-bold text-white mt-1">
              {scenario.stressTestScenario.title}
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl mt-0.5">
              {scenario.stressTestScenario.description}
            </p>
          </div>

          <button
            onClick={runStressTest}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white font-semibold text-sm shadow-lg hover:shadow-orange-500/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            {isSimulating ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Simulating Surge Traffic...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Traffic Surge Test</span>
              </>
            )}
          </button>
        </div>

        {/* Live Terminal Output */}
        {simulationLogs.length > 0 && (
          <div className="p-4 rounded-2xl bg-black border border-zinc-800 font-mono text-xs space-y-2 mt-4 animate-fadeIn">
            <div className="flex items-center justify-between text-zinc-500 pb-2 border-b border-zinc-900 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Simulation Cluster Telemetry Log
              </span>
              <span>TPS Multiplier: {scenario.stressTestScenario.loadMultiplier}x</span>
            </div>
            {simulationLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  log.type === 'error'
                    ? 'text-red-400 font-semibold'
                    : log.type === 'warn'
                    ? 'text-amber-300'
                    : log.type === 'success'
                    ? 'text-emerald-400 font-semibold'
                    : 'text-zinc-300'
                }`}
              >
                <span>&gt;</span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Architect Scorecard & Report */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-5">
            <div className={`size-20 rounded-2xl flex items-center justify-center font-serif text-4xl font-extrabold shadow-2xl border ${
              scorecard.grade === 'S'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-amber-500/20'
                : scorecard.grade === 'A'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                : scorecard.grade === 'B'
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20'
                : 'bg-red-500/10 text-red-300 border-red-500/40 shadow-red-500/20'
            }`}>
              {scorecard.grade}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Architect Assessment</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  {scorecard.score}/100 Pts
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                {scorecard.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-body max-w-xl">
                {scorecard.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Result Copied to Clipboard!' : 'Share Score'}</span>
            </button>
          </div>
        </div>

        {/* Selected Stack Blueprint Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {scenario.stages.map((st) => {
            const opt = st.options.find((o) => o.id === selections[st.id]);
            return (
              <div key={st.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono">
                  {st.title.split(':')[0]}
                </span>
                <div className="font-semibold text-zinc-200 truncate">{opt?.name}</div>
                <div className="text-[11px] text-zinc-400 line-clamp-1">{opt?.tagline}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemDesignSimulator;
