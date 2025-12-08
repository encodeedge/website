---
title: 'Python : Variables and Memory references'
description: The blog post introduces variables in Python and memory references
pubDate: 2025-12-08
updatedDate: 2025-12-08
readTime: 18
featured: true
tags:
  - Variables
  - Memory References
  - Foundation
  - Garbage Collector
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

It's more accurate to say that *variable\_1* is **not** the integer value 120. Instead, *variable\_1* **is a reference pointing to an integer object** that holds the value 120. This integer object is located at the memory address given by *id(variable\_1)*. The same concept applies to the variable *welcome\_msg,* it is a reference to a separate string object.

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

var_id = id(var_1)
var_1 = None

print(ref_count(var_id))

```

```
1
0
```

## Circular Reference and Garbage Collection

Remember that **reference counting** is Python's core mechanism for memory management as objects are created. Python keeps track of the number of active **references** to every object in memory. This count can be one, two, or more. Critically, as soon as that reference count drops to **zero**, the Python memory manager immediately destroys the object and reclaims the memory. This system, however, fails to detect and clean up objects involved in **circular references**, where objects reference each other, preventing their count from reaching zero. This is where the garbage collector comes in.&#x20;

The **Garbage Collector** (GC) is a standard Python module that addresses the limitation of reference counting by managing memory associated with circular references. By default, the GC is **turned on** and runs **periodically** on its own. We can control its behavior programmatically using the built-in ***gc***\*\* module\*\*, allowing us to call it manually or perform custom cleanup tasks. Although possible to **turn the GC off** if we're certain our code avoids circular references, this is generally advised against due to the risk of memory leaks.

```python
import ctypes
import gc

#Returns the reference count of the variable
def reference_count(mem_addr):
    return ctypes.c_long.from_address(mem_addr).value

#Checks the GC if object found or not
def search_id_gc(obj_id):
    for item in gc.get_objects():
        if id(item) == obj_id:
            return "Object found"
    return "Not found"
```

We'll now define two classes, **Class A** and **Class B**, to establish **circular reference**. The setup involves the constructors of both classes referring to each other: **Class A's** constructor will reference instance of class B and store it in b and pass reference of class A to B's constructor.&#x20;

In Class B, the constructor assigns reference to Class A instance to variable a.

```python
class A:
    def __init__(self):
        self.b = B(self)
        print('A: self: {0}, b:{1}'.format(hex(id(self)), hex(id(self.b))))

class B:
    def __init__(self, a):
        self.a = a
        print('B: self: {0}, a: {1}'.format(hex(id(self)), hex(id(self.a))))
```

Let's disable Garbage Collector and see how the circular reference is impacted.

```python
gc.disable()
variable_1 = A()
```

```
B: self: 0x1fc1eae44e0, a: 0x1fc1eae4908
A: self: 0x1fc1eae4908, b:0x1fc1eae44e0
```

As we can see A and B's constructors ran, and we also see from the memory addresses that we have a circular reference.

In fact variable\_1 is also a reference to the same A instance:

```python
print('refcount(a) = {0}'.format(ref_count(a_id)))
print('refcount(b) = {0}'.format(ref_count(b_id)))
print('a: {0}'.format(object_by_id(a_id)))
print('b: {0}'.format(object_by_id(b_id)))
```

```
refcount(a) = 2
refcount(b) = 1
a: Object exists
b: Object exists
```

As we can see the A instance has two references (one from variable\_1, the other from the instance variable *b* in the B instance)

The B instance has one reference (from the A instance variable *a*)

Now, let's remove the reference to the A instance that is being held by variable\_1:

```python
variable_1 = None

print('refcount(a) = {0}'.format(ref_count(a_id)))
print('refcount(b) = {0}'.format(ref_count(b_id)))
print('a: {0}'.format(object_by_id(a_id)))
print('b: {0}'.format(object_by_id(b_id)))

```

```
refcount(a) = 1
refcount(b) = 1
a: Object exists
b: Object exists
```

As we can see, the reference counts are now both equal to 1 (a pure circular reference), and reference counting alone did not destroy the A and B instances - they're still around. If no garbage collection is performed this would result in a memory leak.

Let's run the GC manually and re-check whether the objects still exist:

```python
gc.collect()
print('refcount(a) = {0}'.format(ref_count(a_id)))
print('refcount(b) = {0}'.format(ref_count(b_id)))
print('a: {0}'.format(object_by_id(a_id)))
print('b: {0}'.format(object_by_id(b_id)))
```

```
refcount(a) = 0
refcount(b) = 0
a: Not found
b: Not found
```
