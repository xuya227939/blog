---
title: JS 实现队列
pubDate: 2018-07-19 10:08:43
categories: ["JS"]
description: ""
---

## 队列

队列是一种列表，与栈相反，特点表现为先入先出(First-in-First-out，FIFO)结构。常见的例子就是银行排队，先到人的先办理业务。

## 实现

使用数组实现，js 中的数组相对于其他语言，有它自己的优势，比如 push()方法，向数组末尾追加元素并更新数组长度，shift()方法，取出数据第一项元素。所以，利用数组就很容易实现队列。

```
function queue() {
    this.dataStore = [];
    this.length = length;
    this.iqueue = iqueue;
    this.oqueue = oqueue;
    this.front = front;
    this.back = back;
    this.clear = clear;
}

function length() {
    return this.dataStore.length;
}

function iqueue(element) {
    return this.dataStore.push(element);
}

function oqueue() {
    return this.dataStore.shift();
}

function front() {
    return this.dataStore[0];
}

function back() {
    return this.dataStore[this.dataStore.length - 1];
}

function clear() {
    return this.dataStore = [];
}

var q = new queue();
console.log(q.iqueue(1));
console.log(q.length());
console.log(q.front());
console.log(q.oqueue());
console.log(q.length());
```

## 使用队列实现舞蹈员入场问题

```
function dancer(name, sex) {
    this.name = name;
    this.sex = sex;
}


function getDancer(males, females) {
    var datas = [{
            name: 'a',
            sex: 1
        },
        {
            name: 'b',
            sex: 0
        },
        {
            name: 'c',
            sex: 1
        },
        {
            name: 'd',
            sex: 0
        }
    ]
    for (var i = 0, len = datas.length; i < len; i++) {
        if (datas[i].sex === 0) {
            males.iqueue(new dancer(datas[i].name, datas[i].sex));
        } else {
            females.iqueue(new dancer(datas[i].name, datas[i].sex));
        }
    }
}

function dance(males, females) {
    var person;
    while (males.length() != 0 && females.length() != 0) {
        person = males.oqueue();
        console.log('Males dancer is:' + person.name);
        person = females.oqueue();
        console.log('Females dancer is:' + person.name);
    }
}
var males = new queue();
var females = new queue();
getDancer(males, females);
dance(males, females);
```
