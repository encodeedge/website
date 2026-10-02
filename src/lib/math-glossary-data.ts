export interface MathSymbolItem {
  id: string;
  glyph: string;
  latex?: string;
  name: string;
  pronunciation?: string;
  category: string;
  meaning: string;
  example?: string;
  ambiguity?: string;
  relatedLabId?: string;
  relatedLabTitle?: string;
}

export const MATH_GLOSSARY_ITEMS: MathSymbolItem[] = [
  // ── Statistics & Mathematics ──────────────────────────────────────────────
  {
    id: 'mean',
    glyph: 'x̄ = (1/n) ∑ xᵢ',
    latex: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i',
    name: 'Mean (Arithmetic Average)',
    pronunciation: 'x-bar equals one over n sum of x sub i',
    category: 'statistics',
    meaning: 'The sum of all numerical values in a dataset divided by the total number of observations.',
    example: 'Sensitive to extreme outliers. In [1, 2, 3, 94], the mean is 25, which misrepresents the typical value.'
  },
  {
    id: 'median',
    glyph: 'Median = Middle(X_sorted)',
    latex: '\\text{Median}(X) = X_{\\left(\\frac{n+1}{2}\\right)}',
    name: 'Median (Middle Value)',
    pronunciation: 'Median of ordered dataset X',
    category: 'statistics',
    meaning: 'The central value separating the higher half from the lower half of an ordered dataset.',
    example: 'Robust against extreme outliers. In [1, 2, 3, 94], the median is 2.5, capturing the true center.'
  },
  {
    id: 'mode',
    glyph: 'Mode = argmax Frequency(x)',
    latex: '\\text{Mode} = \\arg\\max_{x} f(x)',
    name: 'Mode (Most Frequent Value)',
    pronunciation: 'Mode equals argmax of frequency distribution',
    category: 'statistics',
    meaning: 'The observation or value that occurs with the highest frequency in a collection of data.',
    example: 'A dataset can have one mode (unimodal), two modes (bimodal), or multiple modes; ideal for categorical data.'
  },
  {
    id: 'variance',
    glyph: 'σ² = (1/N) ∑ (xᵢ - μ)²',
    latex: '\\sigma^2 = \\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2',
    name: 'Variance (Spread of Data)',
    pronunciation: 'sigma squared equals one over N sum of x sub i minus mu squared',
    category: 'statistics',
    meaning: 'Measures the average squared distance of each individual data point from the distribution mean.',
    example: 'Expressed in squared units of the data. Higher variance indicates wider dispersion around the center.'
  },
  {
    id: 'standard-deviation',
    glyph: 'σ = √(σ²)',
    latex: '\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}',
    name: 'Standard Deviation',
    pronunciation: 'sigma equals square root of variance',
    category: 'statistics',
    meaning: 'The square root of variance, quantifying data spread in the exact same measurement units as the original observations.',
    example: 'In a Gaussian curve, approximately 68.2% of data points fall within ±1σ of the mean, and 95.4% within ±2σ.'
  },
  {
    id: 'normal-distribution',
    glyph: 'N(μ, σ²)',
    latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}',
    name: 'Normal (Gaussian) Distribution',
    pronunciation: 'Normal distribution with mean mu and variance sigma squared',
    category: 'probability',
    meaning: 'A continuous, symmetric bell-shaped probability distribution fully specified by its central mean and standard deviation.',
    example: 'Under the Central Limit Theorem, sums and averages of independent random variables approach a normal distribution.'
  },

  // ── Linear Algebra ────────────────────────────────────────────────────────
  {
    id: 'dot-product',
    glyph: 'u · v = ∑ uᵢ vᵢ',
    latex: 'u \\cdot v = \\sum_{i=1}^d u_i v_i = \\|u\\| \\|v\\| \\cos(\\theta)',
    name: 'Dot Product (Scalar Product)',
    pronunciation: 'u dot v equals sum of u sub i times v sub i',
    category: 'linear-algebra',
    meaning: 'Calculates the sum of products of corresponding components of two vectors, measuring their directional alignment.',
    example: 'If u · v = 0, the two vectors are strictly orthogonal (perpendicular). Powers dense linear layers in neural nets.'
  },
  {
    id: 'matrix-multiplication',
    glyph: 'C_{i,j} = ∑_k A_{i,k} B_{k,j}',
    latex: 'C_{i,j} = \\sum_{k=1}^m A_{i,k} B_{k,j}',
    name: 'Matrix Multiplication (GEMM)',
    pronunciation: 'Matrix A times Matrix B',
    category: 'linear-algebra',
    meaning: 'Linear algebraic operation composing two transformations by computing inner products of rows of A with columns of B.',
    example: 'Forms >90% of the floating-point arithmetic workload in deep learning, hardware-accelerated by GPU Tensor Cores.'
  },
  {
    id: 'eigenvalues-eigenvectors',
    glyph: 'A v = λ v',
    latex: 'A v = \\lambda v',
    name: 'Eigenvalues & Eigenvectors',
    pronunciation: 'A times v equals lambda times v',
    category: 'linear-algebra',
    meaning: 'Special non-zero vectors v whose direction is invariant under transformation matrix A, scaled only by constant λ.',
    example: 'Powers Principal Component Analysis (PCA) dimensionality reduction by identifying axes of highest variance.'
  },
  {
    id: 'cosine-similarity',
    glyph: 'CosSim(u, v) = (u · v) / (||u||₂ ||v||₂)',
    latex: '\\text{CosineSim}(u, v) = \\frac{u \\cdot v}{\\|u\\|_2 \\|v\\|_2}',
    name: 'Cosine Similarity',
    pronunciation: 'Cosine similarity of u and v',
    category: 'linear-algebra',
    meaning: 'Measures the cosine of the angle between two multi-dimensional vectors, evaluating orientation regardless of magnitude.',
    example: 'Primary distance metric used in vector databases, semantic document retrieval, and RAG search.'
  },
  {
    id: 'l2-norm',
    glyph: '||x||₂ = √(∑ xᵢ²)',
    latex: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^d x_i^2}',
    name: 'L2 Euclidean Norm (Magnitude)',
    pronunciation: 'L-2 norm of vector x',
    category: 'linear-algebra',
    meaning: 'The straight-line geometric length of a vector in multi-dimensional Euclidean space.',
    example: 'Vectors are often divided by ||x||₂ to produce unit-length vectors with uniform scale.'
  },
  {
    id: 'hadamard-product',
    glyph: 'A ⊙ B',
    latex: 'A \\odot B',
    name: 'Hadamard (Element-Wise) Product',
    pronunciation: 'A element-wise times B / A Hadamard B',
    category: 'linear-algebra',
    meaning: 'Multiplies corresponding elements of two tensors of identical shape: (A ⊙ B)ᵢⱼ = Aᵢⱼ · Bᵢⱼ.',
    example: 'Used in gated activations (e.g. SwiGLU: Swish(xW) ⊙ (xV)) and dropout masks.'
  },

  // ── Calculus & Optimization ───────────────────────────────────────────────
  {
    id: 'nabla-gradient',
    glyph: '∇_θ L(θ)',
    latex: '\\nabla_\\theta \\mathcal{L}(\\theta) = \\left[ \\frac{\\partial \\mathcal{L}}{\\partial \\theta_1}, \\dots, \\frac{\\partial \\mathcal{L}}{\\partial \\theta_n} \\right]^T',
    name: 'Nabla Gradient Operator',
    pronunciation: 'Gradient of loss with respect to parameters theta',
    category: 'optimization',
    meaning: 'A vector of first-order partial derivatives pointing in the direction of greatest rate of increase of scalar loss L.',
    example: 'During backpropagation, auto-differentiation computes ∇_θ L so optimizers can descend down the loss surface.',
    relatedLabId: 'gradient-descent',
    relatedLabTitle: 'Gradient Descent Optimizer Lab'
  },
  {
    id: 'gradient-descent',
    glyph: 'θ ← θ - η ∇_θ L(θ)',
    latex: '\\theta \\leftarrow \\theta - \\eta \\nabla_\\theta \\mathcal{L}(\\theta)',
    name: 'Gradient Descent Optimization',
    pronunciation: 'theta updated as theta minus eta times gradient of loss',
    category: 'optimization',
    meaning: 'Iterative optimization algorithm that steps model parameters in the direction of steepest descent to minimize loss.',
    example: 'The foundational training engine behind SGD, Adam, and modern deep neural network parameter updates.',
    relatedLabId: 'gradient-descent',
    relatedLabTitle: 'Gradient Descent Optimizer Lab'
  },
  {
    id: 'learning-rate',
    glyph: 'η (Step Size)',
    latex: '\\eta \\in (0, 1)',
    name: 'Learning Rate (η / Alpha)',
    pronunciation: 'eta (or alpha) learning rate step size',
    category: 'optimization',
    meaning: 'Crucial hyperparameter that scales the magnitude of parameter updates along the gradient vector each iteration.',
    example: 'Too large causes divergence and training explosion; too small leads to plateaus and slow convergence.'
  },

  // ── Machine Learning Fundamentals ─────────────────────────────────────────
  {
    id: 'mean-squared-error',
    glyph: 'MSE = (1/N) ∑ (yᵢ - ŷᵢ)²',
    latex: '\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2',
    name: 'Mean Squared Error (MSE Loss)',
    pronunciation: 'M-S-E equals one over N sum of y minus y-hat squared',
    category: 'machine-learning',
    meaning: 'Calculates the average squared difference between true continuous target values y and model predictions ŷ.',
    example: 'Standard objective function for linear regression and continuous numerical forecasting.'
  },
  {
    id: 'cross-entropy-loss',
    glyph: 'H(P, Q) = -∑ yᵢ log(pᵢ)',
    latex: '\\mathcal{L}_{\\text{CE}} = -\\sum_{i=1}^C y_i \\log(\\hat{y}_i)',
    name: 'Cross-Entropy Loss',
    pronunciation: 'Cross entropy of true distribution and predicted distribution',
    category: 'machine-learning',
    meaning: 'Measures dissimilarity between ground truth one-hot classification label y and predicted probabilities ŷ.',
    example: 'Standard loss function for multi-class classification and LLM next-token generation.'
  },
  {
    id: 'bias-variance-tradeoff',
    glyph: 'Error = Bias² + Variance + Noise',
    latex: '\\mathbb{E}[(y - \\hat{f}(x))^2] = \\text{Bias}[\\hat{f}(x)]^2 + \\text{Var}[\\hat{f}(x)] + \\sigma^2',
    name: 'Bias-Variance Tradeoff',
    pronunciation: 'Expected error equals bias squared plus variance plus irreducible error',
    category: 'machine-learning',
    meaning: 'The balance between underfitting (high bias from an oversimplified model) and overfitting (high variance from oversensitivity).',
    example: 'Increasing model capacity reduces training bias but risks inflating validation variance.'
  },
  {
    id: 'regularization',
    glyph: 'Loss + λ ||θ||²',
    latex: '\\mathcal{L}_{\\text{reg}} = \\mathcal{L} + \\lambda \\|\\theta\\|_2^2',
    name: 'L1 & L2 Regularization (Weight Decay)',
    pronunciation: 'Loss plus lambda times norm of weights',
    category: 'machine-learning',
    meaning: 'Penalty added to loss function discouraging excessively large weights, keeping model complexity constrained.',
    example: 'L2 (Ridge) penalizes large weights smoothly; L1 (Lasso) drives uninformative weights to exact zero.'
  },
  {
    id: 'precision-recall',
    glyph: 'P = TP/(TP+FP), R = TP/(TP+FN)',
    latex: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}, \\quad \\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
    name: 'Precision & Recall',
    pronunciation: 'Precision and recall evaluation metrics',
    category: 'machine-learning',
    meaning: 'Precision measures exactness (how many selected items were relevant); Recall measures completeness (how many relevant items were selected).',
    example: 'In spam filtering, high precision prevents legitimate emails from being lost; in fraud detection, high recall catches all fraud.'
  },
  {
    id: 'f1-score',
    glyph: 'F1 = 2 · (P · R) / (P + R)',
    latex: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
    name: 'F1 Score (Harmonic Mean)',
    pronunciation: 'F-1 score harmonic mean of precision and recall',
    category: 'machine-learning',
    meaning: 'The harmonic mean of precision and recall, providing a balanced single metric on class-imbalanced datasets.',
    example: 'Prevents deceptive high accuracy when negative samples overwhelmingly dominate positive samples.'
  },

  // ── Deep Learning & AI Architectures ──────────────────────────────────────
  {
    id: 'softmax-function',
    glyph: 'Softmax(zᵢ) = e^(zᵢ) / ∑ e^(zⱼ)',
    latex: '\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}',
    name: 'Softmax Function',
    pronunciation: 'Softmax of z sub i',
    category: 'deep-learning',
    meaning: 'Transforms a vector of arbitrary real-valued raw logits into a valid probability distribution that strictly sums to 1.0.',
    example: 'Applied at the final layer of classification models and within Transformer attention weight computations.'
  },
  {
    id: 'sigmoid-function',
    glyph: 'σ(z) = 1 / (1 + e⁻ᶻ)',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    name: 'Sigmoid Logistic Function',
    pronunciation: 'Sigma of z equals one over one plus e to negative z',
    category: 'deep-learning',
    meaning: 'S-shaped mathematical curve mapping any real number into the range (0, 1), representing Bernoulli probabilities.',
    example: 'Commonly used as the output activation for binary classification and recurrent gate mechanisms.',
    relatedLabId: 'neural-playground',
    relatedLabTitle: 'Neural Playground'
  },
  {
    id: 'relu-activation',
    glyph: 'ReLU(z) = max(0, z)',
    latex: '\\text{ReLU}(z) = \\max(0, z)',
    name: 'Rectified Linear Unit (ReLU)',
    pronunciation: 'R-E-L-U of z equals max of zero and z',
    category: 'deep-learning',
    meaning: 'Piecewise linear activation function that passes positive inputs directly while setting all negative values to zero.',
    example: 'Avoids vanishing gradients in deep feedforward networks and CNNs while offering fast execution.',
    relatedLabId: 'neural-playground',
    relatedLabTitle: 'Neural Playground'
  },
  {
    id: 'attention-equation',
    glyph: 'Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V',
    latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V',
    name: 'Scaled Dot-Product Attention',
    pronunciation: 'Attention of Q, K, V',
    category: 'deep-learning',
    meaning: 'Core routing mechanism of Transformers calculating contextual relevance between token queries Q and keys K to blend values V.',
    example: 'Powers modern LLMs (GPT, Llama, Claude), allowing each token to dynamically attend to relevant context across the sequence.',
    relatedLabId: 'attention-visualizer',
    relatedLabTitle: 'Attention Visualizer'
  },
  {
    id: 'discrete-convolution',
    glyph: '(X ⊛ K)ᵢⱼ = ∑∑ X_{i+m, j+n} K_{m,n}',
    latex: '(X \\ast K)_{i,j} = \\sum_{m} \\sum_{n} X_{i+m, j+n} K_{m,n}',
    name: '2D Spatial Convolution (Filter)',
    pronunciation: 'X convolved with kernel K',
    category: 'deep-learning',
    meaning: 'Slides a small learnable parameter matrix (kernel) across 2D inputs to extract spatial translation-invariant feature patterns.',
    example: 'Foundational operation in Computer Vision CNNs for edge detection, texture extraction, and object recognition.',
    relatedLabId: 'convolution-visualizer',
    relatedLabTitle: '2D Convolution Lab'
  },
  {
    id: 'big-o-notation',
    glyph: 'O(1), O(N), O(N log N), O(N²)',
    latex: '\\mathcal{O}(f(n))',
    name: 'Big-O Asymptotic Complexity',
    pronunciation: 'Big-O of f of n',
    category: 'mathematics',
    meaning: 'Mathematical convention describing upper bound on algorithm runtime or memory scaling as input size grows to infinity.',
    example: 'Hash map lookups are O(1); sorting is O(N log N); full self-attention scales in O(N²) time and memory.'
  },
  {
    id: 'kl-divergence',
    glyph: 'D_KL(P || Q) = ∑ P(x) log(P(x) / Q(x))',
    latex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{x} P(x) \\log\\left(\\frac{P(x)}{Q(x)}\\right)',
    name: 'Kullback-Leibler (KL) Divergence',
    pronunciation: 'K-L divergence of P from Q',
    category: 'probability',
    meaning: 'Quantifies how much probability distribution Q differs from baseline reference distribution P in bits or nats.',
    example: 'Used in RLHF alignment penalties to keep fine-tuned LLM responses from drifting wildly from the base model.'
  }
];
