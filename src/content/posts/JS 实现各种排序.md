---
title: JS 实现各种排序
pubDate: 2018-07-16 11:23:52
categories: ["JS"]
description: ""
---

## 冒泡排序

冒泡排序是一种把数字两两交换的排序，时间复杂度为 O(n2)。

```
function bubbleSort(array) {
    if (array.length < 1) {
        return;
    }
    var temp;
    var len = array.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            if (array[i] < array[j]) {
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
    return array;
}
console.log(bubbleSort([3, 8, 5, 2, 1, 4]));
```

## 快速排序

快速排序其实是二分排序和冒泡排序的变种，基本思想就是左边放最小数据，右边放最大数据，分别对左边和右边进行递归。然后再组成最小数据集。时间复杂度为 O(n2)

```
function quickSort(array) {
    if (array.length < 1) {
        return array;
    }
    var len = array.length;
    var ban = Math.floor(len / 2);
    var num = array[ban];
    var left = [],
        right = [],
        mid = [];
    for (var i = 0; i < len; i++) {
        if (array[i] < num) {
            left.push(array[i]);
        } else if (array[i] > num) {
            right.push(array[i]);
        } else {
            mid.push(array[i]);
        }
    }
    return [].concat(quickSort(left), mid, quickSort(right));
}
console.log(quickSort([3, 8, 5, 2, 1, 4]));
```
