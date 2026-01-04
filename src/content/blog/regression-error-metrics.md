---
title: 'Regression : Error Metrics'
description: A close look at the error metrics for regression
pubDate: 2026-01-04
updatedDate: 2026-01-04
readTime: 38
featured: false
tags:
  - regression
  - Error-Metrics
topics:
  - machine-learning
  - deep-learning
image: /assets/regression-error-metrics/image.png
authorImage: /assets/regression-error-metrics/authorImage.png
authorName: Atul Jha
---
# Error Metrics for Regression

In simple linear regression, the goal is to find the best fitting line that predicts the dependent variable 'y' from the independent variable 'x'. To evaluate the performance of the regression model, we use error metrics to quantify how well the model's predictions match the actual data.

Understanding these metrics is crucial for accessing the quality of a regression model and making improvements.

1. **Mean Absolute Error (MAE)** : Average of absolute  difference between actual and predicted values

   $MAE = \frac\{1}\{N} \sum\_\{i=1}^\{N} \mid y\_i - \hat\{y\_i} \mid $
2. **Sum Squared Error (SSE)** :  Sum of the squared error between actual and the predicted values

   $SSE=  \sum\_\{i=1}^\{N}( y\_i - \hat\{y\_i})^2 $
3. **Mean Squared Error (MSE)** : &#x20;

   $MSE= \frac\{SSE}\{N} = \sum\_\{i=1}^\{N}( y\_i - \hat\{y\_i})^2 $
4. **Root Mean Squared Error (RMSE) :**&#x20;

   $RMSE = \sqrt\{MSE}$
5. **Mean Absolute Percentage Error (MAPE) :** Average of absolute percentage error between the actual and predicted values.

   $MAPE= \frac\{1}\{N} \sum\_\{i=1}^\{N} \mid \frac\{y\_i - \hat\{y\_i}}\{y\_i} \mid \times 100 $
6. **R-Squared (Coefficient of Determination)** : Measures the proportion of variance in the dependent variable y that is predictable from the independent variable x.

   $R^2 = 1 - \frac\{\overbrace\{\sum\_\{i=1}^\{N} (y\_i - \hat\{y\_i})^2}^\{\text\{Variance of y captured using x (Residual sum of squares)}}}\{\underbrace\{\sum\_\{i=1}^\{N} (y\_i - \bar\{y\_i})^2}\_\{\text\{Variance of y (Total sum of squares)}}}$&#x20;

Think of it like the denominator indicates the variance of the actual and the average y, whereas the numerator indicates the variance of y and the predicted $\hat y$. If a dumb model predicts the average value ($\bar y$) then the numerator and denominator is same and $R^2$ will be equal to 0 and if it predicts the correct value of each y, then numerator is 0 and $R^2$ will be 1 . Thus value of $R^2$ ranges between 0 and 1.

7. **Adjusted R-Square Error** : It adjusts the $R^2$ error based on number of predictors in the model (i.e it penalises based on the number of input features).

   $R\_\{adj}^2 = 1 - \frac\{SS\_\{residual}/(N-k-1)}\{SS\_\{total}/(N-1)}$

   where N : No of datapoints

   k : Number of predictors (for simple linear regression is 1)&#x20;

Let's look at some code on how to achieve this :&#x20;

```python
import numpy as np

# Define a function to calculate all metrics
def calculate_metrics(y_actual, y_pred, num_predictors):
    n = len(y_actual)
    
    # Mean of actual values
    y_mean = np.mean(y_actual)
    
    # Errors
    residuals = y_actual - y_pred
    
    # Metrics
    MAE = np.mean(np.abs(residuals))
    SSE = np.sum(residuals**2)
    MSE = np.mean(residuals**2)
    RMSE = np.sqrt(MSE)
    MAPE = np.mean(np.abs(residuals / y_actual)) * 100
    
    # R-squared
    SS_total = np.sum((y_actual - y_mean)**2)
    R_square = 1 - (SSE / SS_total)
    
    # Adjusted R-squared
    Adjusted_R_square = 1 - ((SSE / (n - num_predictors - 1)) / (SS_total / (n - 1)))
    
    # Print all metrics
    print(f"Mean Absolute Error (MAE): {MAE}")
    print(f"Sum of Squared Errors (SSE): {SSE}")
    print(f"Mean Squared Error (MSE): {MSE}")
    print(f"Root Mean Squared Error (RMSE): {RMSE}")
    print(f"Mean Absolute Percentage Error (MAPE): {MAPE}%")
    print(f"R-squared: {R_square}")
    print(f"Adjusted R-squared: {Adjusted_R_square}")

# Example usage:
y_actual = np.array([3, 4, 5, 6])
y_pred = np.array([2.5, 4.2, 4.8, 6.3])

# Assuming 1 predictor (simple linear regression)
num_predictors = 1

calculate_metrics(y_actual, y_pred, num_predictors)
```



```
Mean Absolute Error (MAE): 0.30000000000000004
Sum of Squared Errors (SSE): 0.4200000000000001
Mean Squared Error (MSE): 0.10500000000000002
Root Mean Squared Error (RMSE): 0.32403703492039304
Mean Absolute Percentage Error (MAPE): 7.666666666666668%
R-squared: 0.9159999999999999
Adjusted R-squared: 0.874
```
