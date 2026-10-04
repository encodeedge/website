---
title: 'Overcoming Ravines: Momentum & Nesterov Accelerated Gradient (NAG)'
description: Pathologies of standard gradient descent in ill-conditioned ravines, physical intuition of momentum, velocity vectors, and lookahead NAG correction.
lessonType: video
interactiveLab: none
duration: 36
comingSoon: true
draft: false
course: deep-learning
chapter: Optimization Algorithms in Deep Learning
---
### Curriculum Objectives
This lesson covers the core engineering concepts and implementations for:
- Ill-Conditioned Curvature & Oscillations in Ravines
- Momentum Update Rule (v = gamma*v + eta*grad, w = w - v)
- Nesterov Accelerated Gradient (NAG) Lookahead Correction

### Overview
Understand why vanilla gradient descent makes painfully slow progress along ravines where surface curvature is steep in one dimension and shallow in another, and how momentum accelerates learning.

### Key Concepts & Takeaways
- The physical ball-rolling-downhill metaphor for parameter velocity accumulation
- Dampening high-frequency oscillations across steep walls while accelerating down the valley
- Nesterov's lookahead gradient evaluation preventing overshooting when velocity is high

*Content placeholder — you can add specific lecture notes, video embeds, and hands-on exercises here.*
