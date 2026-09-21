export interface TopicMeta {
  value: string;
  label: string;
  description: string;
  color: string;
  roadmapSlug?: string;
  iconName?: string;
}

export const TOPIC_METADATA: Record<string, TopicMeta> = {
  'artificial-intelligence': {
    value: 'artificial-intelligence',
    label: 'Artificial Intelligence',
    description: 'Comprehensive curriculum covering intelligent agents, state-space search, reinforcement learning, transformers, RAG, and autonomous systems.',
    color: '#E5E795', // Lime
    roadmapSlug: 'artificial-intelligence',
    iconName: 'Sparkles',
  },
  'machine-learning': {
    value: 'machine-learning',
    label: 'Machine Learning',
    description: 'Master statistical pattern recognition, supervised and unsupervised algorithms, mathematical loss formulation, regression metrics, and production scikit-learn models.',
    color: '#FDA4AF', // Rose
    roadmapSlug: 'machine-learning',
    iconName: 'Brain',
  },
  'deep-learning': {
    value: 'deep-learning',
    label: 'Deep Learning',
    description: 'Neural network architectures, backpropagation calculus, PyTorch computational graphs, and transformer attention mechanisms.',
    color: '#EEA9ED', // Lavender
    roadmapSlug: 'deep-learning',
    iconName: 'Bot',
  },
  'data-science': {
    value: 'data-science',
    label: 'Data Science',
    description: 'Exploratory data analysis, probability distributions, statistical inference, feature engineering, and high-performance pandas workflows.',
    color: '#A2D2FF', // Sky blue
    roadmapSlug: 'data-science',
    iconName: 'LineChart',
  },
  'python': {
    value: 'python',
    label: 'Python Foundations',
    description: 'Comprehensive look into CPython internals, memory allocation, PyObject structures, cyclic garbage collection, and robust type systems.',
    color: '#FFB86A', // Peach
    roadmapSlug: 'python',
    iconName: 'Terminal',
  },
  'nlp': {
    value: 'nlp',
    label: 'Natural Language Processing',
    description: 'Tokenization algorithms, vector embeddings, self-attention mechanisms, semantic search, and large language model tuning.',
    color: '#E5E795', // Lime
    roadmapSlug: 'machine-learning',
    iconName: 'MessageSquareCode',
  },
  'computer-vision': {
    value: 'computer-vision',
    label: 'Computer Vision',
    description: 'Convolutional neural networks, spatial feature extraction, image classification, object detection, and visual transformers.',
    color: '#A7F3D0', // Mint
    roadmapSlug: 'deep-learning',
    iconName: 'Eye',
  },
  'web-dev': {
    value: 'web-dev',
    label: 'Web & Systems Engineering',
    description: 'Modern fullstack frameworks, high-throughput model serving with FastAPI and vLLM, and real-time streaming architectures.',
    color: '#CBD5E1', // Slate
    iconName: 'Code2',
  },
};

export const TOPIC_LIST: TopicMeta[] = Object.values(TOPIC_METADATA);

