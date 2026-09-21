---
title: "Project: Enterprise RAG Pipeline with Hybrid Search & Citations"
description: "Build an end-to-end Retrieval Augmented Generation engine that ingests PDF documentation, indexes chunks in a vector store, and returns answers with verifiable citations."
rubric:
- criteria: Document Ingestion, Semantic Chunking & Metadata Attachment
  maxPoints: 25
- criteria: ChromaDB / Pinecone Indexing with Hybrid BM25 Retrieval
  maxPoints: 30
- criteria: Cross-Encoder Re-ranking & Precision Context Pruning
  maxPoints: 25
- criteria: Grounded Response Generation with Inline Page Citations
  maxPoints: 20
resources:
- title: Starter Documentation Corpus (Technical Manuals)
  url: https://github.com/encodeedge/course-materials
- title: RAG Evaluation Benchmark Notebook (RAGAS)
  url: https://docs.ragas.io/
---
### Capstone Objective
Create a resilient, hallucination-resistant RAG system capable of accurately answering enterprise queries.

#### Requirements:
1. **Chunking**: Implement semantic-boundary chunking (800 tokens with 150 token overlap).
2. **Retrieval**: Query vector index and BM25 sparse index; blend scores using Reciprocal Rank Fusion (RRF).
3. **Synthesis**: Direct the LLM to refuse answering if the retrieved context is insufficient, and format answers with citation links: `[Source: Doc A, Page 12]`.
