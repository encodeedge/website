import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Network, 
  Cpu, 
  Boxes, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Trophy, 
  Activity, 
  Layers, 
  Zap, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { SystemDesignSimulator, type SimulatorProblem } from './SystemDesignSimulator';
import { PipelinePuzzleLab, type PuzzleScenario } from './PipelinePuzzleLab';

export type SystemDesignMode = 'simulator' | 'puzzle' | 'reference' | 'principles';

export interface ReferenceArchitecture {
  id: string;
  title: string;
  category: string;
  sla: string;
  summary: string;
  latencyBudget?: Array<{ step: string; latency: string }>;
  componentsUsed?: string[];
  coreTradeoff?: string;
  order?: number;
}

export interface GoldenPrinciple {
  number: string;
  title: string;
  description: string;
}

export interface SystemDesignStudioProps {
  initialProblems?: SimulatorProblem[];
  scenarios?: PuzzleScenario[];
  architectures?: ReferenceArchitecture[];
  goldenPrinciples?: GoldenPrinciple[];
  pageSettings?: any;
}

export const SystemDesignStudio: React.FC<SystemDesignStudioProps> = ({
  initialProblems = [],
  scenarios = [],
  architectures = [],
  goldenPrinciples = [],
  pageSettings
}) => {
  // Mode switcher: 'simulator' (Game Play) | 'puzzle' (AWS Blueprint Lab) | 'reference' (Blueprints) | 'principles' (Golden Rules)
  const [viewMode, setViewMode] = useState<SystemDesignMode>('simulator');

  // Handle URL hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const queryMode = params.get('mode') as SystemDesignMode | null;

      if (queryMode && ['simulator', 'puzzle', 'reference', 'principles'].includes(queryMode)) {
        setViewMode(queryMode);
      } else if (hash === '#blueprint-lab') {
        setViewMode('puzzle');
      } else if (hash === '#reference-architectures') {
        setViewMode('reference');
      } else if (hash === '#golden-principles') {
        setViewMode('principles');
      }
    }
  }, []);

  // Selected problem state for the draggable shelf and simulator
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

  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => problems[0]?.id || 'url-shortener');

  const activeProblem = useMemo(() => {
    return problems.find(p => p.id === selectedProblemId) || problems[0];
  }, [problems, selectedProblemId]);

  // Draggable shelf drag-to-scroll implementation
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDraggingCarousel, setIsDraggingCarousel] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDraggingCarousel(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCarousel || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCarouselMouseUpOrLeave = () => {
    setIsDraggingCarousel(false);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = direction === 'left' ? -340 : 340;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'hard':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
      case 'medium':
      default:
        return 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="w-full space-y-8 select-none">
      {/* ── TOP MODE SWITCHER BAR ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-card border border-border shadow-sm">
        {/* Left: Mode Title & Quick Info */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="size-8 rounded-xl bg-[#E5E795]/20 border border-[#E5E795]/40 flex items-center justify-center text-slate-900 dark:text-[#E5E795]">
            {viewMode === 'simulator' && <Cpu className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />}
            {viewMode === 'puzzle' && <Boxes className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
            {viewMode === 'reference' && <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            {viewMode === 'principles' && <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />}
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-display flex items-center gap-2">
              <span>
                {viewMode === 'simulator' && 'Flight Simulator (Problem Challenges)'}
                {viewMode === 'puzzle' && 'AWS Blueprint Lab (Sequencing Puzzle)'}
                {viewMode === 'reference' && 'Production Reference Blueprints'}
                {viewMode === 'principles' && 'Golden Principles of ML Architecture'}
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#E5E795]/20 text-[#303305] dark:text-[#E5E795] border border-[#E5E795]/40">
                Interactive
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              {viewMode === 'simulator' && 'Drag components, wire dataflows, simulate live QPS, and pass interview tests'}
              {viewMode === 'puzzle' && 'Sequence AWS architecture nodes into VPC subnets in execution order'}
              {viewMode === 'reference' && 'Inspect enterprise SLAs, latency budgets, and engineering trade-offs'}
              {viewMode === 'principles' && '4 battle-tested architectural rules of thumb from top tech companies'}
            </p>
          </div>
        </div>

        {/* Right: 4-Way Mode Pill Switcher matching CustomRoadmapBuilder */}
        <div className="flex items-center bg-secondary/80 p-1 rounded-xl border border-border text-xs shadow-inner shrink-0 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setViewMode('simulator')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              viewMode === 'simulator' 
                ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Interactive flight simulator with draggable nodes and live traffic"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Problem Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('puzzle')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              viewMode === 'puzzle' 
                ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="AWS blueprint sequencing game"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Blueprint Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('reference')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              viewMode === 'reference' 
                ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Production reference blueprints with latency budgets"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reference Architectures</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('principles')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              viewMode === 'principles' 
                ? 'bg-[#E5E795] text-black font-bold shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Core engineering principles of production ML"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Golden Principles</span>
          </button>
        </div>
      </div>

      {/* ── MODE 1: PROBLEM SIMULATOR (GAME PLAY) ──────────────────────── */}
      {viewMode === 'simulator' && (
        <div className="space-y-6">
          {/* Draggable Problems Level Select Carousel Shelf */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Challenge Levels ({problems.length})
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  • Drag cards to scroll or click to play
                </span>
              </div>

              {/* Shelf Scroll Arrows */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="p-1.5 rounded-lg bg-card hover:bg-secondary border border-border text-foreground transition-colors cursor-pointer"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="p-1.5 rounded-lg bg-card hover:bg-secondary border border-border text-foreground transition-colors cursor-pointer"
                  title="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Draggable Horizontal Carousel Container */}
            <div
              ref={carouselRef}
              onMouseDown={handleCarouselMouseDown}
              onMouseMove={handleCarouselMouseMove}
              onMouseUp={handleCarouselMouseUpOrLeave}
              onMouseLeave={handleCarouselMouseUpOrLeave}
              className={`flex gap-3.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin select-none ${
                isDraggingCarousel ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ scrollBehavior: isDraggingCarousel ? 'auto' : 'smooth' }}
            >
              {problems.map((p, idx) => {
                const isActive = p.id === selectedProblemId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (!isDraggingCarousel) {
                        setSelectedProblemId(p.id);
                      }
                    }}
                    className={`shrink-0 w-56 sm:w-64 p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group ${
                      isActive
                        ? 'bg-card border-[#E5E795] ring-2 ring-[#E5E795]/40 shadow-md shadow-[#E5E795]/15'
                        : 'bg-card hover:bg-secondary/40 border-border hover:border-border/90 shadow-2xs'
                    }`}
                  >
                    {/* Top Level Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1.5 text-[9px] font-mono leading-none">
                        <span className="text-muted-foreground uppercase font-bold truncate">
                          0{idx + 1} • {p.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full font-bold border ${getDifficultyBadge(p.difficulty)}`}>
                          {p.difficulty}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold font-display text-foreground group-hover:text-indigo-600 dark:group-hover:text-[#E5E795] transition-colors leading-tight truncate" title={p.title}>
                        {p.title}
                      </h4>

                      <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                        {p.summary}
                      </p>
                    </div>

                    {/* Stats Strip */}
                    <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="font-semibold text-foreground">{(p.targetQps / 1000).toFixed(0)}k</span> QPS
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">&lt;{p.maxLatencyMs}ms</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProblemId(p.id);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'bg-[#E5E795] text-black shadow-xs font-black'
                            : 'bg-secondary hover:bg-secondary/90 text-foreground'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5 stroke-[2.5]" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Play</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulator Island */}
          <div className="relative z-10">
            <SystemDesignSimulator
              initialProblems={problems}
              selectedProblemId={selectedProblemId}
              onSelectProblem={setSelectedProblemId}
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-3xl bg-card border border-border space-y-2.5 shadow-xs">
              <div className="size-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground font-display">Real-Time Traffic Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">
                Topological load propagation powered by Kahn's algorithm. Adjust offered QPS from 1,000 to 250,000 requests/sec with smart load balancer splitting and cache hit deductions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-2.5 shadow-xs">
              <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground font-display">5-Pillar Interview Scoring</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">
                Evaluates your architecture like a Principal Engineer across Scalability, Reliability / SPOF detection, Latency Budget SLA, Cost Efficiency, and Layered Decoupling.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-2.5 shadow-xs">
              <div className="size-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground font-display">35+ Infrastructure Blocks</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">
                Stateless app servers, Redis clusters, read replicas, Kafka message queues, vector databases, and vLLM GPU inference nodes with real latency specs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: AWS BLUEPRINT LAB (PUZZLE GAME) ───────────────────── */}
      {viewMode === 'puzzle' && (
        <div id="blueprint-lab" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#E5E795]/20 border border-[#E5E795]/40 flex items-center justify-center text-slate-900 dark:text-[#E5E795]">
                <Boxes className="w-4 h-4 text-indigo-600 dark:text-[#E5E795]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-display">
                  Interactive System Design Blueprint Lab
                </h2>
                <p className="text-xs text-muted-foreground font-mono">
                  Assemble AWS architectural nodes in valid execution sequence to earn XP
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto font-semibold">
              ● Hands-on Simulator
            </span>
          </div>

          <PipelinePuzzleLab scenarios={scenarios} />
        </div>
      )}

      {/* ── MODE 3: PRODUCTION REFERENCE ARCHITECTURES ─────────────────── */}
      {viewMode === 'reference' && (
        <div id="reference-architectures" className="space-y-6">
          <div className="space-y-1 border-b border-border pb-3">
            <div className="text-xs font-mono text-indigo-600 dark:text-[#E5E795] uppercase tracking-wider font-semibold">
              Architectural Blueprints
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground tracking-tight">
              Production Reference Architectures
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl font-body">
              Battle-tested system blueprints designed to meet extreme enterprise latency budgets, high availability requirements, and data governance standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {architectures.map((arch) => (
              <div 
                key={arch.id}
                className="p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-border/80 transition-all flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden group"
              >
                {/* Top decorative accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-[#E5E795] opacity-70" />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-secondary border border-border text-indigo-600 dark:text-indigo-400 font-semibold">
                      {arch.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {arch.sla}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                      {arch.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-body">
                      {arch.summary}
                    </p>
                  </div>

                  {/* Visual Pipeline Dataflow: roadmap.sh Small Boxes */}
                  {arch.latencyBudget && arch.latencyBudget.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Network className="w-3 h-3 text-indigo-600 dark:text-[#E5E795]" />
                          <span>Execution Pipeline Dataflow</span>
                        </span>
                        <span className="text-indigo-600 dark:text-[#E5E795] font-bold">Total SLA: {arch.sla}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-muted/20 border border-border/80">
                        {arch.latencyBudget.map((stage, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            {/* roadmap.sh small box with just title */}
                            <div 
                              className="group/node relative rounded-lg border px-2 py-1 text-xs font-semibold shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer bg-card hover:bg-secondary border-border text-foreground flex items-center gap-1.5"
                              title={`${stage.step} (Latency: ${stage.latency})`}
                            >
                              <span className="size-1.5 rounded-full bg-[#E5E795] shrink-0"></span>
                              <span className="leading-tight text-[11px]">{stage.step}</span>
                              <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-secondary text-indigo-600 dark:text-[#E5E795] ml-0.5 shrink-0">
                                {stage.latency}
                              </span>
                            </div>

                            {/* Arrow connector */}
                            {Boolean(arch.latencyBudget && idx < arch.latencyBudget.length - 1) && (
                              <svg className="w-3 h-3 text-muted-foreground shrink-0 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Architectural Trade-off Note */}
                  {arch.coreTradeoff && (
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground space-y-0.5">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block font-mono text-[10px] uppercase tracking-wider">
                        Key System Trade-off:
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-body">
                        {arch.coreTradeoff}
                      </p>
                    </div>
                  )}
                </div>

                {/* AWS Components Stack Tags */}
                {arch.componentsUsed && arch.componentsUsed.length > 0 && (
                  <div className="pt-2 border-t border-border space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                      AWS Infrastructure Stack
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {arch.componentsUsed.map((comp, idx) => (
                        <span 
                          key={idx} 
                          className="rounded-md border px-2 py-0.5 text-[10px] font-medium font-mono bg-card border-border text-foreground hover:border-[#E5E795]/50 transition-colors shadow-2xs"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 4: GOLDEN PRINCIPLES ──────────────────────────────────── */}
      {viewMode === 'principles' && (
        <div id="golden-principles" className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-mono text-indigo-600 dark:text-[#E5E795] uppercase tracking-wider font-semibold">
              Design Rules of Thumb
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground tracking-tight">
              The 4 Golden Principles of Production ML
            </h2>
            <p className="text-xs text-muted-foreground font-body">
              Core engineering patterns applied across high-scale ML infrastructures at Google, Meta, and Netflix.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goldenPrinciples.map((principle) => (
              <div key={principle.number} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-muted/30 border border-border">
                <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-[#E5E795] shrink-0">
                  {principle.number}
                </span>
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground font-display">
                    {principle.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-body">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
