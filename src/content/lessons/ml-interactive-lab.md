---
title: "Interactive Loss Surface & Gradient Descent Optimizer Lab"
description: "Hands-on virtual laboratory visualizing convex and non-convex loss surfaces, gradient trajectories, and optimizer convergence mechanics."
lessonType: "lab"
interactiveLab: "gradient-descent"
duration: 25
---

Welcome to the **Loss Surface Optimization & Gradient Descent Lab**.

Training machine learning models is fundamentally an optimization exercise: navigating high-dimensional parameter spaces to find global or high-quality local minima of empirical risk functions.

### Lab Objectives
1. Compare convergence rates across Batch Gradient Descent, Mini-Batch SGD, and AdamW.
2. Observe how momentum vectors prevent oscillation in ravine geometries and escape shallow local saddle points.
3. Experiment with learning rate schedules to avoid explosive divergence or premature stagnation.

### Interactive Optimization Simulator
Interact with the visual loss landscape below to test initial starting coordinates, learning rates ($\alpha$), and momentum coefficients ($\beta$).

```python
import numpy as np

# Quadratic bowl: f(w) = 0.5 * (w1^2 + 10 * w2^2)
def loss(w):
    return 0.5 * (w[0]**2 + 10 * w[1]**2)

def grad(w):
    return np.array([w[0], 10 * w[1]])

# Gradient Descent with Momentum
w = np.array([4.0, 2.0])
v = np.zeros_like(w)
lr = 0.1
beta = 0.9

print(f"Initial weights: {w}, Initial loss: {loss(w):.4f}")

for step in range(1, 6):
    g = grad(w)
    v = beta * v + (1 - beta) * g
    w = w - lr * v
    print(f"Step {step}: w={np.round(w, 4)}, Loss={loss(w):.4f}")
```

### Essential Principles
- **Condition Number:** Ravines with vastly different curvature eigenvalues cause standard gradient descent to oscillate perpendicularly to the gradient direction rather than progressing down the valley.
- **Adaptive Rates:** Optimizers like Adam and RMSprop divide updates by the exponentially decaying root-mean-square of past gradients, equalizing step sizes across sensitive and insensitive dimensions.

