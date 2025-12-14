---
title: 'Python : Type Hierarchy'
description: The fundamentals of Python programming for machine learning and AI.
pubDate: 2025-11-30
updatedDate: 2025-11-30
readTime: 50
featured: true
tags:
  - foundation
topics:
  - python
image: /assets/python-type-hierarchy/image.png
authorImage: /assets/python-type-hierarchy/authorImage.png
authorName: Atul Jha
---
# Type Hierarchy

Type hierarchy defines what data types are supported by Python. Data types define the different type of data that can be created in Python.

Before that lets have a look at one of the most important concept, In this course we will see many data types like int, float, dictionary, None etc, many constructs like Operators ('+', '\*'), functions, Classes etc. But one thing is common, i.e they are all objects (instance of classes). That means they all have a memory address.

```python
def fun(a):
    return a*2

class b :
    abc = "xyz"

print("Type of function fun is : {0} and it's address is {1}".format(type(fun), id(fun)))
print("Type of class b is : {0} and it's address is {1}".format(type(b), id(b)))
print("Type of function fun is : {0} and it's address is {1}".format(type(type), id(type)))
```

```
Type of function fun is : <class 'function'> and it's address is 4357881712
Type of class b is : <class 'type'> and it's address is 5471267584
Type of function fun is : <class 'type'> and it's address is 4320241760
```

As we can see above each of these is an object of a certain class. In Python 3, every class implicitly inherits from ***object***. Whether it is a built-in type like ***int*** or ***str***, or a custom class we define ourself, if we trace the inheritance tree all the way to the root, we will find ***object***. The method \_\_mro\_\_ (method resolution order) can be used to trace the order.

```python

print("The full type lineage of int is ", int.__bases__)

print("The full type lineage of int is ", bool.__bases__)

# Let's define a CustomType:
class MyCustomType:
    pass

print(MyCustomType.__mro__)

x = 10
s = "Hello"
def my_func(): pass

print("{0} is an instance of {1} and it's full lineage is {2}".format(x, isinstance(x, object), type(x).__mro__))
print("{0} is an instance of {1} and it's full lineage is {2}".format(x, isinstance(s, object), type(s).__mro__))
print("{0} is an instance of {1} and it's full lineage is {2}".format(x, isinstance(my_func, object), type(my_func).__mro__))

```

```
The full type lineage of int is  (<class 'object'>,)
The full type lineage of int is  (<class 'int'>,)
(<class '__main__.MyCustomType'>, <class 'object'>)
10 is an instance of True and it's full lineage is (<class 'int'>, <class 'object'>)
10 is an instance of True and it's full lineage is (<class 'str'>, <class 'object'>)
10 is an instance of True and it's full lineage is (<class 'function'>, <class 'object'>)
```

Let's have a look at a subset of data type which are most commonly used.

## Numbers

Numeric types are broadly divided into two main categories: **Integral** and **Non-Integral**.

#### Integral Numbers

These represent integers, bool etc

* **Integers (int):** positive and negative numbers, like -3, -1, 1, 2, 3.
* **Booleans (*bool*):** Stores truthy and falsy value (True or False). Interestingly, in Python, booleans are actually a subclass of integers.

```python
flag = True
print("flag is of type : ",type(flag))
print("flag is an instance of : ",isinstance(flag, int))
```

```
flag is of type :  <class 'bool'>
flag is an instance of :  True
```

#### Non-Integral Numbers

Numbers which are not integer i.e have fraction component or like complex numbers.

* **Floats (*float*):** The most common non-integral type, used for real numbers like **3.14**. They are usually implemented as C doubles in the underlying C language.
* **Complex (*complex*):** Numbers that have both a real and an imaginary part, such as $1 + 2j$.
* **Decimals (*Decimal*):** Provide greater **precision** and control over floating-point arithmetic compared to standard floats.
* **Fractions (*Fraction*):** Represent **rational numbers** as a fraction (numerator and denominator). These are used when we need **exact arithmetic**, for instance, ensuring $\frac\{1}\{3} + \frac\{1}\{3} + \frac\{1}\{3}$ is precisely equal to 1, which standard floats cannot guarantee due to their finite precision.

![Python-Type-Hierarchy-Integrals](/assets/python-type-hierarchy/Python-Type-Hierarchy-Integrals.png)

Fig. 1 : Python Type Hierarchy for Integrals

## Collections

Collections are data structures that group multiple items together. They are broadly categorized into **Sequences**, **Sets**, and **Mappings**.

#### Sequences (Ordered)

Sequences store elements in a specific order, and they can be further divided into mutable and immutable types.

* **Mutable Sequences:**
  * **Lists (*list*):** The most flexible and common sequence type; they can be changed after creation.
* **Immutable Sequences:**
  * **Tuples (*tuple*):** The immutable variant of lists.
  * **Strings (*str*):** Also a sequence type, where each element is a character, and they are immutable.

#### Sets (Unique and Unordered)

Sets store unique elements and are primarily implemented as **hash maps**.

* **Mutable Sets (*set*):** Standard sets that allow elements to be added or removed.
* **Immutable Sets (*frozenset*):** The immutable equivalent of sets. Because they are immutable, they can be used as elements in other sets or as dictionary keys.

#### Mappings (Key-Value)

* **Dictionaries (*dict*):** These are also implemented similarly to sets—as **hash maps**—but they store data as key-value pairs instead of just keys.

![Python-Type-Hierarchy-Collections](/assets/python-type-hierarchy/Python-Type-Hierarchy-Collections.png)

Fig. 2 : Python Type Hierarchy for Collections

## Callable

A callable is anything that can be **invoked** or **called** using the parentheses ***()***.

* **Functions:**
  * **User-Defined Functions**.
  * **Built-in Functions:** Such as *len()* or *open()*.
  * **Instance Methods:** Functions defined inside a class that are called on an instance of that class (e.g., *list.append()*).
* **Classes:** The classes themselves are callable, as calling them instantiates an object.
* **Class Instances:** An object created from a class can be made callable by defining the special *\_\_call\_\_* method.
* **Generators:** Used for iteration, yielding values one at a time.

## Singletons

These are unique objects that exist independently or serve special purposes:

* ***None*** : A singleton object representing the absence of a value. Any variable set to *None* always points back to the same memory address for the *None* object.
* ***NotImplemented*** :  A special value used, for example, when defining comparison methods (*\_\_lt\_\_*, *\_\_gt\_\_*) in classes to indicate that a comparison between two different types is not supported.
* **Ellipsis Operator (*...*) :** An operator (represented as *Ellipsis()* in memory) that can be used for things like slicing, especially in advanced sequence types or libraries like NumPy.

##### **NoneType**

It is a built-in variable of type "NoneType" and is a reference to an object instance of NoneType. Python's memory manager will use shared reference as NoneType objects are immutable.

While `None` is used to represent an "empty" value or missing data (similar to a null pointer), it remains a real object within Python's memory. Consequently, the memory manager handles every assignment to `None` by using a shared reference to the same object instance.

```python
print(None, "is of Type {0}, It's Hex is is : {1}".format(type(None), hex(id(None))))

var_1 = None
print("var_1 is of Type {0}, It's Hex is is : {1}".format(type(var_1), hex(id(var_1))))

var_2 = None
print("var_2 is of Type {0}, It's Hex is is : {1}".format(type(var_2), hex(id(var_2))))

print("var_1 == var_2 : ", var_1 == var_2)
print("var_1 is var_2 : ", var_1 is var_2)
```

```
None is of Type <class 'NoneType'>, It's Hex is is : 0x100f53a50
var_1 is of Type <class 'NoneType'>, It's Hex is is : 0x100f53a50
var_2 is of Type <class 'NoneType'>, It's Hex is is : 0x100f53a50
var_1 == var_2 :  True
var_1 is var_2 :  True
```

For collections, an empty one does have the same collection type, instead of None Type.

```python
str_1 = ""
list_1 = []
tup_1 = ()

print("str_1 is of Type {0}".format(type(str_1)))
print("list_1 is of Type {0}".format(type(list_1)))
print("tup_1 is of Type {0}".format(type(tup_1)))

```

```
str_1 is of Type <class 'str'>
list_1 is of Type <class 'list'>
tup_1 is of Type <class 'tuple'>
```

## Statically typed and Dynamically typed

Statically typed languages, such as **Java**, **C++**, and **Swift**, require a variable's data type to be explicitly declared at the time of creation, and this type cannot be changed later. For example, in a statically typed language, if a variable named `myVar` is declared as a `String` (e.g., `String myVar = "hello";`), it can only hold string values. Attempting to assign an integer value, like `myVar = 10;`, would result in a type error because the variable has been declared as a `String` and is incompatible with the integer type. However, assigning another string value, like `myVar = "abc";`, is acceptable.

In contrast, **Python** is a dynamically typed language. In Python, variables are simply **references** or pointers to objects in memory, and the variables themselves do not have a fixed, inherent type. For instance, when you write `my_var = 'hello'`, the variable `my_var` is just referencing a string object with the value `'hello'`. This flexibility allows the same variable to later reference an object of a completely different type without causing an error. For example, executing `my_var = 10` is perfectly valid; the variable `my_var` simply stops pointing to the string object and starts pointing to an integer object with the value `10`. To determine the type of the object a variable is currently referencing, Python provides the built-in `type()` function, which looks up the object at the memory location the variable is pointing to and returns that object's type.

```python
# Lets assign string to variable a and check its type
a = "hello"
print("Type of a is : ", type(a))

# Lets reassign variable a to a number and check its type
a = 10
print("Type of a is : ",type(a))

# Now lets assign a lambda function to variable a and check its type
a = lambda x: x**2
a(2)
print("Type of a is : ",type(a))
```

```
Type of a is :  <class 'str'>
Type of a is :  <class 'int'>
Type of a is :  <class 'function'>
```
