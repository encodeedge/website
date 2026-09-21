---
title: Data Scientist
description: >-
  The master roadmap to becoming a professional Data Scientist — covering applied statistics, SQL data engineering, exploratory analysis, production ML pipelines, and causal experimentation.
image: /assets/roadmaps/data-science.svg
featured: true
nodes:
  - title: "Phase 1: Statistics & Mathematical Intuition"
    id: statistics-math
    description: Probability theory, statistical distributions, hypothesis testing, and quantitative reasoning for data-driven decisions.
    topics:
      - name: Descriptive & Inferential Statistics
        description: >-
          Measures of central tendency (mean, median, mode), dispersion (variance, standard deviation, IQR), skewness, kurtosis, and the Central Limit Theorem (CLT).
        difficulty: beginner
        optional: false
        duration: "2 weeks"
        prerequisites:
          - "Basic arithmetic & algebra"
        takeaways:
          - "Understanding sampling distributions and standard error"
          - "Applying Central Limit Theorem to sample means"
          - "Detecting skewed distributions and applying log / power transforms"
        codeSnippet: |
          import numpy as np
          from scipy import stats

          data = np.random.normal(loc=50, scale=10, size=1000)
          mean, std = np.mean(data), np.std(data)
          iqr = stats.iqr(data)
          print(f"Mean: {mean:.2f}, Std: {std:.2f}, IQR: {iqr:.2f}")
        links:
          - title: "Statistics and Probability (Khan Academy)"
            url: https://www.khanacademy.org/math/statistics-probability
          - title: "Fundamental Math for Data Science (Codecademy)"
            url: https://www.codecademy.com/learn/paths/fundamental-math-for-data-science

      - name: Probability Distributions & Hypothesis Testing
        description: >-
          Normal, Binomial, Poisson, and Student's t-distributions; formulating null vs alternative hypotheses, Type I/II errors, p-values, t-tests, and ANOVA.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Formulating statistical null and alternative hypotheses"
          - "Interpreting p-values and confidence intervals accurately"
          - "Conducting one-sample, two-sample, and paired t-tests"
        codeSnippet: |
          from scipy import stats

          group_a = [23, 21, 24, 25, 27, 22, 24, 25]
          group_b = [28, 30, 27, 29, 31, 28, 29, 30]
          t_stat, p_val = stats.ttest_ind(group_a, group_b)
          print(f"p-value: {p_val:.5f} (Statistically significant if < 0.05)")
        links:
          - title: "StatQuest: Hypothesis Testing and p-values"
            url: https://www.youtube.com/watch?v=0oc49DyA3hU
          - title: "NPTEL Swayam Mathematics Course"
            url: https://onlinecourses.nptel.ac.in/noc22_cs33/preview

  - title: "Phase 2: SQL & Data Engineering Foundations"
    id: sql-data-engineering
    description: Querying relational databases, complex joins, analytical window functions, and data cleaning pipelines.
    topics:
      - name: Modern SQL for Data Science
        description: >-
          SELECT, filtering, GROUP BY, aggregations, multi-table JOINs (INNER, LEFT, FULL OUTER), Common Table Expressions (CTEs), and subqueries.
        difficulty: beginner
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Writing multi-join aggregation queries for customer analytics"
          - "Structuring complex analysis using Common Table Expressions (WITH clauses)"
          - "Optimizing query execution plans and index usage"
        codeSnippet: |
          WITH MonthlyRevenue AS (
            SELECT 
              DATE_TRUNC('month', order_date) AS order_month,
              user_id,
              SUM(total_amount) AS total_spent
            FROM orders
            WHERE status = 'completed'
            GROUP BY 1, 2
          )
          SELECT 
            order_month,
            COUNT(DISTINCT user_id) AS active_users,
            AVG(total_spent) AS arpu
          FROM MonthlyRevenue
          GROUP BY 1
          ORDER BY 1 DESC;
        links:
          - title: "SQL Tutorial for Beginners (W3Schools)"
            url: https://www.w3schools.com/sql/
          - title: "Mode Analytics SQL Tutorial for Data Analysis"
            url: https://mode.com/sql-tutorial/

      - name: Advanced SQL Window Functions & Aggregations
        description: >-
          ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(), running totals, moving averages, and cumulative distribution calculations.
        difficulty: intermediate
        optional: false
        duration: "10 days"
        takeaways:
          - "Computing rolling metrics and retention cohorts with window functions"
          - "Partitioning data across customer categories without collapsing rows"
          - "Calculating period-over-period growth rates"
        codeSnippet: |
          SELECT 
            employee_id,
            department_id,
            salary,
            DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_in_dept,
            AVG(salary) OVER (PARTITION BY department_id) AS dept_avg_salary
          FROM employees;
        links:
          - title: "PostgreSQL Official Documentation: Window Functions"
            url: https://www.postgresql.org/docs/current/tutorial-window.html

  - title: "Phase 3: Python Data Analysis & Visualization"
    id: python-eda-viz
    description: High-performance data wrangling with Pandas, numerical computing with NumPy, and visual storytelling with Seaborn.
    topics:
      - name: Pandas & NumPy for Data Manipulation
        description: >-
          Loading multi-format data (CSV, Parquet, JSON, SQL), handling nulls, vectorized string operations, datetime manipulation, and pivot tables.
        difficulty: beginner
        optional: false
        duration: "2 weeks"
        takeaways:
          - "High-performance data transformation on large DataFrames"
          - "Handling missing data: forward fill, backward fill, and model imputation"
          - "Reshaping data using melt, pivot_table, and stack/unstack"
        codeSnippet: |
          import pandas as pd
          df = pd.read_parquet("transactions.parquet")
          # Grouped metrics and pivot
          summary = df.pivot_table(
              index="customer_segment",
              columns="channel",
              values="revenue",
              aggfunc=["count", "sum", "mean"]
          )
        links:
          - title: "Python for Data Science (Full Video Tutorial)"
            url: https://www.youtube.com/watch?v=LHBE6Q9XlzI
          - title: "Data Science Introduction (W3Schools)"
            url: https://www.w3schools.com/datascience/ds_introduction.asp

      - name: Exploratory Data Analysis & Visual Storytelling
        description: >-
          Matplotlib, Seaborn, distribution plots, correlation heatmaps, pairplots, box plots for outlier detection, and communicating statistical insights.
        difficulty: intermediate
        optional: false
        duration: "10 days"
        takeaways:
          - "Identifying multicollinearity and feature interactions visually"
          - "Designing publication-quality visualizations for stakeholders"
          - "Interactive dashboards with Plotly and Streamlit"
        codeSnippet: |
          import matplotlib.pyplot as plt
          import seaborn as sns

          plt.figure(figsize=(10, 6))
          sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm", fmt=".2f")
          plt.title("Feature Correlation Matrix")
          plt.tight_layout()
          plt.show()
        links:
          - title: "Seaborn Example Gallery"
            url: https://seaborn.pydata.org/examples/index.html
          - title: "IBM Data Science Professional Certificate"
            url: https://www.coursera.org/professional-certificates/ibm-data-science

  - title: "Phase 4: Predictive Modeling & Experimentation"
    id: predictive-modeling
    description: Applying supervised learning models to solve business problems, feature engineering, and conducting rigorous A/B tests.
    topics:
      - name: Applied Machine Learning for Business
        description: >-
          Linear/Logistic Regression, Random Forests, XGBoost, Scikit-Learn pipelines, customer churn prediction, and lifetime value (LTV) modeling.
        difficulty: intermediate
        optional: false
        duration: "3 weeks"
        takeaways:
          - "Building production Scikit-Learn pipelines with preprocessors"
          - "Feature importance and SHAP (SHapley Additive exPlanations) values"
          - "Calibrating probabilities for business decision thresholds"
        codeSnippet: |
          from sklearn.ensemble import GradientBoostingClassifier
          from sklearn.model_selection import train_test_split
          from sklearn.metrics import roc_auc_score

          X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)
          model = GradientBoostingClassifier(n_estimators=150, learning_rate=0.08)
          model.fit(X_train, y_train)
          print("Test ROC-AUC:", roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))
        links:
          - title: "Google Data Analytics Professional Certificate"
            url: https://www.coursera.org/professional-certificates/google-data-analytics
          - title: "Scikit-Learn Machine Learning in Python"
            url: https://scikit-learn.org/stable/

      - name: A/B Testing & Causal Inference
        description: >-
          Randomized controlled trials (RCTs), sample size determination, statistical power, minimum detectable effect (MDE), and causal inference (propensity score matching).
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Calculating required sample size based on alpha, beta, and MDE"
          - "Addressing peeking problems and novelty effects in online experiments"
          - "Difference-in-differences and quasi-experimental methods"
        codeSnippet: |
          from statsmodels.stats.power import TTestIndPower

          power_analysis = TTestIndPower()
          sample_size = power_analysis.solve_power(
              effect_size=0.2, # Standardized effect size (Cohen's d)
              power=0.80,      # 80% statistical power
              alpha=0.05       # 5% significance level
          )
          print(f"Required sample size per variant: {int(np.ceil(sample_size))}")
        links:
          - title: "Udacity: A/B Testing by Google"
            url: https://www.udacity.com/course/ab-testing--ud257
          - title: "Quick 5 Minute Intro to Data Science"
            url: https://www.youtube.com/watch?v=X3paOmcrTjQ

  - title: "Phase 5: Big Data & Production Analytics"
    id: big-data-analytics
    description: Distributed computing with Apache Spark, cloud data warehouses, and automated analytics pipelines.
    topics:
      - name: Distributed Data Processing with PySpark
        description: >-
          Resilient Distributed Datasets (RDDs), Spark DataFrames, distributed aggregation, partitioning strategies, and big data ETL workflows.
        difficulty: advanced
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Parallel transformations across distributed compute clusters"
          - "Avoiding expensive shuffles and data skews in Spark jobs"
          - "Interfacing PySpark with AWS S3 / Google Cloud Storage"
        codeSnippet: |
          from pyspark.sql import SparkSession
          from pyspark.sql import functions as F

          spark = SparkSession.builder.appName("AnalyticsPipeline").getOrCreate()
          df = spark.read.parquet("s3a://data-lake/events/")
          df_aggregated = df.groupBy("country").agg(
              F.count("user_id").alias("total_events"),
              F.avg("session_duration").alias("avg_duration")
          )
        links:
          - title: "Apache Spark Python API Documentation"
            url: https://spark.apache.org/docs/latest/api/python/

      - name: Cloud Data Warehousing & Analytics Engineering
        description: >-
          Snowflake, Google BigQuery, dbt (data build tool), columnar storage architectures, data modeling (star and snowflake schemas), and metric layers.
        difficulty: intermediate
        optional: true
        duration: "10 days"
        takeaways:
          - "Transforming raw lake data into modeled dimension and fact tables"
          - "dbt testing and automated data quality validation"
        links:
          - title: "dbt (data build tool) Getting Started Guide"
            url: https://docs.getdbt.com/docs/introduction
---