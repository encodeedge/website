export interface MathSymbolItem {
  id: string;
  glyph: string;
  latex: string;
  name: string;
  pronunciation: string;
  category: 'deep-learning' | 'optimization' | 'linear-algebra' | 'probability' | 'inference';
  meaning: string;
  example: string;
  ambiguity: string;
  relatedLabId?: string;
  relatedLabTitle?: string;
}

export const MATH_GLOSSARY_ITEMS: MathSymbolItem[] = [
  {
    id: 'attention-equation',
    glyph: 'Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V',
    latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V',
    name: 'Scaled Dot-Product Attention',
    pronunciation: 'Attention of Q, K, V equals softmax of Q K-transpose over square-root of d-sub-k times V',
    category: 'deep-learning',
    meaning: 'The core routing mechanism of modern Transformers. Computes alignment between query vectors Q and key vectors K, scales scores to stabilize gradients, and produces a weighted mixture of values V.',
    example: 'In GPT-4 or Llama, each attention head projects token embeddings into Q, K, V spaces to determine which preceding words contextually inform the current generation.',
    ambiguity: '√d_k scaling is required to avoid vanishing gradients when dot products grow large in high dimensions. Without it, softmax pushes scores into saturated near-zero derivative regions.',
    relatedLabId: 'attention-visualizer',
    relatedLabTitle: 'Transformer Self-Attention Visualizer'
  },
  {
    id: 'nabla-gradient',
    glyph: '∇_θ L(θ)',
    latex: '\\nabla_\\theta \\mathcal{L}(\\theta)',
    name: 'Nabla Gradient Operator',
    pronunciation: 'Nabla sub theta of L of theta (or gradient of loss with respect to parameters theta)',
    category: 'optimization',
    meaning: 'A vector of first-order partial derivatives pointing in the direction of steepest ascent of the scalar loss function L with respect to neural network weights θ.',
    example: 'During backpropagation, PyTorch computes parameter.grad = ∇_θ L so optimizers like Adam or SGD can step in the opposite direction: θ ← θ - η ∇_θ L.',
    ambiguity: 'Often confused with the Laplacian (∇²). In neural network optimization, ∇ without an exponent is always the gradient vector, not the scalar divergence.',
    relatedLabId: 'gradient-descent',
    relatedLabTitle: 'Loss Surface & Gradient Descent Optimizer Lab'
  },
  {
    id: 'discrete-convolution',
    glyph: '(X ⊛ K)ᵢⱼ = ∑ₘ ∑ₙ X_{i+m, j+n} K_{m,n}',
    latex: '(X \\ast K)_{i,j} = \\sum_{m} \\sum_{n} X_{i+m, j+n} K_{m,n}',
    name: '2D Spatial Cross-Correlation / Convolution',
    pronunciation: 'X convolved with K at index i, j equals sum over m and n of X times kernel K',
    category: 'deep-learning',
    meaning: 'Slides a small learnable parameter matrix (kernel) across a 2D spatial grid (e.g. image feature map) computing local dot products to extract translation-invariant spatial features.',
    example: 'A 3x3 Sobel kernel detects horizontal edges by computing positive differences across adjacent vertical pixel channels.',
    ambiguity: 'In deep learning frameworks (PyTorch/TensorFlow), Conv2d actually implements cross-correlation without flipping the kernel 180°, which is mathematically identical because weights are learned.',
    relatedLabId: 'convolution-visualizer',
    relatedLabTitle: '2D Convolution Kernel & Feature Map Explorer'
  },
  {
    id: 'relu-activation',
    glyph: 'ReLU(z) = max(0, z)',
    latex: '\\text{ReLU}(z) = \\max(0, z)',
    name: 'Rectified Linear Unit',
    pronunciation: 'R-E-L-U of z equals max of zero and z',
    category: 'deep-learning',
    meaning: 'The ubiquitous non-saturating non-linear activation function in deep networks. Passes positive pre-activations unchanged while zeroing out negative values.',
    example: 'Enables deep neural networks (e.g., 50+ layer ResNets) to train without severe gradient vanishing because its derivative is 1 for any positive input.',
    ambiguity: 'Can cause the "dying ReLU" problem where neurons with persistently negative inputs produce zero gradients and never update. Mitigated by Leaky ReLU, GeLU, or SwiGLU.',
    relatedLabId: 'neural-playground',
    relatedLabTitle: 'Neural Network & Activation Playground'
  },
  {
    id: 'sigmoid-function',
    glyph: 'σ(z) = 1 / (1 + e⁻ᶻ)',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    name: 'Sigmoid Logistic Function',
    pronunciation: 'Sigma of z equals one over one plus e to the negative z',
    category: 'deep-learning',
    meaning: 'Maps any real-valued scalar into the open interval (0, 1), making it ideal for modeling Bernoulli probabilities in binary classification or gate mechanisms (e.g. LSTM forget gates).',
    example: 'In binary cross-entropy classification, the output logit z is passed through σ(z) to predict P(y=1 | x).',
    ambiguity: 'Susceptible to vanishing gradients when |z| is large because σ\'(z) = σ(z)(1 - σ(z)), which peaks at only 0.25 and approaches 0 in the tails.',
    relatedLabId: 'neural-playground',
    relatedLabTitle: 'Neural Network & Activation Playground'
  },
  {
    id: 'big-o-notation',
    glyph: 'O(N²)',
    latex: '\\mathcal{O}(N^2)',
    name: 'Big-O Asymptotic Complexity',
    pronunciation: 'Order of N squared / Big-O of N squared',
    category: 'inference',
    meaning: 'Describes the upper bound on time or space resource scaling as the input sequence length N approaches infinity.',
    example: 'Standard full self-attention scales in O(N²) memory and compute with sequence length N, motivating FlashAttention and linear attention approximations.',
    ambiguity: 'Big-O describes asymptotic trends, not wall-clock hardware latency. An O(N²) algorithm with high GPU cache locality can run faster than an O(N) algorithm with uncoalesced memory access.',
    relatedLabId: 'attention-visualizer',
    relatedLabTitle: 'Transformer Self-Attention Visualizer'
  },
  {
    id: 'expectation-operator',
    glyph: '𝔼_{x ~ P}[f(x)]',
    latex: '\\mathbb{E}_{x \\sim P}[f(x)]',
    name: 'Mathematical Expectation',
    pronunciation: 'Expectation over x sampled from P of f of x',
    category: 'probability',
    meaning: 'The probability-weighted average value of a function f(x) when the random variable x is drawn from distribution P.',
    example: 'Empirical risk minimization optimizes the expected loss over the training data distribution: min_θ 𝔼_{(x,y)~D}[L(f_θ(x), y)].',
    ambiguity: 'In practice, expectations over continuous high-dimensional distributions are intractable and approximated with Monte Carlo mini-batch averages: (1/B) ∑ f(xᵢ).',
    relatedLabId: 'gradient-descent',
    relatedLabTitle: 'Loss Surface & Gradient Descent Optimizer Lab'
  },
  {
    id: 'cross-entropy-loss',
    glyph: 'H(P, Q) = -∑ P(x) log Q(x)',
    latex: 'H(P, Q) = -\\sum_{x} P(x) \\log Q(x)',
    name: 'Cross-Entropy Loss',
    pronunciation: 'Cross entropy of P and Q equals negative sum of P of x times log Q of x',
    category: 'probability',
    meaning: 'Measures the dissimilarity between true probability distribution P (one-hot target) and predicted distribution Q (softmax outputs).',
    example: 'Standard objective for training LLM next-token prediction: minimizing cross-entropy maximizes the log likelihood of the correct next token.',
    ambiguity: 'When base 2 logarithm is used, entropy is measured in bits (shannons); in deep learning frameworks like PyTorch, natural log (ln) is used, measuring entropy in nats.'
  },
  {
    id: 'kl-divergence',
    glyph: 'D_KL(P || Q) = ∑ P(x) log(P(x) / Q(x))',
    latex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{x} P(x) \\log\\left(\\frac{P(x)}{Q(x)}\\right)',
    name: 'Kullback-Leibler Divergence',
    pronunciation: 'K-L divergence of P from Q',
    category: 'probability',
    meaning: 'Quantifies the information lost when distribution Q is used to approximate the reference distribution P. Always non-negative and zero only when P = Q.',
    example: 'Used in RLHF (Reinforcement Learning from Human Feedback) penalty terms to prevent the fine-tuned model policy π_θ from drifting too far from the base model policy π_ref.',
    ambiguity: 'Asymmetric! D_KL(P || Q) ≠ D_KL(Q || P). Forward KL is zero-avoiding (mode covering), while reverse KL is zero-forcing (mode seeking).'
  },
  {
    id: 'hadamard-product',
    glyph: 'A ⊙ B',
    latex: 'A \\odot B',
    name: 'Hadamard / Element-wise Product',
    pronunciation: 'A element-wise times B / A Hadamard B',
    category: 'linear-algebra',
    meaning: 'Multiplies corresponding elements of two matrices or tensors of identical shape: (A ⊙ B)ᵢⱼ = Aᵢⱼ · Bᵢⱼ.',
    example: 'Used in gated neural networks (e.g. SwiGLU activation: SwiGLU(x) = Swish(xW) ⊙ (xV)).',
    ambiguity: 'Distinct from matrix multiplication (AB) and outer/tensor product (A ⊗ B). In Python/NumPy, `A * B` is Hadamard, whereas `A @ B` is matrix multiplication.',
    relatedLabId: 'memory-explorer',
    relatedLabTitle: 'CPython Memory & Reference Counting Explorer'
  },
  {
    id: 'l2-norm',
    glyph: '||x||₂ = √(∑ xᵢ²)',
    latex: '\\|x\\|_2 = \\sqrt{\\sum_{i} x_i^2}',
    name: 'L2 Euclidean Norm',
    pronunciation: 'L-2 norm of x / Euclidean length of x',
    category: 'linear-algebra',
    meaning: 'Measures the straight-line geometric magnitude (length) of a vector in n-dimensional Euclidean space.',
    example: 'In vector databases, embeddings are normalized by dividing by ||x||₂ so that dot product becomes equivalent to cosine similarity.',
    ambiguity: 'L2 weight decay in SGD adds λ||θ||₂² to the loss function, which pulls weights toward zero to prevent overfitting.'
  },
  {
    id: 'cosine-similarity',
    glyph: 'CosSim(u, v) = (u · v) / (||u||₂ ||v||₂)',
    latex: '\\text{CosineSim}(u, v) = \\frac{u \\cdot v}{\\|u\\|_2 \\|v\\|_2}',
    name: 'Cosine Similarity',
    pronunciation: 'Cosine similarity of u and v',
    category: 'linear-algebra',
    meaning: 'Measures the cosine of the angle between two multi-dimensional vectors, producing a score between -1 and +1 invariant to vector magnitude.',
    example: 'Standard semantic search metric in RAG pipelines to rank retrieved document chunks against the user query embedding.',
    ambiguity: 'Captures orientation but ignores magnitude. If token frequency or sentence length is critical, dot product without normalization may be preferable.'
  },
  {
    id: 'learning-rate-eta',
    glyph: 'η (Eta)',
    latex: '\\eta',
    name: 'Learning Rate Hyperparameter',
    pronunciation: 'Eta / Learning rate',
    category: 'optimization',
    meaning: 'The step size scalar factor scaling parameter updates along the negative gradient during optimizer iterations.',
    example: 'θ_{t+1} = θ_t - η · m_t / (√v_t + ε) in the Adam optimizer update step.',
    ambiguity: 'Too high causes divergence / exploding loss; too low causes agonizingly slow convergence or trapping in suboptimal local minima.',
    relatedLabId: 'gradient-descent',
    relatedLabTitle: 'Loss Surface & Gradient Descent Optimizer Lab'
  },
  {
    id: 'softmax-temperature',
    glyph: 'P(y_i) = exp(z_i / τ) / ∑ exp(z_j / τ)',
    latex: 'P(y_i) = \\frac{e^{z_i / \\tau}}{\\sum_{j} e^{z_j / \\tau}}',
    name: 'Softmax with Temperature Scaling',
    pronunciation: 'Probability of y-sub-i equals exponential of z-sub-i over tau, divided by sum of exponentials',
    category: 'inference',
    meaning: 'Adjusts the entropy and peakiness of categorical probability distributions output by generative language models.',
    example: 'Lower temperature (τ → 0.1) creates deterministic, greedy outputs; higher temperature (τ → 1.5) flattens probabilities for diverse, creative text.',
    ambiguity: 'τ = 1 is standard unscaled softmax. As τ approaches 0, softmax approaches argmax (hard one-hot distribution).',
    relatedLabId: 'attention-visualizer',
    relatedLabTitle: 'Transformer Self-Attention Visualizer'
  },
  {
    id: 'kv-cache',
    glyph: 'K_{1:t}, V_{1:t}',
    latex: 'K_{1:t}, V_{1:t}',
    name: 'Key-Value Activation Cache',
    pronunciation: 'K-V Cache',
    category: 'inference',
    meaning: 'Stores previously computed Key and Value projection tensors in GPU VRAM during autoregressive decoding to avoid redundant recomputation of past tokens.',
    example: 'Reduces generation per-token latency from O(t²) to O(t), converting an O(N³) prompt generation into O(N²).',
    ambiguity: 'Massive VRAM footprint! For long context windows (e.g. 128k tokens), KV cache often exceeds model weight memory, requiring techniques like PagedAttention (vLLM) or GQA (Grouped Query Attention).'
  },
  {
    id: 'pareto-frontier',
    glyph: 'Pareto(Cost, Quality)',
    latex: '\\mathcal{P} = \\{m \\mid \\nexists m\': \\text{Cost}(m\') \\le \\text{Cost}(m) \\land \\text{Qual}(m\') \\ge \\text{Qual}(m)\\}',
    name: 'Cost-Context Pareto Frontier',
    pronunciation: 'Pareto frontier / Pareto optimal boundary',
    category: 'inference',
    meaning: 'The set of models or configurations where you cannot improve quality without increasing cost, or reduce cost without sacrificing quality.',
    example: 'In model routing systems, requests are routed along the Pareto curve: cheap models (e.g. Flash/Haiku) handle simple queries, while expensive reasoning models (o1/R1) handle difficult tasks.',
    ambiguity: 'Models sitting below or inside the Pareto curve are strictly dominated and should rarely be selected in production architectures.'
  },
  {
    id: 'matrix-transpose',
    glyph: 'Aᵀ',
    latex: 'A^T',
    name: 'Matrix Transpose Operator',
    pronunciation: 'A transpose',
    category: 'linear-algebra',
    meaning: 'Flips a matrix over its diagonal, switching its row and column indices: (Aᵀ)ᵢⱼ = Aⱼᵢ.',
    example: 'In attention QKᵀ, transposing key matrix K (shape [B, S, D]) to Kᵀ (shape [B, D, S]) allows matrix multiplication with Q to produce sequence-by-sequence score matrix [B, S, S].',
    ambiguity: 'In CPython/NumPy/PyTorch, transposing a tensor is an O(1) zero-copy operation that simply swaps stride and shape metadata rather than reallocating memory.',
    relatedLabId: 'memory-explorer',
    relatedLabTitle: 'CPython Memory & Reference Counting Explorer'
  },
  {
    id: 'ttft-latency',
    glyph: 'TTFT (Time to First Token)',
    latex: '\\text{TTFT} = t_{\\text{first\\_token}} - t_{\\text{request}}',
    name: 'Time to First Token (Prefill Latency)',
    pronunciation: 'T-T-F-T / Time to First Token',
    category: 'inference',
    meaning: 'The latency elapsed between a client sending an LLM prompt and receiving the very first token in the streaming response.',
    example: 'Prefill is compute-bound (processing the entire prompt matrix in parallel), whereas subsequent token decoding is memory-bandwidth bound.',
    ambiguity: 'A model with excellent tokens-per-second decoding speed can still feel sluggish to users if its TTFT is several seconds long due to large prompt processing overhead.'
  }
];
