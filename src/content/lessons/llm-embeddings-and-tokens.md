---
title: "Tokenization, Context Windows & High-Dimensional Embeddings"
description: "Byte-Pair Encoding (BPE), SentencePiece, vector representations, and semantic distance metrics."
lessonType: "article"
videoUrl: ""
duration: 20
---
Language models do not read text directly—they process discrete numerical identifiers called **tokens**. In this lesson, we trace how strings convert into token embeddings in high-dimensional vector spaces (e.g. 1536 dimensions for OpenAI `text-embedding-3-small`).

### Cosine Similarity
To measure semantic similarity between two normalized embeddings $\mathbf{u}$ and $\mathbf{v}$:

$$\text{Cosine Similarity} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$
