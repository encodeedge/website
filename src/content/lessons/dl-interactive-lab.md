---
title: "Interactive Neural Network & Activation Playground"
description: "Hands-on virtual laboratory exploring feedforward perceptron layers, non-linear activation response curves, and real-time loss backpropagation."
lessonType: "lab"
interactiveLab: "neural-playground"
duration: 25
---

Welcome to the **Deep Neural Network & Backpropagation Playground**.

Deep neural networks rely on composing linear transformations ($z = Wx + b$) with non-linear activation functions ($\sigma(z)$) to approximate arbitrary decision boundaries. In this interactive lab, you can tweak weights, select activations, and observe forward-backward passes step-by-step.

### Lab Objectives
1. Understand how activation function choice (ReLU, Sigmoid, Tanh, GELU) impacts gradient saturation and vanishing gradients.
2. Trace the exact chain rule computation during reverse-mode automatic differentiation.
3. Test how changing learning rate parameters influences weight convergence and stability.

### Interactive Model Playground
Use the live visualizer below to inject input values, adjust weights interactively, and inspect pre-activation vs post-activation values.

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def relu_grad(z):
    return (z > 0).astype(float)

# Forward pass through a single hidden layer
x = np.array([0.7, -1.2])
W1 = np.array([[0.5, -0.3], [0.8, 0.2]])
b1 = np.array([0.1, -0.1])

z1 = np.dot(W1, x) + b1
h1 = relu(z1)

print(f"Input features: {x}")
print(f"Hidden Pre-activation z: {np.round(z1, 4)}")
print(f"Hidden Activation h (ReLU): {np.round(h1, 4)}")
```

### Core Architecture Insights
- **Dead ReLUs:** If an input pushes pre-activation $z < 0$, the gradient $\frac{\partial \text{ReLU}}{\partial z} = 0$, stopping weight updates for that neuron. Modern architectures use Leaky ReLU or GELU to mitigate dead neurons.
- **Logit Calibration:** In multi-class classification, softmax transforms unconstrained logit vectors into a normalized probability distribution where $\sum p_i = 1.0$.

