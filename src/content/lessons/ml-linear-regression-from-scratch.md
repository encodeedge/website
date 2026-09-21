---
title: "Ordinary Least Squares & Closed-Form Normal Equation"
description: "Deriving analytical OLS solution via linear algebra, matrix inversion, and condition numbers."
lessonType: "article"
videoUrl: ""
duration: 24
---
For linear models, the closed-form analytical solution that minimizes Mean Squared Error is given by the **Normal Equation**:

$$\theta = (X^T X)^{-1} X^T y$$

```python
import numpy as np

# Generate synthetic linear data
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# Add bias column (x_0 = 1)
X_b = np.c_[np.ones((100, 1)), X]

# Compute normal equation
theta_best = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
print(f"Learned Intercept: {theta_best[0][0]:.4f}")
print(f"Learned Slope:     {theta_best[1][0]:.4f}")
```
