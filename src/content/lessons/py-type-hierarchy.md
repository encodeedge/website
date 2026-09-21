---
title: "Numeric Primitives, Precision Traps & Sequence Protocol"
description: "Arbitrary precision integers, IEEE-754 float rounding errors, Fraction, Decimal, and sequence dunders."
lessonType: "article"
videoUrl: ""
duration: 22
---
Python handles numbers with remarkable flexibility, but production machine learning pipelines require an exact understanding of memory sizing and precision limitations.

### Floats vs. Decimals
Standard Python floats are 64-bit binary approximations. For financial computations and hyperparameter limits, use `decimal.Decimal` with explicit rounding contexts.

```python
from decimal import Decimal, getcontext

getcontext().prec = 6
val = Decimal('1.1') + Decimal('2.2')
print("Exact decimal:", val) # 3.3
```
