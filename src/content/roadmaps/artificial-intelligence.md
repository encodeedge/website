---
title: Artificial Intelligence
description: >-
  A comprehensive, modern roadmap to Artificial Intelligence — from intelligent agents and heuristic search to deep neural networks, transformer models, and autonomous tool-calling agents.
image: /assets/roadmaps/artificial-intelligence.svg
featured: true
nodes:
  - title: "Phase 1: Foundations of Artificial Intelligence"
    id: ai-foundations
    description: Core concepts of intelligent rational agents, problem spaces, and search algorithms.
    topics:
      - name: Intelligent Agents & Environments
        description: >-
          Understanding the PEAS framework (Performance measure, Environment, Actuators, Sensors), agent architectures, and environment properties (fully vs partially observable, deterministic vs stochastic).
        difficulty: beginner
        optional: false
        duration: "1 week"
        prerequisites:
          - "Basic Python programming"
          - "Discrete mathematics concepts"
        takeaways:
          - "Formulating agent-environment interaction cycles"
          - "Differentiating simple reflex, goal-based, and utility-based agents"
          - "Analyzing state observability and environmental complexity"
        codeSnippet: |
          class SimpleReflexAgent:
              def __init__(self, rules):
                  self.rules = rules
              
              def act(self, percept):
                  state = self.interpret_input(percept)
                  rule = self.rules.get(state, "DEFAULT_ACTION")
                  return rule
              
              def interpret_input(self, percept):
                  return "DIRTY" if percept["is_dirty"] else "CLEAN"
        links:
          - title: "Russell & Norvig - AIMA Official Companion"
            url: http://aima.cs.berkeley.edu/
          - title: "MIT 6.034: Artificial Intelligence Lecture 1"
            url: https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/

      - name: State Space Search & Uninformed Search
        description: >-
          Formulating problems as state spaces and finding paths to goals using Breadth-First Search (BFS), Depth-First Search (DFS), and Uniform Cost Search (UCS).
        difficulty: intermediate
        optional: false
        duration: "10 days"
        prerequisites:
          - "Data structures (Queues, Stacks, Priority Queues)"
        takeaways:
          - "State space graph formulation"
          - "Completeness, time complexity, and space complexity analysis"
          - "Trade-offs between BFS, DFS, and Iterative Deepening"
        codeSnippet: |
          from collections import deque

          def bfs(graph, start, goal):
              queue = deque([[start]])
              visited = set([start])
              while queue:
                  path = queue.popleft()
                  node = path[-1]
                  if node == goal:
                      return path
                  for neighbor in graph.get(node, []):
                      if neighbor not in visited:
                          visited.add(neighbor)
                          queue.append(path + [neighbor])
              return None
        links:
          - title: "Search Algorithms in AI (Stanford CS221)"
            url: https://stanford-cs221.github.io/autumn2023/
          - title: "Graph Traversal & Search Foundations"
            url: https://www.geeksforgeeks.org/search-algorithms-in-ai/

      - name: Heuristic & Adversarial Search (A* and Minimax)
        description: >-
          Informed search algorithms using admissible heuristics (A* Search) and decision-making in competitive two-player zero-sum games (Minimax with Alpha-Beta pruning).
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        prerequisites:
          - "Uninformed Search"
          - "State Space Graphs"
        takeaways:
          - "Heuristic admissibility and consistency conditions"
          - "A* optimality guarantees: f(n) = g(n) + h(n)"
          - "Game trees and Alpha-Beta pruning efficiency"
        codeSnippet: |
          import heapq

          def a_star_search(graph, start, goal, h):
              frontier = [(h(start), 0, start, [start])]
              costs = {start: 0}
              while frontier:
                  est_total, cost_so_far, current, path = heapq.heappop(frontier)
                  if current == goal:
                      return path
                  for neighbor, weight in graph[current].items():
                      new_cost = cost_so_far + weight
                      if neighbor not in costs or new_cost < costs[neighbor]:
                          costs[neighbor] = new_cost
                          heapq.heappush(frontier, (new_cost + h(neighbor), new_cost, neighbor, path + [neighbor]))
              return None
        links:
          - title: "Introduction to A* Algorithm (Red Blob Games)"
            url: https://www.redblobgames.com/pathfinding/a-star/introduction.html
          - title: "Minimax and Alpha-Beta Pruning Explained"
            url: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning

  - title: "Phase 2: Knowledge Representation & Logical Reasoning"
    id: knowledge-reasoning
    description: Formal symbolic logic, ontological knowledge graphs, and handling uncertainty.
    topics:
      - name: Propositional & First-Order Logic
        description: >-
          Formal logic syntax and semantics, truth tables, inference rules (Modus Ponens, Resolution), unification, and forward/backward chaining.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Representing real-world facts in First-Order Logic (FOL)"
          - "Resolution theorem proving algorithm"
          - "Horn clauses and rule-based expert systems"
        codeSnippet: |
          # Symbolic inference with Horn clauses
          knowledge_base = {
              "parent(john, mary)": True,
              "parent(mary, alice)": True,
              "grandparent(X, Z)": ["parent(X, Y)", "parent(Y, Z)"]
          }
        links:
          - title: "Stanford Introduction to Logic"
            url: http://intrologic.stanford.edu/
          - title: "First-Order Logic Notes (Berkeley CS188)"
            url: https://inst.eecs.berkeley.edu/~cs188/

      - name: Knowledge Graphs & Semantic Ontologies
        description: >-
          Entity-relation modeling, RDF triples, SPARQL querying, and modern vector-grounded enterprise knowledge graphs.
        difficulty: intermediate
        optional: true
        duration: "1 week"
        takeaways:
          - "Semantic web standards (RDF, OWL, SPARQL)"
          - "Extracting relations from unstructured text"
          - "Hybrid graph-RAG architectures"
        links:
          - title: "Knowledge Graphs (ACM Digital Library)"
            url: https://dl.acm.org/doi/10.1145/3447772
          - title: "Neo4j Graph Database Fundamentals"
            url: https://neo4j.com/graphacademy/

      - name: Probabilistic Reasoning & Bayesian Networks
        description: >-
          Modeling uncertainty with probability distributions, conditional independence, Bayes rule, and inference in Directed Acyclic Graphical Models (Bayesian Networks).
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        prerequisites:
          - "Probability theory and conditional independence"
        takeaways:
          - "Joint probability factorization with DAGs"
          - "Variable elimination and exact inference"
          - "Sampling methods (MCMC, Gibbs Sampling)"
        codeSnippet: |
          # Bayes' Theorem formulation: P(A|B) = [P(B|A) * P(A)] / P(B)
          def bayes_theorem(prior_a, likelihood_b_given_a, prob_b):
              return (likelihood_b_given_a * prior_a) / prob_b
        links:
          - title: "Probabilistic Graphical Models (Coursera - Daphne Koller)"
            url: https://www.coursera.org/specializations/probabilistic-graphical-models
          - title: "Bayesian Reasoning and Machine Learning (David Barber)"
            url: http://web4.cs.ucl.ac.uk/staff/D.Barber/pmwiki/pmwiki.php?n=Brml.Online

  - title: "Phase 3: Decision Making Under Uncertainty & Reinforcement Learning"
    id: decision-making-rl
    description: Dynamic programming, Markov processes, and learning from trial-and-error reward signals.
    topics:
      - name: Markov Decision Processes (MDP)
        description: >-
          State spaces, action spaces, transition probabilities, discount factors, and solving for optimal policies via Bellman Equations and Value/Policy Iteration.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "The Bellman Optimality Equation"
          - "Value Iteration algorithm convergence"
          - "Policy Iteration vs Value Iteration trade-offs"
        codeSnippet: |
          import numpy as np

          def value_iteration(states, actions, P, R, gamma=0.95, epsilon=1e-4):
              V = {s: 0.0 for s in states}
              while True:
                  delta = 0
                  for s in states:
                      v = V[s]
                      V[s] = max(sum(P[s][a][s_next] * (R[s][a][s_next] + gamma * V[s_next])
                                     for s_next in states) for a in actions)
                      delta = max(delta, abs(v - V[s]))
                  if delta < epsilon:
                      break
              return V
        links:
          - title: "Sutton & Barto: Reinforcement Learning Book"
            url: http://incompleteideas.net/book/the-book-2nd.html
          - title: "David Silver RL Course (DeepMind/UCL)"
            url: https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ

      - name: Model-Free RL (Q-Learning & SARSA)
        description: >-
          Temporal Difference learning without explicit transition dynamics. Exploration vs exploitation (epsilon-greedy), Q-value estimation, and off-policy vs on-policy learning.
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "TD(0) error calculation"
          - "Q-Learning update rule: Q(s,a) <- Q(s,a) + alpha * [r + gamma * max Q(s',a') - Q(s,a)]"
          - "Convergence guarantees under Robbins-Monro conditions"
        codeSnippet: |
          import numpy as np

          def q_learning_update(Q, s, a, r, s_prime, alpha=0.1, gamma=0.99):
              best_next_q = np.max(Q[s_prime])
              td_target = r + gamma * best_next_q
              td_error = td_target - Q[s][a]
              Q[s][a] += alpha * td_error
              return Q
        links:
          - title: "OpenAI Spinning Up in Deep RL"
            url: https://spinningup.openai.com/
          - title: "Q-Learning In-Depth Guide"
            url: https://www.freecodecamp.org/news/q-learning-an-introduction-to-reinforcement-learning/

      - name: Deep Reinforcement Learning (DQN & Policy Gradients)
        description: >-
          Combining deep neural network function approximators with RL: Deep Q-Networks (experience replay, target networks), REINFORCE, and Actor-Critic (PPO).
        difficulty: advanced
        optional: true
        duration: "3 weeks"
        takeaways:
          - "Overcoming deadly triad instability in Deep Q-Networks"
          - "Policy gradient theorem and score functions"
          - "Proximal Policy Optimization (PPO) clip objective"
        links:
          - title: "Hugging Face Deep RL Course"
            url: https://huggingface.co/learn/deep-rl-course/unit0/introduction
          - title: "Playing Atari with Deep Reinforcement Learning (Mnih et al.)"
            url: https://arxiv.org/abs/1312.5602

  - title: "Phase 4: Machine Learning Core for AI Systems"
    id: machine-learning-core
    description: Statistical learning theory, optimization algorithms, and predictive model pipelines.
    topics:
      - name: Supervised & Unsupervised Learning Foundations
        description: >-
          Parametric vs non-parametric models, linear/logistic regression, support vector machines, decision trees, k-means clustering, and PCA dimensionality reduction.
        difficulty: beginner
        optional: false
        duration: "3 weeks"
        takeaways:
          - "Formulating loss functions (MSE, Cross-Entropy)"
          - "Bias-variance decomposition"
          - "Regularization techniques (L1 Lasso, L2 Ridge)"
        codeSnippet: |
          from sklearn.ensemble import RandomForestClassifier
          from sklearn.metrics import classification_report

          model = RandomForestClassifier(n_estimators=100, random_state=42)
          model.fit(X_train, y_train)
          y_pred = model.predict(X_test)
          print(classification_report(y_test, y_pred))
        links:
          - title: "EncodeEdge Introduction to Machine Learning"
            url: /blog/introduction-to-machine-learning/
          - title: "Scikit-Learn User Guide"
            url: https://scikit-learn.org/stable/user_guide.html

      - name: Loss Formulation, Convexity & Gradient Descent
        description: >-
          Mathematical foundations of optimization: gradient vectors, Hessian matrices, convex objectives, stochastic gradient descent (SGD), Adam, and learning rate schedules.
        difficulty: intermediate
        optional: false
        duration: "10 days"
        takeaways:
          - "Computing analytical and numerical gradients"
          - "Momentum, RMSprop, and Adam optimizer equations"
          - "Saddle points, local minima, and loss surface geometry"
        codeSnippet: |
          import numpy as np

          def gradient_descent(x_start, lr=0.01, epochs=100):
              x = x_start
              for _ in range(epochs):
                  grad = 2 * x  # derivative of f(x) = x^2
                  x = x - lr * grad
              return x
        links:
          - title: "3Blue1Brown: Gradient Descent & Neural Networks"
            url: https://www.youtube.com/watch?v=IHZwWFHWa-w
          - title: "An Overview of Gradient Descent Optimization Algorithms"
            url: https://ruder.io/optimizing-gradient-descent/

      - name: Feature Representation & Model Evaluation
        description: >-
          Feature encoding, normalization, stratified k-fold validation, precision/recall trade-offs, ROC-AUC, and leakage prevention.
        difficulty: intermediate
        optional: false
        duration: "1 week"
        takeaways:
          - "Data preprocessing pipelines without data leakage"
          - "Choosing error metrics for imbalanced datasets"
          - "Cross-validation and confidence intervals"
        links:
          - title: "EncodeEdge Regression Error Metrics Guide"
            url: /blog/regression-error-metrics/
          - title: "Google Machine Learning Crash Course"
            url: https://developers.google.com/machine-learning/crash-course

  - title: "Phase 5: Deep Learning & Frontier AI Architectures"
    id: deep-learning-frontier
    description: Modern neural network topologies, backpropagation calculus, and transformer architectures.
    topics:
      - name: Neural Networks & Backpropagation Calculus
        description: >-
          Multi-layer perceptrons (MLP), matrix calculus, computational graphs, non-linear activation functions (ReLU, GELU), and backprop chain rule implementation.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Deriving backpropagation for a two-layer neural net"
          - "Vanishing and exploding gradient mitigation"
          - "PyTorch autograd mechanics"
        codeSnippet: |
          import torch
          import torch.nn as nn

          class SimpleMLP(nn.Module):
              def __init__(self, in_features, hidden_dim, out_features):
                  super().__init__()
                  self.net = nn.Sequential(
                      nn.Linear(in_features, hidden_dim),
                      nn.ReLU(),
                      nn.Linear(hidden_dim, out_features)
                  )
              def forward(self, x):
                  return self.net(x)
        links:
          - title: "Andrej Karpathy: Building micrograd from scratch"
            url: https://www.youtube.com/watch?v=VMj-3S1tku0
          - title: "PyTorch Deep Learning Zero to Mastery"
            url: https://www.learnpytorch.io/

      - name: The Transformer Architecture & Self-Attention
        description: >-
          Scaled dot-product attention, multi-head attention, positional encodings, layer normalization, residual connections, and encoder-decoder topologies.
        difficulty: advanced
        optional: false
        duration: "3 weeks"
        takeaways:
          - "Attention formula: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V"
          - "Computational complexity of self-attention: O(N^2)"
          - "Causal masking in decoder-only models (GPT)"
        codeSnippet: |
          import torch
          import torch.nn.functional as F

          def scaled_dot_product_attention(Q, K, V, mask=None):
              d_k = Q.size(-1)
              scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
              if mask is not None:
                  scores = scores.masked_fill(mask == 0, -1e9)
              weights = F.softmax(scores, dim=-1)
              return torch.matmul(weights, V)
        links:
          - title: "Attention Is All You Need (Vaswani et al.)"
            url: https://arxiv.org/abs/1706.03762
          - title: "The Illustrated Transformer by Jay Alammar"
            url: https://jalammar.github.io/illustrated-transformer/

      - name: Large Language Models & Pre-training
        description: >-
          Autoregressive next-token prediction, tokenization (BPE, WordPiece), scaling laws, distributed training (FSDP, Megatron), and instruction fine-tuning (SFT, RLHF, DPO).
        difficulty: advanced
        optional: false
        duration: "3 weeks"
        takeaways:
          - "Next-token prediction cross-entropy loss"
          - "Byte Pair Encoding (BPE) tokenization implementation"
          - "Aligning pre-trained base models with human instructions"
        links:
          - title: "Let's build GPT: from scratch, in code (Andrej Karpathy)"
            url: https://www.youtube.com/watch?v=kCc8FmEb1nY
          - title: "Hugging Face Transformers Documentation"
            url: https://huggingface.co/docs/transformers/index

  - title: "Phase 6: Autonomous Agents, RAG & AI Safety"
    id: autonomous-agents-safety
    description: Building production AI systems with external tools, knowledge grounding, and alignment.
    topics:
      - name: Autonomous Agent Frameworks & Tool Calling
        description: >-
          ReAct prompting pattern (Reasoning + Acting), function calling, tool execution loops, planning, short-term and long-term memory architectures.
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "ReAct loop implementation (Thought -> Action -> Observation -> Answer)"
          - "Structured output schema enforcement with JSON"
          - "State management in multi-step autonomous workflows"
        codeSnippet: |
          def agent_react_step(prompt, tools):
              thought = llm_generate(f"{prompt}\nThought:")
              action = parse_action(thought)
              observation = execute_tool(action, tools)
              return f"Observation: {observation}"
        links:
          - title: "ReAct: Synergizing Reasoning and Acting in Language Models"
            url: https://arxiv.org/abs/2210.03629
          - title: "LangChain / LangGraph Agent Documentation"
            url: https://langchain-ai.github.io/langgraph/

      - name: Retrieval-Augmented Generation (RAG)
        description: >-
          Vector embeddings, chunking strategies, cosine similarity search, approximate nearest neighbors (HNSW), re-ranking, and grounded generation pipelines.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Document ingestion, chunking, and embedding generation"
          - "Vector database indexing (Qdrant, Milvus, Chroma)"
          - "Hybrid dense + sparse BM25 retrieval and Cross-Encoder re-ranking"
        links:
          - title: "LlamaIndex Documentation"
            url: https://docs.llamaindex.ai/
          - title: "Pinecone Learning Center: What is Vector Search?"
            url: https://www.pinecone.io/learn/vector-search-basics/

      - name: AI Safety, Alignment & Robustness
        description: >-
          Mechanistic interpretability, prompt injection defense, red teaming, constitutional AI, evaluation benchmarks, and ethical societal alignment.
        difficulty: beginner
        optional: false
        duration: "1 week"
        takeaways:
          - "Vulnerabilities: Prompt injection, jailbreaks, and hallucinations"
          - "Guardrails, output moderation, and deterministic evaluators"
          - "Ethical fairness, privacy, and alignment frameworks"
        links:
          - title: "Anthropic Research on AI Safety & Alignment"
            url: https://www.anthropic.com/research
          - title: "OpenAI Safety & Alignment Guidelines"
            url: https://openai.com/safety/
---