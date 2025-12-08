---
title: 'Python : Variables and Memory references'
description: The blog post introduces variables in Python and memory references
pubDate: 2025-12-08
updatedDate: 2025-12-08
readTime: 18
featured: true
tags:
  - Python
  - Variables
  - Memory References
  - Foundation
topics:
  - python
image: /assets/python-variables-and-memory-references/image.png
authorImage: /assets/python-variables-and-memory-references/authorImage.png
authorName: Atul Jha
---
# Variables and Memory references in Python

## Variables

In this section we are going to learn about variables and memory references in Python

Data is stored in memory, and we can think of memory as a stack of boxes where we can store and retrieve data from. The address to the slot needs to be unique for easy data retrieval and these are called memory addresses.

In python variables are reference to the memory address, generally we think of variable as equal to the value it is storing, in normal scenario this definition works but actually these are the reference to the memory address. In Python the id() function is used to find the memory address that a variable *references*. It returns the memory address as a base-10 integer.

```python
variable_1 = 120
print('variable_1 = {0}'.format(variable_1))
print('memory address of variable_1 (decimal): {0}'.format(id(variable_1)))
print('memory address of variable_1 (hex): {0}'.format(hex(id(variable_1))))
```

```
variable_1 = 120
memory address of variable_1 (decimal): 4311242832
memory address of variable_1 (hex): 0x100f85850
```

We can convert and display the memory address in base-16 using the function *hex()*.

```python
welcome_msg = 'Hello welcome to python learning!'
print('welcome_msg = {0}'.format(welcome_msg))
print('memory address of welcome_msg (decimal): {0}'.format(id(welcome_msg)))
print('memory address of welcome_msg (hex): {0}'.format(hex(id(welcome_msg))))
```

```
welcome_msg = Hello welcome to python learning!
memory address of welcome_msg (decimal): 4356983760
memory address of welcome_msg (hex): 0x103b24bd0

```

Each variables we declare and assign a value gets a unique memory reference, there are caveats which we will discuss further in the section.

Notice that the **memory address** of *variable\_1* is different from that of *welcome\_msg*.

It's more accurate to say that *variable\_1* is **not** the integer value 120. Instead, *variable\_1* **is a reference pointing to an integer object** that holds the value 120. This integer object is located at the memory address given by *id(my\_var)*. The same concept applies to the variable *welcome\_msg,* it is a reference to a separate string object.

## Reference Counting

There are function in python that can help us to check our understanding checking the reference count of the variable. We can use *sys.getrefcount()* which keeps track of how many variables are pointing to memory address. There is another function from ctypes library i.e *c\_long.from\_address()* .

```python
import ctypes

var_1 = (1, 7)
ctypes.c_long.from_address(id(var_1)).value
```

```
1
```

```python
import sys
sys.getrefcount(var_1)
```

```
2
```

**Note :** The *sys.getrefcount()* function returns 2 instead of the expected 1 because the function itself temporarily creates and holds an **additional reference** to the object we pass as an argument (*var\_1*). This means the reference count is always inflated by 1.

```python
var_2 = var_1
print(hex(id(var_1)), hex(id(var_2)))
print(ref_count(id(var_1)))
```

```
0x1083f7100 0x1083f7100
2
```

Now if we assign var\_2 to None, the reference count now goes back to 1.

```python
var_2 = None
print(ref_count(id(var_1)))
```

```
1
```
