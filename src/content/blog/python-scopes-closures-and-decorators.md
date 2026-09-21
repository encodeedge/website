---
title: 'Python: Scopes, Closures and Decorators'
description: Demystify Python's LEGB scope resolution, free variable cell objects, closures, decorator factories, and metadata preservation with functools.wraps.
pubDate: 2025-12-25
updatedDate: 2025-12-25
readTime: 20
featured: false
tags:
  - python
  - decorators
  - closures
  - scopes
  - metaprogramming
topics:
  - python
image: /assets/blog/python-scopes-closures-and-decorators.svg
authorImage: /assets/python-variables-and-memory-references/authorImage.png
authorName: Atul Jha
faqs:
  - question: What is a closure in Python?
    answer: >-
      A closure is a function that retains access to variables in its enclosing lexical scope (called free variables) even after the outer function has finished execution and its local stack frame has been destroyed.
  - question: What are 'cell' objects in CPython?
    answer: >-
      When CPython detects that an inner function references an outer local variable, it allocates a special 'cell' object on the heap. Both the enclosing scope and the inner function hold references to this cell, allowing the variable to outlive the outer function's execution.
  - question: Why must we always use @functools.wraps on our decorator wrapper functions?
    answer: >-
      Without @functools.wraps, the decorated function loses its identity—its __name__, __doc__, and signature are replaced by the wrapper's metadata, breaking debugging tools, docstring generators, and introspection libraries.
references:
  - title: Python 3 Masterclass Series (Part 1 - Section 7)
    url: https://github.com/fbaptiste/python-deepdive
    description: Fred Baptiste's masterclass on Python closures, scopes, and decorator design.
    type: course
  - title: Python Decorator Library
    url: https://wiki.python.org/moin/PythonDecoratorLibrary
    description: Curated architectural recipes for production Python decorators.
    type: docs
---

Decorators are one of Python's most elegant features, enabling clean separation of concerns and metaprogramming. Yet beneath the `@decorator` syntax lies a sophisticated mechanism of lexical scopes and heap-allocated closure cells.

In this comprehensive article, following Part 1 Section 07 of Fred Baptiste's *Python Series*, we dissect Python's scope resolution rules, discover how closures retain memory, and build production-grade parameterized decorators.

---

## 1. Scope Resolution: The LEGB Rule

When Python encounters a variable name, it searches namespaces in a strict precedence order known as the **LEGB Rule**:

1. **L (Local)**: Identifiers defined within the current function execution frame.
2. **E (Enclosing)**: Identifiers in any enclosing function scopes (from innermost to outermost).
3. **G (Global)**: Identifiers defined at the module top-level or declared with `global`.
4. **B (Built-in)**: Pre-assigned built-in names (`len`, `range`, `ValueError`).

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print("Inner sees:", x)
    inner()
    print("Outer sees:", x)

outer()
print("Module sees:", x)
```

Output:
```text
Inner sees: local
Outer sees: enclosing
Module sees: global
```

### The `global` and `nonlocal` Keywords

In Python, assignment (`=`) always defaults to creating or modifying a variable in the **current local scope**. To rebind a variable in an outer namespace, you must explicitly declare it:

```python
def counter():
    count = 0
    def increment():
        nonlocal count  # Binds to count in the enclosing scope!
        count += 1
        return count
    return increment

inc = counter()
print(inc())  # 1
print(inc())  # 2
```

Without `nonlocal count`, Python would treat `count += 1` as `count = count + 1`, detect an assignment to a local variable `count` before initialization, and raise an `UnboundLocalError`.

---

## 2. Anatomy of a Closure: How Free Variables Survive

What happens when an outer function returns an inner function? Normally, when a function completes execution, its stack frame is discarded and its local variables are eligible for garbage collection.

Consider this:

```python
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

double = make_multiplier(2)
# make_multiplier has finished executing and exited!
print(double(10))  # 20
```

How does `double` still know that `factor` is `2`?

### The CPython Solution: Cell Objects

When the Python compiler parses `make_multiplier`, it notes that `factor` is referenced by the nested function `multiply`. Because `factor` is referenced from an enclosing scope without being defined locally, it is called a **free variable**.

Instead of storing `factor` on the transient call stack, CPython allocates a **`cell` object** on the heap:

```python
print("Closure attribute:", double.__closure__)
# Closure attribute: (<cell at 0x103a8a970: int object at 0x102cb4110>,)

# Inspect the value inside the cell
print("Cell contents:", double.__closure__[0].cell_contents)  # 2
```

Both `make_multiplier` and `multiply` hold a reference to this identical cell object. When `make_multiplier` returns, the cell remains alive in memory because `double.__closure__` holds an active reference count to it!

A **closure** is simply a function paired with an extended scope that holds references to free variable cells.

---

## 3. Decorators from First Principles

A decorator is simply a **callable that takes a function as an argument and returns a closure**:

```python
def my_decorator(fn):
    def wrapper(*args, **kwargs):
        print(f"--> Calling {fn.__name__}")
        result = fn(*args, **kwargs)
        print(f"<-- Finished {fn.__name__}")
        return result
    return wrapper

def greet(name):
    return f"Hello, {name}!"

# Manual decoration
decorated_greet = my_decorator(greet)
print(decorated_greet("Alice"))
```

The `@` symbol is syntactic sugar for this exact reassignment:

```python
@my_decorator
def greet(name):
    return f"Hello, {name}!"

# Exactly identical to: greet = my_decorator(greet)
```

---

## 4. The Critical Problem of Lost Metadata: `functools.wraps`

When a function is wrapped by a decorator, its identity is silently replaced by the inner wrapper function:

```python
@my_decorator
def calculate(a, b):
    """Perform mathematical calculation."""
    return a + b

print(calculate.__name__)  # 'wrapper'  <-- LOST ORIGINAL NAME!
print(calculate.__doc__)   # None       <-- LOST DOCSTRING!
```

This breaks IDE auto-completion, docstring documentation generators, and debugging stack traces.

### The Remedy: `@functools.wraps`

`functools.wraps` is a built-in decorator that copies `__name__`, `__doc__`, `__annotations__`, and `__module__` from the original function onto the wrapper:

```python
from functools import wraps

def my_decorator(fn):
    @wraps(fn)  # Preserves fn's identity!
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@my_decorator
def calculate(a, b):
    """Perform mathematical calculation."""
    return a + b

print(calculate.__name__)  # 'calculate'
print(calculate.__doc__)   # 'Perform mathematical calculation.'
```

---

## 5. Decorator Factories: Passing Arguments to Decorators

What if we want our decorator to accept configuration parameters, such as `@timed(num_reps=5)`?

A decorator only accepts one argument: the target function `fn`. To pass parameters to a decorator, we must build a **decorator factory**—a function that accepts configuration arguments and returns the actual decorator:

```python
import time
from functools import wraps

def timed(num_reps=1):
    """Decorator factory that benchmarks execution across N repetitions."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            total_time = 0.0
            last_result = None
            for _ in range(num_reps):
                start = time.perf_counter()
                last_result = fn(*args, **kwargs)
                total_time += time.perf_counter() - start
            avg_time = total_time / num_reps
            print(f"[{fn.__name__}] Avg time over {num_reps} reps: {avg_time:.6f}s")
            return last_result
        return wrapper
    return decorator

@timed(num_reps=3)
def compute_squares(n):
    return [i**2 for i in range(n)]

compute_squares(1_000_000)
```

Execution flow:
1. `timed(num_reps=3)` executes, returning `decorator`.
2. Python evaluates `@decorator`, calling `decorator(compute_squares)`.
3. `decorator` returns `wrapper`, binding `compute_squares = wrapper`.

---

## 6. Real-World Architectural Decorators

### 1. In-Memory Memoization (Caching)

Caching the results of expensive, deterministic function calls:

```python
from functools import wraps

def memoize(fn):
    cache = {}
    @wraps(fn)
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    wrapper.cache = cache  # Expose cache for inspection
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fib(35):", fibonacci(35))
print("Cache entries count:", len(fibonacci.cache))
```

*Note: For production code, always use the standard library's C-accelerated `functools.lru_cache(maxsize=128)`.*

### 2. Execution Retry Decorator with Exponential Backoff

```python
import time
import random
from functools import wraps

def retry(max_attempts=3, delay_sec=1.0, backoff=2.0):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            attempts = 0
            current_delay = delay_sec
            while attempts < max_attempts:
                try:
                    return fn(*args, **kwargs)
                except Exception as err:
                    attempts += 1
                    if attempts == max_attempts:
                        raise err
                    print(f"Error: {err}. Retrying in {current_delay:.2f}s...")
                    time.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator

@retry(max_attempts=3, delay_sec=0.1)
def unreliable_network_fetch():
    if random.random() < 0.7:
        raise ConnectionError("Network timeout")
    return "Data payload received"
```

---

## Key Takeaways

1. **LEGB Order**: Python resolves names strictly via Local -> Enclosing -> Global -> Built-in.
2. **Cell Objects**: Closures retain references to outer scope variables via persistent heap-allocated `cell` objects (`__closure__`).
3. **Decorator Definition**: A decorator wraps a callable in a closure to modify behavior non-invasively.
4. **Always Use `@wraps`**: Never write a decorator wrapper without `@functools.wraps(fn)` to preserve function identity.
5. **Factories for Configuration**: To pass arguments to a decorator (`@my_dec(arg=1)`), wrap it in a factory that returns the decorator.

