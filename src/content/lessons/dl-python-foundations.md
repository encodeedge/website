---
title: "Vectorized Operations with NumPy & PyTorch Tensors"
description: "Understanding stride mechanics, broadcasting rules, tensor shapes, and zero-copy operations in memory."
lessonType: "article"
videoUrl: ""
duration: 22
---
Before training neural networks, machine learning engineers must master **vectorized operations** and memory layouts. Operating on multidimensional arrays row-by-row in Python loops is thousands of times slower than SIMD vectorized kernel execution.

### Memory Strides & Storage
A tensor is composed of a flat 1D block of contiguous memory, paired with a metadata header specifying:
- **Shape**: The dimensions of the tensor `(d_0, d_1, ..., d_k)`
- **Strides**: The number of bytes to step in memory to advance by one element along each dimension
- **Dtype**: The precision data format (`torch.float32`, `torch.float16`, `torch.bfloat16`)

```python
import torch

# Create a 2D tensor
x = torch.tensor([[1.0, 2.0, 3.0], 
                  [4.0, 5.0, 6.0]], dtype=torch.float32)

print("Shape:", x.shape)       # torch.Size([2, 3])
print("Strides:", x.stride())   # (3, 1) -> step 3 floats to move a row, 1 to move a column
print("Is Contiguous:", x.is_contiguous()) # True
```

### Broadcasting Rules
When operating on tensors of different shapes, PyTorch aligns shapes from right to left (trailing dimensions first). Two dimensions are compatible when:
1. They are equal, OR
2. One of them is 1.

```python
A = torch.randn(8, 1, 64) # Batch=8, Channels=1, Features=64
B = torch.randn(64)       # Broadcasts across leading dimensions seamlessly
C = A + B                 # Result shape: (8, 1, 64)
```
