---
title: 'Python: Serialization, JSON and Custom Encoders'
description: Master Python serialization with JSON, custom JSONEncoder subclasses, object_hook decoders, pickle security exploits, and high-performance Pydantic workflows.
pubDate: 2026-01-02
updatedDate: 2026-01-02
readTime: 20
featured: false
tags:
  - python
  - serialization
  - json
  - pickle
  - security
  - pydantic
topics:
  - python
image: /assets/blog/python-serialization-and-json.svg
authorImage: /assets/python-variables-and-memory-references/authorImage.png
authorName: Atul Jha
faqs:
  - question: Why is unpickling data from untrusted sources dangerous?
    answer: >-
      The pickle module executes arbitrary Python bytecode during deserialization via object reduction hooks like __reduce__(). An attacker can craft a malicious pickle payload that invokes os.system(), subprocess.run(), or eval() the moment pickle.loads() is called, achieving full remote code execution (RCE) on the server.
  - question: How do you serialize dates, Decimals, or custom classes with Python's json module?
    answer: >-
      By default, json.dumps() raises TypeError for non-standard types. You can solve this by either passing a custom function to the default parameter (e.g. json.dumps(data, default=my_serializer)) or by subclassing json.JSONEncoder, overriding its default(self, obj) method, and passing cls=MyEncoder to json.dumps().
  - question: What does the object_hook parameter do in json.loads()?
    answer: >-
      The object_hook parameter is a callable that gets invoked on the result of every JSON object decoded into a Python dictionary. It allows you to intercept raw dictionaries and convert specific keys (like ISO date strings) into rich Python objects (like datetime.datetime or custom dataclasses) automatically.
references:
  - title: Python 3 Masterclass Series (Part 3 - Section 9)
    url: https://github.com/fbaptiste/python-deepdive
    description: Fred Baptiste's guide into Python serialization protocols, JSON encoders, and custom decoders.
    type: course
  - title: Python Documentation - json Module
    url: https://docs.python.org/3/library/json.html
    description: Official CPython reference for JSON encoders, decoders, and formatting options.
    type: docs
---

In distributed architectures, microservices, and web APIs, data must constantly traverse process boundaries. **Serialization** is the process of translating live in-memory Python objects into a persistent storage format or byte stream; **deserialization** reconstructs that state on the receiving end.

While serialization appears straightforward on the surface, real-world Python engineering quickly runs into hurdles: converting complex types (dates, decimals, UUIDs), intercepting data structures with custom encoders/decoders, and avoiding catastrophic security vulnerabilities in legacy binary protocols like `pickle`.

In this comprehensive article, based on Part 3 Section 09 of Fred Baptiste's *Python Series*, we dissect Python serialization, audit `pickle` security vulnerabilities, construct custom `json.JSONEncoder` and `object_hook` decoders, and explore modern schema validation.

---

## 1. Serialization Fundamentals: The Standard Mappings

Python's built-in `json` module provides four primary functions:
- `json.dumps(obj)`: Serializes Python object `obj` to a JSON formatted `str`.
- `json.dump(obj, fp)`: Serializes Python object `obj` as a JSON formatted stream to file-like object `fp`.
- `json.loads(s)`: Deserializes JSON string `s` to a Python object.
- `json.load(fp)`: Deserializes JSON formatted file-like object `fp` to a Python object.

### The Standard Conversion Table
The JSON specification only supports a small subset of primitive types:

| Python Type | JSON Equivalent |
| :--- | :--- |
| `dict` | `object` (`{}`) |
| `list`, `tuple` | `array` (`[]`) |
| `str` | `string` (`""`) |
| `int`, `float` | `number` |
| `True` / `False` | `true` / `false` |
| `None` | `null` |

Notice what is missing: **`datetime`, `date`, `Decimal`, `UUID`, `set`, and custom class instances are NOT supported natively!**

```python
import json
from datetime import datetime
from decimal import Decimal

payload = {
    "account_id": 101,
    "balance": Decimal("1500.50"),
    "created_at": datetime.utcnow()
}

try:
    json.dumps(payload)
except TypeError as e:
    print("Serialization Error:", e)
    # Output: TypeError: Object of type Decimal is not JSON serializable
```

---

## 2. The Perils of `pickle`: Remote Code Execution (RCE)

Python's standard library includes the `pickle` module, which can serialize almost any Python object—including functions, classes, and lambdas—into an opaque byte stream.

However, **`pickle` is NOT secure against untrusted or unauthenticated data**.

### How an Attacker Exploits `pickle.loads()`
Python's unpickler uses the `__reduce__()` protocol to determine how to reconstruct an object. An attacker can construct a payload that tells Python to call `os.system` with a malicious shell command:

```python
import pickle
import os

class ExploitPayload:
    def __reduce__(self):
        # When unpickled, executes this arbitrary command!
        cmd = "echo 'CRITICAL: Arbitrary Code Executed via Pickle!' > /tmp/hacked.txt"
        return (os.system, (cmd,))

# Malicious payload packaged by attacker
malicious_bytes = pickle.dumps(ExploitPayload())

# Victim receives bytes from an untrusted network socket or cookie:
# The moment loads() is called, the shell command executes!
pickle.loads(malicious_bytes)
```

> [!CAUTION]
> **Never use `pickle` for public APIs, cookies, caching untrusted requests, or cross-service communication.** Reserve `pickle` strictly for short-lived internal IPC between trusted Python processes (such as `multiprocessing`).

---

## 3. Custom JSON Encoders

To serialize rich domain objects cleanly without crashing, we have two approaches:

### Approach A: The `default` Function
The `default` argument in `json.dumps()` specifies a fallback function invoked whenever Python encounters an object it cannot serialize:

```python
import json
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID

def custom_serializer(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)  # Or str(obj) to preserve exact precision
    if isinstance(obj, UUID):
        return str(obj)
    if isinstance(obj, set):
        return list(obj)
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

data = {
    "timestamp": datetime(2026, 1, 2, 12, 0, 0),
    "amount": Decimal("299.99"),
    "tags": {"python", "serialization"}
}

json_str = json.dumps(data, default=custom_serializer, indent=2)
print(json_str)
```

### Approach B: Subclassing `json.JSONEncoder`
For complex enterprise codebases, encapsulate your serialization rules in a custom class:

```python
class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return str(obj)
        if hasattr(obj, "__json__"):
            # Allow custom domain classes to define their own __json__ method!
            return obj.__json__()
        return super().default(obj)

class UserProfile:
    def __init__(self, user_id: int, username: str, joined: datetime):
        self.user_id = user_id
        self.username = username
        self.joined = joined

    def __json__(self):
        return {
            "id": self.user_id,
            "username": self.username,
            "joined_at": self.joined.isoformat()
        }

user = UserProfile(42, "alex", datetime(2025, 6, 15))
print(json.dumps(user, cls=EnhancedJSONEncoder, indent=2))
```

---

## 4. Custom JSON Decoders: `object_hook`

When reading JSON back into Python, strings are just strings. But what if you want ISO timestamp strings automatically parsed back into real Python `datetime` objects?

The `object_hook` parameter receives every decoded dictionary before it is returned:

```python
import json
from datetime import datetime

raw_json = '''
{
  "event_id": "EVT-9021",
  "created_at": "2026-01-02T14:30:00",
  "actor": "admin"
}
'''

def datetime_parser(dct: dict) -> dict:
    for key, value in dct.items():
        if isinstance(value, str):
            # Attempt to parse ISO dates
            try:
                dct[key] = datetime.fromisoformat(value)
            except (ValueError, TypeError):
                pass
    return dct

decoded = json.loads(raw_json, object_hook=datetime_parser)

print("Decoded type of created_at:", type(decoded["created_at"]))
# Output: <class 'datetime.datetime'>
print("Year:", decoded["created_at"].year)  # 2026
```

### Preserving Decimal Precision with `parse_float`
Standard JSON parses numbers with decimals into IEEE-754 binary floats (`float`), introducing precision errors in financial figures (`0.1 + 0.2 != 0.3`). You can force CPython to parse numbers directly into `Decimal`:

```python
from decimal import Decimal

financial_json = '{"price": 19.99, "tax": 1.60}'

# Decode floats directly into Decimal objects
parsed = json.loads(financial_json, parse_float=Decimal)

print(type(parsed["price"]))  # <class 'decimal.Decimal'>
print(parsed["price"] + parsed["tax"])  # Decimal('21.59') (Exact!)
```

---

## 5. Modern Declarative Serialization: Pydantic v2

In modern Python services (FastAPI, LangChain, modern data pipelines), manual encoder writing is largely superseded by **Pydantic**:

```python
from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

class OrderModel(BaseModel):
    order_id: UUID = Field(default_factory=uuid4)
    item_name: str
    amount: Decimal
    ordered_at: datetime = Field(default_factory=datetime.utcnow)

# Instant bidirectional validation & serialization
order = OrderModel(item_name="Mechanical Keyboard", amount=Decimal("149.50"))

# Fast C/Rust serialization to JSON string
json_output = order.model_dump_json(indent=2)
print("Pydantic JSON:\n", json_output)

# Deserialization with strict schema validation
restored_order = OrderModel.model_validate_json(json_output)
print("Restored order ID:", restored_order.order_id)
```

### Serialization Engine Benchmark Comparison
For ultra-high-throughput APIs parsing gigabytes of JSON per second:
- `json` (CPython Standard Library): Baseline speed
- `ujson` (UltraJSON): ~2x-3x faster
- `orjson` (Rust-accelerated): ~**10x to 15x faster** with native support for `dataclasses`, `numpy` arrays, and `datetime` objects.

