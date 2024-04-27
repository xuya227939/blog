---
title: JS 实现列表操作
pubDate: 2018-07-17 16:54:16
categories: ["JS"]
description: ""
---

## 列表

人们经常使用列表，比如待办事项列表、购物车等，如果数据不太多的话，列表就显得尤为有用。

## JS 实现

```
function list() {
    this.dataStore = []; //初始化数组
    this.clear = clear; //清除列表
    this.remove = remove; //移除列表中的元素
    this.find = find; //寻找列表中的元素
    this.length = length; //返回列表的长度
}

function find(element) {
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
        if (this.dataStore[i] === element) {
            return i;
        }
    }
    return -1;
}

function remove(element) {
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
        if (this.dataStore[i] === element) {
            this.dataStore.splice(i, 1);
        }
    }
    return this.dataStore;
}

function length() {
    return this.dataStore.length;
}

function clear() {
    this.dataStore = [];
}
```
