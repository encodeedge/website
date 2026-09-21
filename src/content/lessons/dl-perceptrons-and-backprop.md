---
title: "Multi-Layer Perceptrons & Computational Graphs"
description: "Deriving automatic differentiation, loss calculation, forward passes, and backward gradients via the chain rule."
lessonType: "video"
videoUrl: "https://www.youtube.com/embed/VMj-3S1tku0"
duration: 28
---
At the core of deep learning is the **computational graph**. Every mathematical operation produces a node that records its parent inputs and partial derivative functions.

### The Chain Rule in Reverse-Mode Autodiff
Given a loss $L$ dependent on intermediate variable $z = f(x, w)$, the gradient with respect to weight $w$ is computed as:

$$\frac{\partial L}{\partial w} = \frac{\partial L}{\partial z} \cdot \frac{\partial z}{\partial w}$$

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
