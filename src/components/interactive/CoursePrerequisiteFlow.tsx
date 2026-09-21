import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Compass, Sparkles, BookOpen, GraduationCap, Target } from 'lucide-react';

interface PrerequisiteNode {
  title: string;
  type: 'prerequisite' | 'current' | 'next';
  status: 'recommended' | 'active' | 'future';
  description: string;
  url?: string;
}

interface CourseFlowConfig {
  courseId: string;
  prerequisites: PrerequisiteNode[];
  coreModules: PrerequisiteNode[];
  nextSteps: PrerequisiteNode[];
}

const FLOW_CONFIGS: Record<string, CourseFlowConfig> = {
  'applied-deep-learning': {
    courseId: 'applied-deep-learning',
    prerequisites: [
      {
        title: 'Python for AI & Memory',
        type: 'prerequisite',
        status: 'recommended',
        description: 'Object references, slicing, vectorization, NumPy broadcasting.',
        url: '/courses/python-mastery-for-ai'
      },
      {
        title: 'Linear Algebra & Calculus',
        type: 'prerequisite',
        status: 'recommended',
        description: 'Matrix dot products, partial derivatives, chain rule fundamentals.',
        url: '/roadmaps/data-science'
      }
    ],
    coreModules: [
      {
        title: 'Deep Foundations & Perceptrons',
        type: 'current',
        status: 'active',
        description: 'Deriving backprop from scratch and gradient descent mechanics.'
      },
      {
        title: 'CNNs & Residual Networks',
        type: 'current',
        status: 'active',
        description: 'Spatial feature hierarchies, convolutions, and transfer learning.'
      },
      {
        title: 'Transformers & Self-Attention',
        type: 'current',
        status: 'active',
        description: 'Scaled dot-product attention, multi-head projections, and decoding blocks.'
      }
    ],
    nextSteps: [
      {
        title: 'Production RAG & LLMs',
        type: 'next',
        status: 'future',
        description: 'Vector databases, dense embeddings, hybrid search, and LangChain/LlamaIndex agents.',
        url: '/courses/practical-rag-and-llm-engineering'
      },
      {
        title: 'Autonomous Multi-Agent Systems',
        type: 'next',
        status: 'future',
        description: 'Tool use, self-reflection loops, and distributed model serving.',
        url: '/roadmaps/artificial-intelligence'
      }
    ]
  },
  'foundations-of-machine-learning': {
    courseId: 'foundations-of-machine-learning',
    prerequisites: [
      {
        title: 'Basic Python Syntax',
        type: 'prerequisite',
        status: 'recommended',
        description: 'Variables, loops, functions, and list comprehensions.',
        url: '/roadmaps/python'
      }
    ],
    coreModules: [
      {
        title: 'Supervised vs Unsupervised',
        type: 'current',
        status: 'active',
        description: 'Problem framing, train/val/test splits, and baseline evaluation.'
      },
      {
        title: 'Linear Regression & Cost Surfaces',
        type: 'current',
        status: 'active',
        description: 'Ordinary least squares, gradient descent optimization, and MSE.'
      },
      {
        title: 'Regularization & Bias-Variance',
        type: 'current',
        status: 'active',
        description: 'L1/L2 penalties, overfitting mitigation, and cross-validation.'
      }
    ],
    nextSteps: [
      {
        title: 'Applied Deep Learning',
        type: 'next',
        status: 'future',
        description: 'Neural networks, PyTorch tensors, backprop, and Transformers.',
        url: '/courses/applied-deep-learning'
      },
      {
        title: 'Modern Python for AI Systems',
        type: 'next',
        status: 'future',
        description: 'CPython internals, generators, GIL, and high-performance concurrency.',
        url: '/courses/python-mastery-for-ai'
      }
    ]
  },
  'python-mastery-for-ai': {
    courseId: 'python-mastery-for-ai',
    prerequisites: [
      {
        title: 'Introductory Programming',
        type: 'prerequisite',
        status: 'recommended',
        description: 'Basic control flow, scripts, and package management with pip.',
        url: '/roadmaps/python'
      }
    ],
    coreModules: [
      {
        title: 'CPython Memory & References',
        type: 'current',
        status: 'active',
        description: 'Stack vs heap, small integer interning, mutable traps, and ob_refcnt.'
      },
      {
        title: 'Type Hierarchy & Dunder Protocol',
        type: 'current',
        status: 'active',
        description: 'Metaclasses, descriptors, slots, and object-oriented architectures.'
      },
      {
        title: 'Generators & Coroutines',
        type: 'current',
        status: 'active',
        description: 'Lazy streaming, asyncio event loops, and producer-consumer pipelines.'
      }
    ],
    nextSteps: [
      {
        title: 'Applied Deep Learning with PyTorch',
        type: 'next',
        status: 'future',
        description: 'CUDA acceleration, custom autograd Functions, and dataset loaders.',
        url: '/courses/applied-deep-learning'
      },
      {
        title: 'High-Throughput ML Microservices',
        type: 'next',
        status: 'future',
        description: 'FastAPI, asynchronous inference batching, and Docker containerization.',
        url: '/roadmaps/data-science'
      }
    ]
  },
  'practical-rag-and-llm-engineering': {
    courseId: 'practical-rag-and-llm-engineering',
    prerequisites: [
      {
        title: 'Python for AI',
        type: 'prerequisite',
        status: 'recommended',
        description: 'Async programming, API interaction, and JSON serialization.',
        url: '/courses/python-mastery-for-ai'
      },
      {
        title: 'Vector Foundations',
        type: 'prerequisite',
        status: 'recommended',
        description: 'Dot products, cosine similarity, and matrix projections.',
        url: '/courses/foundations-of-machine-learning'
      }
    ],
    coreModules: [
      {
        title: 'Dense Embeddings & Chunking',
        type: 'current',
        status: 'active',
        description: 'Context windows, semantic chunking algorithms, and token budgeting.'
      },
      {
        title: 'Vector Indexing & HNSW',
        type: 'current',
        status: 'active',
        description: 'Pinecone, ChromaDB, hybrid BM25 + dense search, and reciprocal rank fusion.'
      },
      {
        title: 'Autonomous LLM Agents',
        type: 'current',
        status: 'active',
        description: 'Tool binding, plan-and-solve loops, structured outputs, and evaluation.'
      }
    ],
    nextSteps: [
      {
        title: 'Applied Deep Learning & Fine-Tuning',
        type: 'next',
        status: 'future',
        description: 'LoRA, QLoRA, parameter-efficient fine-tuning, and DPO alignment.',
        url: '/courses/applied-deep-learning'
      },
      {
        title: 'Frontier AI Roadmap',
        type: 'next',
        status: 'future',
        description: 'Explore full artificial intelligence career competencies.',
        url: '/roadmaps/artificial-intelligence'
      }
    ]
  }
};

export const CoursePrerequisiteFlow: React.FC<{ courseId: string }> = ({ courseId }) => {
  const config = FLOW_CONFIGS[courseId] || FLOW_CONFIGS['applied-deep-learning'];

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Compass className="size-5" />
          </div>
          <div>
            <h3 className="font-bold font-display text-lg text-foreground">Learning Path &amp; Prerequisite Graph</h3>
            <p className="text-xs text-muted-foreground font-body">
              How this course connects to your end-to-end engineering career.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/60"></span>
            Prerequisites
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary"></span>
            Current Course
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-purple-500"></span>
            Next Specializations
          </span>
        </div>
      </div>

      {/* 3-Column Roadmap Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* Step 1: Prerequisites */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground font-mono">1</span>
            <span>Recommended Foundations</span>
          </div>

          <div className="space-y-3">
            {config.prerequisites.map((node, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border/80 bg-muted/20 hover:border-border transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold font-display text-foreground">{node.title}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    Prep
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
                {node.url && (
                  <a href={node.url} className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline pt-1">
                    <span>Review module</span>
                    <ArrowRight className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Current Course Modules */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-mono">2</span>
            <span>This Course Focus</span>
          </div>

          <div className="space-y-3">
            {config.coreModules.map((node, i) => (
              <div key={i} className="p-4 rounded-2xl border-2 border-primary/40 bg-primary/5 hover:border-primary/60 transition-colors space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold font-display text-foreground">{node.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    In Progress
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Next Career Specializations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <span className="size-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-mono">3</span>
            <span>Next Target Specializations</span>
          </div>

          <div className="space-y-3">
            {config.nextSteps.map((node, i) => (
              <div key={i} className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold font-display text-foreground">{node.title}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    Next Up
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
                {node.url && (
                  <a href={node.url} className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-1">
                    <span>Explore specialization</span>
                    <ArrowRight className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

