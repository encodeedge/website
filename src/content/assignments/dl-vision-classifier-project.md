---
title: "Project: Train a ResNet Vision Classifier with PyTorch"
description: "Build, train, and evaluate a residual convolutional network on a custom dataset, implementing custom data augmentations and learning rate scheduling."
rubric:
- criteria: Proper PyTorch Dataset & DataLoader with Augmentations
  maxPoints: 25
- criteria: Correct Residual Block Implementation with Skip Connections
  maxPoints: 30
- criteria: Training Loop with Mixed-Precision (torch.cuda.amp) & Loss Logging
  maxPoints: 25
- criteria: 'Evaluation Report: Confusion Matrix & Top-1 / Top-5 Accuracy > 85%'
  maxPoints: 20
resources:
- title: Starter Notebook (Google Colab / Jupyter)
  url: https://github.com/encodeedge/course-materials
- title: Dataset Download (CIFAR-100 Subset)
  url: https://pytorch.org/vision/stable/datasets.html
---
### Capstone Objective
In this project, you will develop a complete end-to-end computer vision pipeline using PyTorch.

#### Requirements
1. **Data Pipeline**:
   - Implement random cropping, horizontal flips, and color jitter augmentations.
   - Use `DataLoader` with pinned memory and multi-worker prefetching.
2. **Model Architecture**:
   - Construct a modular `ResidualBlock` class.
   - Chain 4 residual stages with projection shortcuts when spatial dimensions downsample.
3. **Training & Optimization**:
   - Optimize using `AdamW` with cosine annealing learning rate scheduling.
   - Use `torch.cuda.amp.autocast` for FP16 mixed precision acceleration.
4. **Deliverables**:
   - Submit your GitHub repository URL or Colab link containing the complete code and evaluation plots.
