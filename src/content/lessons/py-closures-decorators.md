---
title: "Closures, Decorator Factories & functools.wraps"
description: "Cell objects, free variables, creating parameterized decorators, and preserving function introspection metadata."
lessonType: "video"
videoUrl: "https://www.youtube.com/embed/r7Dtus7N4pI"
duration: 26
---
A closure is a function object that remembers values in enclosing lexical scopes even if they are no longer in memory.

```python
from functools import wraps
import time

def timing_decorator(threshold_ms: float = 100.0):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = fn(*args, **kwargs)
            elapsed = (time.perf_counter() - start) * 1000
            if elapsed > threshold_ms:
                print(f"[WARN] {fn.__name__} took {elapsed:.2f}ms (threshold: {threshold_ms}ms)")
            return result
        return wrapper
    return decorator

@timing_decorator(threshold_ms=50.0)
def compute_data():
    time.sleep(0.06)
    return "Complete"

compute_data()
```
