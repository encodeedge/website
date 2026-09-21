---
title: "Project: End-to-End Regression Pipeline & Model Deployment"
description: "Construct a feature engineering and regularized regression model with Scikit-Learn, including cross-validation and hyperparameter tuning."
rubric:
- criteria: Exploratory Data Analysis & Outlier Handling
  maxPoints: 20
- criteria: Feature Scaling & Scikit-Learn ColumnTransformer Pipeline
  maxPoints: 30
- criteria: Cross-Validated Ridge & ElasticNet Hyperparameter Search
  maxPoints: 30
- criteria: Model Serialization (Joblib) & FastAPI Prediction Endpoint
  maxPoints: 20
resources:
- title: California Housing Dataset
  url: https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset
- title: Starter FastAPI Server Template
  url: https://fastapi.tiangolo.com/
---
### Capstone Objective
Deliver a production-ready machine learning regression microservice.

#### Project Milestones:
1. Clean raw housing data, impute missing values, and engineer interaction features.
2. Build an encapsulated `sklearn.pipeline.Pipeline` with scaling and regularized estimators.
3. Report final RMSE, MAE, and $R^2$ scores on an untouched test partition.
4. Wrap the serialized model inside a FastAPI endpoint validating incoming JSON payloads with Pydantic.
