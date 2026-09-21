---
title: "Ridge, Lasso, ElasticNet & The Bias-Variance Tradeoff"
description: "Combating overfitting through L1/L2 penalty constraints, feature sparsity, and cross-validation."
lessonType: "article"
videoUrl: ""
duration: 21
---
Overfitting occurs when a model captures random noise in training data rather than true underlying relationships. Regularization constrains model capacity:

- **Ridge Regression (L2)**: Adds $\lambda \sum \theta_j^2$ penalty; shrinks weights smoothly without setting them strictly to zero.
- **Lasso Regression (L1)**: Adds $\lambda \sum |\theta_j|$ penalty; produces sparse models by driving coefficients to zero (automatic feature selection).
