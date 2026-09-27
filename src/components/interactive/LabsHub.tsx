import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  BookOpen, 
  Cpu, 
  Activity, 
  Layers, 
  Network, 
  TrendingDown, 
  HardDrive, 
  Scale, 
  Sparkles,
  ExternalLink,
  Search,
  ArrowRight
} from 'lucide-react';
import { AttentionVisualizer } from './AttentionVisualizer';
import { ConvolutionVisualizer } from './ConvolutionVisualizer';
import { NeuralPlayground } from './NeuralPlayground';
import { GradientDescentLab } from './GradientDescentLab';
import { MemoryExplorer } from './MemoryExplorer';
import { ModelRouterLab } from './ModelRouterLab';
import { MathDecoder } from './MathDecoder';

export interface LabMeta {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  simulatorType?: string;
  description: string;
  badge: string;
  lessonPath?: string;
  lessonTitle?: string;
}

interface LabsHubProps {
  labs?: LabMeta[];
  glossaryItems?: any[];
}

const DEFAULT_LABS: LabMeta[] = [
  {
    id: 'attention-visualizer',
    title: 'Transformer Self-Attention & Heatmap Visualizer',
    shortTitle: 'Attention Visualizer',
    category: 'Deep Learning',
    simulatorType: 'attention-visualizer',
    description: 'Tune softmax temperature, inspect query-key vector alignment, and visualize N×N self-attention weight heatmaps across multi-head projections.',
    badge: 'Transformers & LLMs',
    lessonPath: '/lessons/dl-transformers-attention',
    lessonTitle: 'Scaled Dot-Product Attention'
  },
  {
    id: 'convolution-visualizer',
    title: '2D Convolution Kernel & Feature Map Explorer',
    shortTitle: '2D Convolution Lab',
    category: 'Computer Vision',
    simulatorType: 'convolution-visualizer',
    description: 'Slide 3×3 Sobel, Gaussian, and Sharpen spatial filters across 2D receptive fields to trace live element-wise dot products and ReLU activation.',
    badge: 'Vision & CNNs',
    lessonPath: '/lessons/dl-cnn-architectures',
    lessonTitle: 'CNN Architectures & ResNets'
  },
  {
    id: 'model-router',
    title: 'Model Router & Context-Cost Pareto Explorer',
    shortTitle: 'Model Router & Pareto',
    category: 'System Design',
    simulatorType: 'model-router',
    description: 'Calculate production inference bills across DeepSeek, Claude, GPT, Gemini, and Llama to map the optimal cost-context Pareto frontier.',
    badge: 'Inference & Systems',
  },
  {
    id: 'neural-playground',
    title: 'Neural Network & Activation Playground',
    shortTitle: 'Neural Playground',
    category: 'Deep Learning',
    simulatorType: 'neural-playground',
    description: 'Tune hidden layer depths, toggle Sigmoid vs ReLU vs Tanh activations, and watch non-linear 2D classification decision boundaries converge.',
    badge: 'MLP & Activations',
    lessonPath: '/lessons/dl-interactive-lab',
    lessonTitle: 'Deep Learning Interactive Lab'
  },
  {
    id: 'gradient-descent',
    title: 'Loss Surface & Gradient Descent Optimizer Lab',
    shortTitle: 'Gradient Descent Lab',
    category: 'Optimization',
    simulatorType: 'gradient-descent',
    description: 'Step along 3D loss contours, tune learning rates, compare SGD vs Momentum vs Adam dynamics, and observe convergence velocity.',
    badge: 'Calculus & Optimization',
    lessonPath: '/lessons/ml-interactive-lab',
    lessonTitle: 'Machine Learning Interactive Lab'
  },
  {
    id: 'memory-explorer',
    title: 'CPython Memory & Stack/Heap Reference Explorer',
    shortTitle: 'Memory Explorer',
    category: 'Python Internals',
    simulatorType: 'memory-explorer',
    description: 'Trace PyObject headers, reference counting (ob_refcnt), pointer addresses, integer caching, and cyclic garbage collection mechanisms.',
    badge: 'CPython Runtime',
    lessonPath: '/lessons/py-memory-management',
    lessonTitle: 'Python Memory Management'
  }
];

export const LabsHub: React.FC<LabsHubProps> = ({ labs, glossaryItems }) => {
  const labsCatalog = labs && labs.length > 0 ? labs : DEFAULT_LABS;
  const [activeMainTab, setActiveMainTab] = useState<'simulators' | 'decoder'>('simulators');
  const [selectedLabId, setSelectedLabId] = useState<string>(labsCatalog[0]?.id || 'attention-visualizer');

  // Handle URL hash navigation on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'math-decoder' || hash === 'glossary') {
        setActiveMainTab('decoder');
      } else if (labsCatalog.some(l => l.id === hash)) {
        setActiveMainTab('simulators');
        setSelectedLabId(hash);
      }
    }
  }, [labsCatalog]);

  const activeLabMeta = labsCatalog.find(l => l.id === selectedLabId) || labsCatalog[0];

  const handleLaunchFromDecoder = (labId: string) => {
    setActiveMainTab('simulators');
    setSelectedLabId(labId);
    window.location.hash = labId;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Main Mode Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <FlaskConical className="size-3.5" />
                EncodeEdge Labs
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Interactive Engineering & Research Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground">
              Interactive AI Simulators & Notation Decoder
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-body leading-relaxed">
              Explore deep learning mechanics, spatial convolutions, transformer attention heatmaps, and mathematical notation with real-time visual controls.
            </p>
          </div>

          {/* Main Tab Toggle: Simulators vs Math Decoder */}
          <div className="p-1.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => { setActiveMainTab('simulators'); window.location.hash = selectedLabId; }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeMainTab === 'simulators'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FlaskConical className="size-4 text-primary" />
              <span>Interactive Simulators ({labsCatalog.length})</span>
            </button>

            <button
              onClick={() => { setActiveMainTab('decoder'); window.location.hash = 'math-decoder'; }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeMainTab === 'decoder'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="size-4 text-primary" />
              <span>Math Decoder & Glossary</span>
            </button>
          </div>
        </div>

        {/* If in Simulators mode, show the horizontal lab selector tabs */}
        {activeMainTab === 'simulators' && (
          <div className="pt-4 border-t border-border/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">Select Simulation Lab:</span>
              <span>Available in browser & within course lessons</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {labsCatalog.map((lab) => {
                const isSelected = lab.id === selectedLabId;

                return (
                  <button
                    key={lab.id}
                    onClick={() => { setSelectedLabId(lab.id); window.location.hash = lab.id; }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20'
                        : 'border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-border'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {lab.badge}
                    </div>
                    <div className={`text-xs font-bold font-display line-clamp-2 ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {lab.shortTitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {activeMainTab === 'simulators' ? (
        <div className="space-y-4">
          {/* Active Lab Context Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {activeLabMeta.category}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Lab ID: {activeLabMeta.id}
                </span>
              </div>
              <h2 className="text-lg font-bold font-display text-foreground mt-0.5">
                {activeLabMeta.title}
              </h2>
            </div>

            {activeLabMeta.lessonPath && (
              <a
                href={activeLabMeta.lessonPath}
                className="px-3.5 py-1.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>View inside lesson: {activeLabMeta.lessonTitle}</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            )}
          </div>

          {/* Render Active Component */}
          {(activeLabMeta.simulatorType === 'attention-visualizer' || activeLabMeta.id === 'attention-visualizer') && (
            <AttentionVisualizer />
          )}

          {(activeLabMeta.simulatorType === 'convolution-visualizer' || activeLabMeta.id === 'convolution-visualizer') && (
            <ConvolutionVisualizer />
          )}

          {(activeLabMeta.simulatorType === 'model-router' || activeLabMeta.id === 'model-router') && (
            <ModelRouterLab />
          )}

          {(activeLabMeta.simulatorType === 'neural-playground' || activeLabMeta.id === 'neural-playground') && (
            <NeuralPlayground />
          )}

          {(activeLabMeta.simulatorType === 'gradient-descent' || activeLabMeta.id === 'gradient-descent') && (
            <GradientDescentLab />
          )}

          {(activeLabMeta.simulatorType === 'memory-explorer' || activeLabMeta.id === 'memory-explorer') && (
            <MemoryExplorer />
          )}
        </div>
      ) : (
        /* Math Decoder View */
        <MathDecoder items={glossaryItems} onSelectLab={handleLaunchFromDecoder} />
      )}
    </div>
  );
};
