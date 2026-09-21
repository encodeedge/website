---
title: Machine Learning Engineer
description: >-
  A master curriculum from mathematical foundations and statistical intuition to production scikit-learn architectures, ensemble methods, and automated MLOps pipelines.
image: /assets/roadmaps/machine-learning.svg
featured: true
nodes:
  - title: "Phase 1: Mathematical Foundations for ML"
    id: math-foundations
    description: Core linear algebra, multivariable calculus, and probabilistic modeling essential for algorithmic intuition.
    topics:
      - name: Linear Algebra & Matrix Transformations
        description: >-
          Vector spaces, dot products, matrix multiplication, rank, determinants, eigenvalues, eigenvectors, and Singular Value Decomposition (SVD).
        difficulty: beginner
        optional: false
        duration: "2 weeks"
        prerequisites:
          - "High school algebra"
          - "Coordinate geometry"
        takeaways:
          - "Vector projection and geometric intuition of feature spaces"
          - "Eigen-decomposition and covariance matrix transformation"
          - "SVD formulation for dimensionality reduction"
        codeSnippet: |
          import numpy as np
          # Covariance matrix and eigendecomposition
          X = np.array([[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2]])
          X_centered = X - np.mean(X, axis=0)
          cov_matrix = np.cov(X_centered, rowvar=False)
          eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)
        links:
          - title: "3Blue1Brown - Essence of Linear Algebra"
            url: https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab
          - title: "MIT 18.06 Linear Algebra - Gilbert Strang"
            url: https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/

      - name: Multivariable Calculus & Gradient Optimization
        description: >-
          Derivatives, partial derivatives, directional gradients, Jacobian and Hessian matrices, and optimization via Gradient Descent variants.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        prerequisites:
          - "Single-variable calculus"
        takeaways:
          - "Computing gradients with multivariable chain rule"
          - "Formulating loss landscapes and convexity"
          - "Batch, Mini-batch, and Stochastic Gradient Descent dynamics"
        codeSnippet: |
          def gradient_descent(X, y, lr=0.01, epochs=1000):
              m, n = X.shape
              weights = np.zeros(n)
              for _ in range(epochs):
                  predictions = np.dot(X, weights)
                  errors = predictions - y
                  gradient = (1 / m) * np.dot(X.T, errors)
                  weights -= lr * gradient
              return weights
        links:
          - title: "Essence of Calculus - 3Blue1Brown"
            url: https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr
          - title: "Math for Machine Learning Playlist"
            url: https://youtube.com/playlist?list=PLD80i8An1OEGZ2tYimemzwC3xqkU0jKUg

      - name: Probability Distributions & Bayesian Inference
        description: >-
          Random variables, probability mass/density functions (Normal, Bernoulli, Poisson), Bayes' Theorem, Maximum Likelihood Estimation (MLE), and Maximum A Posteriori (MAP).
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        prerequisites:
          - "Basic calculus integration"
        takeaways:
          - "Formulating likelihood functions and log-likelihood"
          - "Bayesian prior-to-posterior updates"
          - "Hypothesis testing, p-values, and confidence intervals"
        links:
          - title: "StatQuest with Josh Starmer - Probability & Statistics"
            url: https://www.youtube.com/c/joshstarmer
          - title: "Fundamental Math for Data Science - Codecademy"
            url: https://www.codecademy.com/learn/paths/fundamental-math-for-data-science

  - title: "Phase 2: Python Tooling & Scientific Computing"
    id: python-scientific-computing
    description: Professional engineering environment, vectorized computation with NumPy, and structured data handling with Pandas.
    topics:
      - name: Python Environment & AI/ML Setup
        description: >-
          Configuring modern Python (3.12+), virtual environments, pip, poetry, VS Code configuration, and interactive Jupyter notebook workflows.
        difficulty: beginner
        optional: false
        duration: "1 week"
        takeaways:
          - "Isolated dependency management with venv and pip"
          - "Interactive kernel debugging in VS Code"
          - "Setting up hardware acceleration (Metal / CUDA if available)"
        links:
          - title: "HarvardX CS50's Introduction to Programming with Python"
            url: https://www.edx.org/learn/python/harvard-university-cs50-s-introduction-to-programming-with-python
          - title: "Python 3 Official Documentation & Downloads"
            url: https://www.python.org/downloads/

      - name: NumPy & Vectorized Array Operations
        description: >-
          N-dimensional array indexing, memory layout (C vs Fortran order), broadcasting semantics, vectorization, and linear algebra operations.
        difficulty: beginner
        optional: false
        duration: "10 days"
        takeaways:
          - "Eliminating Python loops with vectorized NumPy expressions"
          - "Broadcasting rules across unequal matrix shapes"
          - "Memory views vs deep copies in matrix slicing"
        codeSnippet: |
          import numpy as np
          # Vectorized pairwise euclidean distance
          A = np.random.randn(100, 10)
          B = np.random.randn(50, 10)
          dists = np.sqrt(np.sum((A[:, np.newaxis, :] - B[np.newaxis, :, :]) ** 2, axis=-1))
        links:
          - title: "NumPy Illustrated: The Visual Guide"
            url: https://betterprogramming.pub/numpy-illustrated-the-visual-guide-to-numpy-3b1d4976de1d
          - title: "Practice Python on HackerRank"
            url: https://www.hackerrank.com/domains/python

      - name: Pandas for Data Wrangling & Feature Engineering
        description: >-
          DataFrames, Series, handling missing values, grouped aggregations, time series manipulation, merge/join paradigms, and categorical encoding.
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Exploratory data analysis (EDA) workflows"
          - "Imputation, robust outlier handling, and scaling"
          - "One-hot encoding vs target encoding"
        codeSnippet: |
          import pandas as pd
          df = pd.read_csv("data.csv")
          # Clean and engineer pipeline
          df['age_imputed'] = df['age'].fillna(df['age'].median())
          df['log_income'] = np.log1p(df['income'])
          df = pd.get_dummies(df, columns=['category'], drop_first=True)
        links:
          - title: "IBM Data Science Professional Certificate"
            url: https://www.coursera.org/professional-certificates/ibm-data-science
          - title: "Google Data Analytics Professional Certificate"
            url: https://www.coursera.org/professional-certificates/google-data-analytics

  - title: "Phase 3: Supervised Machine Learning"
    id: supervised-learning
    description: Core predictive algorithms for continuous estimation and discrete pattern classification.
    topics:
      - name: Linear & Polynomial Regression
        description: >-
          Ordinary Least Squares (OLS), cost functions, bias-variance decomposition, and L1 (Lasso) vs L2 (Ridge) vs ElasticNet regularization.
        difficulty: beginner
        optional: false
        duration: "10 days"
        takeaways:
          - "Deriving normal equation vs gradient descent solution"
          - "Regularization penalties to prevent overfitting"
          - "Residual analysis and heteroskedasticity checks"
        codeSnippet: |
          from sklearn.linear_model import Ridge, Lasso
          from sklearn.preprocessing import StandardScaler
          from sklearn.pipeline import make_pipeline

          pipeline = make_pipeline(StandardScaler(), Ridge(alpha=1.0))
          pipeline.fit(X_train, y_train)
          preds = pipeline.predict(X_test)
        links:
          - title: "HarvardX: Data Science: Machine Learning"
            url: https://www.edx.org/learn/machine-learning/harvard-university-data-science-machine-learning
          - title: "Scikit-Learn Generalized Linear Models"
            url: https://scikit-learn.org/stable/modules/linear_model.html

      - name: Logistic Regression & Classification Metrics
        description: >-
          Binary and multiclass classification, sigmoid/softmax functions, cross-entropy log-loss, ROC-AUC, precision, recall, and PR curves.
        difficulty: beginner
        optional: false
        duration: "10 days"
        takeaways:
          - "Log-odds and odds ratio interpretations"
          - "Balancing precision vs recall trade-offs"
          - "Handling imbalanced datasets with class weights & SMOTE"
        codeSnippet: |
          from sklearn.metrics import classification_report, roc_auc_score
          from sklearn.linear_model import LogisticRegression

          clf = LogisticRegression(class_weight='balanced')
          clf.fit(X_train, y_train)
          y_probs = clf.predict_proba(X_test)[:, 1]
          print("ROC-AUC:", roc_auc_score(y_test, y_probs))
        links:
          - title: "Andrew Ng's Machine Learning Specialization (Stanford / Coursera)"
            url: https://www.coursera.org/specializations/machine-learning-introduction
          - title: "StatQuest: Logistic Regression Clearly Explained"
            url: https://www.youtube.com/watch?v=yIYKR4sgzI8

      - name: Decision Trees & Tree Ensembles (Random Forests, XGBoost)
        description: >-
          Information gain, Gini impurity, CART algorithm, bagging (Random Forest), and gradient boosting architectures (XGBoost, LightGBM, CatBoost).
        difficulty: intermediate
        optional: false
        duration: "2 weeks"
        takeaways:
          - "Tree splitting criteria and pruning strategies"
          - "Bagging vs Boosting variance/bias reduction mechanisms"
          - "Hyperparameter tuning: learning rate, max depth, subsample"
        codeSnippet: |
          import xgboost as xgb
          model = xgb.XGBClassifier(n_estimators=200, learning_rate=0.05, max_depth=5)
          model.fit(X_train, y_train, eval_set=[(X_val, y_val)], early_stopping_rounds=10)
        links:
          - title: "XGBoost Documentation & Tutorials"
            url: https://xgboost.readthedocs.io/en/stable/
          - title: "StatQuest: Random Forests & Gradient Boost"
            url: https://www.youtube.com/watch?v=J4Wdy0Wc_xQ

      - name: Support Vector Machines & Kernel Methods
        description: >-
          Maximum margin hyperplanes, soft margin formulation (C parameter), dual formulation, and non-linear kernel tricks (RBF, Polynomial).
        difficulty: intermediate
        optional: false
        duration: "1 week"
        takeaways:
          - "Support vector identification and margin boundaries"
          - "Kernel mapping to infinite-dimensional spaces"
          - "Computational scalability constraints of kernel SVMs"
        links:
          - title: "Scikit-Learn SVM Guide"
            url: https://scikit-learn.org/stable/modules/svm.html

  - title: "Phase 4: Unsupervised Learning & Clustering"
    id: unsupervised-learning
    description: Finding latent structure, clusters, and low-dimensional manifolds in unlabeled datasets.
    topics:
      - name: Clustering Algorithms (K-Means, DBSCAN, Hierarchical)
        description: >-
          Centroid-based clustering (K-Means, K-Means++), density-based clustering (DBSCAN), agglomerative hierarchical clustering, and silhouette evaluation.
        difficulty: intermediate
        optional: false
        duration: "10 days"
        takeaways:
          - "Elbow method and Silhouette analysis for optimal K"
          - "Handling arbitrary cluster shapes and noise with DBSCAN"
          - "Dendrogram interpretation for hierarchical taxonomies"
        codeSnippet: |
          from sklearn.cluster import KMeans, DBSCAN
          from sklearn.metrics import silhouette_score

          kmeans = KMeans(n_clusters=4, init='k-means++', random_state=42)
          clusters = kmeans.fit_predict(X_scaled)
          print("Silhouette:", silhouette_score(X_scaled, clusters))
        links:
          - title: "Scikit-Learn Clustering Overview"
            url: https://scikit-learn.org/stable/modules/clustering.html
          - title: "Visualizing K-Means Clustering"
            url: https://www.naftaliharris.com/blog/visualizing-k-means-clustering/

      - name: Dimensionality Reduction & PCA
        description: >-
          Principal Component Analysis (PCA), explained variance ratio, t-SNE, and UMAP for high-dimensional feature compression and latent visualization.
        difficulty: advanced
        optional: false
        duration: "10 days"
        takeaways:
          - "Covariance matrix projection onto orthogonal eigenvectors"
          - "Balancing dimensionality reduction with information loss"
          - "Non-linear manifold visualization with UMAP"
        codeSnippet: |
          from sklearn.decomposition import PCA
          pca = PCA(n_components=0.95) # Retain 95% variance
          X_reduced = pca.fit_transform(X_scaled)
          print(f"Reduced features: {X_scaled.shape[1]} -> {X_reduced.shape[1]}")
        links:
          - title: "PCA Explained Visually (Setosa)"
            url: https://setosa.io/ev/principal-component-analysis/
          - title: "How to Use t-SNE Effectively (Distill.pub)"
            url: https://distill.pub/2016/misread-tsne/

      - name: Anomaly Detection & Density Estimation
        description: >-
          Isolation Forests, One-Class SVMs, and Gaussian Mixture Models (GMM) for fraud detection, outlier identification, and industrial telemetry monitoring.
        difficulty: intermediate
        optional: true
        duration: "1 week"
        takeaways:
          - "Path-length isolation metrics in Isolation Forest"
          - "Expectation-Maximization (EM) algorithm for GMMs"
          - "Threshold tuning under extreme class imbalance"
        links:
          - title: "Scikit-Learn Anomaly Detection"
            url: https://scikit-learn.org/stable/modules/outlier_detection.html

  - title: "Phase 5: Evaluation, Validation & MLOps"
    id: evaluation-mlops
    description: Industrial-grade validation strategies, model deployment, API creation, and production monitoring.
    topics:
      - name: Cross-Validation & Preventing Data Leakage
        description: >-
          K-Fold, Stratified K-Fold, TimeSeriesSplit, GroupKFold, target leakage prevention, and Scikit-Learn Pipeline architectures.
        difficulty: intermediate
        optional: false
        duration: "1 week"
        takeaways:
          - "Preventing pre-processing data leakage inside CV splits"
          - "Time series temporal ordering constraints"
          - "Nested cross-validation for unbiased hyperparameter evaluation"
        codeSnippet: |
          from sklearn.model_selection import StratifiedKFold, cross_val_score
          from sklearn.pipeline import Pipeline
          from sklearn.preprocessing import RobustScaler
          from sklearn.ensemble import RandomForestClassifier

          pipe = Pipeline([('scaler', RobustScaler()), ('rf', RandomForestClassifier())])
          cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
          scores = cross_val_score(pipe, X, y, cv=cv, scoring='f1_macro')
        links:
          - title: "Scikit-Learn Model Evaluation & Cross-Validation"
            url: https://scikit-learn.org/stable/modules/cross_validation.html

      - name: Model Serialization & ONNX Export
        description: >-
          Serializing trained estimators with Joblib, Safetensors, and exporting scikit-learn models to the open-standard ONNX format for C++ / cross-platform inference.
        difficulty: intermediate
        optional: false
        duration: "5 days"
        takeaways:
          - "Safe serialization patterns vs insecure pickle vulnerabilities"
          - "ONNX Runtime acceleration for low-latency batch scoring"
        codeSnippet: |
          import joblib
          joblib.dump(pipe, 'production_model.joblib')
          loaded_model = joblib.load('production_model.joblib')
        links:
          - title: "ONNX Runtime: Cross-Platform Machine Learning Accelerator"
            url: https://onnxruntime.ai/

      - name: Production Serving with FastAPI & Docker
        description: >-
          Building asynchronous REST inference microservices with FastAPI, Pydantic request validation, Docker containerization, and health check endpoints.
        difficulty: advanced
        optional: false
        duration: "10 days"
        takeaways:
          - "Designing low-latency REST endpoints for real-time inference"
          - "Multi-worker Uvicorn configurations inside Docker containers"
          - "Handling batch requests with asynchronous queuing"
        codeSnippet: |
          from fastapi import FastAPI
          from pydantic import BaseModel
          import joblib

          app = FastAPI(title="ML Prediction Service")
          model = joblib.load("production_model.joblib")

          class Features(BaseModel):
              inputs: list[float]

          @app.post("/predict")
          def predict(data: Features):
              pred = model.predict([data.inputs])
              return {"prediction": int(pred[0])}
        links:
          - title: "FastAPI Documentation"
            url: https://fastapi.tiangolo.com/
          - title: "Google Cloud ML Engineer Learning Path"
            url: https://www.cloudskillsboost.google/paths/17

      - name: Experiment Tracking & Drift Monitoring
        description: >-
          MLflow, Weights & Biases, detecting concept drift, data drift (Evidently AI), and continuous model re-training strategies.
        difficulty: advanced
        optional: true
        duration: "1 week"
        takeaways:
          - "Logging hyperparameters, artifacts, and evaluation metrics"
          - "Statistical tests (KS-test, Population Stability Index) for drift"
        links:
          - title: "MLflow: An Open Source Platform for the Machine Learning Lifecycle"
            url: https://mlflow.org/
          - title: "Explore Azure with OpenAI"
            url: https://learn.microsoft.com/en-us/training/modules/explore-azure-openai/
---