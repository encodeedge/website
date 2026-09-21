---
title: "Project: High-Throughput Log Streamer with Generators & AsyncIO"
description: "Implement a memory-bounded streaming log analysis engine capable of processing 10GB+ files with less than 50MB resident memory footprint."
rubric:
- criteria: Zero-copy generator pipeline implementation
  maxPoints: 30
- criteria: Bounded memory consumption verified with memory_profiler (< 50MB)
  maxPoints: 30
- criteria: Async batching & real-time anomaly detection alerts
  maxPoints: 25
- criteria: Clean type annotations and comprehensive pytest suite
  maxPoints: 15
resources:
- title: Sample 2GB Log File Generator Script
  url: https://github.com/encodeedge/course-materials
- title: Python Memory Profiling Guide
  url: https://pypi.org/project/memory-profiler/
---
### Capstone Objective
Build a production-grade streaming log pipeline in pure Python.

#### Key Features:
1. **Producer**: Yields log records line by line from disk without loading full contents into memory.
2. **Transformer**: Parses timestamps, IP addresses, and HTTP status codes using regex compiled once.
3. **Aggregator**: Computes windowed error rates (e.g. 5xx status codes per minute) using `collections.deque`.
4. **Benchmarking**: Include benchmark graphs proving your resident memory stays flat regardless of file size.
