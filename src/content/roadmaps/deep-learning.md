---
title: Deep Learning Specialist
description: >-
  Master neural networks, computer vision, and natural language processing using modern frameworks.
featured: false
nodes:
  - title: Neural Network Basics
    id: nn-basics
    description: Understanding the building blocks of Deep Learning.
    topics:
      - name: Perceptrons & Activation Functions
        description: ReLU, Sigmoid, Tanh, and the structure of a neuron.
        difficulty: beginner
        optional: false
        links:
          - title: Neural Networks and Deep Learning (Book)
            url: http://neuralnetworksanddeeplearning.com/
      - name: Backpropagation
        description: How neural networks learn via gradient descent and chain rule.
        difficulty: intermediate
        optional: false
        links:
          - title: Backpropagation Calculus (3Blue1Brown)
            url: https://www.youtube.com/watch?v=tIeHLnjs5U8
      - name: Deep Learning Frameworks
        description: PyTorch or TensorFlow/Keras.
        difficulty: intermediate
        optional: false
        codeSnippet: |
          import torch.nn as nn
          model = nn.Sequential(
              nn.Linear(784, 128),
              nn.ReLU(),
              nn.Linear(128, 10)
          )
        links:
          - title: PyTorch Tutorials
            url: https://pytorch.org/tutorials/
          - title: TensorFlow Tutorials
            url: https://www.tensorflow.org/tutorials
  - title: Computer Vision
    id: computer-vision
    description: Teaching computers to see and interpret images.
    topics:
      - name: Convolutional Neural Networks (CNNs)
        description: Architecture designed for processing grid-like data (images).
        difficulty: intermediate
        optional: false
        links:
          - title: CS231n: CNNs for Visual Recognition
            url: https://cs231n.github.io/
      - name: Transfer Learning
        description: Using pre-trained models (ResNet, VGG, EfficientNet) for new tasks.
        difficulty: intermediate
        optional: false
        links:
          - title: Transfer Learning with PyTorch
            url: https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html
      - name: Object Detection
        description: Identifying and locating objects (YOLO, SSD, Faster R-CNN).
        difficulty: advanced
        optional: true
        links:
          - title: YOLOv8 Documentation
            url: https://docs.ultralytics.com/
  - title: Natural Language Processing (NLP)
    id: nlp
    description: Processing and generating human language.
    topics:
      - name: Word Embeddings
        description: Word2Vec, GloVe, and representing text as vectors.
        difficulty: intermediate
        optional: false
        links:
          - title: Illustrated Word2Vec
            url: https://jalammar.github.io/illustrated-word2vec/
      - name: Transformers & Attention
        description: The architecture behind modern LLMs (BERT, GPT).
        difficulty: advanced
        optional: false
        links:
          - title: The Illustrated Transformer
            url: https://jalammar.github.io/illustrated-transformer/
          - title: Hugging Face NLP Course
            url: https://huggingface.co/learn/nlp-course/chapter1/1
  - title: Generative AI
    id: generative-ai
    description: Creating new content with AI.
    topics:
      - name: GANs (Generative Adversarial Networks)
        description: Two neural networks contesting with each other.
        difficulty: advanced
        optional: true
        links:
          - title: Generative Adversarial Networks (Paper)
            url: https://arxiv.org/abs/1406.2661
      - name: Diffusion Models
        description: State-of-the-art image generation.
        difficulty: advanced
        optional: true
        links:
          - title: What are Diffusion Models?
            url: https://lilianweng.github.io/posts/2021-07-11-diffusion-models/
---