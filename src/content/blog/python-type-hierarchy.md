---
title: 'Python : Type Hierarchy'
description: The fundamentals of Python programming for machine learning and AI.
pubDate: 2025-11-30
updatedDate: 2025-11-30
readTime: 50
featured: true
tags:
  - Python
  - Foundation
topics:
  - python
image: /assets/python-type-hierarchy/image.png
authorImage: /assets/python-type-hierarchy/authorImage.png
authorName: Atul Jha
---
The fundamentals of Python programming for machine learning and AI.

# Type Hierarchy

Type hierarchy defines what data types are supported by Python. Data types define the what type of data are supported. We will have a look at a subset of them which are most commonly used.

## Numbers

Numeric types are broadly divided into two main categories: **Integral** and **Non-Integral**.

#### Integral Numbers

These represent whole numbers.

* **Integers (int):** Standard whole numbers, like 1, 2, or 3.
* **Booleans (*bool*):** Represent *True* or *False*. Interestingly, in Python, booleans are actually a subclass of integers.

#### Non-Integral Numbers

These are used to represent numbers that are not integers, typically with a fractional component or special mathematical properties.

* **Floats (*float*):** The most common non-integral type, used for real numbers like $3.14$. They are usually implemented as C doubles in the underlying C language.
* **Complex (*complex*):** Numbers that have both a real and an imaginary part, such as $1 + 2j$.
* **Decimals (*Decimal*):** Provide greater **precision** and control over floating-point arithmetic compared to standard floats. This is crucial for financial calculations.
* **Fractions (*Fraction*):** Represent **rational numbers** as a fraction (numerator and denominator). They are essential when you need **exact arithmetic**, for instance, ensuring $\frac\{1}\{3} + \frac\{1}\{3} + \frac\{1}\{3}$ is precisely equal to 1, which standard floats cannot guarantee due to their finite precision.

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
