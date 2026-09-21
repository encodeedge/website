---
title: 'Python: Function Parameters and Arguments'
description: Master positional and keyword arguments, tuple and dictionary unpacking, keyword-only parameters, and the infamous mutable default argument trap in CPython.
pubDate: 2025-12-18
updatedDate: 2025-12-18
readTime: 16
featured: false
tags:
  - python
  - functions
  - parameters
  - unpacking
  - cpython
topics:
  - python
image: /assets/blog/python-function-parameters-and-arguments.svg
authorImage: /assets/python-variables-and-memory-references/authorImage.png
authorName: Atul Jha
faqs:
  - question: What is the difference between an argument and a parameter?
    answer: >-
      A parameter is the variable listed inside the parentheses in the function definition (the formal parameter). An argument is the actual value or object reference sent to the function when it is called.
    category: Python Internals
  - question: Why are mutable default arguments considered dangerous in Python?
    answer: >-
      Default parameter values are evaluated once when the function is defined (at compile/execution time), not each time the function is called. The default object is stored in the function's __defaults__ tuple. If modified, the mutation persists across all subsequent invocations.
    category: Python Internals
  - question: What do * and / mean in a Python function signature?
    answer: >-
      A slash (/) indicates that all parameters before it are positional-only. An asterisk (*) indicates that all parameters after it must be passed as keyword-only arguments.
    category: Syntax
references:
  - title: Python 3 Masterclass Series (Part 1 - Functional Programming)
    url: https://github.com/fbaptiste/python-deepdive
    description: Fred Baptiste's in-depth lecture series on Python language internals.
    type: course
  - title: Python Documentation - Defining Functions
    url: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
    description: Official Python tutorial covering positional and keyword argument specifications.
    type: docs
---

Functions are foundational to Python programming, but the mechanics of how Python handles parameters and binds incoming arguments involve subtle CPython internals that trip up even experienced engineers.

In this comprehensive article, based on Fred Baptiste's *Python Series* series, we examine argument unpacking, positional-only and keyword-only constraints, and the internal representation of default parameter values in memory.

---

## 1. Parameters vs. Arguments

Before diving into syntax, let us establish strict terminology:

- **Parameters (Formal Parameters)**: The identifiers declared in the function definition signature.
- **Arguments (Actual Arguments)**: The values or object references passed into the function when invoked.

```python
def calculate_tax(subtotal, tax_rate=0.08):  # subtotal, tax_rate are PARAMETERS
    return subtotal * (1 + tax_rate)

total = calculate_tax(100.0, 0.05)            # 100.0, 0.05 are ARGUMENTS
```

In Python, arguments are always passed by **object reference** (often referred to as *call-by-sharing* or *call-by-assignment*). The parameter name inside the function's local scope becomes an additional pointer to the exact same object in the heap.

---

## 2. Positional and Keyword Arguments

When calling a function, arguments can be passed in two ways:

1. **Positional Arguments**: Mapped to parameters strictly by their ordinal position from left to right.
2. **Keyword (Named) Arguments**: Explicitly specified using `parameter_name=value`.

```python
def compute_volume(length, width, height):
    return length * width * height

# Positional
v1 = compute_volume(10, 5, 2)

# Keyword
v2 = compute_volume(height=2, length=10, width=5)

# Mixed: Positional arguments MUST precede keyword arguments
v3 = compute_volume(10, height=2, width=5)
```

If a positional argument appears after a keyword argument, Python raises a `SyntaxError`:

```python
# SyntaxError: positional argument follows keyword argument
compute_volume(length=10, 5, 2)
```

---

## 3. Unpacking Arguments with `*` and `**`

Python provides powerful operators for packing and unpacking iterable and mapping structures into function arguments.

### The `*` Iterable Unpacking Operator

The `*` operator unrolls any iterable (tuple, list, string, set, generator) into distinct positional arguments:

```python
dimensions = [12, 6, 4]
volume = compute_volume(*dimensions)  # Equivalent to compute_volume(12, 6, 4)
print(f"Volume: {volume}")
```

Inside a function definition, `*args` collects an arbitrary number of excess positional arguments into an immutable **tuple**:

```python
def compute_mean(*args):
    print("args type:", type(args), "value:", args)
    if not args:
        return 0.0
    return sum(args) / len(args)

print(compute_mean(10, 20, 30, 40))
# args type: <class 'tuple'> value: (10, 20, 30, 40)
# 25.0
```

### The `**` Dictionary Unpacking Operator

The `**` operator unrolls a dictionary into keyword arguments where keys must be strings matching parameter names:

```python
config = {"width": 8, "height": 3, "length": 15}
volume = compute_volume(**config)
print(f"Config Volume: {volume}")
```

Inside a function definition, `**kwargs` collects any unmatched keyword arguments into a standard **dictionary**:

```python
def configure_engine(name, **kwargs):
    print(f"Engine: {name}")
    for key, val in kwargs.items():
        print(f"  {key} -> {val}")

configure_engine("V8-Biturbo", displacement=4.0, cylinders=8, boost_psi=18.5)
```

---

## 4. Keyword-Only and Positional-Only Parameters

Modern Python allows developers to strictly enforce how arguments must be supplied.

### Keyword-Only Arguments (The Bare `*`)

Any parameter declared after an asterisk (`*` or `*args`) **cannot** be passed positionally—it must be provided as a keyword argument:

```python
def query_database(query, *, timeout=30, retry=True):
    print(f"Executing: {query} (timeout={timeout}, retry={retry})")

# Valid:
query_database("SELECT * FROM users", timeout=10, retry=False)

# TypeError: query_database() takes 1 positional argument but 3 were given
query_database("SELECT * FROM users", 10, False)
```

Using a bare `*` is an industry best practice for boolean flags or configuration options, making calls self-documenting.

### Positional-Only Arguments (The Bare `/`)

Introduced in Python 3.8 (PEP 570), parameters defined before a forward slash (`/`) **must** be passed positionally:

```python
def format_currency(amount, currency="USD", /, *, precision=2):
    return f"{amount:.{precision}f} {currency}"

# Valid:
print(format_currency(1250.5, "EUR", precision=2))

# TypeError: format_currency() got some positional-only arguments passed as keyword arguments: 'amount'
format_currency(amount=1250.5, currency="EUR")
```

---

## 5. The Infamous Mutable Default Parameter Trap

One of the most notorious gotchas in Python is assigning a mutable object (like a list or dictionary) as a default parameter value.

### The Pitfall in Action

```python
def append_log(message, log_entries=[]):
    log_entries.append(message)
    return log_entries

print(append_log("Server started"))
# ['Server started']

print(append_log("Database connected"))
# ['Server started', 'Database connected']  <-- UNEXPECTED ACCUMULATION!
```

Instead of a fresh empty list on every call, subsequent invocations mutate and share the exact same list!

### Why Does This Happen? CPython Internals

In Python, `def` is an **executable statement**. When the Python compiler executes the `def` statement, it creates a `function` object in memory.

Default parameter values are evaluated **once**, at the exact moment the function is defined—not when the function is called!

Python attaches these default values directly to the function object in the `__defaults__` tuple:

```python
def append_log(message, log_entries=[]):
    log_entries.append(message)
    return log_entries

# Inspect the function object's internal defaults
print("Memory address of default list:", hex(id(append_log.__defaults__[0])))

append_log("Entry 1")
print("After call 1:", append_log.__defaults__)

append_log("Entry 2")
print("After call 2:", append_log.__defaults__)
```

Output:
```text
Memory address of default list: 0x104b2a880
After call 1: (['Entry 1'],)
After call 2: (['Entry 1', 'Entry 2'],)
```

The identifier `log_entries` points directly to the memory address stored in `append_log.__defaults__[0]`. Because lists are mutable, calling `.append()` alters the shared object directly.

### The Idiomatic Solution: Sentinel Value `None`

The universal Python pattern is to use `None` as the default value sentinel:

```python
def append_log(message, log_entries=None):
    if log_entries is None:
        log_entries = []  # A brand-new list allocated on each invocation
    log_entries.append(message)
    return log_entries
```

Now, every time `append_log` executes without passing an explicit list, a brand-new list object is instantiated on the heap.

---

## 6. Function Parameter Introspection

Python functions store their parameter signatures in internal attributes:

- `func.__name__`: The function name.
- `func.__code__`: The compiled code object (`co_argcount`, `co_varnames`, `co_flags`).
- `func.__defaults__`: Tuple of default values for positional/keyword parameters.
- `func.__kwdefaults__`: Dictionary of default values for keyword-only parameters.

We can inspect the complete signature programmatically with the `inspect` module:

```python
import inspect

def process_pipeline(input_path, output_path, *, mode="fast", max_retries=3):
    pass

sig = inspect.signature(process_pipeline)
for param_name, param in sig.parameters.items():
    print(f"Parameter: {param_name:12} Kind: {param.kind.description:20} Default: {param.default}")
```

Output:
```text
Parameter: input_path   Kind: positional or keyword Default: <class 'inspect._empty'>
Parameter: output_path  Kind: positional or keyword Default: <class 'inspect._empty'>
Parameter: mode         Kind: keyword-only         Default: fast
Parameter: max_retries  Kind: keyword-only         Default: 3
```

---

## Key Takeaways

1. **Pass-by-assignment**: Python passes pointers to objects on the heap. Rebinding a parameter name locally does not alter the caller's reference; mutating an in-place mutable object does.
2. **Unpacking**: `*` unrolls iterables into positional arguments; `**` unrolls dictionaries into keyword arguments.
3. **Keyword-Only Guard**: Place `*` before configuration flags to prevent errors caused by ambiguous positional arguments.
4. **Default Evaluation Timing**: Default arguments are bound once at function definition time in `__defaults__`. Always use `None` for mutable defaults.

