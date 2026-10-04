---
title: Deep Learning
shortDescription: >-
  The definitive, code-first deep learning curriculum. Master MP Neurons,
  Perceptrons, Sigmoids, Backpropagation, Modern Optimizers (Adam, RMSProp),
  CNNs, and RNNs from scratch in Python.
coverImage: /assets/courses/deep-learning.svg
instructor: atul-jha
level: intermediate
status: published
chapters:
  - title: Welcome
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-welcome
      - discriminant: lesson
        value:
          lessonRef: dl-faq-on-course
  - title: Expert Systems
    description: >-
      The paradigm shift from heuristic expert systems to data-driven learning
      and the framework of Machine Learning.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-expert-systems-to-machine-learning
      - discriminant: lesson
        value:
          lessonRef: dl-six-jars-framework-data-and-tasks
      - discriminant: lesson
        value:
          lessonRef: dl-six-jars-models-and-loss-functions
      - discriminant: lesson
        value:
          lessonRef: dl-six-jars-learning-and-evaluation
  - title: MP Neuron
    description: >-
      McCulloch-Pitts artificial neuron model: biological motivation, boolean
      aggregation, loss surfaces, and geometric linear separability.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-mp-neuron-model-and-data
      - discriminant: lesson
        value:
          lessonRef: dl-mp-neuron-loss-learning-evaluation
      - discriminant: lesson
        value:
          lessonRef: dl-mp-neuron-geometry-and-interpretation
  - title: Perceptron
    description: >-
      Rosenblatt's Perceptron: real-valued feature spaces, hyperplanes,
      perceptron loss criterion, and the convergence proof.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-perceptron-model-and-geometry
      - discriminant: lesson
        value:
          lessonRef: dl-perceptron-loss-and-learning-recipe
      - discriminant: lesson
        value:
          lessonRef: dl-perceptron-learning-algorithm-and-convergence
  - title: 'Python: MP Neuron, Perceptron'
    description: Writing MP Neuron and Perceptron classes from scratch in Python.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-data-preparation-binarisation-train-test
      - discriminant: lesson
        value:
          lessonRef: dl-implementing-mp-neuron-class
      - discriminant: lesson
        value:
          lessonRef: dl-implementing-perceptron-class
      - discriminant: lesson
        value:
          lessonRef: dl-perceptron-training-epochs-checkpointing-animation
  - title: Sigmoid Neuron, Gradient Descent
    description: >-
      Smooth logistic activations, continuous probability outputs, Taylor series
      derivation of gradient descent, and partial derivatives.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-limitations-of-perceptron-motivation-for-sigmoid
      - discriminant: lesson
        value:
          lessonRef: dl-sigmoid-neuron-model-and-data-tasks
      - discriminant: quiz
        value:
          quizRef: dlfn-sigmoid-model-and-data-quiz
      - discriminant: lesson
        value:
          lessonRef: dl-loss-functions-and-error-surfaces
      - discriminant: quiz
        value:
          quizRef: dlfn-sigmoid-loss-function-quiz
      - discriminant: lesson
        value:
          lessonRef: dl-taylor-series-and-gradient-descent-derivation
      - discriminant: quiz
        value:
          quizRef: dlfn-taylor-series-quiz
      - discriminant: lesson
        value:
          lessonRef: dl-gradient-descent-algorithm-and-partial-derivatives
      - discriminant: quiz
        value:
          quizRef: dlfn-sigmoid-gradient-descent-quiz
      - discriminant: lesson
        value:
          lessonRef: dl-sigmoid-multi-parameter-and-evaluation
      - discriminant: quiz
        value:
          quizRef: dlfn-sigmoid-evaluation-quiz
  - title: 'Python: Sigmoid, Gradient Descent'
    description: >-
      Implementing Sigmoid Neuron with vectorized gradient descent in Python,
      plotting 3D loss surfaces, contours, and optimization paths.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-visualizing-sigmoid-and-loss-surfaces
      - discriminant: lesson
        value:
          lessonRef: dl-implementing-sigmoid-neuron-class
      - discriminant: lesson
        value:
          lessonRef: dl-fitting-toy-data-and-gradient-trajectories
  - title: Representation Power of Functions
    description: >-
      Universal Approximation Theorem, why deep architectures can approximate
      any continuous function, and building sigmoid towers.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-boolean-functions-and-multilayer-networks
      - discriminant: lesson
        value:
          lessonRef: dl-universal-approximation-theorem
  - title: Feedforward Neural Networks
    description: >-
      Deep multilayer perceptrons, layer notation, batched matrix forward
      propagation, Softmax probability layers, and Cross-Entropy loss.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-fnn-architecture-and-matrix-math
      - discriminant: lesson
        value:
          lessonRef: dl-fnn-loss-and-softmax-multiclass
      - discriminant: quiz
        value:
          quizRef: dlfn-fnn-architecture-quiz
  - title: 'Learning in Feedforward Networks: Backpropagation'
    description: >-
      Analytical derivation of backpropagation using computation graphs,
      multivariate chain rule, delta error backpropagation, and weight
      gradients.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-computation-graphs-and-the-multivariate-chain-rule
      - discriminant: lesson
        value:
          lessonRef: dl-backprop-derivation-and-gradient-equations
      - discriminant: quiz
        value:
          quizRef: dlfn-backprop-quiz
  - title: 'Python: Feedforward Neural Networks'
    description: >-
      Building a complete neural network from scratch in pure Python and NumPy
      with automated backpropagation, and training on MNIST.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-implementing-fnn-from-scratch
      - discriminant: lesson
        value:
          lessonRef: dl-training-fnn-on-mnist
  - title: Optimization Algorithms in Deep Learning
    description: >-
      Mastering modern optimizers: ill-conditioned curvature ravines, Momentum,
      Nesterov Accelerated Gradient (NAG), AdaGrad, RMSProp, and Adam.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-momentum-and-nesterov-accelerated-gradient
      - discriminant: lesson
        value:
          lessonRef: dl-adaptive-learning-rate-algorithms-ada-grad-rms-prop-and-adam
      - discriminant: quiz
        value:
          quizRef: dlfn-optimization-algorithms-quiz
  - title: 'Python: Optimization Algorithms'
    description: >-
      Coding custom Momentum, RMSProp, and Adam optimizers from scratch, and
      plotting comparative trajectory visualizations on non-convex loss
      surfaces.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-implementing-momentum-rmsprop-adam
      - discriminant: lesson
        value:
          lessonRef: dl-visualizing-optimizer-loss-trajectories
  - title: Vanishing and Exploding Gradients
    description: >-
      Understanding gradient flow pathologies in deep networks: Sigmoid
      saturation, ReLU activations, He/Xavier initializations, and Batch
      Normalization.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-saturation-relu-and-weight-initialization
      - discriminant: lesson
        value:
          lessonRef: dl-batch-normalization
  - title: Convolutional Neural Networks (CNNs)
    description: >-
      Computer vision with spatial convolutions: kernel filtering, padding,
      strides, pooling, translation equivariance, and deep residual networks
      (ResNet).
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-cnn-spatial-features-convolutions-pooling
      - discriminant: lesson
        value:
          lessonRef: dl-classic-cnn-architectures-lenet-resnet
      - discriminant: quiz
        value:
          quizRef: dlfn-cnn-quiz
  - title: 'Python: CNNs'
    description: >-
      Implementing convolutional neural networks using PyTorch nn.Module, GPU
      training loops, and inspecting learned visual filter representations.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-building-cnns-with-pytorch
      - discriminant: lesson
        value:
          lessonRef: dl-visualizing-cnn-filters-and-feature-maps
  - title: Recurrent Neural Networks (RNNs)
    description: >-
      Sequence modeling across time: recurrent feedback cells, Backpropagation
      Through Time (BPTT), vanishing memory, and gated LSTM/GRU architectures.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-recurrent-networks-bptt-and-sequence-modeling
      - discriminant: lesson
        value:
          lessonRef: dl-lstms-and-grus-gated-memory
  - title: 'Python: Sequence Models with PyTorch'
    description: >-
      Implementing character-level RNNs, sequence embeddings, and text
      classification models using PyTorch recurrent layers.
    items:
      - discriminant: lesson
        value:
          lessonRef: dl-implementing-rnn-lstm-in-pytorch
enrollmentMode: free
prerequisites: []
featured: false
tags: []
topics:
  - machine-learning
  - deep-learning
---
### Why This Course Matters

Deep neural networks are often treated as opaque black boxes. True engineering intuition comes from understanding the progressive evolution of architectures: how we moved from simple rule-based expert systems to McCulloch-Pitts neurons, Rosenblatt's Perceptrons, smooth Sigmoid units, continuous Gradient Descent, deep Feedforward Networks, Backpropagation, modern Optimizers (Momentum, RMSProp, Adam), CNNs, and recurrent LSTMs.

### What You Will Build & Master

1. **The ML framework** Data, Tasks, Models, Loss Functions, Learning Algorithms, and Evaluation.
2. **Biological & Binary Neurons**: McCulloch-Pitts formulation, threshold search, boolean functions, and linear separability geometry.
3. **Rosenblatt's Perceptron**: Real-valued hyperplanes, perceptron loss, convergence theorem proofs, and limitations.
4. **The Calculus of Learning**: First-order Taylor series approximation, analytical derivation of gradient descent, partial derivatives, and loss surface contours.
5. **Deep Feedforward Networks & Backprop**: Rigorous chain rule derivation, computation graphs, and pure NumPy implementations.
6. **Advanced Optimizers**: Overcoming ravines and saddle points with Momentum, NAG, AdaGrad, RMSProp, and Adam.
7. **Computer Vision & CNNs**: Spatial convolution arithmetic, kernels, max pooling, LeNet, and ResNet architectures in PyTorch.
8. **Sequence Modeling & LSTMs**: Temporal unrolling, BPTT, and gated memory architectures for sequence prediction.
