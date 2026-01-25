---
title: Artificial Intelligence
description: >-
  A broad overview of AI, including search algorithms, logic, reasoning, and modern applications.
featured: false
nodes:
  - title: AI Fundamentals
    id: ai-fundamentals
    description: Core concepts of intelligent agents and environments.
    topics:
      - name: Intelligent Agents
        description: Agents, environments, sensors, actuators, and rationality.
        difficulty: beginner
        optional: false
        links:
          - title: AI: A Modern Approach (Book Site)
            url: http://aima.cs.berkeley.edu/
      - name: Search Algorithms
        description: Solving problems by searching through state spaces.
        difficulty: intermediate
        optional: false
        takeaways:
          - "Uninformed Search (BFS, DFS)"
          - "Informed Search (A*, Heuristics)"
          - "Adversarial Search (Minimax)"
        links:
          - title: Search in AI (GeeksforGeeks)
            url: https://www.geeksforgeeks.org/search-algorithms-in-ai/
  - title: Knowledge & Reasoning
    id: knowledge-reasoning
    description: Representing information and drawing conclusions.
    topics:
      - name: Logic
        description: Propositional Logic and First-Order Logic.
        difficulty: intermediate
        optional: false
        links:
          - title: Introduction to Logic (Stanford)
            url: http://intrologic.stanford.edu/
      - name: Probabilistic Reasoning
        description: Bayesian Networks and uncertainty.
        difficulty: advanced
        optional: true
        links:
          - title: Probabilistic Reasoning (Coursera)
            url: https://www.coursera.org/specializations/probabilistic-graphical-models
  - title: Reinforcement Learning
    id: reinforcement-learning
    description: Learning by interacting with an environment.
    topics:
      - name: Markov Decision Processes (MDP)
        description: Mathematical framework for modeling decision making.
        difficulty: advanced
        optional: false
        links:
          - title: Spinning Up in Deep RL (OpenAI)
            url: https://spinningup.openai.com/en/latest/
      - name: Q-Learning
        description: A model-free reinforcement learning algorithm.
        difficulty: advanced
        optional: false
        links:
          - title: Q-Learning Explained
            url: https://www.freecodecamp.org/news/q-learning-an-introduction-to-reinforcement-learning/
  - title: Modern AI & Ethics
    id: modern-ai
    description: Current trends and societal impact.
    topics:
      - name: Large Language Models (LLMs)
        description: Overview of how models like GPT work and their capabilities.
        difficulty: intermediate
        optional: false
        links:
          - title: State of GPT (Andrej Karpathy)
            url: https://www.youtube.com/watch?v=bZQun8Y4L2A
      - name: AI Ethics & Safety
        description: Bias, fairness, transparency, and alignment in AI systems.
        difficulty: beginner
        optional: false
        links:
          - title: AI Ethics Guidelines (IEEE)
            url: https://standards.ieee.org/industry-connections/ec/autonomous-systems.html
---