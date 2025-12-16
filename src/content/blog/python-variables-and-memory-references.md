---
title: 'Python : Variables and Memory references'
description: The blog post introduces variables in Python and memory references
pubDate: 2025-12-08
updatedDate: 2025-12-08
readTime: 18
featured: true
tags:
  - variables
  - memory-references
  - foundation
  - garbage-collector
topics:
  - python
image: /assets/python-variables-and-memory-references/image.jpg
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

The **Garbage Collector** (GC) is a standard Python module that addresses the limitation of reference counting by managing memory associated with circular references. By default, the GC is **turned on** and runs **periodically** on its own. We can control its behavior programmatically using the built-in ***gc*** **module**, allowing us to call it manually or perform custom cleanup tasks. Although possible to **turn the GC off** if we're certain our code avoids circular references, this is generally advised against due to the risk of memory leaks.

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

## Variable Re-assignment and Object Mutability

As we have discussed earlier, whenever we assign a value to a variable, such as *var\_1 = 10*0, an integer object is created at a specific memory address and var\_1 is a reference that points to the object. A common misconception arises when we reassign that variable, for example by writing *var\_2 = 120*. In this scenario, Python does not overwrite the value *100* at the original memory address. Instead, it instantiates a completely distinct integer object with the value *120* at a *new* memory address. The variable *var\_1* simply updates its reference to point to this new location.

```python
var_1 = 100
print("id of var_1 : ",hex(id(var_1)))

# Reassigning var_1 to another value
var_1 = 120
print("id of var_1 after reassignemnt: ",hex(id(var_1)))

var_2 = 120
var_3 = 120
print("id of var_2 : ", hex(id(var_2)))
print("id of var_3 : ", hex(id(var_3)))
```

```
id of var_1 :  0x100a1d5d0
id of var_1 after reassignemnt:  0x100a1d850
id of var_2 :  0x100a1d850
id of var_3 :  0x100a1d850
```

As we can see the memory address of ***var\_1*** is changed after reassignment, similarly if two different variables are assigned same value, the variables may point to same memory address as in case of ***var\_2***.

### Object Mutability

An object in Python can be thought of as having an internal state (data), and a specific memory address. "Modifying" an object specifically refers to altering its internal state without changing its location in memory.&#x20;

Let's take an example, if we have a ***my\_account*** variable pointing to a Bank Account object at a specific memory address with a balance of 150, updating that balance to 500 changes the data *inside* the object, but the variable still points to the exact same memory address.&#x20;

This differs from the example of  immutable types like integers which we saw in previous section, where assigning a new value (e.g., changing 10 to 15) forces the variable to point to a completely new object at a different address. This ability to change data in-place is called **mutation**, leading to the fundamental definition that objects whose state can be modified are **mutable**, while those that cannot be altered after creation are **immutable**.

Some of Python's built-in data types are **mutable**. That is, the internal contents (state) of the object can be modified without changing the memory address for example, list.

```python
# A new dummy_list is created
dummy_list = [3, 5, 3]
print(dummy_list)
print(hex(id(dummy_list)))

#Value 4 is appended to the existing list
dummy_list.append(4)
print(dummy_list)
print(hex(id(dummy_list)))
```

```
[3, 5, 3]
0x106d84100
[3, 5, 3, 4]
0x106d84100
```

In the above example, we can see we have declared a new variable dummy\_list = \[3, 5, 3]. After appending the the value 4 to the same list, the memory address of *dummy\_list* has **not** changed whereas, the **contents** has.

```python
dummy_list_2 = [14, 3, 1]
print(dummy_list_2)
print(hex(id(dummy_list_2)))

# Concatenating 4 to the list, this creates a new list at different memory location
dummy_list_2 = dummy_list_2 + [4]
print(dummy_list_2)
print(hex(id(dummy_list_2)))

# What about +=? This also does inplace
dummy_list_2 += [6]
print(dummy_list_2)
print(hex(id(dummy_list_2)))
```

```
[14, 3, 1]
0x10c215a40
[14, 3, 1, 4]
0x106cdbd00
[14, 3, 1, 4, 6]
0x106cdbd00
```

Now let's take **tuple** as an example, which is of immutable sequence type. As tuple type is of immutable nature, addition, updation removal, can't be done on tuples.&#x20;

```python
tup_1 = (1, 2, 3)
```

In the example above, the tuple tup\_1 will not change as long as the variable points to same reference.

```python
list_1 = [9, 10, 21]
list_2 = [1, 40]
tup_1 = (list_1, list_2)

print("list_1 : {0} has id : ".format(list_1), hex(id(list_1)))
print("list_2 : {0} has id : ".format(list_2), hex(id(list_2)))
print("tup_1 : {0} has id : ".format(tup_1), hex(id(tup_1)))
```

```
list_1 : [9, 10, 21] has id :  0x10c215440
list_1 : [1, 40] has id :  0x10c210f80
list_1 : ([9, 10, 21], [1, 40]) has id :  0x10c1fb6c0
```

Now, if we assign tup\_1 to a tuple of mutable type, things get interesting. Here, **tup\_1** is still immutable, i.e. It's reference to **list\_1** and **list\_2** will never change unless it is reassigned. However the object it points are themselves **mutable.**

```python
list_1.append(9)
list_2.append(7)

print("list_1 : {0} has id : ".format(list_1), hex(id(list_1)))
print("list_2 : {0} has id : ".format(list_2), hex(id(list_2)))
print("tup_1 : {0} has id : ".format(tup_1), hex(id(tup_1)))
```

```
list_1 : [9, 10, 21, 9] has id :  0x10c215440
list_2 : [1, 40, 7] has id :  0x10c210f80
tup_1 : ([9, 10, 21, 9], [1, 40, 7]) has id :  0x10c1fb6c0
```

Check that the contents of **list\_1** and **list\_2** changed. Thus immutability can't just be thought as object whose value doesn't change, it has it's own nuance. In the example, tuple **tup\_1** didn't change, but as the objects it reference **list\_1** and **list\_2** are themselves mutable, it appears though the tuple has changed.&#x20;

It is a subtle nuance, but one that is absolutely critical to understand.

#### Function Arguments

Now let's look at how variables will be impacted when we pass them as arguments to a function. Let's say we have a string var\_str = "EncodeEdge" and we pass it to a function and perform some concatenation, will it change the string value? and what happens when the argument passed is a mutable object.

When we pass a variable as argument to the function, it is passed by reference. As in the below code, when we pass

```python
def concat(str_input):
    print('str_input addr : {0}'.format(hex(id(str_input))))
    str_input = 'Welcome to ' + str_input
    print('Addr of str_input after concatenation :  {0}'.format(hex(id(str_input))))

str = 'EncodeEdge'
print('Addr of str = {0}'.format(hex(id(str))))

concat(str)

print('Addr of str after function call = {0}'.format(hex(id(str))))
```

```
Addr of str = 0x107098670
str_input addr : 0x107098670
Addr of str_input after concatenation :  0x1070eaad0
Addr of str after function call = 0x107098670
```

Let's see how this works with mutable objects:

```python
def change_list(item):
    print('Address of item array : {0}'.format(hex(id(item))))
    if len(item) > 1:
        item[1] = item[0] * 2
    item.append(15)
    print('Address of items array after change {0}'.format(hex(id(item))))

sample_list = [15, 4, 8]
print('Address of sample_list : {0}'.format(hex(id(sample_list))))
change_list(sample_list)

print(sample_list)
print('Address of sample_list {0}'.format(hex(id(sample_list))))
```

```
Address of sample_list : 0x1070d6480
Address of item array : 0x1070d6480
Address of items array after change 0x1070d6480
[15, 30, 8, 15]
Address of sample_list 0x1070d6480
```

As we can see, the memory address referenced by *sample\_list* is same throughout the execution and we are simply modifying the internal state of the item. Also remember the caveat with immutable objects containing mutable collections as we have discussed in the case of tuple above.

#### Shared references, Mutability and Variable equality

***Shared Reference*** is used to indicate, two variables referencing same object in memory (that is having the same memory address).

In some cases with immutable types, Python's memory manager reuses the memory references. This is safe, since for immutable types like numbers, string, the values will not change in-place.

```python
var_1 = 'EncodeEdge'
var_2 = var_1

print("Var_1 : {0}, has id : {1}".format(var_1, hex(id(var_1))))
print("Var_2 : {0}, has id : {1}".format(var_2, hex(id(var_2))))

# Now if we change var_2

var_2 = 'Welcome To ' + var_2
print("Values after var_2 is changed : ")
print("Var_1 : {0}, has id : {1}".format(var_1, hex(id(var_1))))
print("Var_2 : {0}, has id : {1}".format(var_2, hex(id(var_2))))
```

```
Var_1 : EncodeEdge, has id : 0x105b16f70
Var_2 : EncodeEdge, has id : 0x105b16f70
Values after var_2 is changed : 
Var_1 : EncodeEdge, has id : 0x105b16f70
Var_2 : Welcome To EncodeEdge, has id : 0x105b5d580
```

As in the example above, ***var\_1***, ***var\_2*** both references same memory address, when ***var\_2*** is changed, ***var\_2*** now points to a different memory address pointing to the new value.

Be careful in case of Mutable types, as if variables are referring same memory address, changing one will impact the other one.

```python
list_1 = [11, 2, 7]
list_2 = list_1

print("list_1 : {0}, has id : {1}".format(list_1, hex(id(list_1))))
print("list_2 : {0}, has id : {1}".format(list_2, hex(id(list_2))))

# Now if we change list_2

list_2.append(14)
print("Values after var_2 is changed : ")
print("list_1 : {0}, has id : {1}".format(list_1, hex(id(list_1))))
print("list_2 : {0}, has id : {1}".format(list_2, hex(id(list_2))))
```

```
list_1 : [11, 2, 7], has id : 0x105b3fb80
list_2 : [11, 2, 7], has id : 0x105b3fb80
Values after var_2 is changed : 
list_1 : [11, 2, 7, 14], has id : 0x105b3fb80
list_2 : [11, 2, 7, 14], has id : 0x105b3fb80
```

In case when both the mutable variables are assigned same value, will the share same reference?

```python

v1 = 10
v2 = 10

print("v1 : {0}, has id : {1}".format(v1, hex(id(v1))))
print("v2 : {0}, has id : {1}".format(v2, hex(id(v2))))

list_1 = [11, 2, 7]
list_2 = [11, 2, 7]

print("list_1 : {0}, has id : {1}".format(list_1, hex(id(list_1))))
print("list_2 : {0}, has id : {1}".format(list_2, hex(id(list_2))))

```

```
v1 : 10, has id : 0x1029d2a50
v2 : 10, has id : 0x1029d2a50
list_1 : [11, 2, 7], has id : 0x105b39480
list_2 : [11, 2, 7], has id : 0x105b3d080
```

As we can see above for ***immutable*** types like integer, Python memory manager has assigned same reference for both ***v1*** and ***v2***. Whereas for mutable type like list, Python memory manager will never do this.

#### Variable Equality

Comparing two variable can be though of in two different ways :&#x20;

1. Comparing the memory address
2. Comparing the data (internal state) of the variable

In python we can use the identity operator ("is") to compare the memory address and equality operator ("==") to compare the values.

```python
var_1 = 34
var_2 = 34

print("Memory address of var_1 : ",hex(id(var_1)))
print("Memory address of var_2 : ", hex(id(var_2)))

print("var_1 is var_2: ", var_1 is var_2)
print("var_1 == var_2:", var_1 == var_2)

list_1 = [1, 2, 3]
list_2 = [1, 2, 3]

print("Memory address of list_1 : ",hex(id(list_1)))
print("Memory address of list_2 : ",hex(id(list_2)))

print("list_1 is list_2: ", list_1 is list_2)
print("list_1 == list_2", list_1 == list_2)
```

```
Memory address of var_1 :  0x100586d50
Memory address of var_2 :  0x100586d50
var_1 is var_2:  True
var_1 == var_2: True
Memory address of list_1 :  0x1030248c0
Memory address of list_2 :  0x1030cfe40
list_1 is list_2:  False
list_1 == list_2 True
```

### Python Optimisation : Interning

As we saw earlier, for some values shared references are created automatically by Python.

```python
var_1 = 115
var_2 = 115
print("Id of var_1 : ",id(var_1))
print("Id of var_2 : ",id(var_2))

var_3 = 257
var_4 = 257
print("Id of var_3 : ",id(var_3))
print("Id of var_4 : ",id(var_4))
```

```
Id of var_1 :  4343191472
Id of var_2 :  4343191472
Id of var_3 :  4569186256
Id of var_4 :  4569185648
```

In the above example, for value of 115, both the variables share the same memory address. whereas when we see for value of 257, it is different.

This is because python pre caches, values between \[-5, 256]. This is called **interning**. Python pre caches or interns the mentioned values (these are singleton objects).

Similarly for strings, python interns certain strings like identifiers (variable, function, class name etc.)&#x20;

```python
str_1 = 'welcome_to_encodeedge'
str_2 = 'welcome_to_encodeedge'
print("Id of str_1 : ",id(str_1))
print("Id of str_2 : ",id(str_2))
```

```
Id of str_1 :  4382792960
Id of str_2 :  4382792960
```

The variables str\_1, str\_2 are also interned, this is because the values looks like an identifier.



```python
str_1 = 'welcome to encodeedge'
str_2 = 'welcome to encodeedge'
print("Id of str_1 : ",id(str_1))
print("Id of str_2 : ",id(str_2))
```

```
Id of str_1 :  4382738432
Id of str_2 :  4382740352
```



To force a string to be intern by sing the method ***intern()*** in ***sys*** module.



```python
import sys

str_1 = sys.intern('welcome to encodeedge')
str_2 = sys.intern('welcome to encodeedge')
str_3 = 'welcome to encodeedge'
print("ID of str_1 (this is manually interned): ",id(str_1))
print("ID of str_2 (this is manually interned) : ",id(str_2))
print("ID of str_3  : ",id(str_3))

print('str_1 is str_2 :', str_1 is str_2)
print('str_1 is str_3 :', str_1 is str_3)
```



```
ID of str_1 (this is manually interned):  4357757088
ID of str_2 (this is manually interned) :  4357757088
ID of str_3  :  4382826288
str_1 is str_2 : True
str_1 is str_3 : False
```

Notice here that str\_3 has a different memory address and is not interned by default neither manually.



