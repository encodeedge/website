---
title: Gradient Satiation, ReLU Activations & He/Xavier Weight Initialization
description: Analyzing why deep sigmoid networks suffer from vanishing gradients, dying ReLUs, Leaky ReLU variants, and Xavier/He variance-preserving initializations.
lessonType: video
interactiveLab: none
duration: 35
comingSoon: true
draft: false
course: deep-learning
chapter: Vanishing and Exploding Gradients
---
### Curriculum Objectives
This lesson covers the core engineering concepts and implementations for:
- Vanishing Gradients in Deep Sigmoid / Tanh Networks
- The ReLU Family: Standard ReLU, Leaky ReLU & Parametric ReLU
- Variance-Preserving Weight Initializations: Xavier (Glorot) & He (Kaiming)

### Overview
Discover why deep networks initially failed to train due to vanishing gradient signals and how non-saturating piecewise linear activations combined with proper weight initializations resolved the bottleneck.

### Key Concepts & Takeaways
- Maximum derivative of sigmoid is 0.25, causing exponential gradient decay across deep layers
- Constant unit gradient in the positive regime of ReLU preventing saturation
- Mathematical derivation of Xavier initializations for symmetric activations and He initialization for ReLU

*Content placeholder — you can add specific lecture notes, video embeds, and hands-on exercises here.*
