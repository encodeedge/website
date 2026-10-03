---
title: "Building Custom Optimizers from Scratch in Python"
description: "Writing modular optimizer classes (SGD, Momentum, RMSProp, Adam) and cleanly integrating them into the custom neural network training loop."
lessonType: "video"
interactiveLab: "none"
duration: 35
---

### Curriculum Objectives
This lesson covers the core engineering concepts and implementations for:
- Modular Python BaseOptimizer Architecture
- Implementing Momentum, RMSProp, and Adam Step Functions
- Optimizer State Dictionaries (Velocity, Variance Buffers)

### Overview
Code clean, production-grade optimizer classes from scratch in Python and integrate them seamlessly into the backpropagation parameter update step.

### Key Concepts & Takeaways
- Decoupling model forward/backward graph logic from parameter update schemes
- Managing per-layer velocity (v) and squared gradient moving average (s) buffers across epochs
- Comparing training curves and convergence speed across different optimizer choices

*Content placeholder — you can add specific lecture notes, video embeds, and hands-on exercises here.*
