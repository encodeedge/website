#!/usr/bin/env python3
import os
import yaml

LESSONS_DIR = "/workspaces/website/src/content/lessons"
QUIZZES_DIR = "/workspaces/website/src/content/quizzes"
ASSIGNMENTS_DIR = "/workspaces/website/src/content/assignments"
BATCHES_DIR = "/workspaces/website/src/content/batches"
COURSES_DIR = "/workspaces/website/src/content/courses"

os.makedirs(LESSONS_DIR, exist_ok=True)
os.makedirs(QUIZZES_DIR, exist_ok=True)
os.makedirs(ASSIGNMENTS_DIR, exist_ok=True)
os.makedirs(BATCHES_DIR, exist_ok=True)
os.makedirs(COURSES_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. LESSONS
# -------------------------------------------------------------
lessons = {
    # Deep Learning
    "dl-welcome": {
        "title": "Welcome to Applied Deep Learning",
        "description": "An overview of the course roadmap, prerequisites, compute setup with PyTorch and Google Colab, and core learning outcomes.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/aircAruvnKk",
        "duration": 14,
        "content": """
Welcome to **Applied Deep Learning: From Neural Foundations to Production Transformers**. 

In this course, we demystify modern deep learning by building architectures from first mathematical principles before scaling them with PyTorch and CUDA acceleration.

### What You Will Achieve
1. **First-Principles Mastery**: Code backpropagation and multi-layer perceptrons with pure Python and NumPy.
2. **Computer Vision & CNNs**: Train and fine-tune convolutional architectures with residual connections (ResNet) on custom vision datasets.
3. **Sequence Modeling & Attention**: Implement Scaled Dot-Product Attention and decode the inner mechanisms of modern Transformers.
4. **Production Deployment**: Export models with TorchScript / ONNX and serve inference through high-performance async endpoints.

### Development Environment
We strongly recommend setting up a local virtual environment with CUDA support, or utilizing Google Colab / Paperspace Gradient for free GPU tier access:

```bash
# Recommended environment setup
python3 -m venv dl-env
source dl-env/bin/activate
pip install torch torchvision torchaudio numpy matplotlib jupyter
```
"""
    },
    "dl-python-foundations": {
        "title": "Vectorized Operations with NumPy & PyTorch Tensors",
        "description": "Understanding stride mechanics, broadcasting rules, tensor shapes, and zero-copy operations in memory.",
        "lessonType": "article",
        "duration": 22,
        "content": """
Before training neural networks, machine learning engineers must master **vectorized operations** and memory layouts. Operating on multidimensional arrays row-by-row in Python loops is thousands of times slower than SIMD vectorized kernel execution.

### Memory Strides & Storage
A tensor is composed of a flat 1D block of contiguous memory, paired with a metadata header specifying:
- **Shape**: The dimensions of the tensor `(d_0, d_1, ..., d_k)`
- **Strides**: The number of bytes to step in memory to advance by one element along each dimension
- **Dtype**: The precision data format (`torch.float32`, `torch.float16`, `torch.bfloat16`)

```python
import torch

# Create a 2D tensor
x = torch.tensor([[1.0, 2.0, 3.0], 
                  [4.0, 5.0, 6.0]], dtype=torch.float32)

print("Shape:", x.shape)       # torch.Size([2, 3])
print("Strides:", x.stride())   # (3, 1) -> step 3 floats to move a row, 1 to move a column
print("Is Contiguous:", x.is_contiguous()) # True
```

### Broadcasting Rules
When operating on tensors of different shapes, PyTorch aligns shapes from right to left (trailing dimensions first). Two dimensions are compatible when:
1. They are equal, OR
2. One of them is 1.

```python
A = torch.randn(8, 1, 64) # Batch=8, Channels=1, Features=64
B = torch.randn(64)       # Broadcasts across leading dimensions seamlessly
C = A + B                 # Result shape: (8, 1, 64)
```
"""
    },
    "dl-perceptrons-and-backprop": {
        "title": "Multi-Layer Perceptrons & Computational Graphs",
        "description": "Deriving automatic differentiation, loss calculation, forward passes, and backward gradients via the chain rule.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/VMj-3S1tku0",
        "duration": 28,
        "content": """
At the core of deep learning is the **computational graph**. Every mathematical operation produces a node that records its parent inputs and partial derivative functions.

### The Chain Rule in Reverse-Mode Autodiff
Given a loss $L$ dependent on intermediate variable $z = f(x, w)$, the gradient with respect to weight $w$ is computed as:

$$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}$$

```python
import torch
import torch.nn as nn

class SimpleMLP(nn.Module):
    def __init__(self, in_features: int, hidden: int, out_features: int):
        super().__init__()
        self.fc1 = nn.Linear(in_features, hidden)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden, out_features)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.relu(self.fc1(x))
        return self.fc2(h)

# Forward and backward pass
model = SimpleMLP(in_features=10, hidden=32, out_features=2)
x = torch.randn(4, 10)
y = torch.tensor([1, 0, 1, 0])

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)

optimizer.zero_grad()
outputs = model(x)
loss = criterion(outputs, y)
loss.backward()
optimizer.step()

print(f"Computed loss: {loss.item():.4f}")
```
"""
    },
    "dl-cnn-architectures": {
        "title": "Convolutional Neural Networks & ResNet Residual Skips",
        "description": "Feature maps, kernels, padding, pooling, and resolving vanishing gradients with deep residual connections.",
        "lessonType": "article",
        "duration": 25,
        "content": """
Convolutional layers replace dense matrix multiplications with local spatial receptive fields, enforcing **translation invariance** and dramatically reducing parameter counts.

### Why Residual Connections Matter
As deep networks exceed 20+ layers, optimization degrades because gradients repeatedly scaled by weight matrices tend toward 0 or explode. 

ResNet introduced the **identity shortcut**:

$$y = \\mathcal{F}(x, \\{W_i\\}) + x$$

Instead of learning an unreferenced underlying mapping $\\mathcal{H}(x)$, the network explicitly learns the residual $\\mathcal{F}(x) = \\mathcal{H}(x) - x$. If identity mapping is optimal, optimizer weights can simply decay toward zero.

```python
class ResidualBlock(nn.Module):
    def __init__(self, channels: int):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += identity  # Skip connection
        return self.relu(out)
```
"""
    },
    "dl-transformers-attention": {
        "title": "Scaled Dot-Product & Multi-Head Self-Attention",
        "description": "The math behind Query, Key, and Value projections, softmax temperature scaling, and attention masks.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/kCc8FmEb1nY",
        "duration": 34,
        "content": """
The Transformer architecture replaced recurrence with attention, allowing complete parallelization across entire context windows.

### Mathematical Formulation
Given query matrix $Q$, key matrix $K$, and value matrix $V$:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

The factor $\\frac{1}{\\sqrt{d_k}}$ counteracts the tendency of dot products to grow large in high-dimensional spaces, which would otherwise push softmax into regions with vanishingly small gradients.

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    weights = F.softmax(scores, dim=-1)
    output = torch.matmul(weights, V)
    return output, weights
```
"""
    },

    # Modern Python
    "py-memory-management": {
        "title": "CPython Memory Internals, Reference Counts & Garbage Collection",
        "description": "Understanding PyObject headers, arena allocators, cyclic reference detection, and weakref mechanics.",
        "lessonType": "article",
        "duration": 20,
        "content": """
Every variable in Python is a pointer referencing an underlying `PyObject` allocated on the heap. In this lesson, we explore how CPython tracks reference counts and when the cyclic garbage collector triggers generation-based sweeps.

```python
import sys
import gc

a = [1, 2, 3]
print("Initial Refcount:", sys.getrefcount(a) - 1)  # getrefcount adds 1 temporary ref

b = a
print("After assignment:", sys.getrefcount(a) - 1)  # 2

del b
print("After del:", sys.getrefcount(a) - 1)         # 1
```

### Cyclic Garbage Collection
Reference counting cannot reclaim objects referencing each other in a closed loop. CPython's generational GC tracks container objects across three generations (Gen 0, 1, and 2), identifying unreachable reference islands.
"""
    },
    "py-type-hierarchy": {
        "title": "Numeric Primitives, Precision Traps & Sequence Protocol",
        "description": "Arbitrary precision integers, IEEE-754 float rounding errors, Fraction, Decimal, and sequence dunders.",
        "lessonType": "article",
        "duration": 22,
        "content": """
Python handles numbers with remarkable flexibility, but production machine learning pipelines require an exact understanding of memory sizing and precision limitations.

### Floats vs. Decimals
Standard Python floats are 64-bit binary approximations. For financial computations and hyperparameter limits, use `decimal.Decimal` with explicit rounding contexts.

```python
from decimal import Decimal, getcontext

getcontext().prec = 6
val = Decimal('1.1') + Decimal('2.2')
print("Exact decimal:", val) # 3.3
```
"""
    },
    "py-closures-decorators": {
        "title": "Closures, Decorator Factories & functools.wraps",
        "description": "Cell objects, free variables, creating parameterized decorators, and preserving function introspection metadata.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/r7Dtus7N4pI",
        "duration": 26,
        "content": """
A closure is a function object that remembers values in enclosing lexical scopes even if they are no longer in memory.

```python
from functools import wraps
import time

def timing_decorator(threshold_ms: float = 100.0):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = fn(*args, **kwargs)
            elapsed = (time.perf_counter() - start) * 1000
            if elapsed > threshold_ms:
                print(f"[WARN] {fn.__name__} took {elapsed:.2f}ms (threshold: {threshold_ms}ms)")
            return result
        return wrapper
    return decorator

@timing_decorator(threshold_ms=50.0)
def compute_data():
    time.sleep(0.06)
    return "Complete"

compute_data()
```
"""
    },
    "py-oop-dunder-methods": {
        "title": "Object Protocols, Operator Overloading & C3 Linearization",
        "description": "Implementing rich comparisons, dunder operators, custom hashability, and cooperative multiple inheritance with super().",
        "lessonType": "article",
        "duration": 24,
        "content": """
Python classes are dynamic dictionaries governed by the descriptor protocol and special method lookups.

### Method Resolution Order (MRO)
Python uses the C3 Linearization algorithm to calculate a deterministic method resolution sequence in complex multiple inheritance hierarchies.

```python
class Vector:
    __slots__ = ('x', 'y')  # Memory optimization without __dict__ overhead

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: 'Vector') -> 'Vector':
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2.0, 3.5)
v2 = Vector(1.0, 4.0)
print(v1 + v2) # Vector(3.0, 7.5)
```
"""
    },
    "py-generators-coroutines": {
        "title": "Iterators, Infinite Streams & Generator-Based Coroutines",
        "description": "Yield expressions, bidirectional pipeline communication with send(), memory-efficient data streaming.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/D1twn9kLmYg",
        "duration": 25,
        "content": """
Generators suspend execution state on `yield`, allowing processing of multi-gigabyte datasets with near-zero memory consumption.

```python
from typing import Generator

def log_stream(filename: str) -> Generator[str, None, None]:
    with open(filename, "r") as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()

# Pipeline processing
def transform_pipeline(lines: Generator[str, None, None]):
    for line in lines:
        yield line.split(" - ")[-1]
```
"""
    },

    # Foundations of Machine Learning
    "ml-supervised-unsupervised-intro": {
        "title": "The Machine Learning Paradigm: From Rules to Representations",
        "description": "Contrasting heuristic programming with statistical learning, loss surfaces, and generalization bounds.",
        "lessonType": "article",
        "duration": 18,
        "content": """
In traditional software engineering, developers write explicit logic and feed input data to produce outputs:

$$\\text{Data} + \\text{Rules} \\longrightarrow \\text{Answers}$$

In **Machine Learning**, we invert this paradigm:

$$\\text{Data} + \\text{Answers} \\longrightarrow \\text{Rules (Learned Model)}$$

The objective is not merely to memorize training answers, but to capture the underlying probability distribution so the model can generalize to unseen samples drawn from the same domain.
"""
    },
    "ml-gradient-descent-mechanics": {
        "title": "Gradient Descent, Convex Optimization & Learning Rates",
        "description": "Mathematical derivation of parameter updates, learning rate schedules, and momentum.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/sDv4f4s2SB8",
        "duration": 22,
        "content": """
Gradient Descent iteratively nudges model parameters $\\theta$ opposite to the gradient vector of the empirical risk function $J(\\theta)$:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta J(\\theta_t)$$

Where $\\eta$ is the learning rate. We explore Batch, Mini-Batch, and Stochastic variants alongside momentum techniques.
"""
    },
    "ml-linear-regression-from-scratch": {
        "title": "Ordinary Least Squares & Closed-Form Normal Equation",
        "description": "Deriving analytical OLS solution via linear algebra, matrix inversion, and condition numbers.",
        "lessonType": "article",
        "duration": 24,
        "content": """
For linear models, the closed-form analytical solution that minimizes Mean Squared Error is given by the **Normal Equation**:

$$\\theta = (X^T X)^{-1} X^T y$$

```python
import numpy as np

# Generate synthetic linear data
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# Add bias column (x_0 = 1)
X_b = np.c_[np.ones((100, 1)), X]

# Compute normal equation
theta_best = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
print(f"Learned Intercept: {theta_best[0][0]:.4f}")
print(f"Learned Slope:     {theta_best[1][0]:.4f}")
```
"""
    },
    "ml-regularization-bias-variance": {
        "title": "Ridge, Lasso, ElasticNet & The Bias-Variance Tradeoff",
        "description": "Combating overfitting through L1/L2 penalty constraints, feature sparsity, and cross-validation.",
        "lessonType": "article",
        "duration": 21,
        "content": """
Overfitting occurs when a model captures random noise in training data rather than true underlying relationships. Regularization constrains model capacity:

- **Ridge Regression (L2)**: Adds $\\lambda \\sum \\theta_j^2$ penalty; shrinks weights smoothly without setting them strictly to zero.
- **Lasso Regression (L1)**: Adds $\\lambda \\sum |\\theta_j|$ penalty; produces sparse models by driving coefficients to zero (automatic feature selection).
"""
    },

    # Production RAG & LLMs
    "llm-embeddings-and-tokens": {
        "title": "Tokenization, Context Windows & High-Dimensional Embeddings",
        "description": "Byte-Pair Encoding (BPE), SentencePiece, vector representations, and semantic distance metrics.",
        "lessonType": "article",
        "duration": 20,
        "content": """
Language models do not read text directly—they process discrete numerical identifiers called **tokens**. In this lesson, we trace how strings convert into token embeddings in high-dimensional vector spaces (e.g. 1536 dimensions for OpenAI `text-embedding-3-small`).

### Cosine Similarity
To measure semantic similarity between two normalized embeddings $\\mathbf{u}$ and $\\mathbf{v}$:

$$\\text{Cosine Similarity} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$
"""
    },
    "llm-prompt-engineering-patterns": {
        "title": "System Prompts, Few-Shot In-Context Learning & Structured Outputs",
        "description": "Designing deterministic prompts, JSON Schema enforcement, Chain-of-Thought (CoT), and guardrails.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/jC4v5AS4RIM",
        "duration": 27,
        "content": """
Prompt engineering is structured interface design for non-deterministic inference engines. We cover:
- System Persona Framing
- Few-Shot Exemplars for few-shot in-context learning
- Structured JSON Schema enforcement with Pydantic
- ReAct (Reason + Act) loop architectures
"""
    },
    "llm-vector-search-pinecone-chroma": {
        "title": "Vector Databases, HNSW Indexing & Hybrid Search",
        "description": "Setting up ChromaDB and Pinecone, Approximate Nearest Neighbor (ANN) search, and BM25 hybrid ranking.",
        "lessonType": "article",
        "duration": 25,
        "content": """
Exact k-NN search requires $O(N)$ dot products across millions of vectors—unusable for production sub-second latency. Vector databases utilize **Hierarchical Navigable Small World (HNSW)** graphs to search in logarithmic $O(\\log N)$ time.
"""
    },
    "llm-autonomous-agents-tools": {
        "title": "Function Calling, Autonomous Tool Use & Multi-Agent Routing",
        "description": "Enabling models to execute API queries, execute SQL, browse documents, and coordinate in agent teams.",
        "lessonType": "video",
        "videoUrl": "https://www.youtube.com/embed/bQ003g36_tI",
        "duration": 30,
        "content": """
Giving language models tools turns passive question-answering engines into active software orchestrators. We cover OpenAI tool definition schemas, execution dispatch loops, and guardrail error-recovery strategies.
"""
    }
}

for slug, data in lessons.items():
    md_content = f"""---
title: "{data['title']}"
description: "{data['description']}"
lessonType: "{data['lessonType']}"
videoUrl: "{data.get('videoUrl', '')}"
duration: {data['duration']}
---
{data['content'].strip()}
"""
    file_path = os.path.join(LESSONS_DIR, f"{slug}.md")
    with open(file_path, "w") as f:
        f.write(md_content)
    print(f"Saved lesson: {slug}")

# -------------------------------------------------------------
# 2. QUIZZES
# -------------------------------------------------------------
quizzes = {
    "dl-neural-nets-quiz": {
        "title": "Neural Networks & Backpropagation Checkpoint",
        "description": "Verify your understanding of computation graphs, activation functions, and gradient updates.",
        "questions": [
            {
                "question": "What is the primary function of the activation function in a deep neural network?",
                "type": "mcq",
                "options": [
                    "To introduce non-linearity so the network can approximate non-linear functions",
                    "To normalize the input vectors to standard normal distribution",
                    "To speed up GPU matrix multiplications during the forward pass",
                    "To prevent integer overflow in float64 arrays"
                ],
                "correctAnswer": 0,
                "explanation": "Without non-linear activation functions, stacking multiple linear layers results in just a single composite linear transformation (W2 * W1 * x = W_eff * x)."
            },
            {
                "question": "Which of the following activation functions suffers from the vanishing gradient problem when inputs are very large positive or negative numbers?",
                "type": "mcq",
                "options": [
                    "Sigmoid",
                    "ReLU (Rectified Linear Unit)",
                    "Leaky ReLU",
                    "ELU"
                ],
                "correctAnswer": 0,
                "explanation": "Sigmoid saturates near 0 and 1, where its derivative approaches 0, causing gradients to vanish when backpropagating through deep layers."
            },
            {
                "question": "Which techniques help prevent vanishing gradients in deep architectures?",
                "type": "msq",
                "options": [
                    "Residual skip connections (ResNet)",
                    "Batch Normalization / Layer Normalization",
                    "Using ReLU or GELU activations",
                    "Increasing the learning rate to 10.0"
                ],
                "correctAnswers": [0, 1, 2],
                "explanation": "Residual connections, normalization layers, and non-saturating activations all directly combat vanishing gradients."
            }
        ]
    },
    "dl-transformers-quiz": {
        "title": "Transformers & Self-Attention Architecture",
        "description": "Test your mastery of Query-Key-Value projections and multi-head attention mechanics.",
        "questions": [
            {
                "question": "In Scaled Dot-Product Attention, why are dot products scaled by 1/sqrt(d_k)?",
                "type": "mcq",
                "options": [
                    "To counteract large values pushing the softmax function into regions with tiny gradients",
                    "To ensure that the output tensor is strictly orthogonal",
                    "To reduce memory usage on CUDA device allocations",
                    "To convert logits into boolean masks"
                ],
                "correctAnswer": 0,
                "explanation": "For large projection dimensions, the variance of dot products grows as d_k, which pushes softmax into saturated areas with near-zero gradients."
            },
            {
                "question": "What enables Transformers to process all tokens in a prompt in parallel during training, unlike RNNs?",
                "type": "mcq",
                "options": [
                    "Self-attention operates across all token pairs simultaneously as matrix multiplications",
                    "Transformers do not use matrix multiplication",
                    "Hidden state is passed sequentially from left to right",
                    "Transformers discard word order entirely"
                ],
                "correctAnswer": 0,
                "explanation": "Because each layer attends across the entire sequence via matrix operations without sequential recurrent loops, training is completely parallelized."
            }
        ]
    },
    "py-advanced-quiz": {
        "title": "Python Internals & Memory Architecture",
        "description": "Checkpoint test covering refcounts, closures, descriptors, and generators.",
        "questions": [
            {
                "question": "What is the primary benefit of declaring `__slots__` in a custom Python class?",
                "type": "mcq",
                "options": [
                    "Eliminates the per-instance `__dict__` overhead, saving memory for millions of instances",
                    "Prevents subclasses from inheriting methods",
                    "Automatically compiles Python bytecode into C machine code",
                    "Makes all instance attributes strictly immutable"
                ],
                "correctAnswer": 0,
                "explanation": "`__slots__` tells Python to allocate fixed descriptor references in a C array rather than maintaining an unrestricted dict for every instance."
            },
            {
                "question": "Which method in the Descriptor Protocol is called when accessing an attribute on an instance?",
                "type": "mcq",
                "options": [
                    "__get__(self, instance, owner)",
                    "__set__(self, instance, value)",
                    "__getattr__(self, name)",
                    "__access__(self, obj)"
                ],
                "correctAnswer": 0,
                "explanation": "The descriptor protocol specifies `__get__(self, instance, owner)` for reading attribute values."
            }
        ]
    },
    "ml-regression-metrics-quiz": {
        "title": "Evaluation Metrics & Optimization Checkpoint",
        "description": "Assess your intuition on MSE, RMSE, MAE, R-squared, and Gradient Descent.",
        "questions": [
            {
                "question": "Why is Mean Absolute Error (MAE) more robust to large outliers than Mean Squared Error (MSE)?",
                "type": "mcq",
                "options": [
                    "MAE penalizes errors linearly rather than quadratically",
                    "MAE ignores all negative residuals",
                    "MSE divides the error by total features instead of samples",
                    "MAE is an unweighted derivative"
                ],
                "correctAnswer": 0,
                "explanation": "Squaring the error in MSE disproportionately magnifies large outlier residuals, whereas MAE scales proportionally."
            },
            {
                "question": "What is indicated when a model achieves 0.0 MSE on training data but very high MSE on test data?",
                "type": "mcq",
                "options": [
                    "Severe Overfitting (High Variance)",
                    "Severe Underfitting (High Bias)",
                    "Optimal Generalization",
                    "Data Leakage from the test set"
                ],
                "correctAnswer": 0,
                "explanation": "Memorizing training data while failing on unseen test samples is the hallmark of overfitting / high variance."
            }
        ]
    },
    "llm-rag-architectures-quiz": {
        "title": "Retrieval Augmented Generation & Embeddings Checkpoint",
        "description": "Verify your understanding of vector similarity, chunking strategies, and hybrid retrieval.",
        "questions": [
            {
                "question": "What is the primary advantage of Hybrid Search (combining Dense Vector Search with Sparse BM25)?",
                "type": "mcq",
                "options": [
                    "It captures both conceptual semantics (vector) and exact keyword/part-number matches (sparse)",
                    "It reduces vector database disk size by half",
                    "It eliminates the need for token embeddings",
                    "It speeds up LLM generation latency"
                ],
                "correctAnswer": 0,
                "explanation": "Dense vectors capture general semantics but often struggle with precise product codes, acronyms, and names where keyword search (BM25) excels."
            },
            {
                "question": "What is the purpose of re-ranking retrieved documents before passing them into an LLM context?",
                "type": "mcq",
                "options": [
                    "To apply cross-encoder models that accurately score relevance for top-K candidates",
                    "To translate the retrieved documents to another language",
                    "To generate summary embeddings for the query",
                    "To delete duplicate documents from the database"
                ],
                "correctAnswer": 0,
                "explanation": "Cross-encoder re-rankers analyze query and chunk together with full cross-attention, providing higher precision relevance scores than fast vector search alone."
            }
        ]
    }
}

for slug, data in quizzes.items():
    file_path = os.path.join(QUIZZES_DIR, f"{slug}.yaml")
    with open(file_path, "w") as f:
        yaml.dump(data, f, sort_keys=False)
    print(f"Saved quiz: {slug}")

# -------------------------------------------------------------
# 3. ASSIGNMENTS
# -------------------------------------------------------------
assignments = {
    "dl-vision-classifier-project": {
        "title": "Project: Train a ResNet Vision Classifier with PyTorch",
        "description": "Build, train, and evaluate a residual convolutional network on a custom dataset, implementing custom data augmentations and learning rate scheduling.",
        "rubric": [
            {"criteria": "Proper PyTorch Dataset & DataLoader with Augmentations", "maxPoints": 25},
            {"criteria": "Correct Residual Block Implementation with Skip Connections", "maxPoints": 30},
            {"criteria": "Training Loop with Mixed-Precision (torch.cuda.amp) & Loss Logging", "maxPoints": 25},
            {"criteria": "Evaluation Report: Confusion Matrix & Top-1 / Top-5 Accuracy > 85%", "maxPoints": 20}
        ],
        "resources": [
            {"title": "Starter Notebook (Google Colab / Jupyter)", "url": "https://github.com/encodeedge/course-materials"},
            {"title": "Dataset Download (CIFAR-100 Subset)", "url": "https://pytorch.org/vision/stable/datasets.html"}
        ],
        "instructions": """
### Capstone Objective
In this project, you will develop a complete end-to-end computer vision pipeline using PyTorch.

#### Requirements
1. **Data Pipeline**:
   - Implement random cropping, horizontal flips, and color jitter augmentations.
   - Use `DataLoader` with pinned memory and multi-worker prefetching.
2. **Model Architecture**:
   - Construct a modular `ResidualBlock` class.
   - Chain 4 residual stages with projection shortcuts when spatial dimensions downsample.
3. **Training & Optimization**:
   - Optimize using `AdamW` with cosine annealing learning rate scheduling.
   - Use `torch.cuda.amp.autocast` for FP16 mixed precision acceleration.
4. **Deliverables**:
   - Submit your GitHub repository URL or Colab link containing the complete code and evaluation plots.
"""
    },
    "py-stream-processing-project": {
        "title": "Project: High-Throughput Log Streamer with Generators & AsyncIO",
        "description": "Implement a memory-bounded streaming log analysis engine capable of processing 10GB+ files with less than 50MB resident memory footprint.",
        "rubric": [
            {"criteria": "Zero-copy generator pipeline implementation", "maxPoints": 30},
            {"criteria": "Bounded memory consumption verified with memory_profiler (< 50MB)", "maxPoints": 30},
            {"criteria": "Async batching & real-time anomaly detection alerts", "maxPoints": 25},
            {"criteria": "Clean type annotations and comprehensive pytest suite", "maxPoints": 15}
        ],
        "resources": [
            {"title": "Sample 2GB Log File Generator Script", "url": "https://github.com/encodeedge/course-materials"},
            {"title": "Python Memory Profiling Guide", "url": "https://pypi.org/project/memory-profiler/"}
        ],
        "instructions": """
### Capstone Objective
Build a production-grade streaming log pipeline in pure Python.

#### Key Features:
1. **Producer**: Yields log records line by line from disk without loading full contents into memory.
2. **Transformer**: Parses timestamps, IP addresses, and HTTP status codes using regex compiled once.
3. **Aggregator**: Computes windowed error rates (e.g. 5xx status codes per minute) using `collections.deque`.
4. **Benchmarking**: Include benchmark graphs proving your resident memory stays flat regardless of file size.
"""
    },
    "ml-housing-price-predictor": {
        "title": "Project: End-to-End Regression Pipeline & Model Deployment",
        "description": "Construct a feature engineering and regularized regression model with Scikit-Learn, including cross-validation and hyperparameter tuning.",
        "rubric": [
            {"criteria": "Exploratory Data Analysis & Outlier Handling", "maxPoints": 20},
            {"criteria": "Feature Scaling & Scikit-Learn ColumnTransformer Pipeline", "maxPoints": 30},
            {"criteria": "Cross-Validated Ridge & ElasticNet Hyperparameter Search", "maxPoints": 30},
            {"criteria": "Model Serialization (Joblib) & FastAPI Prediction Endpoint", "maxPoints": 20}
        ],
        "resources": [
            {"title": "California Housing Dataset", "url": "https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset"},
            {"title": "Starter FastAPI Server Template", "url": "https://fastapi.tiangolo.com/"}
        ],
        "instructions": """
### Capstone Objective
Deliver a production-ready machine learning regression microservice.

#### Project Milestones:
1. Clean raw housing data, impute missing values, and engineer interaction features.
2. Build an encapsulated `sklearn.pipeline.Pipeline` with scaling and regularized estimators.
3. Report final RMSE, MAE, and $R^2$ scores on an untouched test partition.
4. Wrap the serialized model inside a FastAPI endpoint validating incoming JSON payloads with Pydantic.
"""
    },
    "llm-enterprise-rag-assistant": {
        "title": "Project: Enterprise RAG Pipeline with Hybrid Search & Citations",
        "description": "Build an end-to-end Retrieval Augmented Generation engine that ingests PDF documentation, indexes chunks in a vector store, and returns answers with verifiable citations.",
        "rubric": [
            {"criteria": "Document Ingestion, Semantic Chunking & Metadata Attachment", "maxPoints": 25},
            {"criteria": "ChromaDB / Pinecone Indexing with Hybrid BM25 Retrieval", "maxPoints": 30},
            {"criteria": "Cross-Encoder Re-ranking & Precision Context Pruning", "maxPoints": 25},
            {"criteria": "Grounded Response Generation with Inline Page Citations", "maxPoints": 20}
        ],
        "resources": [
            {"title": "Starter Documentation Corpus (Technical Manuals)", "url": "https://github.com/encodeedge/course-materials"},
            {"title": "RAG Evaluation Benchmark Notebook (RAGAS)", "url": "https://docs.ragas.io/"}
        ],
        "instructions": """
### Capstone Objective
Create a resilient, hallucination-resistant RAG system capable of accurately answering enterprise queries.

#### Requirements:
1. **Chunking**: Implement semantic-boundary chunking (800 tokens with 150 token overlap).
2. **Retrieval**: Query vector index and BM25 sparse index; blend scores using Reciprocal Rank Fusion (RRF).
3. **Synthesis**: Direct the LLM to refuse answering if the retrieved context is insufficient, and format answers with citation links: `[Source: Doc A, Page 12]`.
"""
    }
}

for slug, data in assignments.items():
    rubric_yaml = yaml.dump(data["rubric"], sort_keys=False)
    resources_yaml = yaml.dump(data["resources"], sort_keys=False)
    
    # Format as markdown with frontmatter
    md_content = f"""---
title: "{data['title']}"
description: "{data['description']}"
rubric:
{yaml.dump(data['rubric'], indent=2).strip()}
resources:
{yaml.dump(data['resources'], indent=2).strip()}
---
{data['instructions'].strip()}
"""
    file_path = os.path.join(ASSIGNMENTS_DIR, f"{slug}.md")
    with open(file_path, "w") as f:
        f.write(md_content)
    print(f"Saved assignment: {slug}")

# -------------------------------------------------------------
# 4. COURSES
# -------------------------------------------------------------
courses_data = {
    "applied-deep-learning": {
        "title": "Applied Deep Learning",
        "shortDescription": "Master deep neural networks from mathematical foundations to production Transformers. Implement backprop from scratch, train deep CNNs, and build modern self-attention mechanisms with PyTorch.",
        "coverImage": "/assets/courses/applied-deep-learning.svg",
        "instructor": "atul-jha",
        "level": "advanced",
        "status": "published",
        "chapters": [
            {
                "title": "Deep Learning Foundations & Setup",
                "description": "Environment configuration, tensor vectorization, and computational thinking.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "dl-welcome"}},
                    {"discriminant": "lesson", "value": {"lessonRef": "dl-python-foundations"}}
                ]
            },
            {
                "title": "Neural Networks & Backpropagation",
                "description": "Deriving automatic differentiation, loss landscapes, and activation functions.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "dl-perceptrons-and-backprop"}},
                    {"discriminant": "quiz", "value": {"quizRef": "dl-neural-nets-quiz"}}
                ]
            },
            {
                "title": "Computer Vision & Residual Networks",
                "description": "Feature extraction, spatial hierarchies, and deep ResNet architectures.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "dl-cnn-architectures"}},
                    {"discriminant": "assignment", "value": {"assignmentRef": "dl-vision-classifier-project"}}
                ]
            },
            {
                "title": "Transformers & Modern Attention",
                "description": "Scaled dot-product attention, multi-head projections, and decoding blocks.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "dl-transformers-attention"}},
                    {"discriminant": "quiz", "value": {"quizRef": "dl-transformers-quiz"}}
                ]
            }
        ],
        "about": """
### Why This Course Matters
Modern Artificial Intelligence is driven by deep learning. Yet most tutorials teach superficial syntax without imparting the architectural intuition needed to train models that actually converge in real-world environments.

In this comprehensive, code-centric course, you will bridge the gap between academic research papers and production-ready PyTorch implementations.

### What You Will Build:
- A custom autograd engine simulating PyTorch's reverse-mode differentiation.
- High-accuracy convolutional classifiers with residual connections and mixed precision.
- A functional multi-head self-attention module powering modern Generative AI.
"""
    },
    "python-mastery-for-ai": {
        "title": "Modern Python for AI & High-Performance Systems",
        "description": "Unlock CPython memory architecture, reference counting, the descriptor protocol, metaclasses, and zero-copy generator streams for massive machine learning workloads.",
        "shortDescription": "Unlock CPython memory architecture, reference counting, the descriptor protocol, metaclasses, and zero-copy generator streams for massive machine learning workloads.",
        "coverImage": "/assets/courses/python-mastery-for-ai.svg",
        "instructor": "atul-jha",
        "level": "intermediate",
        "status": "published",
        "chapters": [
            {
                "title": "CPython Internals & Memory Architecture",
                "description": "Heap objects, arena allocators, refcounts, and generational garbage collection.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "py-memory-management"}},
                    {"discriminant": "lesson", "value": {"lessonRef": "py-type-hierarchy"}}
                ]
            },
            {
                "title": "Metaprogramming & Dunder Protocols",
                "description": "Closures, decorator factories, operator overloading, and C3 Linearization.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "py-closures-decorators"}},
                    {"discriminant": "lesson", "value": {"lessonRef": "py-oop-dunder-methods"}},
                    {"discriminant": "quiz", "value": {"quizRef": "py-advanced-quiz"}}
                ]
            },
            {
                "title": "High-Throughput Streams & Concurrency",
                "description": "Lazy generator evaluation, bidirectional coroutines, and memory optimization.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "py-generators-coroutines"}},
                    {"discriminant": "assignment", "value": {"assignmentRef": "py-stream-processing-project"}}
                ]
            }
        ],
        "about": """
### The Engine Behind Modern AI
Python is the lingua franca of machine learning, but high-throughput pipelines demand a deep understanding of its internal execution model.

Learn how to write blazing-fast, memory-bounded Python code that handles multi-gigabyte datasets without memory leaks or unnecessary garbage collection pauses.
"""
    },
    "foundations-of-machine-learning": {
        "title": "Machine Learning Foundations & Statistical Modeling",
        "description": "Develop unshakeable intuition for machine learning mathematics: loss functions, gradient descent optimization, regularized regression, and validation strategies.",
        "shortDescription": "Develop unshakeable intuition for machine learning mathematics: loss functions, gradient descent optimization, regularized regression, and validation strategies.",
        "coverImage": "/assets/courses/foundations-of-machine-learning.svg",
        "instructor": "atul-jha",
        "level": "beginner",
        "status": "published",
        "chapters": [
            {
                "title": "The Machine Learning Paradigm",
                "description": "Mathematical framing, empirical risk minimization, and loss surfaces.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "ml-supervised-unsupervised-intro"}},
                    {"discriminant": "lesson", "value": {"lessonRef": "ml-gradient-descent-mechanics"}}
                ]
            },
            {
                "title": "Regression & Analytical Solutions",
                "description": "Ordinary least squares, normal equations, and regression metrics.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "ml-linear-regression-from-scratch"}},
                    {"discriminant": "quiz", "value": {"quizRef": "ml-regression-metrics-quiz"}}
                ]
            },
            {
                "title": "Regularization & Model Validation",
                "description": "Controlling variance with Ridge, Lasso, and k-fold cross-validation.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "ml-regularization-bias-variance"}},
                    {"discriminant": "assignment", "value": {"assignmentRef": "ml-housing-price-predictor"}}
                ]
            }
        ],
        "about": """
### Ground Your Career on Real Fundamentals
Never treat machine learning algorithms as black boxes. This course covers the exact calculus, linear algebra, and statistical mechanics that power predictive models in industry.
"""
    },
    "practical-rag-and-llm-engineering": {
        "title": "Building Production RAG & LLM Systems",
        "description": "Architect enterprise Retrieval Augmented Generation systems. Master tokenization, vector databases (ChromaDB, Pinecone), hybrid search, and autonomous agents.",
        "shortDescription": "Architect enterprise Retrieval Augmented Generation systems. Master tokenization, vector databases (ChromaDB, Pinecone), hybrid search, and autonomous agents.",
        "coverImage": "/assets/courses/practical-rag-and-llm-engineering.svg",
        "instructor": "atul-jha",
        "level": "intermediate",
        "status": "published",
        "chapters": [
            {
                "title": "Tokenization & Prompt Architecture",
                "description": "Byte-pair encoding, high-dimensional embeddings, and structured outputs.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "llm-embeddings-and-tokens"}},
                    {"discriminant": "lesson", "value": {"lessonRef": "llm-prompt-engineering-patterns"}}
                ]
            },
            {
                "title": "Vector Databases & Retrieval Augmented Generation",
                "description": "Approximate nearest neighbors, HNSW graphs, and hybrid BM25 search.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "llm-vector-search-pinecone-chroma"}},
                    {"discriminant": "quiz", "value": {"quizRef": "llm-rag-architectures-quiz"}}
                ]
            },
            {
                "title": "Agents, Tool Calling & Citations",
                "description": "Function calling schemas, multi-agent orchestration, and verifiable citations.",
                "items": [
                    {"discriminant": "lesson", "value": {"lessonRef": "llm-autonomous-agents-tools"}},
                    {"discriminant": "assignment", "value": {"assignmentRef": "llm-enterprise-rag-assistant"}}
                ]
            }
        ],
        "about": """
### Build What Companies Are Actively Hiring For
Generative AI is only as useful as the private enterprise data it can reliably access. In this hands-on course, you'll construct full-stack RAG systems with verified citations, low latency, and zero hallucinations.
"""
    }
}

for slug, data in courses_data.items():
    chapters_yaml = yaml.dump(data["chapters"], sort_keys=False)
    md_content = f"""---
title: "{data['title']}"
shortDescription: "{data['shortDescription']}"
coverImage: "{data['coverImage']}"
instructor: "{data['instructor']}"
level: "{data['level']}"
status: "{data['status']}"
chapters:
{yaml.dump(data['chapters'], indent=2).strip()}
---
{data['about'].strip()}
"""
    file_path = os.path.join(COURSES_DIR, f"{slug}.md")
    with open(file_path, "w") as f:
        f.write(md_content)
    print(f"Saved course: {slug}")

# -------------------------------------------------------------
# 5. BATCHES
# -------------------------------------------------------------
batches_data = {
    "applied-deep-learning-spring-2026": {
        "title": "Applied Deep Learning - Spring 2026 Cohort",
        "course": "applied-deep-learning",
        "startDate": "2026-04-15",
        "endDate": "2026-06-15",
        "capacity": 30,
        "price": 299,
        "status": "upcoming",
        "content": "Join our 8-week intensive live cohort with bi-weekly live workshops, code reviews, and capstone project feedback."
    },
    "python-mastery-may-2026": {
        "title": "Modern Python for AI - May 2026 Intensive",
        "course": "python-mastery-for-ai",
        "startDate": "2026-05-01",
        "endDate": "2026-06-01",
        "capacity": 25,
        "price": 199,
        "status": "upcoming",
        "content": "4 weeks of deep-dive CPython architecture, high-throughput pipeline design, and asynchronous streaming."
    },
    "production-rag-june-2026": {
        "title": "Enterprise RAG & Agent Engineering - June Cohort",
        "course": "practical-rag-and-llm-engineering",
        "startDate": "2026-06-01",
        "endDate": "2026-07-15",
        "capacity": 20,
        "price": 349,
        "status": "upcoming",
        "content": "Build and deploy production RAG pipelines with Pinecone, LangGraph, and automated evaluation frameworks."
    }
}

for slug, data in batches_data.items():
    md_content = f"""---
title: "{data['title']}"
course: "{data['course']}"
startDate: {data['startDate']}
endDate: {data['endDate']}
capacity: {data['capacity']}
price: {data['price']}
status: "{data['status']}"
---
{data['content']}
"""
    file_path = os.path.join(BATCHES_DIR, f"{slug}.md")
    with open(file_path, "w") as f:
        f.write(md_content)
    print(f"Saved batch: {slug}")

print("All LMS content generated successfully!")

