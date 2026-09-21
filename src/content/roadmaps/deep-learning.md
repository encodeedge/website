---
title: Deep Learning Specialist
description: >-
  A deep-dive curriculum covering neural network calculus, PyTorch computational graphs, Computer Vision (CNNs, YOLO), NLP, Transformer attention, and Generative AI / RAG architectures.
image: /assets/roadmaps/deep-learning.svg
featured: true
nodes:
  - title: "Phase 1: Neural Networks from Scratch & PyTorch"
    id: nn-foundations-pytorch
    description: Mathematical intuition of biological and artificial neurons, backpropagation calculus, and the PyTorch autograd engine.
    topics:
      - name: Perceptrons, Multi-Layer Perceptrons & Activations
        description: >-
          Linear combinations, forward propagation, non-linear activation functions (Sigmoid, Tanh, ReLU, Leaky ReLU, GELU, Swish), and universal approximation theorem.
        difficulty: beginner
        optional: false
        duration: "10 days"
        prerequisites:
          - "Matrix multiplication"
          - "Chain rule of calculus"
        takeaways:
          - "Why non-linear activation functions are required for deep representation"
          - "Vanishing and exploding gradient problems with Sigmoid/Tanh"
          - "Softmax activation for multiclass probability calibration"
        codeSnippet: |
          import torch
          import torch.nn as nn

          class MultiLayerPerceptron(nn.Module):
              def __init__(self, in_features, hidden_dim, num_classes):
                  super().__init__()
                  self.net = nn.Sequential(
                      nn.Linear(in_features, hidden_dim),
                      nn.BatchNorm1d(hidden_dim),
                      nn.GELU(),
                      nn.Dropout(0.2),
                      nn.Linear(hidden_dim, num_classes)
                  )
              def forward(self, x):
                  return self.net(x)
        links:
          - title: "DeepLearning.AI Neural Networks and Deep Learning (Andrew Ng)"
            url: https://www.coursera.org/learn/neural-networks-deep-learning
          - title: "Neural Networks and Deep Learning - Michael Nielsen"
            url: http://neuralnetworksanddeeplearning.com/

      - name: Backpropagation Calculus & Computational Graphs
        description: >-
          Reverse-mode automatic differentiation, computing loss gradients with respect to weights and biases, and implementing a micro-framework from scratch.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Analytical gradient computation across directed acyclic graphs (DAGs)"
          - "Weight update step using Stochastic Gradient Descent (SGD) and Momentum"
          - "Building an autograd scalar engine from first principles"
        codeSnippet: |
          # Micrograd scalar autograd example
          class Value:
              def __init__(self, data, _children=()):
                  self.data = data
                  self.grad = 0.0
                  self._prev = set(_children)
                  self._backward = lambda: None
              def __add__(self, other):
                  out = Value(self.data + other.data, (self, other))
                  def _backward():
                      self.grad += 1.0 * out.grad
                      other.grad += 1.0 * out.grad
                  out._backward = _backward
                  return out
        links:
          - title: "Andrej Karpathy: Building micrograd (Neural Networks: Zero to Hero)"
            url: https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ
          - title: "Backpropagation Calculus - 3Blue1Brown"
            url: https://www.youtube.com/watch?v=tIeHLnjs5U8

      - name: PyTorch Optimization & Regularization
        description: >-
          Modern optimization algorithms (Adam, AdamW, RMSProp), learning rate schedules (Cosine Annealing, OneCycleLR), Weight Decay, and Dropout.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Why AdamW decouples L2 weight decay from gradient momentum"
          - "Learning rate warm-up and cosine decay dynamics"
          - "Using Mixed Precision (torch.cuda.amp / bfloat16) to speed up training"
        links:
          - title: "Official PyTorch Tutorials & Recipes"
            url: https://pytorch.org/tutorials/
          - title: "Deep Learning Crash Course for Beginners"
            url: https://www.youtube.com/watch?v=VyWAvY2CF9c

  - title: "Phase 2: Computer Vision & Spatial Feature Learning"
    id: computer-vision
    description: Spatial convolution kernels, image classification, transfer learning backbones, and real-time object detection.
    topics:
      - name: Computer Vision Basics & OpenCV Processing
        description: >-
          Digital image representation, color channels (RGB, BGR, HSV), spatial filtering (Sobel, Gaussian blur, Canny edge detection), affine transformations, and thresholding.
        difficulty: beginner
        optional: false
        duration: "10 days"
        takeaways:
          - "Manipulating image matrices and pixel data in OpenCV and NumPy"
          - "Spatial convolution with 2D kernel filters"
          - "Image augmentations (Random Crop, Flips, ColorJitter) using Albumentations"
        codeSnippet: |
          import cv2
          import numpy as np
          image = cv2.imread("sample.jpg")
          gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
          blurred = cv2.GaussianBlur(gray, (5, 5), 0)
          edges = cv2.Canny(blurred, threshold1=50, threshold2=150)
        links:
          - title: "OpenCV Course - Full Tutorial with Python"
            url: https://www.youtube.com/watch?v=oXlwWbU8l2o
          - title: "OpenCV Official Bootcamp Course"
            url: https://opencv.org/university/free-opencv-course/

      - name: Convolutional Neural Networks (CNNs) & Residual Networks
        description: >-
          2D Convolution layers, padding (valid vs same), stride, pooling (MaxPool, AvgPool), receptive fields, and residual skip connections (ResNet, ConvNeXt).
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Spatial hierarchy extraction (edges -> textures -> parts -> objects)"
          - "How residual skip connections solve gradient degradation in deep nets"
          - "Global Average Pooling to eliminate dense FC parameters"
        codeSnippet: |
          import torch.nn as nn
          class ResidualBlock(nn.Module):
              def __init__(self, channels):
                  super().__init__()
                  self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
                  self.bn1 = nn.BatchNorm2d(channels)
                  self.relu = nn.ReLU(inplace=True)
                  self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
                  self.bn2 = nn.BatchNorm2d(channels)
              def forward(self, x):
                  return self.relu(x + self.bn2(self.conv2(self.relu(self.bn1(self.conv1(x))))))
        links:
          - title: "Stanford CS231n: CNNs for Visual Recognition Lectures"
            url: https://youtube.com/playlist?list=PLf7L7Kg8_FNxHATtLwDceyh72QQL9pvpQ
          - title: "Coursera: Convolutional Neural Networks (Andrew Ng)"
            url: https://www.coursera.org/learn/convolutional-neural-networks

      - name: Object Detection & Real-Time Models (YOLO)
        description: >-
          Anchor boxes, non-maximum suppression (NMS), intersection over union (IoU), two-stage (Faster R-CNN) vs one-stage detectors (YOLOv8, YOLOv11), and feature pyramid networks.
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Formulating bounding box regression + classification loss"
          - "mAP@0.5 and mAP@0.5:0.95 detection benchmark evaluation"
          - "Real-time edge inference with Ultralytics YOLO"
        codeSnippet: |
          from ultralytics import YOLO
          model = YOLO("yolov8n.pt") # Load pretrained nano model
          results = model.predict(source="test.jpg", conf=0.5)
          for r in results:
              boxes = r.boxes.xyxy.cpu().numpy()
              classes = r.boxes.cls.cpu().numpy()
        links:
          - title: "Ultralytics YOLO Documentation & Guides"
            url: https://docs.ultralytics.com/
          - title: "Computer Vision Essentials Course"
            url: https://www.mygreatlearning.com/academy/learn-for-free/courses/computer-vision-essentials

  - title: "Phase 3: Natural Language Processing & Sequence Modeling"
    id: nlp-sequence-models
    description: Text preprocessing, word vector embeddings, recurrent networks, and sequence-to-sequence pipelines.
    topics:
      - name: Text Preprocessing, Tokenization & Vector Space Models
        description: >-
          Regex normalization, stop words, lemmatization, TF-IDF, Word2Vec (Skip-Gram & CBOW), GloVe embeddings, and cosine semantic similarity.
        difficulty: beginner
        optional: false
        duration: "10 days"
        takeaways:
          - "Embedding words into continuous geometric vector spaces"
          - "Cosine distance metrics for semantic similarity search"
          - "Subword tokenization vs word-level out-of-vocabulary (OOV) bottlenecks"
        codeSnippet: |
          from sklearn.feature_extraction.text import TfidfVectorizer
          corpus = ["Deep learning trains multi-layer networks", "Machine learning discovers patterns in data"]
          tfidf = TfidfVectorizer()
          matrix = tfidf.fit_transform(corpus)
        links:
          - title: "How To Get Started with NLP - Towards Data Science"
            url: https://towardsdatascience.com/how-to-get-started-in-nlp-6a62aa4eaeff
          - title: "TensorFlow's NLP Zero to Hero Playlist"
            url: https://youtube.com/playlist?list=PLQY2H8rRoyvzDbLUZkbudP-MFQZwNmU4S

      - name: Recurrent Neural Networks (RNNs, LSTMs, GRUs)
        description: >-
          Hidden state recurrent loops, handling variable-length sequential data, vanishing gradient challenges, Long Short-Term Memory (LSTM) gates, and bidirectional processing.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Forget, input, and output gating mechanisms in LSTM units"
          - "Sequence-to-sequence encoder-decoder architectures with attention"
          - "Why parallelization constraints led to the Transformer revolution"
        links:
          - title: "Understanding LSTM Networks - Christopher Olah"
            url: https://colah.github.io/posts/2015-08-Understanding-LSTMs/
          - title: "Natural Language Processing Pipeline Overview"
            url: https://www.youtube.com/watch?v=6I-Alfkr5K4

  - title: "Phase 4: Transformer Architecture & Large Language Models"
    id: transformers-llms
    description: Self-attention mechanics, multi-head attention, positional encoding, encoder-decoder models, and foundational LLM architectures.
    topics:
      - name: Self-Attention & The Transformer Architecture
        description: >-
          Scaled dot-product attention, Query, Key, and Value projections, Multi-Head Attention, Rotary Positional Embeddings (RoPE), LayerNorm, and RMSNorm.
        difficulty: advanced
        optional: false
        duration: "3 weeks"
        takeaways:
          - "Deriving attention weights: softmax(QK^T / sqrt(d_k)) * V"
          - "Computational complexity of full self-attention O(N^2)"
          - "Decoder causal attention masking for autoregressive language generation"
        codeSnippet: |
          import torch
          import torch.nn.functional as F

          def scaled_dot_product_attention(Q, K, V, mask=None):
              d_k = Q.size(-1)
              scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
              if mask is not None:
                  scores = scores.masked_fill(mask == 0, -1e9)
              weights = F.softmax(scores, dim=-1)
              return torch.matmul(weights, V), weights
        links:
          - title: "The Illustrated Transformer by Jay Alammar"
            url: https://jalammar.github.io/illustrated-transformer/
          - title: "Andrej Karpathy: Let's build GPT from scratch, in code"
            url: https://www.youtube.com/watch?v=kCc8FmEb1nY

      - name: Pretrained LLM Ecosystem & Fine-Tuning (LoRA, QLoRA)
        description: >-
          HuggingFace Transformers, model hubs, Parameter-Efficient Fine-Tuning (PEFT), Low-Rank Adaptation (LoRA), 4-bit quantization (bitsandbytes), and SFT pipelines.
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Freezing base foundation weights and training rank-decomposition matrices"
          - "4-bit NormalFloat (NF4) quantization mechanisms in QLoRA"
          - "Instruction fine-tuning datasets and formatting templates"
        codeSnippet: |
          from peft import LoraConfig, get_peft_model
          lora_config = LoraConfig(
              r=16,
              lora_alpha=32,
              target_modules=["q_proj", "v_proj"],
              lora_dropout=0.05,
              bias="none",
              task_type="CAUSAL_LM"
          )
          # model = get_peft_model(base_model, lora_config)
        links:
          - title: "Hugging Face PEFT / LoRA Guide"
            url: https://huggingface.co/docs/peft/index
          - title: "Generative AI for Developers Course"
            url: https://www.youtube.com/watch?v=F0GQ0l2NfHA

  - title: "Phase 5: Generative AI, RAG & Agentic Systems"
    id: generative-rag-agents
    description: Production Retrieval-Augmented Generation, vector embeddings, LangChain / LangFlow architectures, and multi-agent coordination.
    topics:
      - name: Retrieval-Augmented Generation (RAG) Architecture
        description: >-
          Chunking strategies (recursive, semantic), vector embeddings, HNSW indexing, vector databases (Chroma, Pinecone, Qdrant), hybrid search, and re-ranking.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Building an end-to-end RAG question-answering pipeline"
          - "Dense vector embeddings vs sparse BM25 keyword matching"
          - "Cross-encoder re-ranking for high retrieval precision"
        codeSnippet: |
          from langchain_community.vectorstores import Chroma
          from langchain_openai import OpenAIEmbeddings

          vectorstore = Chroma.from_texts(
              texts=["EncodeEdge builds production AI blueprints"],
              embedding=OpenAIEmbeddings()
          )
          retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        links:
          - title: "Learn RAG From Scratch (Full Course)"
            url: https://www.youtube.com/watch?v=sVcwVQRHIc8
          - title: "Linux Foundation: RAG Introduction (RXM403)"
            url: https://training.linuxfoundation.org/training/retrieval-augmented-generation-rag-intro-rxm403/

      - name: Agentic AI & Autonomous Tool Calling (LangFlow & n8n)
        description: >-
          ReAct reasoning loop (Reasoning + Acting), structured tool calling, multi-agent orchestration with LangGraph / n8n, memory persistence, and human-in-the-loop workflows.
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Autonomous agent loops: thought -> plan -> tool call -> observe -> synthesize"
          - "Building multi-agent visual workflows with LangFlow and n8n"
          - "State graphs and cyclical graph execution with LangGraph"
        links:
          - title: "AI Agents Fundamentals in 7 Minutes"
            url: https://www.youtube.com/watch?v=dJrgZrPKJfQ
          - title: "Building a Team of AI Agents in n8n (No-Code)"
            url: https://www.youtube.com/watch?v=9FuNtfsnRNo
          - title: "Getting Started with LangFlow"
            url: https://www.youtube.com/watch?v=knPg4KdKU6w

      - name: Reinforcement Learning & Deep RL (PPO, Q-Learning)
        description: >-
          Markov Decision Processes (MDP), value functions, Bellman equation, Deep Q-Networks (DQN), Policy Gradients, and Proximal Policy Optimization (PPO) used in RLHF.
        difficulty: advanced
        optional: true
        duration: "2 weeks"
        takeaways:
          - "Exploration vs exploitation dilemma in dynamic environments"
          - "Q-value approximation with deep neural networks"
          - "PPO clipped surrogate objective for stable policy updates"
        links:
          - title: "HuggingFace Deep Reinforcement Learning Course"
            url: https://huggingface.co/learn/deep-rl-course/en/unit0/introduction
          - title: "Reinforcement Learning By The Book Playlist"
            url: https://www.youtube.com/playlist?list=PLzvYlJMoZ02Dxtwe-MmH4nOB5jYlMGBjr
---