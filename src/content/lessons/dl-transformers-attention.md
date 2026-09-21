---
title: "Scaled Dot-Product & Multi-Head Self-Attention"
description: "The math behind Query, Key, and Value projections, softmax temperature scaling, and attention masks."
lessonType: "video"
videoUrl: "https://www.youtube.com/embed/kCc8FmEb1nY"
duration: 34
---
The Transformer architecture replaced recurrence with attention, allowing complete parallelization across entire context windows.

### Mathematical Formulation
Given query matrix $Q$, key matrix $K$, and value matrix $V$:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

The factor $\frac{1}{\sqrt{d_k}}$ counteracts the tendency of dot products to grow large in high-dimensional spaces, which would otherwise push softmax into regions with vanishingly small gradients.

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
