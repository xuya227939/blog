---
title: JS 实现出入栈操作
pubDate: 2018-07-18 09:22:58
categories: ["JS"]
description: ""
---

## 栈

栈是一种特殊的列表，栈内的元素只能通过列表的一端访问，这一端称之为栈顶。栈被称为一种后入先出(LIFO，last-in-first-out)的数据结构。盘子就是最好的例子，最后叠入的盘子，总是最先出去。

## 实现

```
function stack() {
    this.dataStore = []; //初始化数组
    this.topa = 0; //栈位
    this.pop = pop; //出栈
    this.push = push; //入栈
    this.clear = clear; //清楚栈
    this.length = length; //返回栈的长度
}

function pop() {
    return this.dataStore[--this.topa];
}

function push(element) {
    return this.dataStore[this.topa++] = element;
}

function length() {
    return this.topa;
}

function clear() {
    this.topa = 0;
}
var s = new stack();
s.push(1);
s.topa;
```

## 利用栈的特点很容易实现回文

回文是指，正过来和反过来都是一样，比如`dad，racecar`，比如`dad`，在栈中就是
`[d] [a] [d]`
通过循环读取，判断与传入的字符串是否相等，即判断是否是回文。

```
function isPalindremo(word) {
    var s = new stack();
    for (var i = 0, len = word.length; i < len; i++) {
        s.push(word[i]);
    }
    var rword = '';
    while (s.length() > 0) {
        rword += s.pop();
    }
    if (rword === word) {
        return true;
    } else {
        return false;
    }
}
isPalindremo('dad');
```

## 判断括号是否匹配

```
function isBrackets(expresseion) {
    var s = new stack();
    var b = false;
    var c = false;
    for (var i = 0, len = expresseion.length; i < len; i++) {
        if (expresseion[i] == '(') {
            b = true;
        }
        if (expresseion[i] == ')') {
            c = true;
        }
        s.push(expresseion[i]);
    }
    if (!(b && c)) {
        s.push(')');
        return s.length();
    } else {
        return false;
    }
}
console.log(isBrackets('123 + (a+x+x5+a'));
```
