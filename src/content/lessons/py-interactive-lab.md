---
title: "Interactive CPython Stack & Heap Memory Explorer"
description: "Hands-on virtual laboratory investigating PyObject references, refcounting, arena memory blocks, and generational garbage collection."
lessonType: "lab"
interactiveLab: "memory-explorer"
duration: 25
---

Welcome to the **CPython Memory Architecture Interactive Lab**.

High-performance AI pipelines in Python frequently suffer from silent memory bloat, unexpected object copies, and uncoordinated garbage collection pauses. In this hands-on laboratory, you will directly interact with CPython's memory structures.

### Lab Objectives
1. Trace pointer allocations and reference count increments (`ob_refcnt`) during variable binding.
2. Observe how container types (`list`, `dict`, `tuple`) create cyclic references that bypass immediate refcount deallocation.
3. Test the CPython generational garbage collector thresholds (Generations 0, 1, and 2).

### Interactive Memory Simulator
Use the visual memory explorer below to trigger pointer allocations, simulate variable scope exits, and inspect how Python reclaims heap memory in real-time.

```python
import sys
import gc

class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

# 1. Create a cyclic reference
a = Node("Head")
b = Node("Tail")
a.next = b
b.next = a  # Cycle created!

print(f"Node A refcount: {sys.getrefcount(a) - 1}")
print(f"Node B refcount: {sys.getrefcount(b) - 1}")

# 2. Break scope references
del a
del b

# At this point, the cycle is unreachable by user code but still in memory!
unreachable = gc.collect()
print(f"Unreachable circular objects reclaimed by GC: {unreachable}")
```

### Key Engineering Takeaways
- **Small Object Allocator (pymalloc):** CPython bypasses `malloc()` for allocations $\le 512$ bytes, reserving arenas (256 KB) subdivided into pools (4 KB) and blocks.
- **Weak References:** Use `import weakref` when building caches or graph neural network adjacency graphs to prevent cyclic reference memory leaks without requiring constant `gc.collect()` overhead.

