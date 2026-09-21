---
title: "Object Protocols, Operator Overloading & C3 Linearization"
description: "Implementing rich comparisons, dunder operators, custom hashability, and cooperative multiple inheritance with super()."
lessonType: "article"
videoUrl: ""
duration: 24
---
Python classes are dynamic dictionaries governed by the descriptor protocol and special method lookups.

### Method Resolution Order (MRO)
Python uses the C3 Linearization algorithm to calculate a deterministic method resolution sequence in complex multiple inheritance hierarchies.

```python
class Vector:
    __slots__ = ('x', 'y')  # Memory optimization without __dict__ overhead

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: 'Vector') -> 'Vector':
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2.0, 3.5)
v2 = Vector(1.0, 4.0)
print(v1 + v2) # Vector(3.0, 7.5)
```
