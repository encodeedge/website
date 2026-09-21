---
title: 'Python: Dictionaries, Sets and Hashmaps'
description: Explore CPython hash table internals, compact dictionary architecture, hash randomization, collision resolution, and specialized mapping types.
pubDate: 2025-12-29
updatedDate: 2025-12-29
readTime: 22
featured: false
tags:
  - python
  - dictionaries
  - sets
  - hashmaps
  - data-structures
  - cpython-internals
topics:
  - python
image: /assets/blog/python-dictionaries-sets-and-hashmaps.svg
authorImage: /assets/python-variables-and-memory-references/authorImage.png
authorName: Atul Jha
faqs:
  - question: Why are Python dictionaries insertion-ordered since Python 3.6?
    answer: >-
      Python 3.6 introduced Raymond Hettinger's compact dictionary architecture. Instead of a sparse hash table array holding sparse entries directly, CPython stores entries densely in an array in the exact order they are inserted, while a separate compact byte array of indices maps hash buckets to positions in that dense array. This preserved insertion order as an organic side effect while slashing RAM usage by 20-25%.
  - question: What is the contract between __hash__ and __eq__ in Python?
    answer: >-
      If two objects compare equal according to __eq__ (a == b is True), their hash values MUST be equal (hash(a) == hash(b)). The inverse is not required: two distinct objects can produce the same hash (a hash collision). If a custom class overrides __eq__ without defining __hash__, Python automatically sets __hash__ = None, rendering instances unhashable.
  - question: How does CPython resolve hash collisions?
    answer: >-
      CPython uses open addressing with a pseudo-random perturbation sequence: j = ((5 * j) + 1 + perturb) & mask, where perturb is shifted right by 5 bits on every probe. This non-linear recurrence prevents clustering and ensures all buckets in the table can eventually be inspected.
references:
  - title: Python 3 Masterclass Series (Part 3 - Hash Tables & Dictionaries)
    url: https://github.com/fbaptiste/python-deepdive
    description: Fred Baptiste's guide into hash functions, dictionary architecture, and set theory.
    type: course
  - title: Raymond Hettinger's Compact Dict Proposal
    url: https://mail.python.org/pipermail/python-dev/2012-December/123028.html
    description: Original Python-dev proposal explaining the split-table memory optimization.
    type: docs
---

The dictionary is Python's bedrock data structure. Global variables, module namespaces, class attributes, object instances (`__dict__`), and keyword arguments all operate on Python dictionaries.

Because dictionaries sit at the epicenter of the runtime, CPython's hash table implementation has been polished for over three decades into an engineering marvel of speed and memory compactness.

In this comprehensive article, based on Part 3 of Fred Baptiste's *Python Series*, we explore hashability contracts, delve into the CPython compact hash table architecture, trace collision resolution probing, and leverage specialized mapping collections.

---

## 1. Hashability and the Contract of `__hash__` & `__eq__`

For an object to serve as a key in a dictionary or an element in a set, it must be **hashable**:

```python
# The Hashability Rule
# If a == b, then hash(a) == hash(b) MUST hold true!
```

If an object's equality can change during its lifecycle, its hash value would change—meaning looking it up in the hash bucket where it was originally deposited would fail, causing phantom data loss!

```python
class MutablePoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return isinstance(other, MutablePoint) and self.x == other.x and self.y == other.y

# When you override __eq__, Python automatically marks __hash__ = None
p = MutablePoint(1, 2)
try:
    hash(p)
except TypeError as e:
    print("Hashability error:", e)
    # Output: unhashable type: 'MutablePoint'
```

### Implementing a Custom Hashable Class
To make custom instances hashable, freeze their identity or state and implement both `__hash__` and `__eq__`:

```python
class FrozenPoint:
    def __init__(self, x: int, y: int):
        self._x = x
        self._y = y

    @property
    def x(self): return self._x
    
    @property
    def y(self): return self._y

    def __eq__(self, other):
        if not isinstance(other, FrozenPoint):
            return False
        return self._x == other._x and self._y == other._y

    def __hash__(self):
        # Combine hashes of immutable attributes
        return hash((self._x, self._y))

pt1 = FrozenPoint(10, 20)
pt2 = FrozenPoint(10, 20)

lookup = {pt1: "Found Target!"}
print(lookup[pt2])  # "Found Target!" (pt1 == pt2 and hash(pt1) == hash(pt2))
```

### Hash Randomization (SipHash)
To prevent Algorithmic Complexity Attacks (HashDoS), Python randomizes string and byte hashing on every interpreter launch using a secret 128-bit salt key. Running `hash("test")` across two independent Python processes yields different integers.

---

## 2. The Evolution of CPython Dict: Compact Hash Tables

Prior to Python 3.6, dictionaries used a **sparse table** design. An 8-bucket dictionary was represented as an array of 8 full entry slots:

```text
Legacy Sparse Table (Heavy RAM overhead):
[
  [hash, key, val], # Slot 0
  None,             # Slot 1 (wasted 24 bytes)
  [hash, key, val], # Slot 2
  None,             # Slot 3 (wasted 24 bytes)
  None,             # Slot 4 (wasted 24 bytes)
  [hash, key, val], # Slot 5
  None,             # Slot 6 (wasted 24 bytes)
  None              # Slot 7 (wasted 24 bytes)
]
```

### Raymond Hettinger's Compact Dict (Python 3.6+)
CPython separated the hash table into two distinct arrays:
1. `indices`: A compact array of small integers (bytes) indexed by hash bucket: `[-1, 0, -1, 1, -1, 2, -1, -1]`.
2. `entries`: A dense array holding entries in exact insertion order:
   - Index 0: `[hash_a, key_a, val_a]`
   - Index 1: `[hash_b, key_b, val_b]`
   - Index 2: `[hash_c, key_c, val_c]`

```text
Modern Compact Architecture:
Indices (Bytes):   [ 0,  -1,   1,  -1,  -1,   2,  -1,  -1 ]
                     |         |              |
Entries (Dense):     v         v              v
  0: ['hash1', 'user_id', 101]
  1: ['hash2', 'email', 'user@example.com']
  2: ['hash3', 'active', True]
```

This layout achieved two massive wins:
- **20% to 25% memory reduction** across all Python dictionaries.
- **Deterministic insertion ordering** became a natural byproduct of appending to `entries`.

---

## 3. Collision Resolution: Open Addressing and Perturbation

What happens when two different keys calculate the same bucket index (`hash(key) & mask`)?

CPython does not use separate chaining (linked lists). Instead, it uses **open addressing** with a pseudo-random probe algorithm:

```python
# CPython's exact probe recurrence relation:
# perturb >>= 5
# j = (5 * j + 1 + perturb) & mask
```

This probe sequence ensures:
1. Every slot in the table is visited before any slot is repeated.
2. The perturbation term incorporates the higher bits of the hash, scattering collisions across distant regions of the table and preventing linear clustering.

When a dictionary becomes $\frac{2}{3}$ full (load factor $\approx 0.66$), CPython resizes the table (doubling or quadrupling its capacity) to maintain $O(1)$ amortized lookup time.

---

## 4. Sets and Frozensets: Mathematical Set Algebra

A `set` in Python is essentially a dictionary where only keys exist and values are absent. Elements in a set must be hashable and unique.

```python
backend_devs = {"Alice", "Bob", "Charlie", "Diana"}
cloud_devs = {"Bob", "Diana", "Evan", "Frank"}

# Intersection: Engineers with both skill sets
print("Intersection (&):", backend_devs & cloud_devs)
# {'Bob', 'Diana'}

# Union: All engineers combined
print("Union (|):", backend_devs | cloud_devs)
# {'Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Frank'}

# Difference: Backend devs who don't do cloud
print("Difference (-):", backend_devs - cloud_devs)
# {'Alice', 'Charlie'}

# Symmetric Difference: Engineers in one group but not both
print("Symmetric Difference (^):", backend_devs ^ cloud_devs)
# {'Alice', 'Charlie', 'Evan', 'Frank'}
```

### `frozenset`: The Immutable Set
Because standard sets are mutable, they are unhashable and cannot be placed inside another set or used as dictionary keys. `frozenset` provides an immutable, hashable alternative:

```python
graph = {
    frozenset({"NYC", "BOS"}): 215,
    frozenset({"NYC", "DC"}): 225,
}

# Bidirectional edge lookup regardless of order!
print(graph[frozenset({"BOS", "NYC"})])  # 215
```

---

## 5. Dynamic Dictionary Views and Set-Like Operations

In Python 3, `dict.keys()`, `dict.values()`, and `dict.items()` return dynamic **view objects**:
- They reflect runtime dictionary mutations immediately without copying data.
- `dict.keys()` and `dict.items()` implement the **Set Protocol**!

```python
d1 = {"a": 1, "b": 2, "c": 3}
d2 = {"b": 20, "c": 3, "d": 4}

# Intersecting dictionary keys directly using set syntax:
common_keys = d1.keys() & d2.keys()
print("Common keys:", common_keys)  # {'b', 'c'}

# Find keys present in d1 but not in d2:
diff_keys = d1.keys() - d2.keys()
print("Keys only in d1:", diff_keys)  # {'a'}

# Find exact key-value pairs shared across both dicts:
common_pairs = d1.items() & d2.items()
print("Identical (k, v) pairs:", common_pairs)  # {('c', 3)}
```

---

## 6. Specialized Mappings in `collections`

The Python standard library provides specialized mapping variants for common architectural scenarios:

### 1. `collections.defaultdict`
Eliminates tedious existence checks before appending:
```python
from collections import defaultdict

grouped = defaultdict(list)
data = [("fruit", "apple"), ("veg", "carrot"), ("fruit", "banana")]

for category, item in data:
    grouped[category].append(item)

print(dict(grouped))  # {'fruit': ['apple', 'banana'], 'veg': ['carrot']}
```

### 2. `collections.Counter`
High-performance multiset for tallying frequencies:
```python
from collections import Counter

words = "apple orange banana apple pear apple orange".split()
counts = Counter(words)

print("Most common 2:", counts.most_common(2))
# [('apple', 3), ('orange', 2)]
```

### 3. `collections.ChainMap`
Logically combines multiple dictionaries into a single view without copying memory. Searches dictionaries sequentially in order:
```python
from collections import ChainMap

defaults = {"theme": "light", "language": "en", "debug": False}
user_settings = {"theme": "dark"}
cli_args = {"debug": True}

# CLI args override user settings, which override defaults
config = ChainMap(cli_args, user_settings, defaults)

print(config["theme"])     # "dark" (from user_settings)
print(config["debug"])     # True (from cli_args)
print(config["language"])  # "en" (from defaults)
```

---

## 7. Modern Dictionary Merging (PEP 584)

Python 3.9 introduced the union operators `|` and `|=` for dictionaries:

```python
base_config = {"host": "localhost", "port": 5432, "ssl": False}
override_config = {"port": 5433, "ssl": True, "pool_size": 10}

# Clean non-mutating union
merged = base_config | override_config
print("Merged:", merged)
# {'host': 'localhost', 'port': 5433, 'ssl': True, 'pool_size': 10}

# In-place update operator
base_config |= {"timeout": 30}
```

### Summary of Lookup Complexity
| Operation | Average Case | Worst Case (Pathological Collisions) |
| :--- | :--- | :--- |
| `dict[key]` (Lookup) | $O(1)$ | $O(N)$ |
| `dict[key] = val` (Insert) | $O(1)$ | $O(N)$ (during dynamic resizing) |
| `del dict[key]` (Delete) | $O(1)$ | $O(N)$ |
| `key in set` (Membership) | $O(1)$ | $O(N)$ |

Python's internal engineering ensures worst-case degradation almost never happens in practice, keeping dictionaries fast, reliable, and lightweight.

