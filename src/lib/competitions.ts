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
    id: 'arc-prize-2026',
    title: 'ARC Prize 2026 - AGI Fluid Reasoning Benchmark',
    slug: 'arc-prize-2026',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions/arc-prize-2026',
    description: 'The premier benchmark to create AI systems capable of acquiring new skills, solving novel unseen visual reasoning grids, and exhibiting true fluid intelligence without pre-training memorization.',
    problemStatement: 'Predict transformation outputs for ARC test grids evaluated across private evaluation sets with multi-step symbolic and inductive reasoning.',
    category: 'NLP & LLMs',
    difficulty: 'Expert',
    prizePool: '$1,100,000 USD',
    prizeAmountUSD: 1100000,
    rewardType: 'cash',
    teamsCount: 2450,
    deadline: '2026-11-10',
    daysRemaining: 44,
    status: 'active',
    tags: ['AGI', 'Reasoning', 'Deep Learning', 'Program Synthesis', 'LLMs'],
    featured: true,
    evaluationMetric: 'Exact Match Accuracy on Private Test Grids (Top-3 submissions)',
    datasetSize: '1,000 Reasoning Grids',
    hostName: 'ARC Prize Foundation & François Chollet',
  },
  {
    id: 'drivendata-gems-geothermal',
    title: 'The Geologic Enhanced Mapping System (GEMS) Challenge',
    slug: 'drivendata-gems-geothermal',
    platform: 'drivendata',
    platformName: 'DrivenData',
    url: 'https://www.drivendata.org/competitions/gems-challenge',
    description: 'Accelerate geothermal clean energy exploration by identifying hidden fault lines and subsurface permeability pathways using multi-spectral satellite, gravimetric, and seismic telemetry.',
    problemStatement: 'Delineate blind geothermal subsurface faults from gravimetric, thermal infrared, and magnetic field observation rasters.',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    prizePool: '$300,000 USD',
    prizeAmountUSD: 300000,
    rewardType: 'cash',
    teamsCount: 940,
    deadline: '2026-11-30',
    daysRemaining: 64,
    status: 'active',
    tags: ['Geothermal', 'Clean Energy', 'Remote Sensing', 'Segmentation', 'Earth Science'],
    featured: true,
    evaluationMetric: 'Mean Intersection over Union (mIoU)',
    datasetSize: '45 GB GeoTIFF & HDF5',
    hostName: 'U.S. Department of Energy (DOE)',
  },
  {
    id: 'ai-agent-security',
    title: 'AI Agent Security - Multi-Step Tool Attacks',
    slug: 'ai-agent-security',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions/ai-agent-security',
    description: 'Develop defensive classifiers, monitor telemetry, and detect multi-step jailbreaks and unauthorized tool invocation in autonomous software engineering agents.',
    problemStatement: 'Flag malicious payloads across multi-turn tool-calling execution transcripts while maintaining low false-positive rates on normal enterprise workflows.',
    category: 'NLP & LLMs',
    difficulty: 'Advanced',
    prizePool: '$100,000 USD',
    prizeAmountUSD: 100000,
    rewardType: 'cash',
    teamsCount: 1180,
    deadline: '2026-12-01',
    daysRemaining: 65,
    status: 'active',
    tags: ['AI Agents', 'Cybersecurity', 'LLMs', 'Safety', 'Alignment'],
    featured: true,
    evaluationMetric: 'ROC-AUC / False Discovery Rate',
    datasetSize: '150k Tool Calling Transcripts',
    hostName: 'Google DeepMind & AI Safety Institute',
  },
  {
    id: 'biohub-cell-tracking',
    title: 'Biohub - Cell Tracking During Development',
    slug: 'biohub-cell-tracking',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions/biohub-cell-tracking',
    description: 'Reconstruct lineage trees and track individual cellular movements in 3D across developing zebrafish embryos captured with light-sheet volumetric microscopy.',
    problemStatement: 'Segment cell nuclei across sequential 3D volumes and link daughter cells through mitosis events over time.',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    prizePool: '$55,000 USD',
    prizeAmountUSD: 55000,
    rewardType: 'cash',
    teamsCount: 780,
    deadline: '2026-10-25',
    daysRemaining: 28,
    status: 'active',
    tags: ['Bioinformatics', '3D Vision', 'Segmentation', 'Microscopy', 'PyTorch'],
    featured: false,
    evaluationMetric: 'Tracking Accuracy (TRA) & Segmentation Jaccard Index',
    datasetSize: '120 GB Volumetric TIFF',
    hostName: 'Chan Zuckerberg Biohub',
  },
  {
    id: 'enveda-casmi-molecule-id',
    title: 'Enveda CASMI 2026 - Molecule ID From Mass Spectra',
    slug: 'enveda-casmi-molecule-id',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions/enveda-CASMI26-molecule-id-mass-spectra',
    description: 'Elucidate chemical structures and discover novel therapeutic natural compounds directly from high-resolution tandem mass spectra (MS/MS).',
    problemStatement: 'Map fragmentation spectrum fingerprints into SMILES representations and candidate chemical structures.',
    category: 'Tabular & Predictive',
    difficulty: 'Advanced',
    prizePool: '$50,000 USD',
    prizeAmountUSD: 50000,
    rewardType: 'cash',
    teamsCount: 620,
    deadline: '2026-12-14',
    daysRemaining: 78,
    status: 'active',
    tags: ['Chemistry', 'Drug Discovery', 'Graph Neural Networks', 'GNN', 'Mass Spectra'],
    featured: false,
    evaluationMetric: 'Tanimoto Similarity on Molecular Fingerprints',
    datasetSize: '35 GB Tandem MS/MS Spectra',
    hostName: 'Enveda Biosciences',
  },
  {
    id: 'huggingface-fast-gemma',
    title: 'Fast Gemma 4 Multi-Agent Collaboration Challenge',
    slug: 'huggingface-fast-gemma',
    platform: 'huggingface',
    platformName: 'Hugging Face',
    url: 'https://huggingface.co/spaces',
    description: 'Fine-tune and optimize Gemma lightweight open models for low-latency multi-agent orchestration on consumer hardware and browser WebGPU runtimes.',
    problemStatement: 'Benchmark cooperative agent reasoning with quantized weights under strict latency budgets (<100ms per token generation).',
    category: 'NLP & LLMs',
    difficulty: 'Advanced',
    prizePool: '$40,000 Compute Grants & Prizes',
    prizeAmountUSD: 40000,
    rewardType: 'credits',
    teamsCount: 890,
    deadline: '2026-11-15',
    daysRemaining: 49,
    status: 'active',
    tags: ['Gemma', 'Quantization', 'ONNX', 'WebGPU', 'LLMs'],
    featured: false,
    evaluationMetric: 'Inference Latency vs Multi-Turn Benchmark Accuracy',
    datasetSize: 'Open Math & Code Datasets',
    hostName: 'Google DeepMind & Hugging Face',
  },
  {
    id: 'pokemon-ptcg-ai-battle',
    title: 'The Pokémon Company - PTCG AI Battle Challenge',
    slug: 'pokemon-ptcg-ai-battle',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions/pokemon-ptcg-ai-battle',
    description: 'Train reinforcement learning agents to evaluate tactical card synergies, prize racing, and long-term resource management in the Pokémon Trading Card Game.',
    problemStatement: 'Submit Python agent bots evaluated in a round-robin Elo tournament with hidden information and stochastic card draws.',
    category: 'Reinforcement Learning',
    difficulty: 'Intermediate',
    prizePool: '$35,000 USD',
    prizeAmountUSD: 35000,
    rewardType: 'cash',
    teamsCount: 1420,
    deadline: '2026-11-18',
    daysRemaining: 52,
    status: 'active',
    tags: ['Reinforcement Learning', 'Game Theory', 'Simulation', 'Python'],
    featured: false,
    evaluationMetric: 'Elo Rating on Head-to-Head Simulation',
    datasetSize: 'Interactive Simulation Engine',
    hostName: 'The Pokémon Company International',
  },
  {
    id: 'huggingface-gradio-agents-mcp',
    title: 'Hugging Face Gradio Agents & MCP Hackathon',
    slug: 'huggingface-gradio-agents-mcp',
    platform: 'huggingface',
    platformName: 'Hugging Face',
    url: 'https://huggingface.co/spaces',
    description: 'Build interactive, tool-augmented agent applications hosted on Hugging Face Spaces implementing Anthropic’s Model Context Protocol (MCP).',
    problemStatement: 'Deploy open-source agents that integrate external tool registries, live sandboxes, and Gradio 5 interactive interfaces.',
    category: 'NLP & LLMs',
    difficulty: 'Intermediate',
    prizePool: '$30,000 GPU Grants & Hardware',
    prizeAmountUSD: 30000,
    rewardType: 'credits',
    teamsCount: 1850,
    deadline: '2026-10-31',
    daysRemaining: 34,
    status: 'active',
    tags: ['Model Context Protocol', 'Gradio', 'Agents', 'PyTorch', 'Spaces'],
    featured: true,
    evaluationMetric: 'Community Upvotes, Architecture Rigor & Execution Quality',
    datasetSize: 'Hugging Face Spaces SDK',
    hostName: 'Hugging Face & Anthropic',
  },
  {
    id: 'zindi-barbados-handwriting',
    title: 'R.O.A.D. Barbados Historic Handwriting OCR Challenge',
    slug: 'zindi-barbados-handwriting',
    platform: 'zindi',
    platformName: 'Zindi',
    url: 'https://zindi.africa/competitions/road-barbados-historic-handwriting-challenge',
    description: 'Digitize and transcribe centuries of colonial-era handwritten deeds, land registries, and historic ledgers using modern vision-language and OCR models.',
    problemStatement: 'High-fidelity line and character recognition on degraded, non-standard cursive manuscripts and aged paper textures.',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    prizePool: '$25,000 USD',
    prizeAmountUSD: 25000,
    rewardType: 'cash',
    teamsCount: 590,
    deadline: '2026-10-20',
    daysRemaining: 23,
    status: 'active',
    tags: ['OCR', 'Vision-Language', 'Historic Archives', 'Vision Transformer'],
    featured: false,
    evaluationMetric: 'Character Error Rate (CER) & Word Error Rate (WER)',
    datasetSize: '15,000 High-Res Document Scans',
    hostName: 'Government of Barbados & UNDP',
  },
  {
    id: 'rogii-wellbore-geology',
    title: 'ROGII - Wellbore Geology Real-Time Prediction',
    slug: 'rogii-wellbore-geology',
    platform: 'kaggle',
    platformName: 'Kaggle',
    url: 'https://www.kaggle.com/competitions/rogii-wellbore-geology-prediction',
    description: 'Automate stratigraphy boundary detection and formation classification from real-time gamma-ray telemetry in directional drilling operations.',
    problemStatement: 'Multi-class sequence labeling of geological rock formations along lateral drill paths to prevent wellbore instability.',
    category: 'Tabular & Predictive',
    difficulty: 'Intermediate',
    prizePool: '$25,000 USD',
    prizeAmountUSD: 25000,
    rewardType: 'cash',
    teamsCount: 510,
    deadline: '2026-10-30',
    daysRemaining: 33,
    status: 'active',
    tags: ['Geology', 'Time Series', 'Sensor Telemetry', 'XGBoost', 'Energy'],
    featured: false,
    evaluationMetric: 'Weighted F1-Score on Lateral Trajectories',
    datasetSize: '12 GB Wellbore Log Files',
    hostName: 'ROGII',
  },
  {
    id: 'drivendata-lost-in-transcription',
    title: 'Lost in Transcription - Speech Recognition in Underserved Contexts',
    slug: 'drivendata-lost-in-transcription',
    platform: 'drivendata',
    platformName: 'DrivenData',
    url: 'https://www.drivendata.org/competitions/lost-in-transcription',
    description: 'Build robust automatic speech recognition (ASR) systems capable of handling code-switched bilingual audio across indigenous and underserved linguistic contexts.',
    problemStatement: 'Accurately transcribe audio clips with mixed Spanish-English, Spanish-Nahuatl, and Indonesian-Javanese dialogues.',
    category: 'Audio & Speech',
    difficulty: 'Intermediate',
    prizePool: '$20,000 USD',
    prizeAmountUSD: 20000,
    rewardType: 'cash',
    teamsCount: 680,
    deadline: '2026-10-02',
    daysRemaining: 5,
    status: 'ending-soon',
    tags: ['ASR', 'Speech', 'Audio', 'Transformers', 'Whisper'],
    featured: false,
    evaluationMetric: 'Word Error Rate (WER) & Character Error Rate (CER)',
    datasetSize: '550 Hours Bilingual Audio',
    hostName: 'Mozilla Data Collective',
  },
  {
    id: 'hackerrank-global-ai-sprint',
    title: 'HackerRank Global AI & Algorithms Sprint 2026',
    slug: 'hackerrank-global-ai-sprint',
    platform: 'hackerrank',
    platformName: 'HackerRank',
    url: 'https://www.hackerrank.com/contests',
    description: 'Timed algorithmic problem solving, dynamic programming challenges, and machine learning system design round organized across global developers.',
    problemStatement: 'Solve 6 competitive algorithmic problems and optimize predictive models under strict CPU runtime and memory constraints.',
    category: 'Tabular & Predictive',
    difficulty: 'Intermediate',
    prizePool: '$15,000 + Tech Interviews',
    prizeAmountUSD: 15000,
    rewardType: 'jobs',
    teamsCount: 3100,
    deadline: '2026-10-18',
    daysRemaining: 21,
    status: 'active',
    tags: ['Algorithms', 'Data Structures', 'Python', 'C++', 'Optimization'],
    featured: false,
    evaluationMetric: 'Test Case Pass Rate & Execution Runtime',
    datasetSize: 'Interactive Testing Sandbox',
    hostName: 'HackerRank',
  },
  {
    id: 'drivendata-snomed-entity-linking',
    title: 'SNOMED CT Clinical Entity Linking Benchmark',
    slug: 'drivendata-snomed-entity-linking',
    platform: 'drivendata',
    platformName: 'DrivenData',
    url: 'https://www.drivendata.org/competitions/snomed-entity-linking',
    description: 'Extract clinical findings and map unstructured clinician consultation notes into standardized SNOMED Clinical Taxonomy concept IDs.',
    problemStatement: 'Disambiguate medical acronyms and match diagnostic terms to 350,000+ ontology nodes with zero-shot entity linking.',
    category: 'NLP & LLMs',
    difficulty: 'Intermediate',
    prizePool: '$15,000 USD',
    prizeAmountUSD: 15000,
    rewardType: 'cash',
    teamsCount: 470,
    deadline: '2026-12-15',
    daysRemaining: 79,
    status: 'active',
    tags: ['Healthcare', 'BioNLP', 'Named Entity Recognition', 'LLMs'],
    featured: false,
    evaluationMetric: 'Micro F1 on Concept Span Alignment',
    datasetSize: '25,000 De-identified Clinical Notes',
    hostName: 'SNOMED International',
  },
  {
    id: 'zindi-bias-bounty-mapping',
    title: 'Bias Bounty Mapping Equity Challenge',
    slug: 'zindi-bias-bounty-mapping',
    platform: 'zindi',
    platformName: 'Zindi',
    url: 'https://zindi.africa/competitions/bias-bounty-mapping-equity-challenge',
    description: 'Uncover algorithmic bias, demographic disparities, and hallucinated stereotypes in open-source multilingual conversational agents.',
    problemStatement: 'Design adversarial probe datasets and quantify bias metrics across low-resource African and Caribbean language models.',
    category: 'NLP & LLMs',
    difficulty: 'Beginner',
    prizePool: '$10,000 USD',
    prizeAmountUSD: 10000,
    rewardType: 'cash',
    teamsCount: 430,
    deadline: '2026-11-05',
    daysRemaining: 39,
    status: 'active',
    tags: ['Ethics', 'AI Safety', 'Fairness', 'Multilingual LLMs'],
    featured: false,
    evaluationMetric: 'Disparity Ratio & Toxicity Audit Score',
    datasetSize: 'Multi-Prompt Evaluation Benchmarks',
    hostName: 'Mozilla & Fair Forward',
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

    // Filter Keystatic items by enabled platforms
    const validKeystatic = (keystaticCompetitions || []).filter((comp) => {
      if (comp.platform === 'custom') return true;
      return enabledPlatforms.has(comp.platform);
    });

    // Merge Keystatic curated items if any, then fallback registry
    const allCombined = [...validKeystatic, ...filteredRegistry];

    // Deduplicate and compute real-time deadline status
    const now = new Date();
    const seen = new Set<string>();
    const deduplicated: Competition[] = [];

    for (const raw of allCombined) {
      const key = (raw.url || raw.id || raw.title).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);

        let daysRemaining = raw.daysRemaining;
        let status = raw.status;

        if (raw.deadline) {
          const deadlineDate = new Date(raw.deadline);
          const diffTime = deadlineDate.getTime() - now.getTime();
          if (diffTime <= 0) {
            daysRemaining = 0;
            status = 'completed';
          } else {
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            status = daysRemaining <= 7 ? 'ending-soon' : (raw.status === 'completed' ? 'completed' : 'active');
          }
        }

        deduplicated.push({
          ...raw,
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
