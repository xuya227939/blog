---
title: JS 数组扁平化之简单方法实现
pubDate: 2019-09-10 10:14:20
categories: ["JS"]
description: ""
---

## 什么是扁平化

一句话解释，数组扁平化是指将一个多维数组(含嵌套)变为一维数组

## 扁平化之 ES5

### toString

```
const arr = [1, 2, 3, [4, 5, [6, 7]]];

const flatten = arr.toString().split(',');

console.log(flatten);
```

优点：简单，方便，对原数据没有影响

缺点：最好数组元素全是数字或字符，不会跳过空位

### join

```
const arr = [1, 2, 3, [4, 5, [6, 7]]];

const flatten = arr.join(',').split(',');

console.log(flatten);
```

优点和缺点同 toString

## 扁平化之 ES6

### flat

```
const arr = [1, 2, 3, [4, 5, [6, 7]]];

const flatten = arr.flat(Infinity);

console.log(flatten);
```

优点：会跳过空位，返回新数组，不会修改原数组。

缺点：无

### 扩展运算符(...)

```
const arr = [1, 2, 3, [4, 5]];

console.log([].concat(...arr));
```

优点：简单，方便

缺点：只能扁平化一层

## 总结

推荐使用 `ES6` 的 `flat` 方法

## 博客

[欢迎关注我的博客](https://github.com/xuya227939/LiuJiang-Blog)
