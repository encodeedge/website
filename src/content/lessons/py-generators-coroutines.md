---
title: "Iterators, Infinite Streams & Generator-Based Coroutines"
description: "Yield expressions, bidirectional pipeline communication with send(), memory-efficient data streaming."
lessonType: "video"
videoUrl: "https://www.youtube.com/embed/D1twn9kLmYg"
duration: 25
---
Generators suspend execution state on `yield`, allowing processing of multi-gigabyte datasets with near-zero memory consumption.

```python
from typing import Generator

def log_stream(filename: str) -> Generator[str, None, None]:
    with open(filename, "r") as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()

# Pipeline processing
def transform_pipeline(lines: Generator[str, None, None]):
    for line in lines:
        yield line.split(" - ")[-1]
```
