---
title: Data Scientist
description: >-
  The path to becoming a Data Scientist, covering data manipulation, visualization, statistics, and machine learning.
featured: true
nodes:
  - title: Data Handling
    id: data-handling
    description: Collecting, cleaning, and managing data.
    topics:
      - name: SQL
        description: Querying relational databases to extract and aggregate data.
        difficulty: beginner
        optional: false
        takeaways:
          - "SELECT, FROM, WHERE clauses"
          - "JOINS (Inner, Left, Right)"
          - "GROUP BY and Aggregations"
        links:
          - title: SQL Tutorial (W3Schools)
            url: https://www.w3schools.com/sql/
      - name: Pandas for Data Analysis
        description: Data manipulation, cleaning, and aggregation in Python.
        difficulty: intermediate
        optional: false
        duration: "3 weeks"
        links:
          - title: Pandas User Guide
            url: https://pandas.pydata.org/docs/user_guide/index.html
  - title: Exploratory Data Analysis (EDA)
    id: eda
    description: Understanding data through visualization and stats.
    topics:
      - name: Data Visualization
        description: Using Matplotlib, Seaborn, or Tableau to tell stories with data.
        difficulty: beginner
        optional: false
        links:
          - title: Seaborn Gallery
            url: https://seaborn.pydata.org/examples/index.html
          - title: Matplotlib Tutorials
            url: https://matplotlib.org/stable/tutorials/index.html
      - name: Statistical Inference
        description: A/B Testing, Hypothesis testing, Confidence intervals.
        difficulty: intermediate
        optional: false
        links:
          - title: Statistics for Data Science
            url: https://www.khanacademy.org/math/statistics-probability
  - title: Machine Learning for Data Science
    id: ml-for-ds
    description: Applying predictive models to solve business problems.
    topics:
      - name: Scikit-Learn
        description: Implementing standard ML algorithms in Python.
        difficulty: intermediate
        optional: false
        links:
          - title: Scikit-Learn Tutorials
            url: https://scikit-learn.org/stable/tutorial/index.html
      - name: Time Series Analysis
        description: Analyzing and forecasting data points collected over time.
        difficulty: advanced
        optional: true
        links:
          - title: Time Series Forecasting (TensorFlow)
            url: https://www.tensorflow.org/tutorials/structured_data/time_series
  - title: Big Data Technologies
    id: big-data
    description: Handling large-scale datasets.
    topics:
      - name: Apache Spark
        description: Unified analytics engine for large-scale data processing.
        difficulty: advanced
        optional: true
        links:
          - title: Apache Spark Documentation
            url: https://spark.apache.org/docs/latest/
---