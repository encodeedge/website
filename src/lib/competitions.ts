import { getSourcesSettings } from './settings';

export type PlatformId = 'kaggle' | 'hackerrank' | 'drivendata' | 'huggingface' | 'zindi' | 'aicrowd' | 'custom';

export interface CompetitionPlatform {
  id: PlatformId;
  name: string;
  url: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
}

export interface Competition {
  id: string;
  title: string;
  slug: string;
  platform: PlatformId;
  platformName: string;
  url: string;
  description: string;
  problemStatement?: string;
  category: 'Computer Vision' | 'NLP & LLMs' | 'Tabular & Predictive' | 'Reinforcement Learning' | 'Audio & Speech' | 'Generative AI' | 'Multimodal';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prizePool: string;
  prizeAmountUSD?: number;
  rewardType: 'cash' | 'credits' | 'jobs' | 'knowledge';
  teamsCount: number;
  deadline: string; // ISO date string
  daysRemaining: number;
  status: 'active' | 'upcoming' | 'ending-soon' | 'completed';
  tags: string[];
  featured?: boolean;
  evaluationMetric?: string;
  datasetSize?: string;
  hostName: string;
}

export const PLATFORMS: Record<PlatformId, CompetitionPlatform> = {
  kaggle: {
    id: 'kaggle',
    name: 'Kaggle',
    url: 'https://www.kaggle.com/competitions',
    accentColor: '#20BEFF',
    badgeBg: 'bg-[#20BEFF]/10 border-[#20BEFF]/20',
    badgeText: 'text-[#0284c7] dark:text-[#38bdf8]',
    icon: 'K',
  },
  hackerrank: {
    id: 'hackerrank',
    name: 'HackerRank',
    url: 'https://www.hackerrank.com/contests',
    accentColor: '#00EA64',
    badgeBg: 'bg-[#00EA64]/10 border-[#00EA64]/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    icon: 'H',
  },
  drivendata: {
    id: 'drivendata',
    name: 'DrivenData',
    url: 'https://www.drivendata.org/competitions',
    accentColor: '#3B82F6',
    badgeBg: 'bg-blue-500/10 border-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400',
    icon: 'D',
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co',
    accentColor: '#FFD21E',
    badgeBg: 'bg-amber-500/10 border-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
    icon: '🤗',
  },
  zindi: {
    id: 'zindi',
    name: 'Zindi',
    url: 'https://zindi.africa/competitions',
    accentColor: '#FF5722',
    badgeBg: 'bg-orange-500/10 border-orange-500/20',
    badgeText: 'text-orange-600 dark:text-orange-400',
    icon: 'Z',
  },
  aicrowd: {
    id: 'aicrowd',
    name: 'AIcrowd',
    url: 'https://www.aicrowd.com/challenges',
    accentColor: '#8B5CF6',
    badgeBg: 'bg-purple-500/10 border-purple-500/20',
    badgeText: 'text-purple-600 dark:text-purple-400',
    icon: 'A',
  },
  custom: {
    id: 'custom',
    name: 'Partner Challenge',
    url: '/competitions',
    accentColor: '#E5E795',
    badgeBg: 'bg-primary/10 border-primary/20',
    badgeText: 'text-primary',
    icon: '⭐',
  },
};

/**
 * Curated registry of premier live & active AI/ML competitions
 */
export const ACTIVE_COMPETITIONS: Competition[] = [
  {
    id: 'kaggle-llm-reasoning-benchmark',
    title: 'Google & Kaggle: Complex Reasoning & Multimodal Prompt Recovery',
    slug: 'kaggle-llm-reasoning-benchmark',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions',
    description: 'Reverse-engineer generative prompts and train compact distilled models capable of high-fidelity multimodal reasoning on edge compute.',
    problemStatement: 'Given transformed target outputs and reference images, predict the original latent prompting structure and system instructions.',
    category: 'NLP & LLMs',
    difficulty: 'Advanced',
    prizePool: '$110,000',
    prizeAmountUSD: 110000,
    rewardType: 'cash',
    teamsCount: 2340,
    deadline: '2026-11-15T23:59:59Z',
    daysRemaining: 49,
    status: 'active',
    tags: ['LLMs', 'Prompt Engineering', 'PyTorch', 'Distillation', 'Transformers'],
    featured: true,
    evaluationMetric: 'Normalized BLEURT & Levenshtein Similarity',
    datasetSize: '24 GB JSONL',
    hostName: 'Google DeepMind & Kaggle',
  },
  {
    id: 'drivendata-bio-sentinel-radiation',
    title: 'NASA Deep Space: BioSentinel Biological Radiation Anomaly Detection',
    slug: 'drivendata-bio-sentinel-radiation',
    platform: 'drivendata',
    platformName: 'DrivenData',
    url: 'https://www.drivendata.org/competitions',
    description: 'Predict cellular damage and radiation flux incidents using real deep-space telemetry from NASA’s BioSentinel lunar mission.',
    problemStatement: 'Detect stochastic particle collision events from streaming multichannel optical density sensor logs under solar storm conditions.',
    category: 'Tabular & Predictive',
    difficulty: 'Intermediate',
    prizePool: '$55,000',
    prizeAmountUSD: 55000,
    rewardType: 'cash',
    teamsCount: 840,
    deadline: '2026-10-28T23:59:59Z',
    daysRemaining: 31,
    status: 'active',
    tags: ['NASA', 'Time Series', 'XGBoost', 'LightGBM', 'Sensor Analytics'],
    featured: true,
    evaluationMetric: 'Weighted Mean Absolute Error (MAE)',
    datasetSize: '4.8 GB Parquet',
    hostName: 'NASA Ames Research Center',
  },
  {
    id: 'hackerrank-ai-neural-heuristic-championship',
    title: 'HackerRank AI Championship: Autonomous Heuristics & Search Algorithms',
    slug: 'hackerrank-ai-neural-heuristic-championship',
    platform: 'hackerrank',
    platformName: 'HackerRank',
    url: 'https://www.hackerrank.com/contests',
    description: 'Design deep reinforcement learning agents and neural A* heuristic functions to solve dynamic multi-agent grid exploration problems.',
    problemStatement: 'Control multi-robot fleets navigating adversarial maze environments with partial observability and dynamic latency constraints.',
    category: 'Reinforcement Learning',
    difficulty: 'Advanced',
    prizePool: '$35,000 + Tech Interviews',
    prizeAmountUSD: 35000,
    rewardType: 'cash',
    teamsCount: 3120,
    deadline: '2026-10-18T23:59:59Z',
    daysRemaining: 21,
    status: 'active',
    tags: ['Reinforcement Learning', 'Graph Neural Networks', 'A* Search', 'PPO', 'Algorithms'],
    featured: true,
    evaluationMetric: 'Cumulative Reward & Path Optimization Efficiency',
    datasetSize: 'Interactive Simulation API',
    hostName: 'HackerRank & Enterprise Partners',
  },
  {
    id: 'kaggle-rsna-cranial-imaging',
    title: 'RSNA: 3D Volumetric Brain Microhemorrhage Segmentation',
    slug: 'kaggle-rsna-cranial-imaging',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions',
    description: 'Develop production-ready 3D Vision architectures to segment subtle intracranial bleeding across diverse clinical CT modalities.',
    problemStatement: 'Accurately contour millimeter-scale hematomas across non-contrast cranial CT volumes with severe class imbalance.',
    category: 'Computer Vision',
    difficulty: 'Expert',
    prizePool: '$80,000',
    prizeAmountUSD: 80000,
    rewardType: 'cash',
    teamsCount: 1650,
    deadline: '2026-11-04T23:59:59Z',
    daysRemaining: 38,
    status: 'active',
    tags: ['Computer Vision', '3D U-Net', 'PyTorch', 'Medical AI', 'DICOM'],
    featured: false,
    evaluationMetric: 'Surface Dice Metric & Volumetric Overlap',
    datasetSize: '145 GB DICOM / NIfTI',
    hostName: 'Radiological Society of North America',
  },
  {
    id: 'hf-open-llm-efficiency',
    title: 'Hugging Face: Sub-4B Parameter Edge Reasoning Benchmark',
    slug: 'hf-open-llm-efficiency',
    platform: 'huggingface',
    platformName: 'Hugging Face',
    url: 'https://huggingface.co/spaces',
    description: 'Fine-tune open-weights models strictly under 4 Billion parameters to achieve maximum reasoning accuracy on GSM8K and HumanEval.',
    problemStatement: 'Quantize and distill reasoning capabilities into compact architectures runnable on consumer edge hardware with <8GB VRAM.',
    category: 'NLP & LLMs',
    difficulty: 'Intermediate',
    prizePool: '$25,000 + 10k H100 Credits',
    prizeAmountUSD: 25000,
    rewardType: 'credits',
    teamsCount: 970,
    deadline: '2026-10-12T23:59:59Z',
    daysRemaining: 15,
    status: 'ending-soon',
    tags: ['Quantization', 'Hugging Face', 'PEFT', 'LoRA', 'Edge AI'],
    featured: false,
    evaluationMetric: 'Token Throughput vs. Aggregate Benchmark Accuracy',
    datasetSize: 'Open Math & Code Corpora',
    hostName: 'Hugging Face Community',
  },
  {
    id: 'zindi-african-agro-drone-cv',
    title: 'Zindi: Sub-Saharan Crop Disease Detection via Multispectral Drone Imagery',
    slug: 'zindi-african-agro-drone-cv',
    platform: 'zindi',
    platformName: 'Zindi',
    url: 'https://zindi.africa/competitions',
    description: 'Diagnose bacterial blight and fungal crop infections across smallholder agricultural fields using ultra-high-resolution drone imagery.',
    problemStatement: 'Perform multi-class semantic segmentation under varying sunlight, shadow artifacts, and seasonal canopy changes.',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    prizePool: '$15,000',
    prizeAmountUSD: 15000,
    rewardType: 'cash',
    teamsCount: 520,
    deadline: '2026-10-30T23:59:59Z',
    daysRemaining: 33,
    status: 'active',
    tags: ['YOLOv10', 'Drone Vision', 'Agriculture AI', 'Computer Vision', 'PyTorch'],
    featured: false,
    evaluationMetric: 'Mean Average Precision (mAP@0.5:0.95)',
    datasetSize: '18 GB TIFF',
    hostName: 'CGIAR & African AgTech Alliance',
  },
  {
    id: 'drivendata-methane-plume-geospatial',
    title: 'Climate Trace: Super-Emitter Methane Plume Spatial Localization',
    slug: 'drivendata-methane-plume-geospatial',
    platform: 'drivendata',
    platformName: 'DrivenData',
    url: 'https://www.drivendata.org/competitions',
    description: 'Pinpoint pinpoint industrial methane leaks and pipeline emissions from European Space Agency Sentinel-5P hyperspectral observations.',
    problemStatement: 'Distinguish true atmospheric gas column density anomalies from surface albedo noise and cloud interference.',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    prizePool: '$60,000',
    prizeAmountUSD: 60000,
    rewardType: 'cash',
    teamsCount: 710,
    deadline: '2026-11-20T23:59:59Z',
    daysRemaining: 54,
    status: 'active',
    tags: ['Climate AI', 'Geospatial', 'Satellite Imaging', 'Convolutional Nets', 'PyTorch'],
    featured: false,
    evaluationMetric: 'Intersection over Union (IoU) & F1 Score',
    datasetSize: '32 GB GeoTIFF',
    hostName: 'Rocky Mountain Institute & Climate TRACE',
  },
  {
    id: 'kaggle-tabular-playground-regression',
    title: 'Kaggle Grandmaster Tabular Series: High-Dimensional Continuous Yield',
    slug: 'kaggle-tabular-playground-regression',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions',
    description: 'A pure algorithmic showdown on massive synthetic continuous numerical data featuring complex non-linear feature interactions.',
    problemStatement: 'Engineered for rapid iteration: test stacking, blending, CatBoost tuning, and neural tabular architectures on 1M+ rows.',
    category: 'Tabular & Predictive',
    difficulty: 'Beginner',
    prizePool: 'Kaggle Tier Points & Medals',
    rewardType: 'knowledge',
    teamsCount: 3890,
    deadline: '2026-10-08T23:59:59Z',
    daysRemaining: 11,
    status: 'ending-soon',
    tags: ['Tabular', 'CatBoost', 'XGBoost', 'Feature Engineering', 'Scikit-Learn'],
    featured: false,
    evaluationMetric: 'Root Mean Squared Logarithmic Error (RMSLE)',
    datasetSize: '1.2 GB CSV',
    hostName: 'Kaggle Community',
  },
  {
    id: 'hackerrank-credit-risk-graph-ml',
    title: 'Global Fintech Challenge: Fraud Ring Detection with Graph Neural Networks',
    slug: 'hackerrank-credit-risk-graph-ml',
    platform: 'hackerrank',
    platformName: 'HackerRank',
    url: 'https://www.hackerrank.com/contests',
    description: 'Detect coordinated money laundering circles and fraudulent borrower syndicates across large-scale financial transaction graphs.',
    problemStatement: 'Construct dynamic heterogeneous graph embeddings to identify collusive node clusters in near real-time streaming data.',
    category: 'Tabular & Predictive',
    difficulty: 'Expert',
    prizePool: '$30,000 + Job Fast-Track',
    prizeAmountUSD: 30000,
    rewardType: 'cash',
    teamsCount: 1450,
    deadline: '2026-11-10T23:59:59Z',
    daysRemaining: 44,
    status: 'active',
    tags: ['Graph ML', 'PyTorch Geometric', 'Fraud Detection', 'NetworkX', 'DGL'],
    featured: false,
    evaluationMetric: 'PR-AUC (Precision-Recall Area Under Curve)',
    datasetSize: '12 GB Edge-List Graph',
    hostName: 'Fintech Open Consortium',
  },
  {
    id: 'aicrowd-neural-mmo-ecosystem',
    title: 'AIcrowd: Neural MMO Ecosystem Multi-Agent Survival Challenge',
    slug: 'aicrowd-neural-mmo-ecosystem',
    platform: 'aicrowd',
    platformName: 'AIcrowd',
    url: 'https://www.aicrowd.com/challenges',
    description: 'Train diverse populations of reinforcement learning agents in a persistent massively multiplayer virtual ecosystem.',
    problemStatement: 'Optimize long-horizon survival strategies, cooperative trading behavior, and tactical resource combat against competing algorithms.',
    category: 'Reinforcement Learning',
    difficulty: 'Expert',
    prizePool: '$20,000 + Compute Grants',
    prizeAmountUSD: 20000,
    rewardType: 'credits',
    teamsCount: 430,
    deadline: '2026-11-28T23:59:59Z',
    daysRemaining: 62,
    status: 'active',
    tags: ['Reinforcement Learning', 'Multi-Agent', 'Ray / RLlib', 'PyTorch', 'Simulations'],
    featured: false,
    evaluationMetric: 'Elo Rating & Survival Epoch Duration',
    datasetSize: 'Python Environment Gym',
    hostName: 'MIT & Neural MMO Project',
  },
  {
    id: 'hf-multimodal-medical-vqa',
    title: 'Hugging Face: Multimodal Clinical Visual Question Answering',
    slug: 'hf-multimodal-medical-vqa',
    platform: 'huggingface',
    platformName: 'Hugging Face',
    url: 'https://huggingface.co/spaces',
    description: 'Train open vision-language models (VLMs) capable of answering diagnostic pathology and radiology queries with verified attribution.',
    problemStatement: 'Generate clinically factual answers to complex visual queries while minimizing hallucinations and generating citation bounding boxes.',
    category: 'Multimodal',
    difficulty: 'Advanced',
    prizePool: '$22,000',
    prizeAmountUSD: 22000,
    rewardType: 'cash',
    teamsCount: 680,
    deadline: '2026-10-25T23:59:59Z',
    daysRemaining: 28,
    status: 'active',
    tags: ['VLM', 'Vision-Language', 'Medical AI', 'Llava', 'Transformers'],
    featured: false,
    evaluationMetric: 'Clinical Factuality Score & Hallucination Penalty',
    datasetSize: '50k VQA Pairs + Images',
    hostName: 'Biomedical AI Research Collective',
  },
  {
    id: 'zindi-nlp-swahili-sentiment',
    title: 'Zindi: Swahili & African Dialect Audio Sentiment Classification',
    slug: 'zindi-nlp-swahili-sentiment',
    platform: 'zindi',
    platformName: 'Zindi',
    url: 'https://zindi.africa/competitions',
    description: 'Fine-tune self-supervised speech foundation models to classify tone, sentiment, and intent in conversational Swahili voice notes.',
    problemStatement: 'Handle low-resource linguistic nuances, background ambient market noise, and code-switching between Swahili and English.',
    category: 'Audio & Speech',
    difficulty: 'Intermediate',
    prizePool: '$10,000',
    prizeAmountUSD: 10000,
    rewardType: 'cash',
    teamsCount: 390,
    deadline: '2026-10-16T23:59:59Z',
    daysRemaining: 19,
    status: 'active',
    tags: ['Wav2Vec2', 'Whisper', 'Audio ML', 'Speech Processing', 'PyTorch'],
    featured: false,
    evaluationMetric: 'Multi-class Weighted Macro F1',
    datasetSize: '40 Hours Audio WAV',
    hostName: 'African NLP Network',
  },
];

/**
 * Helper to compute platform and aggregate stats
 */
export function getCompetitionsStats(competitions: Competition[] = ACTIVE_COMPETITIONS) {
  const totalCount = competitions.length;
  const activeCount = competitions.filter((c) => c.status === 'active').length;
  const endingSoonCount = competitions.filter((c) => c.status === 'ending-soon').length;
  const completedCount = competitions.filter((c) => c.status === 'completed').length;
  const totalTeams = competitions.reduce((acc, c) => acc + c.teamsCount, 0);

  // Compute total tracked prize pool in USD
  const totalPrizeUSD = competitions.reduce((acc, c) => acc + (c.prizeAmountUSD || 0), 0);

  const platformCounts: Record<string, number> = {};
  for (const c of competitions) {
    platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
  }

  const categoryCounts: Record<string, number> = {};
  for (const c of competitions) {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  }

  return {
    totalCount,
    activeCount,
    endingSoonCount,
    completedCount,
    totalTeams,
    totalPrizeUSD,
    platformCounts,
    categoryCounts,
  };
}

/**
 * Load competitions respecting Keystatic platform sources settings and custom curated items.
 */
export async function getAggregatedCompetitions(
  keystaticCompetitions?: Competition[]
): Promise<{ competitions: Competition[]; sourcesSettings: any }> {
  try {
    const sourcesConfig = await getSourcesSettings().catch(() => null);
    const enabledPlatforms = new Map<string, number>();

    if (sourcesConfig?.competitionSources && sourcesConfig.competitionSources.length > 0) {
      for (const p of sourcesConfig.competitionSources) {
        if (p.enabled) {
          enabledPlatforms.set(p.platformId, p.fetchLimit || 6);
        }
      }
    } else {
      // Default all platforms enabled
      for (const key of Object.keys(PLATFORMS)) {
        enabledPlatforms.set(key, 6);
      }
    }

    // Filter standard registry challenges by enabled platforms and platform limits
    const platformCounts: Record<string, number> = {};
    const filteredRegistry = ACTIVE_COMPETITIONS.filter((comp) => {
      if (!enabledPlatforms.has(comp.platform)) return false;
      const limit = enabledPlatforms.get(comp.platform) || 6;
      platformCounts[comp.platform] = (platformCounts[comp.platform] || 0) + 1;
      return platformCounts[comp.platform] <= limit;
    });

    // Merge Keystatic curated items if any
    const allCombined = [...(keystaticCompetitions || []), ...filteredRegistry];

    // Deduplicate by id and normalize real-time expiration
    const seen = new Set<string>();
    const deduplicated: Competition[] = [];
    const now = new Date();

    for (const c of allCombined) {
      if (!seen.has(c.id)) {
        seen.add(c.id);

        let daysRemaining = c.daysRemaining;
        let status = c.status;

        if (c.deadline) {
          const deadlineDate = new Date(c.deadline);
          if (!isNaN(deadlineDate.getTime())) {
            const diffTime = deadlineDate.getTime() - now.getTime();
            const isPast = diffTime <= 0;
            daysRemaining = isPast ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (isPast) {
              status = 'completed';
            } else if (daysRemaining <= 7) {
              status = 'ending-soon';
            }
          }
        }

        deduplicated.push({
          ...c,
          daysRemaining,
          status,
        });
      }
    }

    const maxDisplay = sourcesConfig?.displaySettings.maxCompetitionsDisplay || 24;
    return {
      competitions: deduplicated.slice(0, maxDisplay),
      sourcesSettings: sourcesConfig,
    };
  } catch (err) {
    console.warn('[Competitions] Failed to load aggregated competitions, using registry:', err);
    return {
      competitions: ACTIVE_COMPETITIONS,
      sourcesSettings: null,
    };
  }
}
