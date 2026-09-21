---
title: "Interactive Vector Embeddings & Semantic Search Lab"
description: "Hands-on virtual laboratory exploring dense vector spaces, cosine similarity metrics, top-k retrieval, and chunking trade-offs for production RAG pipelines."
lessonType: "lab"
interactiveLab: "code-sandbox"
duration: 25
---

Welcome to the **Vector Embeddings & Semantic Retrieval Lab**.

Retrieval Augmented Generation (RAG) bridges private knowledge stores with foundational Large Language Models. At the center of every RAG system lies vector semantic search: converting raw text passages into high-dimensional geometric embeddings where semantic similarity maps directly to angular proximity.

### Lab Objectives
1. Understand vector normalization and calculate dot products vs cosine distances.
2. Explore Approximate Nearest Neighbor (ANN) index behaviors (HNSW graphs and IVF partitions).
3. Evaluate chunking strategies: how document overlap and token boundaries influence embedding fidelity.

### Interactive Vector Search & Embeddings Playground
Use the live Python code sandbox below to compute document embeddings, query vectors, and rank retrieved chunks by relevance score.

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Simulated 4-dimensional semantic embeddings
docs = {
    "Doc 1 (Python Allocator)": np.array([0.9, 0.1, 0.05, 0.2]),
    "Doc 2 (Transformer Attention)": np.array([0.15, 0.85, 0.9, 0.3]),
    "Doc 3 (Vector DB HNSW Index)": np.array([0.2, 0.7, 0.88, 0.45]),
}

# User Query: "How does vector index nearest neighbor retrieval work?"
query = np.array([0.18, 0.75, 0.92, 0.4])

print("Query-Document Relevance Scores:")
for name, vec in docs.items():
    score = cosine_similarity(query, vec)
    print(f"  {name}: {score:.4f}")
```

### Production RAG Best Practices
- **Reciprocal Rank Fusion (RRF):** Combine dense vector search with sparse keyword search (BM25) to avoid catastrophic misses when users search for specific error codes or part numbers.
- **Rerankers:** Pass top-50 vector results into a Cross-Encoder reranker (such as `bge-reranker-large`) to produce higher precision top-5 context windows for the LLM.

