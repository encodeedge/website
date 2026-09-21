---
title: "CPython Memory Internals, Reference Counts & Garbage Collection"
description: "Understanding PyObject headers, arena allocators, cyclic reference detection, and weakref mechanics."
lessonType: "article"
videoUrl: ""
duration: 20
---
Every variable in Python is a pointer referencing an underlying `PyObject` allocated on the heap. In this lesson, we explore how CPython tracks reference counts and when the cyclic garbage collector triggers generation-based sweeps.

```python
import sys
import gc

a = [1, 2, 3]
print("Initial Refcount:", sys.getrefcount(a) - 1)  # getrefcount adds 1 temporary ref

b = a
print("After assignment:", sys.getrefcount(a) - 1)  # 2

del b
print("After del:", sys.getrefcount(a) - 1)         # 1
```

### Cyclic Garbage Collection
Reference counting cannot reclaim objects referencing each other in a closed loop. CPython's generational GC tracks container objects across three generations (Gen 0, 1, and 2), identifying unreachable reference islands.
