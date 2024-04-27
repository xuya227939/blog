---
title: JS 实现斐波那契数列
pubDate: 2018-07-16 11:05:07
categories: ["JS"]
description: ""
---

## 斐波那契数列

0,1,1,2,3,5,8 像这样的数列就是斐波那契数列，特点是第 n 项等于前两项的和。

## 递归实现

```
function fib(n) {
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}
console.log(fib(5));
```

## 迭代实现

```
function fib(n) {
    var a = 0,
        b = 1,
        total = 0;
    if (n < 2) {
        return n;
    }
    for (var i = 2; i <= n; i++) {
        total = a + b;
        a = b;
        b = total;
    }
    return total;
}
console.log(fib(5));
```

## 总结

斐波那契数列最好不要用递归去实现，因为它在重复计算，而迭代计算的效率则要高很多并且时间复杂度为 O(n)，不信？输入个 100 看看？所以，面试的时候用迭代去写会让面试官更称心如意。
