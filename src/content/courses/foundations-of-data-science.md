---
title: Foundations of Data Science
shortDescription: >-
  Master the complete mathematical and computational foundations of Data
  Science. From CRISP-DM engineering, descriptive statistics, Python, NumPy, and
  Pandas to probability, the Central Limit Theorem, and Chi-Square tests.
coverImage: /assets/courses/foundations-of-data-science.svg
instructor: atul-jha
level: beginner
status: published
chapters:
  - title: Introduction
    description: >-
      Understanding the data science lifecycle: data collection, storage,
      processing, statistical vs algorithmic modeling, and career paths.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-what-is-data-science-lifecycle
      - discriminant: lesson
        value:
          lessonRef: fds-statistical-vs-algorithmic-modelling
      - discriminant: lesson
        value:
          lessonRef: fds-myths-and-path-to-data-science
      - discriminant: quiz
        value:
          quizRef: fds-week-1-quiz
  - title: Engineering Data Science Systems
    description: >-
      Systems perspective of data science, production architectures, the
      CRISP-DM lifecycle methodology, and Python ecosystem tools.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-engineering-aspects-and-system-perspective
      - discriminant: lesson
        value:
          lessonRef: fds-crisp-dm-framework
      - discriminant: lesson
        value:
          lessonRef: fds-programming-tools-why-python
      - discriminant: quiz
        value:
          quizRef: fds-week-2-part-1-quiz
  - title: Statistics
    description: >-
      Statistical inference fundamentals: sampling procedures, experimental
      design, descriptive summaries, probability guarantees, and hypothesis
      tests.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-introduction-to-statistics-sampling-design
      - discriminant: lesson
        value:
          lessonRef: fds-summarising-data-probability-guarantees
      - discriminant: lesson
        value:
          lessonRef: fds-modelling-relationships-and-goodness-of-fit
      - discriminant: quiz
        value:
          quizRef: fds-week-2-part-2-quiz
  - title: Introduction to Python
    description: >-
      Hands-on Python in Google Colab: basic data types, variables, control flow
      (if/for/while), reusable functions, and coding exercises.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-colab-basics-variables-and-data-types
      - discriminant: lesson
        value:
          lessonRef: fds-control-flow-and-functions
      - discriminant: lesson
        value:
          lessonRef: fds-assignment-walkthrough-python-basics
      - discriminant: quiz
        value:
          quizRef: fds-week-3-quiz
  - title: Numpy
    description: >-
      Fast numerical array processing: high-dimensional ndarrays, slicing,
      vectorization, broadcasting mechanics, and statistical computing.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-numpy-ndarrays-creation-and-indexing
      - discriminant: lesson
        value:
          lessonRef: fds-vectorized-operations-and-broadcasting
      - discriminant: lesson
        value:
          lessonRef: fds-numerical-statistics-and-case-studies
      - discriminant: quiz
        value:
          quizRef: fds-week-8-quiz
  - title: Pandas
    description: >-
      Tabular data engineering: Series creation, label loc vs integer iloc
      indexing, vectorized series math, and the NIFTY stock analysis case study.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-pandas-series-and-indexing
      - discriminant: lesson
        value:
          lessonRef: fds-series-operations-and-financial-case-study
      - discriminant: quiz
        value:
          quizRef: fds-week-9-quiz
  - title: Visualisation
    description: >-
      Distribution visualization with Seaborn: reading nested JSON, custom
      tabulation styles, histograms, swarm plots, violin plots, and pair plots.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-distribution-visualizations
      - discriminant: lesson
        value:
          lessonRef: fds-multivariate-facets-and-pair-plots
      - discriminant: quiz
        value:
          quizRef: fds-week-11-quiz
  - title: Approaching Open-Ended DS Problems
    description: >-
      Navigating real-world data ambiguity: data audit hygiene, missing data
      strategies, and end-to-end multi-part agricultural case study.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-open-ended-problem-framework
      - discriminant: lesson
        value:
          lessonRef: fds-agriculture-case-study-eda
  - title: Probability
    description: >-
      Discrete probability foundations: multiplication principle with/without
      repetition, addition rule, permutations, combinations, and urn models.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-multiplication-and-addition-principles
      - discriminant: lesson
        value:
          lessonRef: fds-permutations-combinations-subtractions
      - discriminant: quiz
        value:
          quizRef: fds-week-14-quiz
  - title: Sample Spaces & Events
    description: >-
      Probability axioms: sample spaces, event algebra, conditional probability,
      multiplication rule, law of total probability, and Bayes' Theorem.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-set-theory-sample-spaces-axioms
      - discriminant: lesson
        value:
          lessonRef: fds-conditional-probability-and-bayes-theorem
      - discriminant: quiz
        value:
          quizRef: fds-week-15-quiz
  - title: Random Variables
    description: >-
      Random variable fundamentals: Probability Mass Functions (PMF),
      expectation, variance, and discrete distributions (Bernoulli, Binomial,
      Geometric).
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-discrete-random-variables-pmf
      - discriminant: lesson
        value:
          lessonRef: fds-discrete-distributions-bernoulli-binomial-geometric
      - discriminant: quiz
        value:
          quizRef: fds-week-16-quiz
  - title: Descriptive Statistics
    description: >-
      Types of data, qualitative summaries, frequency histograms, binning
      heuristics, skewness trends, and bivariate scatter plots in ML.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-qualitative-vs-quantitative-data
      - discriminant: lesson
        value:
          lessonRef: fds-histograms-trends-and-uses-in-ml
      - discriminant: lesson
        value:
          lessonRef: fds-stem-and-leaf-and-scatter-plots
      - discriminant: quiz
        value:
          quizRef: fds-week-4-quiz
  - title: Distributions & Sampling Strategies
    description: >-
      Continuous random variables: Probability Density Functions (PDF), Gaussian
      normal distribution, standard normal Z-scores, and sampling design.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-continuous-random-variables-pdf
      - discriminant: lesson
        value:
          lessonRef: fds-gaussian-normal-distribution-standardization
      - discriminant: quiz
        value:
          quizRef: fds-week-17-quiz
  - title: Distributions of Sample Statistics
    description: >-
      Transition to inferential statistics: population parameters vs sample
      statistics, sampling distributions, standard errors, and unbiased
      estimators.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-inferential-statistics-and-sample-means
      - discriminant: lesson
        value:
          lessonRef: fds-sampling-distributions-and-unbiased-estimators
  - title: Central Limit Theorem (CLT)
    description: >-
      The Central Limit Theorem: mathematical statements, empirical proof
      simulations, likelihood of sample means, and normal approximations.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-central-limit-theorem-foundations
      - discriminant: lesson
        value:
          lessonRef: fds-clt-applications-and-normal-approximations
      - discriminant: quiz
        value:
          quizRef: fds-week-19-quiz
  - title: Chi-Square Distribution
    description: >-
      Chi-Square distribution mechanics: sum of squared standard normals,
      degrees of freedom, sample variance distribution, and goodness-of-fit
      hypothesis testing.
    items:
      - discriminant: lesson
        value:
          lessonRef: fds-chi-square-distribution-and-degrees-of-freedom
      - discriminant: lesson
        value:
          lessonRef: fds-goodness-of-fit-and-independence-tests
      - discriminant: quiz
        value:
          quizRef: fds-week-20-quiz
enrollmentMode: free
prerequisites: []
featured: false
tags: []
topics: []
---
### Why This Course Matters

Modern Artificial Intelligence and Machine Learning algorithms cannot function without solid data foundations. Knowing how to systematically collect, store, clean, summarize, model, and infer statistical guarantees from empirical data is what separates true data scientists from superficial model-fitters.

### What You Will Master

1. **The Data Science Lifecycle & Systems**: CRISP-DM methodology, engineering architectures, and problem framing.
2. **Descriptive Statistics**: Centrality (mean, median, mode), spread (variance, standard deviation, IQR), outliers, and distribution shapes.
3. **Applied Python Stack**: Deep dives into Python primitives, vectorized NumPy multidimensional arrays, and tabular manipulation with Pandas.
4. **Data Visualization**: Constructing clear histograms, scatter plots, violin plots, pair grids, and compositional charts with Seaborn and Matplotlib.
5. **Probability & Counting**: Combinatorics, sample spaces, conditional probability, Bayes' Rule, and discrete distributions (Binomial, Geometric).
6. **Inferential Statistics**: Continuous densities, Gaussian distributions, the Central Limit Theorem (CLT), and Chi-Square hypothesis testing.
