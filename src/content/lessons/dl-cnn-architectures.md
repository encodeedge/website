---
title: "Convolutional Neural Networks & ResNet Residual Skips"
description: "Feature maps, kernels, padding, pooling, and resolving vanishing gradients with deep residual connections."
lessonType: "article"
videoUrl: ""
duration: 25
---
Convolutional layers replace dense matrix multiplications with local spatial receptive fields, enforcing **translation invariance** and dramatically reducing parameter counts.

### Why Residual Connections Matter
As deep networks exceed 20+ layers, optimization degrades because gradients repeatedly scaled by weight matrices tend toward 0 or explode. 

ResNet introduced the **identity shortcut**:

$$y = \mathcal F(x, \lbrace W_i \rbrace) + x$$

Instead of learning an unreferenced underlying mapping $\mathcal H(x)$, the network explicitly learns the residual $\mathcal F(x) = \mathcal H(x) - x$. If identity mapping is optimal, optimizer weights can simply decay toward zero.

```python
class ResidualBlock(nn.Module):
    def __init__(self, channels: int):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += identity  # Skip connection
        return self.relu(out)
```
