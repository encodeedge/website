import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Compass,
  Layers,
  Plus,
  Trash2,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Download,
  Upload,
  Share2,
  Copy,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Save,
  BookOpen,
  Maximize2,
  Minimize2,
  Check,
  RotateCcw,
  FileText,
  List,
  GitFork,
  Target,
  Award,
  ChevronRight,
  X,
  Sliders,
  Search,
  Printer,
  Move,
  ZoomIn,
  ZoomOut,
  FolderPlus,
  Eye,
  FileDown,
  StickyNote,
  Flag,
  Split,
  Trophy,
  Code,
  Link,
  Palette,
  Box,
  Keyboard,
  HelpCircle
} from 'lucide-react';

export type TopicDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TopicStatus = 'not-started' | 'in-progress' | 'completed';
export type BuilderMode = 'simple' | 'design' | 'read';
export type TopicKind = 'topic' | 'milestone' | 'decision' | 'project' | 'exam' | 'resource' | 'note' | 'group';
export type WireStyle = 'solid' | 'dashed' | 'dotted';
export type WireCurve = 'curved' | 'straight';

export interface RoadmapResource {
  title: string;
  url: string;
}

export interface RoadmapConnection {
  id: string;
  from: string; // source topic id
  to: string;   // target topic id
  style: WireStyle;
  label?: string;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  description: string;
  difficulty: TopicDifficulty;
  status: TopicStatus;
  kind?: TopicKind;
  duration?: string;
  resources?: RoadmapResource[];
  notes?: string;
  color?: string; // For sticky notes (lime, sky, peach, mint, lavender)
  width?: number; // For groups or notes
  height?: number; // For groups or notes
  zIndex?: number; // Layer ordering (higher numbers are in front)
  x?: number;
  y?: number;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  colorTag: string;
  topics: RoadmapTopic[];
}

export interface CustomRoadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  phases: RoadmapPhase[];
  connections?: RoadmapConnection[];
  wireCurve?: WireCurve;
}

export interface SavedTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  phases: RoadmapPhase[];
  connections?: RoadmapConnection[];
}

// ── COLOR PALETTES MATCHING WEBSITE DESIGN ──────────────────────────────────
export const NOTE_COLORS: Record<string, { bg: string; border: string; text: string; label: string; hex: string }> = {
  lime: {
    bg: 'bg-[#E5E795]/20 dark:bg-[#E5E795]/15',
    border: 'border-[#E5E795]/60 dark:border-[#E5E795]/40',
    text: 'text-zinc-900 dark:text-[#E5E795]',
    label: 'Lime',
    hex: '#E5E795'
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-300 dark:border-sky-500/50',
    text: 'text-sky-900 dark:text-sky-200',
    label: 'Sky Blue',
    hex: '#A2D2FF'
  },
  peach: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-300 dark:border-orange-500/50',
    text: 'text-orange-950 dark:text-orange-200',
    label: 'Peach',
    hex: '#FFB86A'
  },
  mint: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-300 dark:border-emerald-500/50',
    text: 'text-emerald-950 dark:text-emerald-200',
    label: 'Mint',
    hex: '#A7F3D0'
  },
  lavender: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-300 dark:border-purple-500/50',
    text: 'text-purple-950 dark:text-purple-200',
    label: 'Lavender',
    hex: '#EEA9ED'
  }
};

// ── ONLY ONE DEFAULT STARTER TEMPLATE ─────────────────────────────────────────
export const DEFAULT_STARTER_TEMPLATE: Omit<CustomRoadmap, 'id' | 'updatedAt'> = {
  title: 'Full-Stack Web Architect Roadmap',
  description: 'From modern React, TypeScript, and server runtimes to distributed caching, databases, and containerized deployment.',
  category: 'Full-Stack',
  wireCurve: 'curved',
  connections: [
    { id: 'c-1', from: 't-101', to: 't-102', style: 'solid', label: 'Prerequisite' },
    { id: 'c-2', from: 't-102', to: 't-103', style: 'solid' },
    { id: 'c-3', from: 't-102', to: 't-project-1', style: 'dashed', label: 'Hands-on Lab' },
    { id: 'c-4', from: 't-103', to: 't-104', style: 'solid' },
    { id: 'c-5', from: 't-104', to: 't-105', style: 'solid' },
    { id: 'c-6', from: 't-105', to: 't-106', style: 'solid' },
    { id: 'c-7', from: 't-106', to: 't-decision-1', style: 'dashed', label: 'Architecture Decision' },
    { id: 'c-8', from: 't-106', to: 't-107', style: 'solid' },
    { id: 'c-9', from: 't-107', to: 't-108', style: 'solid' },
    { id: 'c-10', from: 't-108', to: 't-exam-1', style: 'dashed', label: 'Capstone Exam' }
  ],
  phases: [
    {
      id: 'fs-phase-1',
      title: 'Phase 1: Modern Frontend Foundations',
      description: 'Master core web primitives, reactive component architectures, and typed development.',
      colorTag: '#E5E795',
      topics: [
        {
          id: 't-101',
          kind: 'topic',
          name: 'Modern JavaScript & TypeScript 5',
          description: 'ES6+ async iterators, closures, generics, conditional types, and strict compiler configs.',
          difficulty: 'beginner',
          status: 'completed',
          duration: '2 weeks',
          resources: [
            { title: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/' }
          ],
          x: 60,
          y: 80
        },
        {
          id: 't-102',
          kind: 'topic',
          name: 'React 19 & Component Architecture',
          description: 'Server Components, Actions, useOptimistic, custom hooks, and state machines.',
          difficulty: 'intermediate',
          status: 'in-progress',
          duration: '3 weeks',
          resources: [
            { title: 'React Official Documentation', url: 'https://react.dev/' }
          ],
          x: 350,
          y: 80
        },
        {
          id: 't-project-1',
          kind: 'project',
          name: 'Hands-on Lab: Real-Time Kanban Board',
          description: 'Build an optimistic UI collaborative board with drag-and-drop, WebSocket sync, and undo/redo.',
          difficulty: 'intermediate',
          status: 'in-progress',
          duration: '1 week',
          resources: [
            { title: 'React Server Actions Guide', url: 'https://react.dev/reference/rsc/server-actions' }
          ],
          x: 350,
          y: 260
        },
        {
          id: 't-103',
          kind: 'topic',
          name: 'Tailwind CSS & Design Tokens',
          description: 'Utility-first styling, CSS variables, dark mode semantics, and responsive design systems.',
          difficulty: 'beginner',
          status: 'completed',
          duration: '1 week',
          resources: [
            { title: 'Tailwind CSS Documentation', url: 'https://tailwindcss.com/' }
          ],
          x: 640,
          y: 80
        }
      ]
    },
    {
      id: 'fs-phase-2',
      title: 'Phase 2: Backend Systems & APIs',
      description: 'Design robust HTTP/REST and gRPC microservices with rock-solid data persistence.',
      colorTag: '#A2D2FF',
      topics: [
        {
          id: 't-104',
          kind: 'topic',
          name: 'Node.js & Async Runtimes',
          description: 'Event loop mechanics, worker threads, stream pipelines, and high-performance Express/Fastify.',
          difficulty: 'intermediate',
          status: 'not-started',
          duration: '2 weeks',
          x: 60,
          y: 440
        },
        {
          id: 't-105',
          kind: 'topic',
          name: 'PostgreSQL & Relational Data Modeling',
          description: 'ACID transactions, B-Tree vs GIN indexes, query execution plans, and connection pooling.',
          difficulty: 'intermediate',
          status: 'not-started',
          duration: '2 weeks',
          x: 350,
          y: 440
        },
        {
          id: 't-106',
          kind: 'topic',
          name: 'Redis In-Memory Caching',
          description: 'Cache-aside patterns, TTL expiration, write-through vs write-behind, and distributed locks.',
          difficulty: 'intermediate',
          status: 'not-started',
          duration: '1 week',
          x: 640,
          y: 440
        },
        {
          id: 't-decision-1',
          kind: 'decision',
          name: 'Architecture Fork: GraphQL vs REST vs gRPC',
          description: 'Evaluate over-fetching tradeoffs, streaming subscriptions, protobuf binary serialization, and CDN cacheability.',
          difficulty: 'intermediate',
          status: 'not-started',
          duration: '3 days',
          x: 640,
          y: 620
        },
        {
          id: 't-note-1',
          kind: 'note',
          name: 'Architect Study Note',
          description: 'Always design APIs with idempotency keys for distributed retry safety.',
          difficulty: 'beginner',
          status: 'not-started',
          color: 'lime',
          x: 60,
          y: 620
        }
      ]
    },
    {
      id: 'fs-phase-3',
      title: 'Phase 3: Production DevOps & Cloud Infrastructure',
      description: 'Containerize, orchestrate, monitor, and deploy resilient production applications.',
      colorTag: '#FDA4AF',
      topics: [
        {
          id: 't-107',
          kind: 'topic',
          name: 'Docker & Multi-Stage Builds',
          description: 'Lightweight alpine/distroless images, layer caching, Docker compose multi-container stacks.',
          difficulty: 'intermediate',
          status: 'not-started',
          duration: '1 week',
          x: 200,
          y: 800
        },
        {
          id: 't-108',
          kind: 'topic',
          name: 'CI/CD Automation & GitHub Actions',
          description: 'Automated test matrix, linting enforcement, zero-downtime container registries, and rollback triggers.',
          difficulty: 'intermediate',
          status: 'not-started',
          duration: '1 week',
          x: 490,
          y: 800
        },
        {
          id: 't-exam-1',
          kind: 'exam',
          name: 'Capstone: AWS Certified Solutions Architect',
          description: 'Validate multi-tier architecture design, VPC routing, IAM zero-trust, and disaster recovery.',
          difficulty: 'advanced',
          status: 'not-started',
          duration: 'Exam Target',
          resources: [
            { title: 'AWS Solutions Architect Guide', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' }
          ],
          x: 770,
          y: 800
        }
      ]
    }
  ]
};

const STORAGE_KEY = 'encodeedge_custom_roadmaps_v4';
const ACTIVE_ROADMAP_KEY = 'encodeedge_active_roadmap_id_v4';
const SAVED_TEMPLATES_KEY = 'encodeedge_custom_roadmap_templates_v4';

export const CustomRoadmapBuilder: React.FC = () => {
  // 1. Initial State
  const defaultRoadmap: CustomRoadmap = useMemo(() => ({
    ...JSON.parse(JSON.stringify(DEFAULT_STARTER_TEMPLATE)),
    id: 'roadmap-default-master',
    updatedAt: new Date().toISOString()
  }), []);

  const [roadmaps, setRoadmaps] = useState<CustomRoadmap[]>([defaultRoadmap]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(defaultRoadmap.id);
  const [userTemplates, setUserTemplates] = useState<SavedTemplate[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false);

  // 2. 3-Way Mode Switcher: 'simple' | 'design' | 'read'
  const [viewMode, setViewMode] = useState<BuilderMode>('simple');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Fullscreen state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals & Panels State
  const [editingTopic, setEditingTopic] = useState<{
    phaseId: string;
    topic: RoadmapTopic;
    isNew: boolean;
  } | null>(null);

  const [showTemplateManager, setShowTemplateManager] = useState<boolean>(false);
  const [showNewRoadmapMenu, setShowNewRoadmapMenu] = useState<boolean>(false);
  const newRoadmapMenuRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);
  const [saveTemplatePrompt, setSaveTemplatePrompt] = useState<boolean>(false);
  const [templateNameInput, setTemplateNameInput] = useState<string>('');
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // 3. Design Mode Canvas States (Drag, Pan, Zoom, Interactive Wiring)
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<{ phaseId: string; topicId: string } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizingNode, setResizingNode] = useState<{
    phaseId: string;
    topicId: string;
    corner: 'br' | 'bl' | 'tr' | 'tl';
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startNodeX: number;
    startNodeY: number;
  } | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 60, y: 60 });
  const [zoom, setZoom] = useState<number>(1);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Wiring tools: connecting source node ID
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [currentWireStyle, setCurrentWireStyle] = useState<WireStyle>('solid');
  const [showDesignToolbox, setShowDesignToolbox] = useState<boolean>(false);

  // Load from localStorage on client
  useEffect(() => {
    try {
      const savedRoadmaps = localStorage.getItem(STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_ROADMAP_KEY);
      const savedTmpls = localStorage.getItem(SAVED_TEMPLATES_KEY);

      if (savedRoadmaps) {
        const parsed: CustomRoadmap[] = JSON.parse(savedRoadmaps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoadmaps(parsed);
          const validId = parsed.find(r => r.id === savedActiveId)?.id || parsed[0].id;
          setActiveRoadmapId(validId);
        }
      }

      if (savedTmpls) {
        const parsedTmpls: SavedTemplate[] = JSON.parse(savedTmpls);
        if (Array.isArray(parsedTmpls)) {
          setUserTemplates(parsedTmpls);
        }
      }
    } catch {
      // Fallback to default
    }
    setHasLoadedStorage(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
      localStorage.setItem(ACTIVE_ROADMAP_KEY, activeRoadmapId);
      localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(userTemplates));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [roadmaps, activeRoadmapId, userTemplates, hasLoadedStorage]);

  // Click outside listener for new roadmap dropdown menu and delete confirm popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newRoadmapMenuRef.current && !newRoadmapMenuRef.current.contains(e.target as Node)) {
        setShowNewRoadmapMenu(false);
      }
      if (deleteConfirmRef.current && !deleteConfirmRef.current.contains(e.target as Node)) {
        setShowDeleteConfirm(false);
      }
    };
    if (showNewRoadmapMenu || showDeleteConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNewRoadmapMenu, showDeleteConfirm]);

  // Fullscreen listener
  const toggleFullScreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } catch {
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
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // Active roadmap reference
  const activeRoadmap = useMemo(() => {
    return roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0] || defaultRoadmap;
  }, [roadmaps, activeRoadmapId, defaultRoadmap]);

  // Stats computation
  const stats = useMemo(() => {
    if (!activeRoadmap) return { total: 0, completed: 0, inProgress: 0, percent: 0 };
    let total = 0;
    let completed = 0;
    let inProgress = 0;

    activeRoadmap.phases.forEach(p => {
      p.topics.forEach(t => {
        total++;
        if (t.status === 'completed') completed++;
        if (t.status === 'in-progress') inProgress++;
      });
    });

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, inProgress, percent };
  }, [activeRoadmap]);

  // Active Roadmap updater helper
  const updateActiveRoadmap = useCallback((updater: (current: CustomRoadmap) => CustomRoadmap) => {
    setRoadmaps(prev => prev.map(r => {
      if (r.id === activeRoadmapId) {
        const updated = updater(r);
        return {
          ...updated,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  }, [activeRoadmapId]);

  // Toggle status of a topic
  const handleToggleTopicStatus = useCallback((phaseId: string, topicId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          topics: p.topics.map(t => {
            if (t.id !== topicId) return t;
            const nextStatus: TopicStatus = 
              t.status === 'not-started' ? 'in-progress' :
              t.status === 'in-progress' ? 'completed' : 'not-started';
            return { ...t, status: nextStatus };
          })
        };
      })
    }));
  }, [updateActiveRoadmap]);

  // Add new topic / design item
  const handleOpenAddTopic = useCallback((phaseId: string, kind: TopicKind = 'topic', initialColor: string = 'lime') => {
    const phaseIndex = activeRoadmap.phases.findIndex(p => p.id === phaseId);
    const existingCount = activeRoadmap.phases.find(p => p.id === phaseId)?.topics.length || 0;
    const defaultX = 80 + (existingCount * 280);
    const defaultY = 80 + (phaseIndex * 260);

    const defaultNames: Record<TopicKind, string> = {
      topic: 'New Core Topic',
      milestone: 'Milestone Landmark',
      decision: 'Architecture Choice: Option A vs B',
      project: 'Hands-on Lab Deliverable',
      exam: 'Certification Target Checkpoint',
      resource: 'Reference Architecture & Docs',
      note: 'Architect Design Note',
      group: 'Architecture Domain Container'
    };

    setEditingTopic({
      phaseId,
      isNew: true,
      topic: {
        id: `node-${Date.now()}`,
        kind,
        name: defaultNames[kind] || 'New Item',
        description: '',
        difficulty: 'beginner',
        status: 'not-started',
        duration: kind === 'exam' ? 'Target Date' : kind === 'project' ? '2 weeks' : '1 week',
        resources: [],
        color: initialColor,
        width: kind === 'group' ? 380 : undefined,
        height: kind === 'group' ? 240 : undefined,
        x: defaultX,
        y: defaultY
      }
    });
  }, [activeRoadmap]);

  // Save topic / design element
  const handleSaveTopic = () => {
    if (!editingTopic || !editingTopic.topic.name.trim()) return;

    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== editingTopic.phaseId) return p;
        if (editingTopic.isNew) {
          return {
            ...p,
            topics: [...p.topics, editingTopic.topic]
          };
        }
        return {
          ...p,
          topics: p.topics.map(t => t.id === editingTopic.topic.id ? editingTopic.topic : t)
        };
      })
    }));
    setEditingTopic(null);
  };

  // Delete topic / item
  const handleDeleteTopic = useCallback((phaseId: string, topicId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          topics: p.topics.filter(t => t.id !== topicId)
        };
      }),
      connections: (cur.connections || []).filter(c => c.from !== topicId && c.to !== topicId)
    }));
    setSelectedTopicId(prev => prev === topicId ? null : prev);
    setCopyFeedback('Topic deleted');
    setTimeout(() => setCopyFeedback(null), 1500);
  }, [updateActiveRoadmap]);

  // Selected topic data lookup
  const selectedTopicData = useMemo(() => {
    if (!selectedTopicId || !activeRoadmap) return null;
    for (const phase of activeRoadmap.phases) {
      const topic = phase.topics.find(t => t.id === selectedTopicId);
      if (topic) return { phase, topic };
    }
    return null;
  }, [selectedTopicId, activeRoadmap]);

  // Layer Ordering Handlers (Bring Forward / Send Backward / To Front / To Back)
  const handleBringForward = useCallback((phaseId: string, topicId: string) => {
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          topics: p.topics.map(t => {
            if (t.id !== topicId) return t;
            const curZ = t.zIndex !== undefined ? t.zIndex : (t.kind === 'group' ? 1 : 10);
            return { ...t, zIndex: curZ + 1 };
          })
        };
      })
    }));
    setCopyFeedback('Layer moved forward (+1)');
    setTimeout(() => setCopyFeedback(null), 1200);
  }, [updateActiveRoadmap]);

  const handleSendBackward = useCallback((phaseId: string, topicId: string) => {
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          topics: p.topics.map(t => {
            if (t.id !== topicId) return t;
            const curZ = t.zIndex !== undefined ? t.zIndex : (t.kind === 'group' ? 1 : 10);
            return { ...t, zIndex: Math.max(0, curZ - 1) };
          })
        };
      })
    }));
    setCopyFeedback('Layer moved backward (-1)');
    setTimeout(() => setCopyFeedback(null), 1200);
  }, [updateActiveRoadmap]);

  const handleBringToFront = useCallback((phaseId: string, topicId: string) => {
    let maxZ = 10;
    activeRoadmap.phases.forEach(p => p.topics.forEach(t => {
      const z = t.zIndex !== undefined ? t.zIndex : (t.kind === 'group' ? 1 : 10);
      if (z > maxZ) maxZ = z;
    }));
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          topics: p.topics.map(t => {
            if (t.id !== topicId) return t;
            return { ...t, zIndex: maxZ + 5 };
          })
        };
      })
    }));
    setCopyFeedback('Brought to front (Top layer)');
    setTimeout(() => setCopyFeedback(null), 1200);
  }, [activeRoadmap, updateActiveRoadmap]);

  const handleSendToBack = useCallback((phaseId: string, topicId: string) => {
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.map(p => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          topics: p.topics.map(t => {
            if (t.id !== topicId) return t;
            return { ...t, zIndex: 0 };
          })
        };
      })
    }));
    setCopyFeedback('Sent to back (Background layer)');
    setTimeout(() => setCopyFeedback(null), 1200);
  }, [updateActiveRoadmap]);

  // Add new phase
  const handleAddPhase = () => {
    const phaseNum = (activeRoadmap?.phases.length || 0) + 1;
    const colors = ['#E5E795', '#A2D2FF', '#FDA4AF', '#A7F3D0', '#E9D5FF', '#FED7AA'];
    const colorTag = colors[(phaseNum - 1) % colors.length];

    const newPhase: RoadmapPhase = {
      id: `phase-${Date.now()}`,
      title: `Phase ${phaseNum}: New Learning Track`,
      description: 'Describe the core objective and learning outcomes of this milestone.',
      colorTag,
      topics: [
        {
          id: `topic-${Date.now()}`,
          kind: 'topic',
          name: 'First Foundation Topic',
          description: 'Key skills and practical exercises for this topic.',
          difficulty: 'beginner',
          status: 'not-started',
          duration: '1 week',
          x: 80,
          y: 80 + ((phaseNum - 1) * 260)
        }
      ]
    };

    updateActiveRoadmap(cur => ({
      ...cur,
      phases: [...cur.phases, newPhase]
    }));
  };

  // Move phase Up/Down
  const handleMovePhase = (index: number, direction: 'up' | 'down') => {
    if (!activeRoadmap) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeRoadmap.phases.length) return;

    const newPhases = [...activeRoadmap.phases];
    const temp = newPhases[index];
    newPhases[index] = newPhases[targetIdx];
    newPhases[targetIdx] = temp;

    updateActiveRoadmap(cur => ({
      ...cur,
      phases: newPhases
    }));
  };

  // Delete phase
  const handleDeletePhase = (phaseId: string) => {
    if (activeRoadmap.phases.length <= 1) {
      alert('A roadmap must contain at least one phase.');
      return;
    }
    updateActiveRoadmap(cur => ({
      ...cur,
      phases: cur.phases.filter(p => p.id !== phaseId)
    }));
  };

  // ── TEMPLATES & MULTI-ROADMAPS MANAGEMENT ─────────────────────────────────
  const handleSaveAsTemplate = () => {
    if (!templateNameInput.trim()) return;
    const newTmpl: SavedTemplate = {
      id: `template-${Date.now()}`,
      title: templateNameInput.trim(),
      description: activeRoadmap.description || 'Custom user template',
      category: activeRoadmap.category || 'Custom',
      phases: JSON.parse(JSON.stringify(activeRoadmap.phases)),
      connections: JSON.parse(JSON.stringify(activeRoadmap.connections || []))
    };

    setUserTemplates(prev => [newTmpl, ...prev]);
    setTemplateNameInput('');
    setSaveTemplatePrompt(false);
    setCopyFeedback(`Template "${newTmpl.title}" saved successfully!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setUserTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleCreateRoadmap = (source: 'default' | 'blank' | SavedTemplate) => {
    let newRoadmap: CustomRoadmap;
    if (source === 'blank') {
      newRoadmap = {
        id: `roadmap-${Date.now()}`,
        title: 'My Custom Engineering Roadmap',
        description: 'A personalized curriculum tailored to my career goals and interview milestones.',
        category: 'Custom',
        updatedAt: new Date().toISOString(),
        connections: [],
        wireCurve: 'curved',
        phases: [
          {
            id: `phase-${Date.now()}`,
            title: 'Phase 1: Core Fundamentals',
            description: 'Foundational concepts and building blocks.',
            colorTag: '#E5E795',
            topics: [
              {
                id: `topic-${Date.now()}`,
                kind: 'topic',
                name: 'First Milestone Topic',
                description: 'Click to edit this topic, set learning duration, and add learning resources.',
                difficulty: 'beginner',
                status: 'not-started',
                duration: '1 week',
                x: 100,
                y: 100
              }
            ]
          }
        ]
      };
    } else if (source === 'default') {
      newRoadmap = {
        ...JSON.parse(JSON.stringify(DEFAULT_STARTER_TEMPLATE)),
        id: `roadmap-${Date.now()}`,
        title: `${DEFAULT_STARTER_TEMPLATE.title} (${roadmaps.length + 1})`,
        updatedAt: new Date().toISOString()
      };
    } else {
      newRoadmap = {
        id: `roadmap-${Date.now()}`,
        title: `${source.title} (Copy)`,
        description: source.description,
        category: source.category,
        updatedAt: new Date().toISOString(),
        phases: JSON.parse(JSON.stringify(source.phases)),
        connections: JSON.parse(JSON.stringify(source.connections || [])),
        wireCurve: 'curved'
      };
    }

    setRoadmaps(prev => [newRoadmap, ...prev]);
    setActiveRoadmapId(newRoadmap.id);
    setShowTemplateManager(false);
    setCopyFeedback(`Created new roadmap "${newRoadmap.title}"`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const executeDeleteActiveRoadmap = () => {
    if (!activeRoadmap) return;
    if (roadmaps.length <= 1) {
      const reset = {
        ...JSON.parse(JSON.stringify(DEFAULT_STARTER_TEMPLATE)),
        id: `roadmap-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };
      setRoadmaps([reset]);
      setActiveRoadmapId(reset.id);
      setCopyFeedback('Reset to default starter template');
      setTimeout(() => setCopyFeedback(null), 2500);
      return;
    }
    const targetTitle = activeRoadmap.title;
    const remaining = roadmaps.filter(r => r.id !== activeRoadmapId);
    setRoadmaps(remaining);
    setActiveRoadmapId(remaining[0].id);
    setCopyFeedback(`Deleted "${targetTitle}"`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // ── EXPORT & DOWNLOAD HANDLERS ───────────────────────────────────────────
  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!activeRoadmap) return;
    const jsonStr = JSON.stringify(activeRoadmap, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeRoadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roadmap.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    if (!activeRoadmap) return;
    let md = `# ${activeRoadmap.title}\n\n`;
    md += `> ${activeRoadmap.description}\n\n`;
    md += `**Curriculum Progress:** ${stats.completed}/${stats.total} topics completed (${stats.percent}%)\n\n`;

    activeRoadmap.phases.forEach((phase, idx) => {
      md += `## Phase ${idx + 1}: ${phase.title}\n`;
      if (phase.description) md += `${phase.description}\n\n`;
      phase.topics.forEach((t) => {
        const check = t.status === 'completed' ? '[x]' : '[ ]';
        const badge = (t.kind || 'topic').toUpperCase();
        md += `- ${check} **${t.name}** \`[${badge}]\``;
        if (t.duration) md += ` (${t.duration})`;
        md += `\n  ${t.description}\n`;
        if (t.resources && t.resources.length > 0) {
          t.resources.forEach((r) => {
            md += `  - [${r.title}](${r.url})\n`;
          });
        }
      });
      md += '\n';
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeRoadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roadmap.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.title && Array.isArray(imported.phases)) {
          const validRoadmap: CustomRoadmap = {
            ...imported,
            id: `imported-${Date.now()}`,
            updatedAt: new Date().toISOString()
          };
          setRoadmaps(prev => [validRoadmap, ...prev]);
          setActiveRoadmapId(validRoadmap.id);
          setCopyFeedback('Roadmap successfully imported!');
          setTimeout(() => setCopyFeedback(null), 3000);
        } else {
          alert('Invalid roadmap JSON file format.');
        }
      } catch {
        alert('Failed to parse uploaded JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── DESIGN MODE CANVAS INTERACTIONS & WIRING ──────────────────────────────
  const getTopicCoordinates = useCallback((topic: RoadmapTopic, phaseIdx: number, topicIdx: number) => {
    const x = topic.x !== undefined ? topic.x : 60 + (topicIdx * 280);
    const y = topic.y !== undefined ? topic.y : 80 + (phaseIdx * 240);
    return { x, y };
  }, []);

  // Flat list of topics for canvas lookups
  const canvasTopicsList = useMemo(() => {
    const list: { phase: RoadmapPhase; topic: RoadmapTopic; pIdx: number; tIdx: number; x: number; y: number }[] = [];
    activeRoadmap.phases.forEach((phase, pIdx) => {
      phase.topics.forEach((topic, tIdx) => {
        const coords = getTopicCoordinates(topic, pIdx, tIdx);
        list.push({ phase, topic, pIdx, tIdx, x: coords.x, y: coords.y });
      });
    });
    return list;
  }, [activeRoadmap, getTopicCoordinates]);

  // Computed wires to render (explicit OR auto-fallback)
  const renderedConnections = useMemo(() => {
    if (activeRoadmap.connections && activeRoadmap.connections.length > 0) {
      return activeRoadmap.connections;
    }
    const autoConns: RoadmapConnection[] = [];
    for (let i = 0; i < canvasTopicsList.length - 1; i++) {
      autoConns.push({
        id: `auto-${canvasTopicsList[i].topic.id}-${canvasTopicsList[i + 1].topic.id}`,
        from: canvasTopicsList[i].topic.id,
        to: canvasTopicsList[i + 1].topic.id,
        style: 'solid'
      });
    }
    return autoConns;
  }, [activeRoadmap.connections, canvasTopicsList]);

  // Direct connection style changer (WORKS INSTANTLY FOR ANY WIRE)
  const handleSetConnectionStyle = useCallback((connId: string, style: WireStyle) => {
    updateActiveRoadmap(cur => {
      let conns = cur.connections && cur.connections.length > 0
        ? [...cur.connections]
        : [...renderedConnections];

      const existingIdx = conns.findIndex(c => c.id === connId);
      if (existingIdx >= 0) {
        conns[existingIdx] = { ...conns[existingIdx], style };
      } else {
        const autoConn = renderedConnections.find(c => c.id === connId);
        if (autoConn) {
          conns.push({ ...autoConn, style });
        }
      }
      return {
        ...cur,
        connections: conns
      };
    });
    setCurrentWireStyle(style);
    setCopyFeedback(`Wire style set to ${style.toUpperCase()}`);
    setTimeout(() => setCopyFeedback(null), 1500);
  }, [updateActiveRoadmap, renderedConnections]);

  // Top Bar Wire Style Selector: updates currentWireStyle AND selected wire if one is active!
  const handleChooseWireStyle = useCallback((style: WireStyle) => {
    setCurrentWireStyle(style);
    if (selectedConnectionId) {
      handleSetConnectionStyle(selectedConnectionId, style);
    }
  }, [selectedConnectionId, handleSetConnectionStyle]);

  // Delete a wire
  const handleDeleteConnection = useCallback((connId: string) => {
    updateActiveRoadmap(cur => {
      const conns = cur.connections && cur.connections.length > 0
        ? cur.connections
        : renderedConnections;
      return {
        ...cur,
        connections: conns.filter(c => c.id !== connId)
      };
    });
    setSelectedConnectionId(null);
    setCopyFeedback('Wire deleted');
    setTimeout(() => setCopyFeedback(null), 1500);
  }, [updateActiveRoadmap, renderedConnections]);

  // Reverse wire direction
  const handleReverseConnection = useCallback((connId: string) => {
    updateActiveRoadmap(cur => {
      let conns = cur.connections && cur.connections.length > 0
        ? [...cur.connections]
        : [...renderedConnections];

      const idx = conns.findIndex(c => c.id === connId);
      if (idx >= 0) {
        const item = conns[idx];
        conns[idx] = { ...item, from: item.to, to: item.from };
      }
      return { ...cur, connections: conns };
    });
    setCopyFeedback('Wire direction reversed');
    setTimeout(() => setCopyFeedback(null), 1500);
  }, [updateActiveRoadmap, renderedConnections]);

  // Toggle wire curve (curved bezier vs straight direct)
  const handleToggleWireCurve = () => {
    updateActiveRoadmap(cur => ({
      ...cur,
      wireCurve: cur.wireCurve === 'straight' ? 'curved' : 'straight'
    }));
  };

  // Wire Connection Port Handlers (click right port then left port to connect)
  const handlePortClick = (e: React.MouseEvent, topicId: string, isOutput: boolean) => {
    e.stopPropagation();

    if (isOutput) {
      setConnectingSourceId(topicId);
      setCopyFeedback('Click input port (left) on destination node to complete wire');
      setTimeout(() => setCopyFeedback(null), 2500);
    } else {
      if (connectingSourceId && connectingSourceId !== topicId) {
        const newConn: RoadmapConnection = {
          id: `conn-${Date.now()}`,
          from: connectingSourceId,
          to: topicId,
          style: currentWireStyle
        };
        updateActiveRoadmap(cur => {
          const currentConns = cur.connections && cur.connections.length > 0
            ? cur.connections
            : renderedConnections;
          if (currentConns.some(c => c.from === connectingSourceId && c.to === topicId)) {
            return cur;
          }
          return {
            ...cur,
            connections: [...currentConns, newConn]
          };
        });
        setConnectingSourceId(null);
        setCopyFeedback('Connected!');
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    }
  };

  // Dragging and Panning
  const handleNodeMouseDown = (e: React.MouseEvent, phaseId: string, topicId: string) => {
    e.stopPropagation();
    const phase = activeRoadmap.phases.find(p => p.id === phaseId);
    const topic = phase?.topics.find(t => t.id === topicId);
    if (!topic || !canvasRef.current) return;

    const pIdx = activeRoadmap.phases.findIndex(p => p.id === phaseId);
    const tIdx = phase?.topics.findIndex(t => t.id === topicId) || 0;
    const coords = getTopicCoordinates(topic, pIdx, tIdx);

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoom;

    setDragOffset({
      x: mouseX - coords.x,
      y: mouseY - coords.y
    });
    setDraggedNode({ phaseId, topicId });
    setSelectedTopicId(topicId);
    setSelectedConnectionId(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    setSelectedTopicId(null);
    setSelectedConnectionId(null);
    if (connectingSourceId) setConnectingSourceId(null);
  };

  // Handle start dragging corner handles to stretch container or note
  const handleResizeCornerMouseDown = (
    e: React.MouseEvent,
    phaseId: string,
    topic: RoadmapTopic,
    corner: 'br' | 'bl' | 'tr' | 'tl'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const phase = activeRoadmap.phases.find(p => p.id === phaseId);
    const pIdx = activeRoadmap.phases.findIndex(p => p.id === phaseId);
    const tIdx = phase?.topics.findIndex(t => t.id === topic.id) || 0;
    const coords = getTopicCoordinates(topic, pIdx, tIdx);

    const startWidth = topic.width || (topic.kind === 'group' ? 380 : 190);
    const startHeight = topic.height || (topic.kind === 'group' ? 240 : 160);

    setResizingNode({
      phaseId,
      topicId: topic.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      startWidth,
      startHeight,
      startNodeX: coords.x,
      startNodeY: coords.y
    });
    setSelectedTopicId(topic.id);
    setSelectedConnectionId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    if (resizingNode) {
      const dx = (e.clientX - resizingNode.startX) / zoom;
      const dy = (e.clientY - resizingNode.startY) / zoom;

      let newWidth = resizingNode.startWidth;
      let newHeight = resizingNode.startHeight;
      let newX = resizingNode.startNodeX;
      let newY = resizingNode.startNodeY;

      if (resizingNode.corner === 'br') {
        newWidth = Math.max(160, Math.round(resizingNode.startWidth + dx));
        newHeight = Math.max(90, Math.round(resizingNode.startHeight + dy));
      } else if (resizingNode.corner === 'bl') {
        const potentialW = resizingNode.startWidth - dx;
        if (potentialW >= 160) {
          newWidth = Math.round(potentialW);
          newX = Math.round(resizingNode.startNodeX + dx);
        }
        newHeight = Math.max(90, Math.round(resizingNode.startHeight + dy));
      } else if (resizingNode.corner === 'tr') {
        newWidth = Math.max(160, Math.round(resizingNode.startWidth + dx));
        const potentialH = resizingNode.startHeight - dy;
        if (potentialH >= 90) {
          newHeight = Math.round(potentialH);
          newY = Math.round(resizingNode.startNodeY + dy);
        }
      } else if (resizingNode.corner === 'tl') {
        const potentialW = resizingNode.startWidth - dx;
        const potentialH = resizingNode.startHeight - dy;
        if (potentialW >= 160) {
          newWidth = Math.round(potentialW);
          newX = Math.round(resizingNode.startNodeX + dx);
        }
        if (potentialH >= 90) {
          newHeight = Math.round(potentialH);
          newY = Math.round(resizingNode.startNodeY + dy);
        }
      }

      updateActiveRoadmap(cur => ({
        ...cur,
        phases: cur.phases.map(p => {
          if (p.id !== resizingNode.phaseId) return p;
          return {
            ...p,
            topics: p.topics.map(t => {
              if (t.id !== resizingNode.topicId) return t;
              return {
                ...t,
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
              };
            })
          };
        })
      }));
      return;
    }

    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentMouseX = (e.clientX - rect.left - panOffset.x) / zoom;
      const currentMouseY = (e.clientY - rect.top - panOffset.y) / zoom;

      const newX = Math.round(currentMouseX - dragOffset.x);
      const newY = Math.round(currentMouseY - dragOffset.y);

      updateActiveRoadmap(cur => ({
        ...cur,
        phases: cur.phases.map(p => {
          if (p.id !== draggedNode.phaseId) return p;
          return {
            ...p,
            topics: p.topics.map(t => {
              if (t.id !== draggedNode.topicId) return t;
              return { ...t, x: newX, y: newY };
            })
          };
        })
      }));
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
    setResizingNode(null);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(2.0, Math.max(0.4, Number((prev + delta).toFixed(1)))));
  };

  const handleResetCanvasView = () => {
    setPanOffset({ x: 60, y: 60 });
    setZoom(1);
  };

  // Selected Connection references
  const selectedConnection = useMemo(() => {
    if (!selectedConnectionId) return null;
    return renderedConnections.find(c => c.id === selectedConnectionId) || null;
  }, [selectedConnectionId, renderedConnections]);

  const selectedWireSrc = useMemo(() => {
    if (!selectedConnection) return null;
    return canvasTopicsList.find(c => c.topic.id === selectedConnection.from)?.topic || null;
  }, [selectedConnection, canvasTopicsList]);

  const selectedWireDst = useMemo(() => {
    if (!selectedConnection) return null;
    return canvasTopicsList.find(c => c.topic.id === selectedConnection.to)?.topic || null;
  }, [selectedConnection, canvasTopicsList]);

  // ── KEYBOARD SHORTCUTS INTEGRATION (Delete, Backspace, Arrows, Esc, Zoom, Shortcuts) ──
  const stateRef = useRef({
    selectedTopicId,
    selectedConnectionId,
    connectingSourceId,
    activeRoadmap,
    renderedConnections,
    editingTopic,
    viewMode
  });
  stateRef.current = {
    selectedTopicId,
    selectedConnectionId,
    connectingSourceId,
    activeRoadmap,
    renderedConnections,
    editingTopic,
    viewMode
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (isInput) return;

      const {
        selectedTopicId: selTopicId,
        selectedConnectionId: selConnId,
        connectingSourceId: connSrcId,
        activeRoadmap: curRoadmap,
        editingTopic: curEditTopic,
        viewMode: curMode
      } = stateRef.current;

      // 1. ESCAPE: deselect or cancel
      if (e.key === 'Escape') {
        if (connSrcId) {
          setConnectingSourceId(null);
          setCopyFeedback('Wire connection cancelled');
          setTimeout(() => setCopyFeedback(null), 1500);
          return;
        }
        if (curEditTopic) {
          setEditingTopic(null);
          return;
        }
        if (selConnId) {
          setSelectedConnectionId(null);
          return;
        }
        if (selTopicId) {
          setSelectedTopicId(null);
          return;
        }
      }

      // 2. DELETE / BACKSPACE: delete selected wire or node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selConnId) {
          e.preventDefault();
          handleDeleteConnection(selConnId);
          return;
        }
        if (selTopicId) {
          e.preventDefault();
          const foundPhase = curRoadmap.phases.find(p => p.topics.some(t => t.id === selTopicId));
          if (foundPhase) {
            handleDeleteTopic(foundPhase.id, selTopicId);
          }
          return;
        }
      }

      // 3. ARROW KEYS: Nudge Node in Design Mode
      if (curMode === 'design' && selTopicId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 40 : 10;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;

        updateActiveRoadmap(cur => ({
          ...cur,
          phases: cur.phases.map(p => ({
            ...p,
            topics: p.topics.map(t => {
              if (t.id !== selTopicId) return t;
              return {
                ...t,
                x: (t.x !== undefined ? t.x : 100) + dx,
                y: (t.y !== undefined ? t.y : 100) + dy
              };
            })
          }))
        }));
        return;
      }

      // 4. DUPLICATE (Ctrl+D / Cmd+D)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        if (selTopicId) {
          e.preventDefault();
          const foundPhase = curRoadmap.phases.find(p => p.topics.some(t => t.id === selTopicId));
          const foundTopic = foundPhase?.topics.find(t => t.id === selTopicId);
          if (foundPhase && foundTopic) {
            const newTopic: RoadmapTopic = {
              ...JSON.parse(JSON.stringify(foundTopic)),
              id: `node-${Date.now()}`,
              name: `${foundTopic.name} (Copy)`,
              x: (foundTopic.x || 100) + 30,
              y: (foundTopic.y || 100) + 30
            };
            updateActiveRoadmap(cur => ({
              ...cur,
              phases: cur.phases.map(p => {
                if (p.id !== foundPhase.id) return p;
                return { ...p, topics: [...p.topics, newTopic] };
              })
            }));
            setSelectedTopicId(newTopic.id);
            setCopyFeedback(`Duplicated "${foundTopic.name}"`);
            setTimeout(() => setCopyFeedback(null), 2000);
          }
          return;
        }
      }

      // 5. SPACE: Cycle Status of selected node
      if (e.key === ' ' || e.code === 'Space') {
        if (selTopicId && !curEditTopic) {
          e.preventDefault();
          const foundPhase = curRoadmap.phases.find(p => p.topics.some(t => t.id === selTopicId));
          if (foundPhase) {
            handleToggleTopicStatus(foundPhase.id, selTopicId);
          }
          return;
        }
      }

      // 6. ENTER: Edit Details
      if (e.key === 'Enter' && selTopicId && !curEditTopic) {
        e.preventDefault();
        const foundPhase = curRoadmap.phases.find(p => p.topics.some(t => t.id === selTopicId));
        const foundTopic = foundPhase?.topics.find(t => t.id === selTopicId);
        if (foundPhase && foundTopic) {
          setEditingTopic({ phaseId: foundPhase.id, topic: foundTopic, isNew: false });
        }
        return;
      }

      // 7. ZOOM (+ / -)
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoom(0.1);
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoom(-0.1);
        return;
      }

      // 8. RESET VIEW (0)
      if (e.key === '0') {
        e.preventDefault();
        handleResetCanvasView();
        return;
      }

      // 9. WIRE STYLE HOTKEYS (1: Solid, 2: Dashed, 3: Dotted)
      if (selConnId && (e.key === '1' || e.key === '2' || e.key === '3')) {
        e.preventDefault();
        const style: WireStyle = e.key === '1' ? 'solid' : e.key === '2' ? 'dashed' : 'dotted';
        handleSetConnectionStyle(selConnId, style);
        return;
      }

      // 10. LAYER ORDERING HOTKEYS (] : Forward, [ : Backward)
      if (selTopicId && (e.key === ']' || e.key === '[')) {
        e.preventDefault();
        const foundPhase = curRoadmap.phases.find(p => p.topics.some(t => t.id === selTopicId));
        if (foundPhase) {
          if (e.key === ']') {
            handleBringForward(foundPhase.id, selTopicId);
          } else {
            handleSendBackward(foundPhase.id, selTopicId);
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBringForward, handleSendBackward, handleDeleteConnection, handleDeleteTopic, handleSetConnectionStyle, handleToggleTopicStatus, updateActiveRoadmap]);

  // Global mouseup listener to cleanly end node dragging and corner resizing even outside canvas bounds
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggedNode(null);
      setIsPanning(false);
      setResizingNode(null);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Filtered phases and topics
  const filteredPhases = useMemo(() => {
    if (!activeRoadmap) return [];
    return activeRoadmap.phases.map(phase => {
      const matchTopics = phase.topics.filter(topic => {
        const matchSearch = searchQuery === '' || 
          topic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          topic.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDiff = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty;
        const matchStatus = selectedStatusFilter === 'all' || topic.status === selectedStatusFilter;
        return matchSearch && matchDiff && matchStatus;
      });
      return { ...phase, topics: matchTopics };
    });
  }, [activeRoadmap, searchQuery, selectedDifficulty, selectedStatusFilter]);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-background text-foreground rounded-3xl border border-border shadow-2xl flex flex-col font-sans select-none overflow-hidden transition-all duration-200 ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none' : 'min-h-[880px]'
      }`}
    >
      {/* ── PRINT STYLES FOR CLEAN PDF EXPORT ─────────────────────────────── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #roadmap-printable-view, #roadmap-printable-view * {
            visibility: visible !important;
          }
          #roadmap-printable-view {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── TOP CONTROL & ACTION BAR ────────────────────────────────────── */}
      <div className="no-print px-4 sm:px-6 py-3.5 bg-card/95 backdrop-blur-md border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs z-20 text-foreground">
        {/* Left: Active Roadmap Switcher & Template Management */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 dark:text-[#E5E795] font-bold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
              <span className="text-foreground">Roadmap:</span>
            </span>
            <select
              value={activeRoadmapId}
              onChange={(e) => setActiveRoadmapId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-secondary/80 border border-border text-foreground font-medium focus:ring-1 focus:ring-[#E5E795] focus:outline-hidden cursor-pointer"
            >
              {roadmaps.map(r => (
                <option key={r.id} value={r.id} className="bg-card text-foreground">
                  {r.title}
                </option>
              ))}
            </select>

            {/* + Button next to dropdown to create a new roadmap */}
            <div className="relative inline-flex items-center" ref={newRoadmapMenuRef}>
              <button
                type="button"
                onClick={() => setShowNewRoadmapMenu(prev => !prev)}
                title="Create New Roadmap (+)"
                className="size-7.5 rounded-xl bg-[#E5E795] hover:brightness-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-xs cursor-pointer font-bold shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>

              {showNewRoadmapMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-60 rounded-2xl bg-card border border-border shadow-2xl p-1.5 z-50 text-foreground animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold text-muted-foreground border-b border-border mb-1">
                    Create New Roadmap
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleCreateRoadmap('blank');
                      setShowNewRoadmapMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-secondary flex items-center gap-2.5 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <span className="size-6 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0 border border-border">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">Blank Roadmap</div>
                      <div className="text-[10px] text-muted-foreground">Start with empty canvas</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleCreateRoadmap('default');
                      setShowNewRoadmapMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-secondary flex items-center gap-2.5 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <span className="size-6 rounded-lg bg-[#E5E795]/20 flex items-center justify-center text-indigo-700 dark:text-[#E5E795] shrink-0 border border-[#E5E795]/40">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">Starter Roadmap</div>
                      <div className="text-[10px] text-muted-foreground">Backend &amp; Cloud Architect</div>
                    </div>
                  </button>

                  {userTemplates.length > 0 && (
                    <div className="border-t border-border mt-1 pt-1">
                      <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-muted-foreground">
                        From Saved Templates
                      </div>
                      {userTemplates.map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            handleCreateRoadmap(tmpl);
                            setShowNewRoadmapMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-secondary text-xs truncate cursor-pointer flex items-center gap-2 transition-colors"
                        >
                          <FolderPlus className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795] shrink-0" />
                          <span className="truncate">{tmpl.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delete active roadmap button with custom UI popover */}
            <div className="relative inline-flex items-center" ref={deleteConfirmRef}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(prev => !prev)}
                title={`Delete roadmap "${activeRoadmap?.title || ''}"`}
                className={`size-7.5 rounded-xl border transition-all shadow-xs cursor-pointer shrink-0 active:scale-95 flex items-center justify-center ${
                  showDeleteConfirm
                    ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-500/30'
                    : 'bg-secondary/80 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/40 border-border text-muted-foreground'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {showDeleteConfirm && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 rounded-2xl bg-card border border-rose-500/30 shadow-2xl p-3.5 z-50 text-foreground animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs mb-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Delete Roadmap?</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug mb-3">
                    Are you sure you want to delete <strong className="text-foreground">"{activeRoadmap?.title}"</strong>?
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 rounded-xl bg-secondary hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        executeDeleteActiveRoadmap();
                      }}
                      className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Actions Button */}
          <button
            type="button"
            onClick={() => setShowTemplateManager(true)}
            className="px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Manage and create templates or new roadmaps"
          >
            <FolderPlus className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
            <span>Templates</span>
            {userTemplates.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E5E795]/30 text-indigo-700 dark:text-[#E5E795] font-bold">
                {userTemplates.length}
              </span>
            )}
          </button>

          {/* Save as Template Quick Button */}
          <button
            type="button"
            onClick={() => {
              setTemplateNameInput(`${activeRoadmap.title} Template`);
              setSaveTemplatePrompt(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#E5E795]/15 hover:bg-[#E5E795]/25 border border-[#E5E795]/30 text-indigo-700 dark:text-[#E5E795] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            title="Save this roadmap as a reusable template"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Save as Template</span>
          </button>
        </div>

        {/* Center: EXACT 3 MODES (Simple Mode, Design Mode, Read Mode) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-secondary/80 p-0.5 rounded-xl border border-border text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                viewMode === 'simple' 
                  ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Simple Mode: Structured zigzag roadmap tree"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Simple Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('design')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                viewMode === 'design' 
                  ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Design Mode: 2D interactive canvas with drag and drop, different box types & arrows"
            >
              <Move className="w-3.5 h-3.5" />
              <span>Design Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('read')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                viewMode === 'read' 
                  ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Read Mode: Clean syllabus view with PDF and Markdown download"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Mode</span>
            </button>
          </div>
        </div>

        {/* Right: Actions, Download/Export & Fullscreen */}
        <div className="flex items-center gap-2">
          {viewMode === 'read' ? (
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="p-1.5 px-3 rounded-xl bg-[#E5E795] hover:brightness-105 text-black font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Download clean printable PDF"
            >
              <Printer className="w-3.5 h-3.5 text-black" />
              <span className="font-mono text-[11px]">Download as PDF</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="p-1.5 px-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Download / Print as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
              <span className="hidden md:inline font-mono text-[11px]">Print / PDF</span>
            </button>
          )}

          {/* Download Markdown */}
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="p-1.5 px-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Download Roadmap as Markdown (.md) file"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden lg:inline font-mono text-[11px]">MD</span>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="p-1.5 px-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Download Roadmap as JSON file"
          >
            <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden md:inline font-mono text-[11px]">JSON</span>
          </button>

          {/* Import JSON file */}
          <label className="p-1.5 px-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline font-mono text-[11px]">Import</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 px-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
            )}
          </button>
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copyFeedback && (
        <div className="no-print bg-[#E5E795] text-black px-4 py-2 text-center text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          ✓ {copyFeedback}
        </div>
      )}

      {/* ── ROADMAP HEADER & MASTERY PROGRESS HUD ──────────────────────────── */}
      <div className="no-print px-6 py-4 bg-card border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activeRoadmap.title}
              onChange={(e) => updateActiveRoadmap(cur => ({ ...cur, title: e.target.value }))}
              className="text-xl sm:text-2xl font-bold font-serif text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-[#E5E795] focus:outline-hidden transition-colors"
            />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E5E795]/20 border border-[#E5E795]/30 text-indigo-700 dark:text-[#E5E795]">
              {activeRoadmap.category || 'Custom Path'}
            </span>
          </div>
          <input
            type="text"
            value={activeRoadmap.description}
            onChange={(e) => updateActiveRoadmap(cur => ({ ...cur, description: e.target.value }))}
            className="text-xs sm:text-sm text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-[#E5E795] focus:outline-hidden w-full transition-colors"
          />
        </div>

        {/* Progress HUD Widget */}
        <div className="flex items-center gap-4 bg-secondary/50 p-2.5 rounded-2xl border border-border shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Curriculum Mastery
            </span>
            <div className="text-base font-bold font-mono text-foreground flex items-center gap-1.5 justify-end">
              <span>{stats.completed}</span>
              <span className="text-xs text-muted-foreground font-normal">/ {stats.total} topics</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-[#E5E795] font-semibold">
              {stats.inProgress} currently in progress
            </span>
          </div>

          <div className="relative size-12 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/50"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#E5E795] transition-all duration-500 ease-out"
                strokeDasharray={`${stats.percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-extrabold text-xs text-foreground">
              {stats.percent}%
            </span>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── VIEW MODE 1: SIMPLE MODE (COMPACT ZIGZAG TREE) ────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'simple' && (
        <div 
          className="flex-1 w-full p-4 sm:p-6 overflow-y-auto bg-muted/20 dark:bg-[#090a0e]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            color: 'rgba(128, 128, 128, 0.12)'
          }}
        >
          <div className="max-w-4xl mx-auto py-4">
            {/* Start Landmark Node */}
            <div className="flex flex-col items-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#E5E795] text-black shadow-xs">
                <Sparkles className="size-3.5" />
                Curriculum Start
              </div>
              <div className="w-0.5 h-6 border-l-2 border-dashed border-border"></div>
            </div>

            {/* Phases List */}
            <div className="space-y-12">
              {filteredPhases.map((phase, pIdx) => {
                const stepNumber = String(pIdx + 1).padStart(2, '0');
                const phaseCompleted = phase.topics.filter(t => t.status === 'completed').length;
                const phaseTotal = phase.topics.length;

                return (
                  <div key={phase.id} className="roadmap-phase-container relative">
                    {/* Phase Milestone Header Card */}
                    <div className="max-w-2xl mx-auto mb-6 p-4 sm:p-5 rounded-2xl border border-border bg-card/90 backdrop-blur-xs text-center shadow-xs">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span className="size-7 rounded-xl bg-secondary text-foreground font-serif font-bold text-xs flex items-center justify-center border border-border shadow-2xs">
                          {stepNumber}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Phase {stepNumber}
                        </span>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {phaseCompleted}/{phaseTotal} completed
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="text"
                          value={phase.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveRoadmap(cur => ({
                              ...cur,
                              phases: cur.phases.map(p => p.id === phase.id ? { ...p, title: val } : p)
                            }));
                          }}
                          className="text-xl sm:text-2xl font-serif font-medium text-foreground tracking-tight text-center bg-transparent border-b border-transparent hover:border-border focus:border-[#E5E795] focus:outline-hidden transition-colors max-w-lg"
                        />
                      </div>

                      {phase.description && (
                        <input
                          type="text"
                          value={phase.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveRoadmap(cur => ({
                              ...cur,
                              phases: cur.phases.map(p => p.id === phase.id ? { ...p, description: val } : p)
                            }));
                          }}
                          className="text-xs text-muted-foreground mt-1.5 font-body max-w-lg mx-auto text-center block bg-transparent border-b border-transparent hover:border-border focus:border-[#E5E795] focus:outline-hidden transition-colors w-full"
                        />
                      )}

                      {/* Phase Action Buttons */}
                      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                        <button
                          type="button"
                          disabled={pIdx === 0}
                          onClick={() => handleMovePhase(pIdx, 'up')}
                          className="size-7 rounded-lg bg-secondary hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors border border-border"
                          title="Move Phase Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={pIdx === activeRoadmap.phases.length - 1}
                          onClick={() => handleMovePhase(pIdx, 'down')}
                          className="size-7 rounded-lg bg-secondary hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors border border-border"
                          title="Move Phase Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAddTopic(phase.id, 'topic')}
                          className="text-[11px] font-semibold px-3 py-1 rounded-lg border border-[#E5E795]/40 bg-[#E5E795]/20 hover:bg-[#E5E795]/30 text-indigo-700 dark:text-[#E5E795] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Topic</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePhase(phase.id)}
                          className="size-7 rounded-lg bg-secondary hover:bg-rose-500/20 text-muted-foreground hover:text-rose-500 flex items-center justify-center cursor-pointer transition-colors border border-border"
                          title="Delete Phase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mb-6">
                      <div className="w-0.5 h-6 border-l-2 border-dashed border-border"></div>
                    </div>

                    {/* Zigzag Tree Container */}
                    <div className="zigzag-tree-wrapper relative py-2">
                      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-border pointer-events-none"></div>
                      <div className="block md:hidden absolute left-5 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-border pointer-events-none"></div>

                      <div className="space-y-6 md:space-y-8">
                        {phase.topics.map((topic, tIdx) => {
                          const isEven = tIdx % 2 === 0;
                          const isCompleted = topic.status === 'completed';
                          const isInProgress = topic.status === 'in-progress';
                          const kind = topic.kind || 'topic';

                          return (
                            <div
                              key={topic.id}
                              className={`topic-node-wrapper relative flex ${
                                isEven 
                                  ? 'md:w-[calc(50%-2.25rem)] md:mr-auto md:ml-0 md:justify-end ml-12' 
                                  : 'md:w-[calc(50%-2.25rem)] md:ml-auto md:mr-0 md:justify-start ml-12'
                              }`}
                            >
                              {/* Desktop Waypoints */}
                              {isEven ? (
                                <>
                                  <div className="hidden md:block absolute -right-9 top-1/2 -translate-y-1/2 w-9 h-0.5 border-t-2 border-dashed border-border pointer-events-none"></div>
                                  <div className="hidden md:flex absolute -right-11 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-border bg-background items-center justify-center pointer-events-none z-10">
                                    <span className={`size-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-muted-foreground'}`}></span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="hidden md:block absolute -left-9 top-1/2 -translate-y-1/2 w-9 h-0.5 border-t-2 border-dashed border-border pointer-events-none"></div>
                                  <div className="hidden md:flex absolute -left-11 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-border bg-background items-center justify-center pointer-events-none z-10">
                                    <span className={`size-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-muted-foreground'}`}></span>
                                  </div>
                                </>
                              )}

                              {/* Mobile Waypoint */}
                              <div className="block md:hidden absolute -left-7 top-1/2 -translate-y-1/2 w-7 h-0.5 border-t-2 border-dashed border-border pointer-events-none"></div>
                              <div className="flex md:hidden absolute -left-9 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-border bg-background items-center justify-center pointer-events-none z-10">
                                <span className={`size-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-muted-foreground'}`}></span>
                              </div>

                              {/* Topic Card Render by Kind */}
                              <div
                                onClick={() => setEditingTopic({ phaseId: phase.id, topic, isNew: false })}
                                className={`topic-node group relative rounded-xl border-2 px-4 py-2.5 text-center font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 select-none w-full sm:w-auto sm:min-w-[200px] sm:max-w-sm ${
                                  kind === 'project'
                                    ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500/70 text-indigo-950 dark:text-indigo-200'
                                    : kind === 'exam'
                                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500/70 text-amber-950 dark:text-amber-200'
                                    : kind === 'decision'
                                    ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-400 dark:border-purple-500/70 text-purple-950 dark:text-purple-200 rounded-2xl'
                                    : kind === 'note'
                                    ? 'bg-[#E5E795]/20 border-[#E5E795]/60 text-zinc-900 dark:text-[#E5E795]'
                                    : isCompleted
                                    ? 'bg-emerald-50/90 dark:bg-emerald-950/45 border-emerald-400 dark:border-emerald-500/80 text-emerald-950 dark:text-emerald-100 font-semibold'
                                    : isInProgress
                                    ? 'bg-amber-50/90 dark:bg-amber-950/45 border-amber-400 dark:border-amber-500/80 text-amber-950 dark:text-amber-100 font-semibold'
                                    : 'bg-card hover:bg-secondary/70 border-border text-foreground font-medium'
                                }`}
                              >
                                {kind === 'project' ? (
                                  <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                ) : kind === 'exam' ? (
                                  <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                ) : kind === 'decision' ? (
                                  <Split className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                ) : kind === 'note' ? (
                                  <StickyNote className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795] shrink-0" />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleTopicStatus(phase.id, topic.id, e)}
                                    title={`Status: ${isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'To Learn'} (click to cycle)`}
                                    className="shrink-0 p-0.5 rounded-full hover:scale-125 transition-transform cursor-pointer"
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    ) : isInProgress ? (
                                      <span className="size-3 rounded-full bg-amber-500 block animate-pulse" />
                                    ) : (
                                      <Circle className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-foreground" />
                                    )}
                                  </button>
                                )}

                                <span className="truncate max-w-[200px]">{topic.name}</span>
                                <Edit3 className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-0.5" />
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAddTopic(phase.id, 'topic')}
                            className="group rounded-xl border-2 border-dashed border-border hover:border-[#E5E795] px-4 py-2 text-center font-medium text-xs text-muted-foreground hover:text-foreground bg-card/60 hover:bg-secondary/70 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                            <span>Add Item to Phase</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center my-6">
                      <div className="w-0.5 h-8 border-l-2 border-dashed border-border"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-4 pb-8">
              <button
                type="button"
                onClick={handleAddPhase}
                className="px-6 py-3 rounded-2xl bg-card hover:bg-secondary border-2 border-dashed border-border hover:border-[#E5E795] text-foreground font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
                <span>+ Add Next Learning Phase / Milestone</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── VIEW MODE 2: DESIGN MODE (FULL 2D CANVAS WITH MULTIPLE ITEMS) ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'design' && (
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="flex-1 w-full relative bg-muted/20 dark:bg-[#090a0e] overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            color: 'rgba(128, 128, 128, 0.15)',
            minHeight: '680px'
          }}
        >
          {/* FLOATING TOP-LEFT WIRE TOOLS & PROMPTS */}
          <div onMouseDown={(e) => e.stopPropagation()} className="absolute top-4 left-4 z-20 flex items-center gap-2 flex-wrap">
            {/* Wire style selector & curve toggle (DIRECTLY MODIFIES SELECTED WIRE) */}
            <div className="flex items-center gap-1 bg-card/95 p-1 rounded-2xl border border-border shadow-lg backdrop-blur-md text-xs">
              <span className="text-[10px] font-mono text-muted-foreground px-2 font-semibold uppercase">Wire:</span>
              <button
                type="button"
                onClick={() => handleChooseWireStyle('solid')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer ${
                  (selectedConnection ? selectedConnection.style === 'solid' : currentWireStyle === 'solid')
                    ? 'bg-[#E5E795] text-black font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Solid Arrow (Shortcut: Key 1): Prerequisite / Mandatory Path"
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => handleChooseWireStyle('dashed')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer ${
                  (selectedConnection ? selectedConnection.style === 'dashed' : currentWireStyle === 'dashed')
                    ? 'bg-[#E5E795] text-black font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dashed Arrow (Shortcut: Key 2): Elective / Optional Path"
              >
                Dashed
              </button>
              <button
                type="button"
                onClick={() => handleChooseWireStyle('dotted')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer ${
                  (selectedConnection ? selectedConnection.style === 'dotted' : currentWireStyle === 'dotted')
                    ? 'bg-[#E5E795] text-black font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dotted Arrow (Shortcut: Key 3): Related / Parallel Path"
              >
                Dotted
              </button>
              <div className="h-4 w-px bg-border mx-1"></div>
              <button
                type="button"
                onClick={handleToggleWireCurve}
                className="px-2 py-1 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground font-mono text-[10px] cursor-pointer"
                title={`Wire Shape: ${activeRoadmap.wireCurve === 'straight' ? 'Straight' : 'Curved Bezier'} (click to toggle)`}
              >
                {activeRoadmap.wireCurve === 'straight' ? 'Straight' : 'Curved'}
              </button>
            </div>

            {/* Connecting prompt banner */}
            {connectingSourceId && (
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-500/50 text-indigo-900 dark:text-indigo-200 text-xs font-mono animate-pulse shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <span>Click any node's left port to complete wire (or click canvas to cancel)</span>
                <button type="button" onClick={() => setConnectingSourceId(null)} className="ml-1 text-muted-foreground hover:text-foreground">✕</button>
              </div>
            )}
          </div>

          {/* FLOATING TOP-RIGHT DESIGN PALETTE TOGGLE */}
          <div onMouseDown={(e) => e.stopPropagation()} className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDesignToolbox(!showDesignToolbox)}
              className={`px-3.5 py-1.5 rounded-2xl border font-semibold text-xs flex items-center gap-2 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                showDesignToolbox
                  ? 'bg-[#E5E795] text-black border-[#E5E795] font-bold'
                  : 'bg-card/95 text-foreground border-border hover:bg-secondary'
              }`}
            >
              <Palette className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
              <span>Design Palette</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                showDesignToolbox ? 'bg-black/20 text-black font-bold' : 'bg-[#E5E795]/20 text-indigo-700 dark:text-[#E5E795]'
              }`}>
                {showDesignToolbox ? '✕ Close' : '+ Add Items'}
              </span>
            </button>
          </div>

          {/* FLOATING DESIGN PALETTE DRAWER ON THE RIGHT (When Opened) */}
          {showDesignToolbox && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute top-16 right-4 z-30 w-76 max-h-[calc(100%-80px)] rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-foreground"
            >
              <div className="p-3 border-b border-border bg-secondary/50 flex items-center justify-between text-xs font-mono">
                <span className="font-bold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                  <span>Design Elements Toolbox</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDesignToolbox(false)}
                  className="size-6 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 overflow-y-auto space-y-4 text-xs font-sans">
                {/* 1. Learning Nodes */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                    Curriculum Nodes
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'topic')}
                      className="p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-none">Topic Box</div>
                        <span className="text-[10px] text-muted-foreground">Standard topic</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'milestone')}
                      className="p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-none">Milestone</div>
                        <span className="text-[10px] text-muted-foreground">Phase banner</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'decision')}
                      className="p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <Split className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-none">Decision</div>
                        <span className="text-[10px] text-muted-foreground">Branch choice</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'project')}
                      className="p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <Code className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-none">Project Lab</div>
                        <span className="text-[10px] text-muted-foreground">Hands-on code</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'exam')}
                      className="p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-none">Exam / Cert</div>
                        <span className="text-[10px] text-muted-foreground">Checkpoint</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'resource')}
                      className="p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-border flex items-center gap-2 text-left cursor-pointer transition-colors"
                    >
                      <Link className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-none">Resource</div>
                        <span className="text-[10px] text-muted-foreground">Doc link card</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Annotations & Sticky Notes */}
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                    Architecture Notes &amp; Groups
                  </span>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'note', 'lime')}
                      className="w-full p-2 rounded-xl bg-[#E5E795]/15 hover:bg-[#E5E795]/25 border border-[#E5E795]/40 text-foreground flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <StickyNote className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                        <span className="font-semibold text-xs">+ Sticky Memo Note</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Lime</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddTopic(activeRoadmap.phases[0]?.id || 'p-1', 'group')}
                      className="w-full p-2 rounded-xl bg-secondary/70 hover:bg-secondary border border-dashed border-border flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-semibold text-xs">+ Group Section Area</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Container</span>
                    </button>
                  </div>
                </div>

                {/* 3. Instructions & Shortcut link */}
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border text-[11px] text-muted-foreground leading-relaxed flex items-center justify-between">
                  <span>💡 Press <strong>Delete</strong> on selected items.</span>
                  <button
                    type="button"
                    onClick={() => setShowShortcutsModal(true)}
                    className="text-indigo-600 dark:text-[#E5E795] font-semibold underline cursor-pointer"
                  >
                    Shortcuts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TRANSFORMED CANVAS LAYER (Nodes + SVG Wires) */}
          <div
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
            className="absolute inset-0 size-full pointer-events-none"
          >
            {/* SVG Wires Layer */}
            <svg className="absolute inset-0 size-full pointer-events-none overflow-visible">
              <defs>
                <marker
                  id="wire-arrow-solid"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                </marker>
                <marker
                  id="wire-arrow-dashed"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
                </marker>
                <marker
                  id="wire-arrow-dotted"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
                </marker>
                <marker
                  id="wire-arrow-completed"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker
                  id="wire-arrow-selected"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
                </marker>
              </defs>

              {/* Render Connections */}
              {renderedConnections.map(conn => {
                const src = canvasTopicsList.find(c => c.topic.id === conn.from);
                const dst = canvasTopicsList.find(c => c.topic.id === conn.to);
                if (!src || !dst) return null;

                const srcWidth = src.topic.kind === 'milestone' ? 260 : src.topic.kind === 'group' ? (src.topic.width || 380) : 210;
                const x1 = src.x + srcWidth;
                const y1 = src.y + 40;
                const x2 = dst.x;
                const y2 = dst.y + 40;

                const isStraight = activeRoadmap.wireCurve === 'straight';
                const dx = Math.max(30, Math.abs(x2 - x1) * 0.45);
                const pathD = isStraight
                  ? `M ${x1} ${y1} L ${x2} ${y2}`
                  : `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                const isSelected = selectedConnectionId === conn.id;
                const isCompleted = src.topic.status === 'completed' && dst.topic.status === 'completed';

                const strokeColor = isSelected
                  ? '#3b82f6'
                  : isCompleted
                  ? '#10b981'
                  : conn.style === 'dotted'
                  ? '#a855f7'
                  : conn.style === 'dashed'
                  ? '#818cf8'
                  : '#6366f1';

                const markerEnd = isSelected
                  ? 'url(#wire-arrow-selected)'
                  : isCompleted
                  ? 'url(#wire-arrow-completed)'
                  : conn.style === 'dotted'
                  ? 'url(#wire-arrow-dotted)'
                  : conn.style === 'dashed'
                  ? 'url(#wire-arrow-dashed)'
                  : 'url(#wire-arrow-solid)';

                const strokeWidth = isSelected ? 4 : conn.style === 'dotted' ? 3.5 : 2.5;
                const dashArray = conn.style === 'dashed' ? '8,6' : conn.style === 'dotted' ? '2,4' : 'none';
                const lineCap = conn.style === 'dotted' ? 'round' : 'butt';

                return (
                  <g key={conn.id} className="pointer-events-auto cursor-pointer">
                    {/* Generous invisible stroke hit area */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="24"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedConnectionId(conn.id);
                        setSelectedTopicId(null);
                        setCurrentWireStyle(conn.style);
                        setCopyFeedback(`Selected wire: ${conn.style.toUpperCase()}`);
                        setTimeout(() => setCopyFeedback(null), 1500);
                      }}
                    />
                    {/* Visual wire path */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashArray}
                      strokeLinecap={lineCap}
                      markerEnd={markerEnd}
                      className="transition-all"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Canvas Nodes with dynamic layer ordering (zIndex) */}
            {canvasTopicsList.map(({ phase, topic, pIdx, x, y }) => {
              const kind = topic.kind || 'topic';
              const isCompleted = topic.status === 'completed';
              const isInProgress = topic.status === 'in-progress';
              const isSelected = selectedTopicId === topic.id;
              const isConnectSource = connectingSourceId === topic.id;

              const baseZ = topic.zIndex !== undefined ? topic.zIndex : (kind === 'group' ? 1 : 10);
              const effectiveZ = isSelected ? baseZ + 30 : baseZ;

              // ── ITEM TYPE A: GROUP CONTAINER (STRETCHABLE ON CORNERS) ─
              if (kind === 'group') {
                const width = topic.width || 380;
                const height = topic.height || 240;

                return (
                  <div
                    key={topic.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      width: `${width}px`,
                      height: `${height}px`,
                      position: 'absolute',
                      zIndex: effectiveZ
                    }}
                    className={`group/container rounded-3xl border-2 border-dashed p-4 select-none pointer-events-auto transition-shadow cursor-move ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/30 shadow-xl'
                        : 'border-border/80 bg-secondary/15 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                        <Box className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{topic.name}</span>
                        <span className="text-[10px] font-mono font-normal text-muted-foreground ml-1">
                          (L:{baseZ})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                        }}
                        className="hover:text-foreground text-muted-foreground p-0.5 cursor-pointer"
                        title="Edit container details"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* CORNER RESIZE HANDLES */}
                    {isSelected && (
                      <>
                        {/* Top-Left */}
                        <div
                          onMouseDown={(e) => handleResizeCornerMouseDown(e, phase.id, topic, 'tl')}
                          className="absolute -top-1.5 -left-1.5 size-3.5 rounded-full bg-background border-2 border-indigo-500 shadow-md hover:scale-125 cursor-nwse-resize z-40 transition-transform"
                          title="Drag corner to stretch"
                        />
                        {/* Top-Right */}
                        <div
                          onMouseDown={(e) => handleResizeCornerMouseDown(e, phase.id, topic, 'tr')}
                          className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full bg-background border-2 border-indigo-500 shadow-md hover:scale-125 cursor-nesw-resize z-40 transition-transform"
                          title="Drag corner to stretch"
                        />
                        {/* Bottom-Left */}
                        <div
                          onMouseDown={(e) => handleResizeCornerMouseDown(e, phase.id, topic, 'bl')}
                          className="absolute -bottom-1.5 -left-1.5 size-3.5 rounded-full bg-background border-2 border-indigo-500 shadow-md hover:scale-125 cursor-nesw-resize z-40 transition-transform"
                          title="Drag corner to stretch"
                        />
                        {/* Bottom-Right (Primary handle) */}
                        <div
                          onMouseDown={(e) => handleResizeCornerMouseDown(e, phase.id, topic, 'br')}
                          className="absolute -bottom-2 -right-2 size-4 rounded-full bg-indigo-600 border-2 border-white dark:border-zinc-900 shadow-lg hover:scale-125 cursor-nwse-resize z-40 transition-transform flex items-center justify-center text-white"
                          title="Drag corner to stretch container"
                        >
                          <span className="size-1 rounded-full bg-white block" />
                        </div>

                        {/* Live dimension badge during resize */}
                        {resizingNode && resizingNode.topicId === topic.id && (
                          <div className="absolute -bottom-7 right-0 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-bold shadow-md z-50 pointer-events-none">
                            {width} × {height}
                          </div>
                        )}
                      </>
                    )}

                    {!isSelected && (
                      <div
                        onMouseDown={(e) => handleResizeCornerMouseDown(e, phase.id, topic, 'br')}
                        className="absolute bottom-1 right-1 p-1 opacity-40 hover:opacity-100 cursor-nwse-resize text-muted-foreground hover:text-indigo-500 transition-opacity"
                        title="Drag corner to stretch"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                          <path d="M7 1 L1 7 M7 4 L4 7 M7 7 L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              }

              // ── ITEM TYPE B: STICKY NOTE ──────────────────────────────
              if (kind === 'note') {
                const colorConfig = NOTE_COLORS[topic.color || 'lime'] || NOTE_COLORS.lime;

                return (
                  <div
                    key={topic.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                    }}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      position: 'absolute',
                      zIndex: effectiveZ
                    }}
                    className={`w-[190px] rounded-2xl border-2 p-3 transition-shadow cursor-move select-none pointer-events-auto shadow-md ${colorConfig.bg} ${colorConfig.border} ${colorConfig.text} ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                        <StickyNote className="w-3 h-3" />
                        <span>Architect Memo</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                        }}
                        className="opacity-70 hover:opacity-100 p-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-semibold text-xs leading-tight mb-1">{topic.name}</div>
                    {topic.description && (
                      <p className="text-[11px] leading-snug opacity-80 line-clamp-3">{topic.description}</p>
                    )}
                  </div>
                );
              }

              // ── ITEM TYPE C: MILESTONE BANNER ─────────────────────────
              if (kind === 'milestone') {
                return (
                  <div
                    key={topic.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                    }}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      position: 'absolute',
                      zIndex: effectiveZ
                    }}
                    className={`w-[260px] rounded-2xl border-2 p-3.5 transition-all cursor-move select-none pointer-events-auto shadow-lg bg-card ${
                      isSelected ? 'border-[#E5E795] ring-2 ring-[#E5E795]/50 shadow-2xl' : 'border-border hover:border-indigo-400'
                    }`}
                  >
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, false)}
                      className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-border hover:border-indigo-500 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Input Port"
                    >
                      <span className="size-1.5 rounded-full bg-foreground"></span>
                    </div>
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, true)}
                      className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-border hover:border-cyan-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Output Port"
                    >
                      <span className="size-1.5 rounded-full bg-cyan-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-[#E5E795] text-black">
                        Milestone Landmark
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                        }}
                        className="hover:text-foreground text-muted-foreground p-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-serif font-bold text-sm text-foreground mb-1 leading-snug">{topic.name}</div>
                    {topic.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{topic.description}</p>
                    )}
                  </div>
                );
              }

              // ── ITEM TYPE D: DECISION BRANCH ──────────────────────────
              if (kind === 'decision') {
                return (
                  <div
                    key={topic.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                    }}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      position: 'absolute',
                      zIndex: effectiveZ
                    }}
                    className={`w-[210px] rounded-3xl border-2 p-3 transition-all cursor-move select-none pointer-events-auto shadow-md bg-purple-50/80 dark:bg-purple-950/30 border-purple-300 dark:border-purple-500/50 text-foreground ${
                      isSelected ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:border-purple-400'
                    }`}
                  >
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, false)}
                      className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-purple-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Input Port"
                    >
                      <span className="size-1.5 rounded-full bg-purple-600"></span>
                    </div>
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, true)}
                      className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-purple-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Output Port"
                    >
                      <span className="size-1.5 rounded-full bg-purple-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300 uppercase">
                        <Split className="w-3 h-3" />
                        <span>Branch Fork</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                        }}
                        className="hover:text-foreground text-muted-foreground p-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-semibold text-xs text-foreground mb-1 leading-snug line-clamp-2">{topic.name}</div>
                  </div>
                );
              }

              // ── ITEM TYPE E: PROJECT LAB ──────────────────────────────
              if (kind === 'project') {
                return (
                  <div
                    key={topic.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                    }}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      position: 'absolute',
                      zIndex: effectiveZ
                    }}
                    className={`w-[210px] rounded-2xl border-2 p-3 transition-all cursor-move select-none pointer-events-auto shadow-md bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-500/50 text-foreground ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:border-indigo-400'
                    }`}
                  >
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, false)}
                      className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-indigo-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Input Port"
                    >
                      <span className="size-1.5 rounded-full bg-indigo-600"></span>
                    </div>
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, true)}
                      className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-indigo-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Output Port"
                    >
                      <span className="size-1.5 rounded-full bg-indigo-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                        <Code className="w-3 h-3" />
                        <span>Hands-On Lab</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                        }}
                        className="hover:text-foreground text-muted-foreground p-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-semibold text-xs text-foreground mb-1 leading-snug line-clamp-2">{topic.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{topic.duration || '2 weeks'}</div>
                  </div>
                );
              }

              // ── ITEM TYPE F: EXAM / CERT ──────────────────────────────
              if (kind === 'exam') {
                return (
                  <div
                    key={topic.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                    }}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      position: 'absolute',
                      zIndex: effectiveZ
                    }}
                    className={`w-[210px] rounded-2xl border-2 p-3 transition-all cursor-move select-none pointer-events-auto shadow-md bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/50 text-foreground ${
                      isSelected ? 'ring-2 ring-amber-500 shadow-xl' : 'hover:border-amber-400'
                    }`}
                  >
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, false)}
                      className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-amber-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Input Port"
                    >
                      <span className="size-1.5 rounded-full bg-amber-600"></span>
                    </div>
                    <div
                      onClick={(e) => handlePortClick(e, topic.id, true)}
                      className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-amber-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                      title="Output Port"
                    >
                      <span className="size-1.5 rounded-full bg-amber-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300 uppercase">
                        <Trophy className="w-3 h-3" />
                        <span>Exam Checkpoint</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                        }}
                        className="hover:text-foreground text-muted-foreground p-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-semibold text-xs text-foreground mb-1 leading-snug line-clamp-2">{topic.name}</div>
                  </div>
                );
              }

              // ── ITEM TYPE G: STANDARD TOPIC BOX ───────────────────────
              return (
                <div
                  key={topic.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, phase.id, topic.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTopicId(topic.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                  }}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    position: 'absolute',
                    zIndex: effectiveZ
                  }}
                  className={`w-[210px] rounded-2xl border-2 p-3 transition-shadow cursor-move select-none pointer-events-auto shadow-md ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/80 text-emerald-950 dark:text-emerald-100'
                      : isInProgress
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500/80 text-amber-950 dark:text-amber-100'
                      : 'bg-card border-border hover:border-indigo-400 text-foreground'
                  } ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : ''
                  } ${
                    isConnectSource ? 'ring-2 ring-cyan-400 animate-pulse' : ''
                  }`}
                >
                  {/* Left Port (Input) */}
                  <div
                    onClick={(e) => handlePortClick(e, topic.id, false)}
                    className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-border hover:border-indigo-500 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                    title="Input Port (Click here to complete connection)"
                  >
                    <span className="size-1.5 rounded-full bg-foreground"></span>
                  </div>

                  {/* Right Port (Output) */}
                  <div
                    onClick={(e) => handlePortClick(e, topic.id, true)}
                    className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-card border-2 border-border hover:border-cyan-400 cursor-pointer flex items-center justify-center transition-colors shadow-xs"
                    title="Output Port (Click to start wire)"
                  >
                    <span className="size-1.5 rounded-full bg-cyan-500"></span>
                  </div>

                  {/* Header & Status Toggle */}
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider bg-secondary text-muted-foreground">
                      P{pIdx + 1} • {topic.difficulty}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleTopicStatus(phase.id, topic.id, e)}
                      title={`Status: ${isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'To Learn'} (click to cycle)`}
                      className="p-0.5 rounded-full hover:scale-125 transition-transform cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : isInProgress ? (
                        <span className="size-3 rounded-full bg-amber-500 block animate-pulse" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-muted-foreground/60" />
                      )}
                    </button>
                  </div>

                  {/* Topic Title */}
                  <div className="font-semibold text-xs leading-snug text-foreground mb-1 line-clamp-2">
                    {topic.name}
                  </div>

                  {/* Duration & Edit */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{topic.duration || '1 week'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTopic({ phaseId: phase.id, topic, isNew: false });
                      }}
                      className="hover:text-foreground p-0.5"
                      title="Edit topic details"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FLOATING ACTION & LAYER ORDERING TOOLBAR ON TOPIC / CONTAINER SELECTION */}
          {selectedTopicData && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl flex items-center gap-2 text-xs font-mono text-foreground animate-in fade-in zoom-in-95 duration-100 max-w-[92vw] overflow-x-auto"
            >
              <div className="flex items-center gap-1.5 font-bold pr-2 border-r border-border shrink-0">
                {selectedTopicData.topic.kind === 'group' ? (
                  <Box className="w-3.5 h-3.5 text-indigo-500" />
                ) : selectedTopicData.topic.kind === 'note' ? (
                  <StickyNote className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
                ) : (
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span className="max-w-[120px] truncate text-[11px] font-sans">
                  {selectedTopicData.topic.name}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-semibold">
                  Layer: {selectedTopicData.topic.zIndex !== undefined ? selectedTopicData.topic.zIndex : (selectedTopicData.topic.kind === 'group' ? 1 : 10)}
                </span>
              </div>

              {/* Layer Ordering: Bring Forward / Send Backward / To Front / To Back */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold px-1 hidden sm:inline">Layer:</span>
                <button
                  type="button"
                  onClick={() => handleBringForward(selectedTopicData.phase.id, selectedTopicData.topic.id)}
                  className="px-2 py-1 rounded-lg hover:bg-secondary text-foreground text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title="Bring Forward (+1 Layer)"
                >
                  <ArrowUp className="w-3 h-3 text-indigo-500" />
                  <span className="hidden sm:inline">Forward</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendBackward(selectedTopicData.phase.id, selectedTopicData.topic.id)}
                  className="px-2 py-1 rounded-lg hover:bg-secondary text-foreground text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title="Send Backward (-1 Layer)"
                >
                  <ArrowDown className="w-3 h-3 text-indigo-500" />
                  <span className="hidden sm:inline">Backward</span>
                </button>

                <div className="h-3.5 w-px bg-border mx-0.5" />

                <button
                  type="button"
                  onClick={() => handleBringToFront(selectedTopicData.phase.id, selectedTopicData.topic.id)}
                  className="px-1.5 py-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground text-[10px] cursor-pointer"
                  title="Bring to Front (Topmost layer)"
                >
                  To Front
                </button>

                <button
                  type="button"
                  onClick={() => handleSendToBack(selectedTopicData.phase.id, selectedTopicData.topic.id)}
                  className="px-1.5 py-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground text-[10px] cursor-pointer"
                  title="Send to Back (Bottommost background layer)"
                >
                  To Back
                </button>
              </div>

              <div className="h-3.5 w-px bg-border mx-0.5" />

              {/* Edit Details */}
              <button
                type="button"
                onClick={() => setEditingTopic({ phaseId: selectedTopicData.phase.id, topic: selectedTopicData.topic, isNew: false })}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                title="Edit item details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDeleteTopic(selectedTopicData.phase.id, selectedTopicData.topic.id)}
                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                title="Delete item (Shortcut: Delete)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* FLOATING ACTION TOOLBAR ON WIRE SELECTION */}
          {selectedConnection && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className={`absolute top-16 z-30 p-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl space-y-2.5 text-xs font-mono animate-in fade-in zoom-in-95 duration-150 text-foreground w-68 ${
                showDesignToolbox ? 'right-82' : 'right-4'
              }`}
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Wire Settings</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedConnectionId(null)}
                  className="size-5 rounded hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground truncate">
                {selectedWireSrc?.name || 'Node A'} ➔ {selectedWireDst?.name || 'Node B'}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Select Wire Style:</span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetConnectionStyle(selectedConnection.id, 'solid')}
                    className={`py-1 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer border ${
                      selectedConnection.style === 'solid'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-secondary hover:bg-muted text-foreground border-border'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetConnectionStyle(selectedConnection.id, 'dashed')}
                    className={`py-1 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer border ${
                      selectedConnection.style === 'dashed'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-secondary hover:bg-muted text-foreground border-border'
                    }`}
                  >
                    Dashed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetConnectionStyle(selectedConnection.id, 'dotted')}
                    className={`py-1 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer border ${
                      selectedConnection.style === 'dotted'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-secondary hover:bg-muted text-foreground border-border'
                    }`}
                  >
                    Dotted
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleReverseConnection(selectedConnection.id)}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                  title="Reverse wire direction"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reverse</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteConnection(selectedConnection.id)}
                  className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Wire</span>
                </button>
              </div>
            </div>
          )}

          {/* FLOATING ZOOM & SHORTCUT CONTROLS (Bottom Right) */}
          <div onMouseDown={(e) => e.stopPropagation()} className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl text-xs font-mono text-foreground">
            <button
              type="button"
              onClick={() => setShowShortcutsModal(true)}
              className="p-1.5 px-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]"
              title="Keyboard Shortcuts Cheat Sheet"
            >
              <Keyboard className="w-3.5 h-3.5 text-indigo-600 dark:text-[#E5E795]" />
              <span className="hidden sm:inline">Shortcuts</span>
            </button>
            <div className="h-4 w-px bg-border mx-0.5"></div>
            <button
              type="button"
              onClick={() => handleZoom(-0.1)}
              className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Zoom Out (-)"
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
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-border mx-0.5"></div>
            <button
              type="button"
              onClick={handleResetCanvasView}
              className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Reset Canvas View (0)"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── VIEW MODE 3: READ MODE (DISTRACTION-FREE PRINTABLE SYLLABUS) ──── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'read' && (
        <div id="roadmap-printable-view" className="flex-1 w-full p-6 sm:p-10 overflow-y-auto bg-card text-foreground">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="border-b border-border pb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E5E795] text-black">
                  {activeRoadmap.category || 'Engineering Roadmap'}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Mastery: {stats.completed}/{stats.total} topics ({stats.percent}%)
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                {activeRoadmap.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-body leading-relaxed">
                {activeRoadmap.description}
              </p>
            </div>

            <div className="space-y-8">
              {filteredPhases.map((phase, pIdx) => {
                const phaseCompleted = phase.topics.filter(t => t.status === 'completed').length;
                const phaseTotal = phase.topics.length;

                return (
                  <div key={phase.id} className="rounded-2xl border border-border bg-card/60 p-6 space-y-4 shadow-xs">
                    <div className="flex items-start justify-between border-b border-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-lg bg-secondary text-foreground text-xs font-bold font-serif flex items-center justify-center">
                            {pIdx + 1}
                          </span>
                          <h2 className="text-xl font-serif font-bold text-foreground">
                            {phase.title}
                          </h2>
                        </div>
                        {phase.description && (
                          <p className="text-xs text-muted-foreground font-body mt-1 ml-8">
                            {phase.description}
                          </p>
                        )}
                      </div>

                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0 font-medium">
                        {phaseCompleted}/{phaseTotal} mastered
                      </span>
                    </div>

                    <div className="space-y-3 pt-1">
                      {phase.topics.map(topic => {
                        const isCompleted = topic.status === 'completed';
                        const isInProgress = topic.status === 'in-progress';
                        const kind = topic.kind || 'topic';

                        return (
                          <div
                            key={topic.id}
                            className="p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-secondary/40 transition-colors space-y-2"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleTopicStatus(phase.id, topic.id, e)}
                                  className="shrink-0 p-0.5 rounded-full no-print cursor-pointer"
                                  title="Toggle status"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : isInProgress ? (
                                    <span className="size-3 rounded-full bg-amber-500 block" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-muted-foreground/60" />
                                  )}
                                </button>
                                <span className={`font-semibold text-sm ${isCompleted ? 'text-emerald-700 dark:text-emerald-300' : 'text-foreground'}`}>
                                  {topic.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 text-muted-foreground font-mono text-[11px]">
                                {topic.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{topic.duration}</span>
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded bg-secondary uppercase text-[10px] font-semibold text-foreground">
                                  {kind}
                                </span>
                              </div>
                            </div>

                            {topic.description && (
                              <p className="text-xs text-muted-foreground font-body leading-relaxed ml-6">
                                {topic.description}
                              </p>
                            )}

                            {topic.resources && topic.resources.length > 0 && (
                              <div className="ml-6 flex items-center gap-3 flex-wrap pt-1 text-[11px] font-mono">
                                <span className="text-muted-foreground">Resources:</span>
                                {topic.resources.map((res, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                                  >
                                    <span>{res.title}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}

                            {topic.notes && (
                              <div className="ml-6 p-2 rounded-lg bg-secondary/60 text-xs font-mono text-muted-foreground border border-border/50">
                                <strong>Notes:</strong> {topic.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT TOPIC DETAILS ─────────────────────────────────────── */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-medium text-lg text-foreground flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
                <span>{editingTopic.isNew ? `Add ${editingTopic.topic.kind || 'Topic'}` : 'Edit Item Details'}</span>
              </h3>
              <button 
                type="button"
                onClick={() => setEditingTopic(null)}
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus (Raft/Paxos)"
                  value={editingTopic.topic.name}
                  onChange={(e) => setEditingTopic({
                    ...editingTopic,
                    topic: { ...editingTopic.topic, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-[#E5E795]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="Key concepts, architecture patterns, and learning goals..."
                  value={editingTopic.topic.description}
                  onChange={(e) => setEditingTopic({
                    ...editingTopic,
                    topic: { ...editingTopic.topic, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-[#E5E795]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Item Type</label>
                  <select
                    value={editingTopic.topic.kind || 'topic'}
                    onChange={(e) => setEditingTopic({
                      ...editingTopic,
                      topic: { ...editingTopic.topic, kind: e.target.value as TopicKind }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-secondary/80 border border-border text-foreground focus:outline-hidden"
                  >
                    <option value="topic">Topic Box</option>
                    <option value="milestone">Milestone</option>
                    <option value="decision">Decision</option>
                    <option value="project">Project Lab</option>
                    <option value="exam">Exam Checkpoint</option>
                    <option value="resource">Resource Link</option>
                    <option value="note">Sticky Note</option>
                    <option value="group">Group Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Status</label>
                  <select
                    value={editingTopic.topic.status}
                    onChange={(e) => setEditingTopic({
                      ...editingTopic,
                      topic: { ...editingTopic.topic, status: e.target.value as TopicStatus }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-secondary/80 border border-border text-foreground focus:outline-hidden"
                  >
                    <option value="not-started">⚪ To Learn</option>
                    <option value="in-progress">🟡 In Progress</option>
                    <option value="completed">🟢 Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Est. Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 week"
                    value={editingTopic.topic.duration || ''}
                    onChange={(e) => setEditingTopic({
                      ...editingTopic,
                      topic: { ...editingTopic.topic, duration: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-secondary/80 border border-border text-foreground focus:outline-hidden"
                  />
                </div>
              </div>

              {editingTopic.topic.kind === 'note' && (
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Sticky Note Color</label>
                  <div className="flex items-center gap-2">
                    {Object.entries(NOTE_COLORS).map(([key, cfg]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, color: key }
                        })}
                        style={{ backgroundColor: cfg.hex }}
                        className={`size-6 rounded-full border-2 transition-transform cursor-pointer ${
                          editingTopic.topic.color === key ? 'scale-125 border-foreground' : 'border-transparent'
                        }`}
                        title={cfg.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layer Ordering (Z-Index) & Dimensions */}
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/80 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layer Stacking (Z-Index)</label>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary border border-border text-foreground font-semibold">
                      Layer: {editingTopic.topic.zIndex ?? (editingTopic.topic.kind === 'group' ? 1 : 10)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    {editingTopic.topic.kind === 'group' 
                      ? 'Containers default behind topics (Layer 1) so topics inside remain clickable and connectable.'
                      : 'Bring this item forward to place it in front of containers and other elements.'}
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const curZ = editingTopic.topic.zIndex ?? (editingTopic.topic.kind === 'group' ? 1 : 10);
                        setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, zIndex: curZ + 1 }
                        });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-secondary hover:bg-muted border border-border text-xs font-semibold text-foreground transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Bring forward one layer (+1)"
                    >
                      <span>⬆ Forward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const curZ = editingTopic.topic.zIndex ?? (editingTopic.topic.kind === 'group' ? 1 : 10);
                        setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, zIndex: Math.max(0, curZ - 1) }
                        });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-secondary hover:bg-muted border border-border text-xs font-semibold text-foreground transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Send backward one layer (-1)"
                    >
                      <span>⬇ Backward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, zIndex: 50 }
                        });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-secondary hover:bg-muted border border-border text-xs font-semibold text-foreground transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Bring to front"
                    >
                      <span>To Front</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, zIndex: 1 }
                        });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-secondary hover:bg-muted border border-border text-xs font-semibold text-foreground transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Send to back (behind all items)"
                    >
                      <span>To Back</span>
                    </button>
                  </div>
                </div>

                {(editingTopic.topic.kind === 'group' || editingTopic.topic.kind === 'note') && (
                  <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Width (px)</label>
                      <input
                        type="number"
                        min="160"
                        max="1200"
                        value={editingTopic.topic.width || (editingTopic.topic.kind === 'group' ? 380 : 190)}
                        onChange={(e) => setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, width: Math.max(160, parseInt(e.target.value) || 160) }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Height (px)</label>
                      <input
                        type="number"
                        min="90"
                        max="1000"
                        value={editingTopic.topic.height || (editingTopic.topic.kind === 'group' ? 240 : 160)}
                        onChange={(e) => setEditingTopic({
                          ...editingTopic,
                          topic: { ...editingTopic.topic, height: Math.max(90, parseInt(e.target.value) || 90) }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Personal Study Notes / Links</label>
                <textarea
                  rows={2}
                  placeholder="Notes, takeaways, or URLs..."
                  value={editingTopic.topic.notes || ''}
                  onChange={(e) => setEditingTopic({
                    ...editingTopic,
                    topic: { ...editingTopic.topic, notes: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-[#E5E795]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              {!editingTopic.isNew ? (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteTopic(editingTopic.phaseId, editingTopic.topic.id);
                    setEditingTopic(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Item</span>
                </button>
              ) : <div></div>}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTopic}
                  className="px-5 py-2 rounded-xl bg-[#E5E795] text-black font-bold hover:brightness-105 transition-all shadow-md cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: KEYBOARD SHORTCUTS CHEAT SHEET ─────────────────────────── */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-medium text-lg text-foreground flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
                <span>Keyboard Shortcuts</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Delete / Backspace</span>
                <span className="font-bold text-foreground">Delete selected node or wire</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Arrow Keys (↑ ↓ ← →)</span>
                <span className="font-bold text-foreground">Nudge node (Shift for +40px)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Ctrl + D / Cmd + D</span>
                <span className="font-bold text-foreground">Duplicate selected node</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Space</span>
                <span className="font-bold text-foreground">Cycle status (⚪ ➔ 🟡 ➔ 🟢)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Enter</span>
                <span className="font-bold text-foreground">Open edit details modal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">1, 2, 3</span>
                <span className="font-bold text-foreground">Set Wire Style (Solid, Dashed, Dotted)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">] / [</span>
                <span className="font-bold text-foreground">Bring Forward / Send Backward</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">+ / -</span>
                <span className="font-bold text-foreground">Zoom in / Zoom out</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">0 (zero)</span>
                <span className="font-bold text-foreground">Reset view &amp; zoom</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Escape</span>
                <span className="font-bold text-foreground">Deselect / Cancel wire</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#E5E795] text-black font-bold text-xs cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: TEMPLATE MANAGER ───────────────────────────────────────── */}
      {showTemplateManager && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-medium text-lg text-foreground flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
                <span>Roadmap Templates</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowTemplateManager(false)}
                className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="font-mono uppercase font-bold text-[10px] text-muted-foreground block">
                  Official Starter Template (1)
                </span>
                <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-foreground text-sm flex items-center gap-2">
                    <span>{DEFAULT_STARTER_TEMPLATE.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E5E795]/20 text-indigo-700 dark:text-[#E5E795]">
                      Default
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    {DEFAULT_STARTER_TEMPLATE.description}
                  </p>
                  <div className="mt-2 text-[11px] text-muted-foreground font-mono">
                    💡 To create a new roadmap, click the <strong>+</strong> button just next to the Roadmap dropdown.
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="font-mono uppercase font-bold text-[10px] text-muted-foreground block">
                  My Custom Saved Templates ({userTemplates.length})
                </span>

                {userTemplates.length === 0 ? (
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center text-muted-foreground text-xs">
                    No custom templates saved yet. Click "Save as Template" in the top bar to save any roadmap as a reusable blueprint!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {userTemplates.map(tmpl => (
                      <div key={tmpl.id} className="p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{tmpl.title}</div>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {tmpl.phases.length} phases • {tmpl.phases.reduce((a, p) => a + p.topics.length, 0)} items
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(tmpl.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer transition-colors"
                          title="Delete custom template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowTemplateManager(false);
                  setShowDeleteConfirm(true);
                }}
                className="text-rose-500 hover:underline cursor-pointer"
                title="Delete currently open roadmap"
              >
                Delete Current Roadmap
              </button>
              <button
                type="button"
                onClick={() => setShowTemplateManager(false)}
                className="px-4 py-1.5 rounded-xl bg-secondary hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SAVE AS TEMPLATE PROMPT ────────────────────────────────── */}
      {saveTemplatePrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-foreground">
            <h3 className="font-serif font-medium text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
              <span>Save as Custom Template</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Save the current structure of <strong>"{activeRoadmap.title}"</strong> as a reusable template to build future roadmaps.
            </p>

            <div>
              <label className="block text-xs text-muted-foreground mb-1 font-medium">Template Name</label>
              <input
                type="text"
                value={templateNameInput}
                onChange={(e) => setTemplateNameInput(e.target.value)}
                placeholder="e.g. My Distributed Systems Template"
                className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border text-foreground text-xs focus:outline-hidden focus:border-[#E5E795]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setSaveTemplatePrompt(false)}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-muted text-foreground text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAsTemplate}
                className="px-5 py-2 rounded-xl bg-[#E5E795] text-black text-xs font-bold hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
