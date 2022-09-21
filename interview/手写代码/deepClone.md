## 考察知识点

-   基本实现

    递归能力

    循环引用

-   考虑问题的全面性
    理解 `weakmap` 的真正意义

    多种类型

-   考虑问题的严谨性
    创建各种引用类型的方法，`JS API` 的熟练程度

    准确的判断数据类型，对数据类型的理解程度

-   通用遍历
    写代码可以考虑性能优化

    了解集中遍历的效率

    代码抽象能力

-   拷贝函数
    箭头函数和普通函数的区别

    正则表达式熟练程度

## 核心问题

-   如何遍历对象的每一个字段；

    for in，while

-   如何解决引用问题；

    递归

-   如何判断对象还是数组

    Array.isArray || Object.prototype.toString.call 判断

-   如何解决循环引用个问题

    weakMap

## deepClone

```
var target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
target.target = target;

function getType(target) {
    return Object.prototype.toString.call(target);
}

function deepClone(target, map = new WeakMap()) {
    if(typeof target == 'object') {
        let cloneTarget = getType(target) == '[object Array]' ? [] : {};
        if (map.get(target)) {
            return target;
        }

        map.set(target, cloneTarget);

        if (getType(target) === '[object Map]') {
            target.forEach((value, key) => {
                cloneTarget.set(key, deepClone(value));
            });
            return cloneTarget;
        }

        for(const key in target) {
            cloneTarget[key] = deepClone(target[key], map);
        }
        return cloneTarget;
    }
    return target;
}


function iterationClone(target) {
    let cloneTarget = {};
    for(const key in target) {
        if(typeof target[key] == 'object') {
            cloneTarget[key] = target[key];
        } else {
            let test = target[key];
            cloneTarget[key] = test;
        }
    }

    return cloneTarget;
}
```

## full deepClone

```

// 判断引用类型
function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

// 获取类型
function getType(target) {
    return Object.prototype.toString.call(target);
}

// 获取可继续遍历类型
function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function clone(target, map = new WeakMap()) {

    // 防止循环引用
    if (map.get(target)) {
        return target;
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(clone(value));
        });
        return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, clone(value));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
}
```

## JSON.stringify 缺陷

无法处理循环引用，比如这段代码，objA 引用 objB，objB 引用 objA

JSON.stringify 报错

> VM915:9 Uncaught TypeError: Converting circular structure to JSON--> starting at object with constructor 'Object'| property 'child' -> object with constructor 'Object'--- property 'parent' closes the circle

```
var objA = {
  name: 'this is A'
}
var objB = {
  name: 'this is B'
}
objA.child = objB
objB.parent = objA
console.log(JSON.stringify(objA))
```
