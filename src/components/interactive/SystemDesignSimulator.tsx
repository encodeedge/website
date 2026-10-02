import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Network,
  Cpu,
  Database,
  Radio,
  Server,
  Brain,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  Trash2,
  Download,
  Upload,
  Eye,
  Sliders,
  HelpCircle,
  Layers,
  ChevronRight,
  ShieldCheck,
  Activity,
  Maximize2,
  Minimize2,
  Copy,
  Info,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  X,
  Compass,
  Move,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export type ComponentCategory = 'networking' | 'compute' | 'storage' | 'messaging' | 'aiml' | 'infra';

export interface ComponentSpec {
  type: string;
  name: string;
  category: ComponentCategory;
  maxQps: number;
  baseLatencyMs: number;
  costPerHour: number;
  description: string;
  isStateful?: boolean;
}

export const COMPONENT_CATALOG: Record<string, ComponentSpec> = {
  // Networking
  'client': {
    type: 'client',
    name: 'Client Traffic',
    category: 'networking',
    maxQps: 1000000,
    baseLatencyMs: 0,
    costPerHour: 0,
    description: 'Ingress traffic from mobile apps, web browsers, and external API callers.'
  },
  'dns': {
    type: 'dns',
    name: 'DNS (Route 53)',
    category: 'networking',
    maxQps: 1000000,
    baseLatencyMs: 2,
    costPerHour: 0.05,
    description: 'Latency-based or geo-routing DNS resolution.'
  },
  'cdn': {
    type: 'cdn',
    name: 'CDN Edge (CloudFront)',
    category: 'networking',
    maxQps: 500000,
    baseLatencyMs: 15,
    costPerHour: 0.40,
    description: 'Edge caching for static assets, images, and cached responses.'
  },
  'load-balancer': {
    type: 'load-balancer',
    name: 'Load Balancer (ALB)',
    category: 'networking',
    maxQps: 200000,
    baseLatencyMs: 1,
    costPerHour: 0.25,
    description: 'Layer 7 / Layer 4 traffic distribution across compute nodes.'
  },
  'api-gateway': {
    type: 'api-gateway',
    name: 'API Gateway',
    category: 'networking',
    maxQps: 100000,
    baseLatencyMs: 5,
    costPerHour: 0.35,
    description: 'Authentication, routing, request validation, and rate limiting.'
  },
  'rate-limiter': {
    type: 'rate-limiter',
    name: 'Rate Limiter',
    category: 'networking',
    maxQps: 150000,
    baseLatencyMs: 2,
    costPerHour: 0.20,
    description: 'Token bucket / sliding window throttling to block DDoS and abuse.'
  },

  // Compute
  'app-server': {
    type: 'app-server',
    name: 'App Server (ECS/K8s)',
    category: 'compute',
    maxQps: 8000,
    baseLatencyMs: 12,
    costPerHour: 0.45,
    description: 'Stateless backend business logic server running microservices.'
  },
  'worker-server': {
    type: 'worker-server',
    name: 'Background Worker',
    category: 'compute',
    maxQps: 5000,
    baseLatencyMs: 50,
    costPerHour: 0.35,
    description: 'Async task processor for heavy jobs, batch computing, and fanout.'
  },
  'websocket-server': {
    type: 'websocket-server',
    name: 'WebSocket Server',
    category: 'compute',
    maxQps: 30000,
    baseLatencyMs: 2,
    costPerHour: 0.50,
    description: 'Maintains long-lived duplex TCP connections for chat, notifications.'
  },
  'stream-processor': {
    type: 'stream-processor',
    name: 'Stream Processor (Flink)',
    category: 'compute',
    maxQps: 40000,
    baseLatencyMs: 8,
    costPerHour: 0.80,
    description: 'Real-time telemetry, rolling window aggregations, and clickstream.'
  },
  'auth-service': {
    type: 'auth-service',
    name: 'Auth Service',
    category: 'compute',
    maxQps: 35000,
    baseLatencyMs: 6,
    costPerHour: 0.30,
    description: 'JWT issuance, session validation, OAuth2 authorization.'
  },

  // Storage
  'redis-cache': {
    type: 'redis-cache',
    name: 'Redis Cache (Cluster)',
    category: 'storage',
    maxQps: 100000,
    baseLatencyMs: 1,
    costPerHour: 0.60,
    isStateful: true,
    description: 'Sub-millisecond in-memory key-value store for hot reads and sessions.'
  },
  'sql-db': {
    type: 'sql-db',
    name: 'SQL Primary (PostgreSQL)',
    category: 'storage',
    maxQps: 3500,
    baseLatencyMs: 15,
    costPerHour: 1.20,
    isStateful: true,
    description: 'ACID transactional relational database for source-of-truth records.'
  },
  'sql-replica': {
    type: 'sql-replica',
    name: 'SQL Read Replica',
    category: 'storage',
    maxQps: 8000,
    baseLatencyMs: 10,
    costPerHour: 0.80,
    isStateful: true,
    description: 'Read-only replica for horizontal query scaling.'
  },
  'nosql-db': {
    type: 'nosql-db',
    name: 'NoSQL DB (DynamoDB)',
    category: 'storage',
    maxQps: 50000,
    baseLatencyMs: 4,
    costPerHour: 0.90,
    isStateful: true,
    description: 'High-scale distributed key-value / document store with auto-partitioning.'
  },
  'object-storage': {
    type: 'object-storage',
    name: 'Object Storage (S3)',
    category: 'storage',
    maxQps: 25000,
    baseLatencyMs: 70,
    costPerHour: 0.20,
    isStateful: true,
    description: 'Massive durable blob storage for videos, photos, and model checkpoints.'
  },
  'search-index': {
    type: 'search-index',
    name: 'Search Index (OpenSearch)',
    category: 'storage',
    maxQps: 15000,
    baseLatencyMs: 18,
    costPerHour: 0.75,
    isStateful: true,
    description: 'Inverted index for full-text search, fuzzy matching, and log analytics.'
  },

  // Messaging
  'message-queue': {
    type: 'message-queue',
    name: 'Message Queue (Kafka)',
    category: 'messaging',
    maxQps: 100000,
    baseLatencyMs: 4,
    costPerHour: 0.70,
    isStateful: true,
    description: 'Durable distributed commit log for event streaming and decoupling.'
  },
  'pubsub-bus': {
    type: 'pubsub-bus',
    name: 'Pub/Sub Event Bus',
    category: 'messaging',
    maxQps: 120000,
    baseLatencyMs: 3,
    costPerHour: 0.50,
    description: 'Fan-out event routing between independent decoupled services.'
  },
  'notification-service': {
    type: 'notification-service',
    name: 'Push Gateway (FCM/APNs)',
    category: 'messaging',
    maxQps: 20000,
    baseLatencyMs: 25,
    costPerHour: 0.30,
    description: 'Sends alerts, push notifications, emails, and SMS.'
  },

  // AI & ML
  'vector-db': {
    type: 'vector-db',
    name: 'Vector DB (Qdrant/Milvus)',
    category: 'aiml',
    maxQps: 12000,
    baseLatencyMs: 18,
    costPerHour: 1.10,
    isStateful: true,
    description: 'HNSW ANN vector index for semantic similarity & RAG candidate search.'
  },
  'embedding-service': {
    type: 'embedding-service',
    name: 'Embedding Generator',
    category: 'aiml',
    maxQps: 2500,
    baseLatencyMs: 35,
    costPerHour: 1.50,
    description: 'Converts queries and texts into dense multi-dimensional embeddings.'
  },
  'neural-reranker': {
    type: 'neural-reranker',
    name: 'Cross-Encoder Reranker',
    category: 'aiml',
    maxQps: 1000,
    baseLatencyMs: 50,
    costPerHour: 1.80,
    description: 'Heavy deep-learning ranking model to score and reorder top candidates.'
  },
  'llm-inference': {
    type: 'llm-inference',
    name: 'LLM Serving (vLLM)',
    category: 'aiml',
    maxQps: 200,
    baseLatencyMs: 220,
    costPerHour: 3.50,
    description: 'GPU-accelerated frontier LLM generation with streaming tokens.'
  },
  'feature-store': {
    type: 'feature-store',
    name: 'Online Feature Store',
    category: 'aiml',
    maxQps: 45000,
    baseLatencyMs: 3,
    costPerHour: 0.85,
    isStateful: true,
    description: 'Low-latency user/item feature serving for real-time recommendation models.'
  },

  // Infra
  'circuit-breaker': {
    type: 'circuit-breaker',
    name: 'Circuit Breaker',
    category: 'infra',
    maxQps: 200000,
    baseLatencyMs: 1,
    costPerHour: 0.15,
    description: 'Fails fast when downstream dependencies degrade to prevent cascading failure.'
  },
  'monitoring': {
    type: 'monitoring',
    name: 'Prometheus Monitoring',
    category: 'infra',
    maxQps: 200000,
    baseLatencyMs: 1,
    costPerHour: 0.25,
    description: 'Real-time telemetry, error tracking, and automated alert manager.'
  }
};

export const CATEGORY_COLORS: Record<ComponentCategory, { bg: string; border: string; text: string; badge: string; icon: any }> = {
  networking: {
    bg: 'bg-sky-50 dark:bg-sky-950/20 hover:bg-sky-100 dark:hover:bg-sky-950/30',
    border: 'border-sky-300 dark:border-sky-500/50',
    text: 'text-sky-700 dark:text-sky-300',
    badge: 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-500/30',
    icon: Network
  },
  compute: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/30',
    border: 'border-indigo-300 dark:border-indigo-500/50',
    text: 'text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    icon: Cpu
  },
  storage: {
    bg: 'bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30',
    border: 'border-blue-300 dark:border-blue-500/50',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    icon: Database
  },
  messaging: {
    bg: 'bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30',
    border: 'border-purple-300 dark:border-purple-500/50',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    icon: Radio
  },
  aiml: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30',
    border: 'border-emerald-300 dark:border-emerald-500/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    icon: Brain
  },
  infra: {
    bg: 'bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200/80 dark:hover:bg-slate-800/60',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: ShieldCheck
  }
};

export interface CanvasNode {
  id: string;
  componentType: string;
  label: string;
  x: number;
  y: number;
  instances: number;
}

export interface CanvasEdge {
  id: string;
  from: string;
  to: string;
  isAsync: boolean;
  label?: string;
}

export interface SimulatorProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  targetQps: number;
  readRatioPercent: number;
  maxLatencyMs: number;
  summary: string;
  functionalRequirements?: string[];
  nonFunctionalRequirements?: string[];
  hints?: string[];
  referenceNodes: CanvasNode[];
  referenceEdges: CanvasEdge[];
  order?: number;
}

interface NodeRuntimeMetrics {
  incomingQps: number;
  effectiveCapacity: number;
  utilization: number;
  latencyMs: number;
  isOverloaded: boolean;
  isWarning: boolean;
  droppedQps: number;
}

interface ScoreReport {
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  scalability: { score: number; max: 20; feedback: string };
  reliability: { score: number; max: 20; feedback: string };
  performance: { score: number; max: 20; feedback: string };
  cost: { score: number; max: 20; feedback: string };
  architecture: { score: number; max: 20; feedback: string };
  passedChecklist: string[];
  improvementChecklist: string[];
}

export interface SystemDesignSimulatorProps {
  initialProblems?: SimulatorProblem[];
  defaultProblemId?: string;
}

export const SystemDesignSimulator: React.FC<SystemDesignSimulatorProps> = ({
  initialProblems = [],
  defaultProblemId
}) => {
  // 1. Problems state
  const problems = useMemo(() => {
    if (initialProblems && initialProblems.length > 0) {
      return initialProblems;
    }
    return [
      {
        id: 'url-shortener',
        title: 'URL Shortener (TinyURL)',
        difficulty: 'Easy',
        category: 'General',
        targetQps: 100000,
        readRatioPercent: 95,
        maxLatencyMs: 25,
        summary: 'Design a high-throughput URL shortening service like TinyURL. Must handle 100K QPS with 95% reads, sub-25ms redirection, and persistent storage.',
        functionalRequirements: ['Shorten long URLs to 7 chars', 'Redirect short code to destination', 'Custom alias support'],
        nonFunctionalRequirements: ['Sub-25ms P99 latency', 'High read availability 99.99%', 'Decouple writes from reads'],
        hints: ['Place Redis in front of PostgreSQL to serve 85%+ reads sub-2ms', 'Use ALB to balance traffic across App Servers'],
        referenceNodes: [
          { id: 'client-1', componentType: 'client', label: 'Client Ingress', x: 60, y: 220, instances: 1 },
          { id: 'lb-1', componentType: 'load-balancer', label: 'ALB Load Balancer', x: 240, y: 220, instances: 2 },
          { id: 'app-1', componentType: 'app-server', label: 'URL Gateway Cluster', x: 440, y: 220, instances: 4 },
          { id: 'cache-1', componentType: 'redis-cache', label: 'Redis Hot URL Cache', x: 640, y: 120, instances: 2 },
          { id: 'db-1', componentType: 'sql-db', label: 'PostgreSQL Primary', x: 640, y: 320, instances: 1 },
          { id: 'replica-1', componentType: 'sql-replica', label: 'Read Replicas', x: 840, y: 320, instances: 2 },
        ],
        referenceEdges: [
          { id: 'e1', from: 'client-1', to: 'lb-1', isAsync: false, label: 'HTTP' },
          { id: 'e2', from: 'lb-1', to: 'app-1', isAsync: false, label: 'Round-Robin' },
          { id: 'e3', from: 'app-1', to: 'cache-1', isAsync: false, label: '95% Reads' },
          { id: 'e4', from: 'app-1', to: 'db-1', isAsync: false, label: '5% Writes' },
          { id: 'e5', from: 'db-1', to: 'replica-1', isAsync: true, label: 'Replication' },
          { id: 'e6', from: 'cache-1', to: 'replica-1', isAsync: false, label: 'Miss' },
        ],
        order: 1
      }
    ] as SimulatorProblem[];
  }, [initialProblems]);

  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    if (defaultProblemId && problems.some(p => p.id === defaultProblemId)) {
      return defaultProblemId;
    }
    return problems[0]?.id || 'url-shortener';
  });

  const activeProblem = useMemo(() => {
    return problems.find(p => p.id === selectedProblemId) || problems[0];
  }, [problems, selectedProblemId]);

  // 2. Canvas Elements State
  const [nodes, setNodes] = useState<CanvasNode[]>(() => activeProblem?.referenceNodes || []);
  const [edges, setEdges] = useState<CanvasEdge[]>(() => activeProblem?.referenceEdges || []);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Connecting edge state
  const [connectSourceNodeId, setConnectSourceNodeId] = useState<string | null>(null);

  // Pan & Zoom State for Full-Width Infinite Canvas
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Floating Overlay Panels Visibility
  const [showToolbox, setShowToolbox] = useState<boolean>(false);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'simulation' | 'score' | 'problem'>('simulation');

  // Fullscreen state & container reference
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullScreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } catch {
        // Fallback for restricted frames/browsers
        setIsFullscreen(prev => !prev);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {
        // ignore
      }
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // 3. Traffic Simulation Engine State
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [offeredQps, setOfferedQps] = useState<number>(() => activeProblem?.targetQps || 50000);

  // Search filter for component palette
  const [paletteSearch, setPaletteSearch] = useState<string>('');
  const [selectedPaletteCategory, setSelectedPaletteCategory] = useState<ComponentCategory | 'all'>('all');

  // Load problem reference
  const loadProblemArchitecture = useCallback((prob: SimulatorProblem) => {
    setNodes(prob.referenceNodes.map(n => ({ ...n })));
    setEdges(prob.referenceEdges.map(e => ({ ...e })));
    setOfferedQps(prob.targetQps);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setConnectSourceNodeId(null);
    setZoom(1);
    setPanOffset({ x: 40, y: 40 });
  }, []);

  // Update when selected problem changes
  useEffect(() => {
    if (activeProblem) {
      loadProblemArchitecture(activeProblem);
    }
  }, [activeProblem, loadProblemArchitecture]);

  // 4. Node Dragging Mechanics with Pan & Zoom Awareness
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    setDraggingNodeId(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseCanvasX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseCanvasY = (e.clientY - rect.top - panOffset.y) / zoom;

    dragOffsetRef.current = {
      x: mouseCanvasX - node.x,
      y: mouseCanvasY - node.y
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking empty canvas background directly, never on buttons/panels/overlays
    if (e.target !== canvasRef.current) return;
    if (e.button === 0 && !draggingNodeId) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY };
      panStartOffsetRef.current = { ...panOffset };
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setConnectSourceNodeId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset({
        x: Math.round(panStartOffsetRef.current.x + dx),
        y: Math.round(panStartOffsetRef.current.y + dy)
      });
      return;
    }

    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseCanvasX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseCanvasY = (e.clientY - rect.top - panOffset.y) / zoom;

    const newX = Math.round((mouseCanvasX - dragOffsetRef.current.x) / 10) * 10;
    const newY = Math.round((mouseCanvasY - dragOffsetRef.current.y) / 10) * 10;

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(1.8, Math.round((prev + delta) * 10) / 10)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 40, y: 40 });
  };

  // Connect port click
  const handlePortClick = (e: React.MouseEvent, nodeId: string, isOutput: boolean) => {
    e.stopPropagation();
    if (isOutput) {
      setConnectSourceNodeId(nodeId);
    } else {
      if (connectSourceNodeId && connectSourceNodeId !== nodeId) {
        const exists = edges.some(edge => edge.from === connectSourceNodeId && edge.to === nodeId);
        if (!exists) {
          const newEdge: CanvasEdge = {
            id: `edge-${Date.now()}`,
            from: connectSourceNodeId,
            to: nodeId,
            isAsync: false,
            label: 'Dataflow'
          };
          setEdges(prev => [...prev, newEdge]);
        }
        setConnectSourceNodeId(null);
      }
    }
  };

  // Add Component to canvas center
  const handleAddComponent = (spec: ComponentSpec) => {
    const id = `${spec.type}-${Date.now().toString().slice(-4)}`;
    // Place at center of visible canvas viewport
    const canvasCenterX = Math.round((-panOffset.x + (canvasRef.current?.clientWidth || 800) / 2) / zoom);
    const canvasCenterY = Math.round((-panOffset.y + (canvasRef.current?.clientHeight || 600) / 2) / zoom);

    const newNode: CanvasNode = {
      id,
      componentType: spec.type,
      label: spec.name,
      x: canvasCenterX - 65,
      y: canvasCenterY - 30,
      instances: 1
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  // Node instance adjust
  const handleUpdateInstances = (nodeId: string, delta: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const next = Math.max(1, Math.min(24, n.instances + delta));
        return { ...n, instances: next };
      }
      return n;
    }));
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Delete edge
  const handleDeleteEdge = (edgeId: string) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
  };

  // Toggle sync/async edge
  const handleToggleEdgeAsync = (edgeId: string) => {
    setEdges(prev => prev.map(e => e.id === edgeId ? { ...e, isAsync: !e.isAsync } : e));
  };

  // 5. TOPOLOGICAL TRAFFIC SIMULATION ENGINE (KAHN'S ALGORITHM)
  const nodeMetrics = useMemo(() => {
    const metrics: Record<string, NodeRuntimeMetrics> = {};

    nodes.forEach(n => {
      const spec = COMPONENT_CATALOG[n.componentType] || COMPONENT_CATALOG['app-server'];
      const effectiveCap = spec.maxQps * n.instances;
      metrics[n.id] = {
        incomingQps: 0,
        effectiveCapacity: effectiveCap,
        utilization: 0,
        latencyMs: spec.baseLatencyMs,
        isOverloaded: false,
        isWarning: false,
        droppedQps: 0
      };
    });

    if (!isSimulating || nodes.length === 0) return metrics;

    const inDegree: Record<string, number> = {};
    const outgoingMap: Record<string, string[]> = {};

    nodes.forEach(n => {
      inDegree[n.id] = 0;
      outgoingMap[n.id] = [];
    });

    edges.forEach(e => {
      if (inDegree[e.to] !== undefined) {
        inDegree[e.to] = (inDegree[e.to] || 0) + 1;
      }
      if (outgoingMap[e.from]) {
        outgoingMap[e.from].push(e.to);
      }
    });

    const rootNodes = nodes.filter(n => inDegree[n.id] === 0);
    rootNodes.forEach(r => {
      metrics[r.id].incomingQps = offeredQps / Math.max(1, rootNodes.length);
    });

    const queue = [...rootNodes.map(r => r.id)];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const currentMetrics = metrics[currentId];
      if (!currentMetrics) continue;

      const currentNode = nodes.find(n => n.id === currentId);
      const spec = currentNode ? COMPONENT_CATALOG[currentNode.componentType] : null;

      const throughput = Math.min(currentMetrics.incomingQps, currentMetrics.effectiveCapacity);
      currentMetrics.utilization = currentMetrics.effectiveCapacity > 0 ? (currentMetrics.incomingQps / currentMetrics.effectiveCapacity) : 1;
      currentMetrics.isOverloaded = currentMetrics.utilization >= 1.0;
      currentMetrics.isWarning = currentMetrics.utilization >= 0.75 && currentMetrics.utilization < 1.0;
      currentMetrics.droppedQps = Math.max(0, currentMetrics.incomingQps - currentMetrics.effectiveCapacity);

      if (spec) {
        let penalty = 0;
        if (currentMetrics.utilization > 0.8) {
          penalty = spec.baseLatencyMs * (currentMetrics.utilization - 0.8) * 3;
        }
        currentMetrics.latencyMs = Math.round((spec.baseLatencyMs + penalty) * 10) / 10;
      }

      const children = outgoingMap[currentId] || [];
      if (children.length === 0) continue;

      const isLoadBalancer = currentNode?.componentType === 'load-balancer';
      const isCache = currentNode?.componentType === 'redis-cache';

      children.forEach(childId => {
        let childShare = 0;
        if (isLoadBalancer) {
          childShare = throughput / children.length;
        } else if (isCache) {
          childShare = throughput * 0.15;
        } else {
          childShare = throughput;
        }

        if (metrics[childId]) {
          metrics[childId].incomingQps += childShare;
        }

        if (!visited.has(childId) && !queue.includes(childId)) {
          queue.push(childId);
        }
      });
    }

    return metrics;
  }, [nodes, edges, offeredQps, isSimulating]);

  // Overall system metrics
  const systemSummary = useMemo(() => {
    let totalCap = 0;
    let maxPathLatency = 0;
    let bottleneckNodes: CanvasNode[] = [];
    let totalDropped = 0;

    nodes.forEach(n => {
      const m = nodeMetrics[n.id];
      if (m) {
        totalCap += m.effectiveCapacity;
        totalDropped += m.droppedQps;
        if (m.isOverloaded) {
          bottleneckNodes.push(n);
        }
      }
    });

    const syncEdges = edges.filter(e => !e.isAsync);
    function getPathLatency(currId: string, visited: Set<string>): number {
      if (visited.has(currId)) return 0;
      visited.add(currId);
      const m = nodeMetrics[currId];
      const selfLat = m ? m.latencyMs : 0;
      const nextEdges = syncEdges.filter(e => e.from === currId);
      if (nextEdges.length === 0) return selfLat;
      const childMax = Math.max(...nextEdges.map(e => getPathLatency(e.to, new Set(visited))));
      return selfLat + childMax;
    }

    const roots = nodes.filter(n => !edges.some(e => e.to === n.id));
    if (roots.length > 0) {
      maxPathLatency = Math.round(Math.max(...roots.map(r => getPathLatency(r.id, new Set()))));
    } else {
      maxPathLatency = 20;
    }

    const effectiveThroughput = Math.max(0, offeredQps - totalDropped);
    const healthStatus = bottleneckNodes.length > 0 ? 'critical' : totalDropped > 0 ? 'warning' : 'healthy';

    return {
      totalCapacity: totalCap,
      endToEndLatencyMs: maxPathLatency,
      bottlenecks: bottleneckNodes,
      totalDroppedQps: totalDropped,
      effectiveThroughput,
      healthStatus
    };
  }, [nodes, edges, nodeMetrics, offeredQps]);

  // 6. SCORING & INTERVIEW EVALUATION ENGINE
  const scoreReport = useMemo<ScoreReport>(() => {
    let scal = 10;
    let rel = 10;
    let perf = 10;
    let cost = 14;
    let arch = 10;

    const passed: string[] = [];
    const improvements: string[] = [];

    const hasLB = nodes.some(n => n.componentType === 'load-balancer');
    const computeNodes = nodes.filter(n => ['app-server', 'worker-server'].includes(n.componentType));
    const totalComputeInstances = computeNodes.reduce((acc, c) => acc + c.instances, 0);

    if (hasLB) {
      scal += 5;
      passed.push('Load Balancer distributes traffic horizontally across servers');
    } else {
      improvements.push('Add an Application Load Balancer to prevent single server bottlenecks');
    }

    if (totalComputeInstances >= 3) {
      scal += 5;
      passed.push(`Compute tier scaled with ${totalComputeInstances} active instances`);
    } else {
      scal -= 3;
      improvements.push('Compute tier has low replica count. Scale app servers to 3+ instances');
    }

    const singlePointsOfFailure = nodes.filter(n => n.instances === 1 && n.componentType !== 'client' && n.componentType !== 'dns');
    if (singlePointsOfFailure.length === 0) {
      rel += 6;
      passed.push('Zero SPOF — all critical services have multiple redundant instances');
    } else {
      rel -= 4;
      improvements.push(`SPOF detected on ${singlePointsOfFailure.map(s => s.label).slice(0, 2).join(', ')}. Scale instances to 2+`);
    }

    const hasQueue = nodes.some(n => ['message-queue', 'pubsub-bus'].includes(n.componentType));
    if (hasQueue) {
      rel += 4;
      passed.push('Message Queue / Event Bus absorbs heavy write spikes asynchronously');
    }

    const hasCache = nodes.some(n => n.componentType === 'redis-cache');
    if (hasCache) {
      perf += 6;
      passed.push('Redis Cache intercepts reads with sub-2ms response time');
    } else {
      perf -= 4;
      improvements.push('No cache detected. Direct DB queries cause latency spikes at high QPS');
    }

    if (systemSummary.endToEndLatencyMs <= activeProblem.maxLatencyMs) {
      perf += 4;
      passed.push(`P99 latency of ~${systemSummary.endToEndLatencyMs}ms meets target SLA (< ${activeProblem.maxLatencyMs}ms)`);
    } else {
      perf -= 5;
      improvements.push(`Estimated latency (${systemSummary.endToEndLatencyMs}ms) exceeds target budget (${activeProblem.maxLatencyMs}ms)`);
    }

    const hasDb = nodes.some(n => ['sql-db', 'nosql-db'].includes(n.componentType));
    if (hasDb) {
      arch += 5;
      passed.push('Persistent database storage layer correctly integrated');
    } else {
      arch -= 6;
      improvements.push('Missing database storage tier for persistent records');
    }

    const hasAsyncEdges = edges.some(e => e.isAsync);
    if (hasAsyncEdges) {
      arch += 5;
      passed.push('Asynchronous background paths configured to keep user response paths non-blocking');
    }

    if (systemSummary.bottlenecks.length > 0) {
      scal -= 4;
      perf -= 4;
      improvements.push(`Bottlenecks: ${systemSummary.bottlenecks.map(b => b.label).join(', ')} exceeded throughput capacity`);
    } else {
      scal = Math.min(20, scal + 2);
    }

    scal = Math.max(0, Math.min(20, scal));
    rel = Math.max(0, Math.min(20, rel));
    perf = Math.max(0, Math.min(20, perf));
    cost = Math.max(0, Math.min(20, cost));
    arch = Math.max(0, Math.min(20, arch));

    const total = scal + rel + perf + cost + arch;
    const grade: 'S' | 'A' | 'B' | 'C' | 'F' = 
      total >= 90 ? 'S' : 
      total >= 80 ? 'A' : 
      total >= 65 ? 'B' : 
      total >= 50 ? 'C' : 'F';

    return {
      totalScore: total,
      grade,
      scalability: { score: scal, max: 20, feedback: scal >= 16 ? 'Excellent horizontal elasticity' : 'Scale out app server replicas' },
      reliability: { score: rel, max: 20, feedback: rel >= 16 ? 'High redundancy & fault tolerant' : 'Eliminate SPOF components' },
      performance: { score: perf, max: 20, feedback: perf >= 16 ? 'Fast critical path with caching' : 'Optimize slow database stages' },
      cost: { score: cost, max: 20, feedback: 'Well-proportioned infrastructure sizing' },
      architecture: { score: arch, max: 20, feedback: arch >= 16 ? 'Clean layered microservice topology' : 'Ensure complete flow to storage' },
      passedChecklist: passed,
      improvementChecklist: improvements
    };
  }, [nodes, edges, systemSummary, activeProblem]);

  const filteredCatalog = useMemo(() => {
    return Object.values(COMPONENT_CATALOG).filter(item => {
      const matchCat = selectedPaletteCategory === 'all' || item.category === selectedPaletteCategory;
      const matchSearch = paletteSearch === '' || 
        item.name.toLowerCase().includes(paletteSearch.toLowerCase()) || 
        item.description.toLowerCase().includes(paletteSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [paletteSearch, selectedPaletteCategory]);

  return (
    <div 
      ref={containerRef}
      className={`w-full bg-card text-foreground overflow-hidden shadow-2xl flex flex-col font-sans select-none relative transition-all duration-200 border border-border ${
        isFullscreen 
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none' 
          : 'h-[760px] sm:h-[840px] rounded-3xl'
      }`}
    >
      {/* ── TOP CONTROL BAR ────────────────────────────────────── */}
      <div className="px-4 py-3 bg-card/95 backdrop-blur-md border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs z-20 text-foreground">
        {/* Left: Problem Selector & Reference Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[#E5E795] font-bold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
              <span className="text-foreground">Problem:</span>
            </span>
            <select
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-secondary/80 border border-border text-foreground font-medium focus:ring-1 focus:ring-[#E5E795] focus:outline-hidden cursor-pointer"
            >
              {problems.map(p => (
                <option key={p.id} value={p.id} className="bg-card text-foreground">
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => loadProblemArchitecture(activeProblem)}
            className="px-3 py-1.5 rounded-xl bg-[#E5E795]/20 hover:bg-[#E5E795]/30 border border-[#E5E795]/40 text-indigo-600 dark:text-[#E5E795] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reset canvas to battle-tested reference architecture"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
            <span>Load Reference Solution</span>
          </button>
        </div>

        {/* Center: Live Simulation Toggle & Traffic Slider */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-secondary/60 px-3 py-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                isSimulating 
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30' 
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isSimulating ? 'Simulating' : 'Start Sim'}</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-border font-mono">
              <span className="text-muted-foreground text-[10px]">Load:</span>
              <input
                type="range"
                min="1000"
                max="250000"
                step="5000"
                value={offeredQps}
                onChange={(e) => setOfferedQps(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#E5E795] cursor-pointer"
              />
              <span className="font-bold text-indigo-600 dark:text-[#E5E795] text-xs w-16">
                {(offeredQps / 1000).toFixed(0)}k <span className="text-[9px] text-muted-foreground font-normal">QPS</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNodes([]);
              setEdges([]);
              setSelectedNodeId(null);
              setSelectedEdgeId(null);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-secondary transition-colors cursor-pointer"
            title="Clear canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Floating Panels Toggles & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Telemetry Pill Button */}
          <button
            type="button"
            onClick={() => {
              setShowInspector(true);
              setActiveInspectorTab('simulation');
            }}
            className={`px-3 py-1 rounded-xl border backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              systemSummary.healthStatus === 'critical'
                ? 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500/80 text-amber-950 dark:text-amber-200'
                : systemSummary.healthStatus === 'warning'
                ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-500/80 text-amber-900 dark:text-amber-300'
                : 'bg-secondary/70 border-border text-foreground hover:bg-secondary'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>{(systemSummary.effectiveThroughput / 1000).toFixed(0)}k QPS • {systemSummary.endToEndLatencyMs}ms</span>
          </button>

          {/* Score Pill Button */}
          <button
            type="button"
            onClick={() => {
              setShowInspector(true);
              setActiveInspectorTab('score');
            }}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-secondary/70 hover:bg-secondary border border-border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs text-foreground"
          >
            <Trophy className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
            <span className="font-mono font-bold">{scoreReport.totalScore}/100</span>
            <span className="px-1.5 py-0.2 rounded font-black text-xs bg-[#E5E795] text-black">
              Grade {scoreReport.grade}
            </span>
          </button>

          {/* Full Screen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 px-2.5 rounded-xl bg-secondary/70 hover:bg-secondary border border-border text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                <span className="hidden sm:inline font-mono font-semibold text-[11px]">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                <span className="hidden sm:inline font-mono font-semibold text-[11px]">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── FULL-WIDTH CANVAS WORKSPACE ─────────────────────────── */}
      <div
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        className="flex-1 w-full h-full relative bg-muted/30 dark:bg-[#090a0e] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          color: 'rgba(128, 128, 128, 0.15)'
        }}
      >
        {/* Floating Top-Left Component Palette Button */}
        <div onMouseDown={(e) => e.stopPropagation()} className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowToolbox(!showToolbox)}
            className={`px-3.5 py-2 rounded-2xl border font-semibold text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              showToolbox 
                ? 'bg-[#E5E795] text-black border-[#E5E795] font-bold' 
                : 'bg-card/95 text-foreground border-border hover:bg-secondary'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
            <span>Component Toolbox (35)</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              showToolbox ? 'bg-black/20 text-black font-bold' : 'bg-[#E5E795]/20 text-indigo-600 dark:text-[#E5E795]'
            }`}>
              {showToolbox ? '✕ Close' : '+ Add'}
            </span>
          </button>

          {/* Connect Mode Reminder */}
          {connectSourceNodeId && (
            <div className="px-3 py-1.5 rounded-xl bg-[#E5E795]/20 border border-[#E5E795]/40 text-indigo-600 dark:text-[#E5E795] text-xs font-mono animate-pulse shadow-lg backdrop-blur-md flex items-center gap-1.5">
              <span>Click any node's left port to complete wire (or click canvas to cancel)</span>
              <button type="button" onClick={() => setConnectSourceNodeId(null)} className="ml-1 text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}
        </div>

        {/* FLOATING LEFT PALETTE (When Opened) */}
        {showToolbox && (
          <div onMouseDown={(e) => e.stopPropagation()} className="absolute top-16 left-4 z-30 w-80 max-h-[620px] rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-foreground">
            <div className="p-3 border-b border-border space-y-2 bg-secondary/50">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground font-bold">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                  <span>Component Toolbox</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{filteredCatalog.length} Blocks</span>
                  <button 
                    type="button"
                    onClick={() => setShowToolbox(false)}
                    className="size-6 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={paletteSearch}
                  onChange={(e) => setPaletteSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-[#E5E795]/50"
                />
              </div>

              {/* Category filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono scrollbar-none">
                {(['all', 'networking', 'compute', 'storage', 'messaging', 'aiml'] as const).map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedPaletteCategory(cat)}
                    className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      selectedPaletteCategory === cat 
                        ? 'bg-[#E5E795] text-black font-bold' 
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Items List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin max-h-[460px]">
              {filteredCatalog.map(spec => {
                const catConfig = CATEGORY_COLORS[spec.category];
                const Icon = catConfig.icon;

                return (
                  <div
                    key={spec.type}
                    onClick={() => {
                      handleAddComponent(spec);
                    }}
                    title={`${spec.name}: ${spec.description} (Max ~${(spec.maxQps / 1000).toFixed(0)}k QPS • ~${spec.baseLatencyMs}ms)`}
                    className={`px-3 py-2 rounded-xl border ${catConfig.border} ${catConfig.bg} hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs group`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1 rounded-lg ${catConfig.badge} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {spec.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {(spec.maxQps / 1000).toFixed(0)}k
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FLOATING RIGHT INSPECTOR (When Opened or Node Selected) */}
        {showInspector && (
          <div onMouseDown={(e) => e.stopPropagation()} className="absolute top-16 right-4 z-30 w-84 sm:w-96 max-h-[660px] rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-foreground">
            {/* Header & Tabs */}
            <div className="p-3 border-b border-border bg-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-card p-0.5 rounded-xl border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('simulation')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeInspectorTab === 'simulation' ? 'bg-[#E5E795] text-black font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Metrics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('score')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeInspectorTab === 'score' ? 'bg-[#E5E795] text-black font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Score ({scoreReport.totalScore})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('problem')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeInspectorTab === 'problem' ? 'bg-[#E5E795] text-black font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Briefing
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowInspector(false)}
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: METRICS & NODE INSPECTION */}
            {activeInspectorTab === 'simulation' && (
              <div className="p-4 overflow-y-auto space-y-4 text-xs font-mono scrollbar-thin max-h-[580px]">
                {selectedNodeId ? (
                  (() => {
                    const node = nodes.find(n => n.id === selectedNodeId);
                    if (!node) return null;
                    const spec = COMPONENT_CATALOG[node.componentType];
                    const m = nodeMetrics[node.id];

                    return (
                      <div className="p-3.5 rounded-2xl bg-secondary/50 border border-[#E5E795]/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <div>
                            <div className="font-bold text-foreground text-sm">{node.label}</div>
                            <span className="text-[10px] text-indigo-600 dark:text-[#E5E795]">{spec?.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteNode(node.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-secondary transition-colors"
                            title="Delete Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Replicas Scaler */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Scale Instances:</span>
                          <div className="flex items-center gap-2 bg-card px-2 py-1 rounded-xl border border-border">
                            <button
                              type="button"
                              onClick={() => handleUpdateInstances(node.id, -1)}
                              className="size-5 rounded flex items-center justify-center hover:bg-secondary cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-foreground text-xs w-6 text-center">
                              x{node.instances}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateInstances(node.id, 1)}
                              className="size-5 rounded flex items-center justify-center hover:bg-secondary cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Node Telemetry */}
                        <div className="space-y-1.5 pt-1 text-[11px] text-foreground">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Incoming Traffic:</span>
                            <span className="font-bold">{m ? Math.round(m.incomingQps) : 0} QPS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Node Max Capacity:</span>
                            <span>{m ? Math.round(m.effectiveCapacity) : 0} QPS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estimated Latency:</span>
                            <span>{m?.latencyMs} ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className={m?.isOverloaded ? 'text-amber-500 font-bold' : m?.isWarning ? 'text-amber-400 font-semibold' : 'text-emerald-500 font-bold'}>
                              {m?.isOverloaded ? 'Bottleneck / Overloaded' : m?.isWarning ? 'Warning (Near Cap)' : 'Healthy'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : selectedEdgeId ? (
                  (() => {
                    const edge = edges.find(e => e.id === selectedEdgeId);
                    if (!edge) return null;
                    const src = nodes.find(n => n.id === edge.from);
                    const dst = nodes.find(n => n.id === edge.to);

                    return (
                      <div className="p-3.5 rounded-2xl bg-secondary/50 border border-cyan-500/30 space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <div className="font-bold text-foreground text-xs">
                            {src?.label} ➔ {dst?.label}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteEdge(edge.id)}
                            className="p-1 rounded text-muted-foreground hover:text-amber-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Connection Mode:</span>
                          <button
                            type="button"
                            onClick={() => handleToggleEdgeAsync(edge.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${
                              edge.isAsync 
                                ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40' 
                                : 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            {edge.isAsync ? 'Asynchronous (Decoupled)' : 'Synchronous (Blocking)'}
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border text-muted-foreground text-center text-[11px]">
                    Click any node or connection wire on the canvas to inspect its metrics and scale replicas.
                  </div>
                )}

                {/* Overall Telemetry HUD */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    System Telemetry Summary
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-secondary/50 border border-border">
                      <span className="block text-muted-foreground text-[10px]">End-to-End Latency</span>
                      <span className={`text-base font-bold ${
                        systemSummary.endToEndLatencyMs <= activeProblem.maxLatencyMs ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {systemSummary.endToEndLatencyMs} ms
                      </span>
                      <span className="text-[9px] text-muted-foreground">Target &lt; {activeProblem.maxLatencyMs}ms</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/50 border border-border">
                      <span className="block text-muted-foreground text-[10px]">Effective Throughput</span>
                      <span className="text-base font-bold text-foreground">
                        {(systemSummary.effectiveThroughput / 1000).toFixed(1)}k
                      </span>
                      <span className="text-[9px] text-zinc-500">QPS Handled</span>
                    </div>
                  </div>

                  {systemSummary.bottlenecks.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Bottlenecks Detected ({systemSummary.bottlenecks.length})</span>
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        {systemSummary.bottlenecks.map(b => b.label).join(', ')} exceeded max throughput. Scale instances to relieve load.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: INTERVIEW SCORE */}
            {activeInspectorTab === 'score' && (
              <div className="p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin max-h-[580px]">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E5E795]/20 via-card to-card border border-[#E5E795]/30 text-center space-y-1">
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-[#E5E795] uppercase tracking-wider font-semibold">
                    Interview Evaluation Score
                  </span>
                  <div className="text-3xl font-display font-black text-foreground">
                    {scoreReport.totalScore} <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                  </div>
                  <div className="inline-block px-3 py-0.5 rounded-full font-bold text-xs bg-emerald-500 text-black">
                    Grade {scoreReport.grade} Candidate
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Scalability', obj: scoreReport.scalability },
                    { name: 'Reliability & SPOF', obj: scoreReport.reliability },
                    { name: 'Latency & Performance', obj: scoreReport.performance },
                    { name: 'Cost Optimization', obj: scoreReport.cost },
                    { name: 'Architecture & Decoupling', obj: scoreReport.architecture },
                  ].map((pillar, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-secondary/50 border border-border text-[11px] font-mono space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">{pillar.name}</span>
                        <span className="text-indigo-600 dark:text-[#E5E795] font-bold">{pillar.obj.score}/{pillar.obj.max}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-[#E5E795] rounded-full"
                          style={{ width: `${(pillar.obj.score / pillar.obj.max) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground block">{pillar.obj.feedback}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-border font-mono text-[11px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Actionable Recommendations
                  </span>
                  {scoreReport.improvementChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {scoreReport.passedChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PROBLEM BRIEFING */}
            {activeInspectorTab === 'problem' && (
              <div className="p-4 overflow-y-auto space-y-4 text-xs leading-relaxed font-body scrollbar-thin max-h-[580px]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-[#E5E795] font-semibold block mb-1">
                    System Design Challenge
                  </span>
                  <h3 className="text-base font-bold font-display text-foreground">{activeProblem.title}</h3>
                  <p className="text-muted-foreground mt-1">{activeProblem.summary}</p>
                </div>

                {activeProblem.functionalRequirements && activeProblem.functionalRequirements.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block">
                      Functional Requirements
                    </span>
                    <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                      {activeProblem.functionalRequirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeProblem.hints && activeProblem.hints.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs space-y-1 font-mono">
                    <span className="font-bold block text-amber-600 dark:text-amber-400">Architect Advisory Note:</span>
                    <p>{activeProblem.hints[0]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TRANSFORMED CANVAS LAYER (Nodes + SVG Edges) */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
          className="absolute inset-0 size-full pointer-events-none"
        >
          {/* SVG Connections & Animated Data Packets */}
          <svg className="absolute inset-0 size-full pointer-events-none overflow-visible">
            <defs>
              <marker
                id="sim-arrow-sync"
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
                id="sim-arrow-async"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
              </marker>
              <marker
                id="sim-arrow-overload"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
              </marker>
            </defs>

            {edges.map(edge => {
              const src = nodes.find(n => n.id === edge.from);
              const dst = nodes.find(n => n.id === edge.to);
              if (!src || !dst) return null;

              const x1 = src.x + 130;
              const y1 = src.y + 35;
              const x2 = dst.x;
              const y2 = dst.y + 35;

              const dx = Math.max(40, Math.abs(x2 - x1) * 0.5);
              const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              const isSelected = selectedEdgeId === edge.id;
              const srcMetrics = nodeMetrics[src.id];
              const isOverloaded = srcMetrics?.isOverloaded;

              const strokeColor = isOverloaded 
                ? '#f59e0b' 
                : edge.isAsync 
                ? '#c084fc' 
                : '#38bdf8';

              return (
                <g key={edge.id} className="pointer-events-auto cursor-pointer">
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEdgeId(edge.id);
                      setSelectedNodeId(null);
                      setShowInspector(true);
                      setActiveInspectorTab('simulation');
                    }}
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3.5 : 2}
                    strokeDasharray={edge.isAsync ? '6,4' : 'none'}
                    markerEnd={isOverloaded ? 'url(#sim-arrow-overload)' : edge.isAsync ? 'url(#sim-arrow-async)' : 'url(#sim-arrow-sync)'}
                    className="transition-all"
                  />

                  {isSimulating && (
                    <circle r={edge.isAsync ? 2.5 : 3.5} fill={strokeColor} filter="drop-shadow(0 0 4px currentColor)">
                      <animateMotion
                        path={pathD}
                        dur={edge.isAsync ? '2.4s' : '1.4s'}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Canvas Nodes (roadmap.sh small box style with real-time telemetry) */}
          {nodes.map(node => {
            const spec = COMPONENT_CATALOG[node.componentType] || COMPONENT_CATALOG['app-server'];
            const cat = CATEGORY_COLORS[spec.category];
            const Icon = cat.icon;
            const metrics = nodeMetrics[node.id] || {
              incomingQps: 0,
              effectiveCapacity: spec.maxQps,
              utilization: 0,
              latencyMs: spec.baseLatencyMs,
              isOverloaded: false,
              isWarning: false
            };

            const isSelected = selectedNodeId === node.id;
            const isConnectSource = connectSourceNodeId === node.id;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                  setSelectedEdgeId(null);
                  setShowInspector(true);
                  setActiveInspectorTab('simulation');
                }}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  position: 'absolute'
                }}
                className={`w-[130px] rounded-xl border-2 p-2 transition-shadow cursor-move select-none pointer-events-auto shadow-md ${
                  metrics.isOverloaded
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 dark:border-amber-400 shadow-md shadow-amber-500/20 text-foreground ring-2 ring-amber-500/40'
                    : metrics.isWarning
                    ? 'bg-amber-50/70 dark:bg-amber-900/30 border-amber-400 dark:border-amber-500/70 text-foreground'
                    : isSelected
                    ? 'bg-card border-[#E5E795] ring-2 ring-[#E5E795]/40 shadow-xl shadow-[#E5E795]/15 text-foreground'
                    : isConnectSource
                    ? 'bg-card border-cyan-400 ring-2 ring-cyan-400/30 animate-pulse text-foreground'
                    : `bg-card ${cat.border} hover:border-[#E5E795]/60 text-foreground`
                }`}
              >
                {/* Input Connection Handle (Left) */}
                <div
                  onClick={(e) => handlePortClick(e, node.id, false)}
                  className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-secondary border-2 border-border hover:border-[#E5E795] hover:bg-[#E5E795]/20 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                  title="Input Port (Connect previous node here)"
                >
                  <span className="size-1.5 rounded-full bg-foreground"></span>
                </div>

                {/* Output Connection Handle (Right) */}
                <div
                  onClick={(e) => handlePortClick(e, node.id, true)}
                  className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-secondary border-2 border-border hover:border-cyan-400 hover:bg-cyan-400/20 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                  title="Output Port (Drag/click to connect forward)"
                >
                  <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
                </div>

                {/* Node Title Header */}
                <div className="flex items-center justify-between text-[10px] font-mono leading-none mb-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <Icon className="w-3 h-3 shrink-0 text-muted-foreground" />
                    <span className="font-bold text-foreground truncate max-w-[70px]">
                      {node.label}
                    </span>
                  </div>

                  <span className="px-1 py-0.5 rounded bg-secondary text-[9px] font-bold text-indigo-600 dark:text-[#E5E795]">
                    x{node.instances}
                  </span>
                </div>

                {/* Telemetry Bar (QPS / Capacity) */}
                <div className="space-y-1 pt-1 border-t border-border text-[9px] font-mono">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{metrics.latencyMs}ms</span>
                    <span className={metrics.isOverloaded ? 'text-amber-500 font-bold' : metrics.isWarning ? 'text-amber-400 font-semibold' : 'text-foreground'}>
                      {(metrics.incomingQps / 1000).toFixed(1)}k QPS
                    </span>
                  </div>

                  <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        metrics.isOverloaded 
                          ? 'bg-amber-500' 
                          : metrics.isWarning 
                          ? 'bg-amber-400' 
                          : 'bg-[#E5E795]'
                      }`}
                      style={{ width: `${Math.min(100, Math.round(metrics.utilization * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FLOATING BOTTOM-LEFT QUICK-ADD DOCK */}
        <div onMouseDown={(e) => e.stopPropagation()} className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl text-[11px] font-mono text-foreground">
          <span className="px-2 text-muted-foreground font-semibold text-[10px] uppercase">Quick Add:</span>
          {[
            { spec: COMPONENT_CATALOG['client'], label: '+ Client' },
            { spec: COMPONENT_CATALOG['load-balancer'], label: '+ ALB' },
            { spec: COMPONENT_CATALOG['app-server'], label: '+ App' },
            { spec: COMPONENT_CATALOG['redis-cache'], label: '+ Redis' },
            { spec: COMPONENT_CATALOG['sql-db'], label: '+ SQL' },
            { spec: COMPONENT_CATALOG['message-queue'], label: '+ Kafka' },
            { spec: COMPONENT_CATALOG['llm-inference'], label: '+ vLLM' },
          ].map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleAddComponent(item.spec)}
              className="px-2 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground font-medium border border-border transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* FLOATING BOTTOM-RIGHT ZOOM & PAN CONTROLS */}
        <div onMouseDown={(e) => e.stopPropagation()} className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl text-xs font-mono text-foreground">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-foreground text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(0.1)}
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-border mx-0.5"></div>
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Reset View / Fit Center"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
