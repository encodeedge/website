---
title: "Vector Databases, HNSW Indexing & Hybrid Search"
description: "Setting up ChromaDB and Pinecone, Approximate Nearest Neighbor (ANN) search, and BM25 hybrid ranking."
lessonType: "article"
videoUrl: ""
duration: 25
---
Exact k-NN search requires $O(N)$ dot products across millions of vectors—unusable for production sub-second latency. Vector databases utilize **Hierarchical Navigable Small World (HNSW)** graphs to search in logarithmic $O(\log N)$ time.
