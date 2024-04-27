---
title: JS 实现 deepCopy
pubDate: 2019-03-12 10:18:02
categories: ["JS"]
description: ""
---

```
function getType(obj) {
    // 为啥不用typeof? typeof无法区分数组和对象
    if(Object.prototype.toString.call(obj) == '[object Object]') {
        return 'Object';
    }

    if(Object.prototype.toString.call(obj) == '[object Array]') {
        return 'Array';
    }
    return 'nomal';
};

function deepCopy(obj) {
    if (getType(obj) == 'nomal') {
        return obj;
    } else {
        var newObj = getType(obj) == 'Object' ? {} : [];
        for(var key in obj) {
            // 为啥要用hasOwnProperty？不需要从对象的原型链上进行复制
            if(obj.hasOwnProperty(key)) {
                newObj[key] = deepCopy(obj[key]);
            }
        }
    }
    return newObj;
}


var object = [
  {
    title: 'test',
    checked: false
  }
];

deepCopy(object);
```
