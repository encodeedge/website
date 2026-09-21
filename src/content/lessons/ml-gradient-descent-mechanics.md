---
title: "Gradient Descent, Convex Optimization & Learning Rates"
description: "Mathematical derivation of parameter updates, learning rate schedules, and momentum."
lessonType: "video"
videoUrl: "https://www.youtube.com/embed/sDv4f4s2SB8"
duration: 22
---
Gradient Descent iteratively nudges model parameters $\theta$ opposite to the gradient vector of the empirical risk function $J(\theta)$:

$$\theta_{t+1} = \theta_t - \eta \nabla_\theta J(\theta_t)$$

Where $\eta$ is the learning rate. We explore Batch, Mini-Batch, and Stochastic variants alongside momentum techniques.
