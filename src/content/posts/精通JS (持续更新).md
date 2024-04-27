---
title: 精通JS (持续更新)
pubDate: 2018-12-21 11:26:56
categories: ["JS"]
description: ""
---

## 作用域

作用域是一套规则，用于确定在何处以及如何查找变量(标识符)。如果查找的目的是对
变量进行赋值，那么就会使用 LHS 查询;如果目的是获取变量的值，就会使用 RHS 查询。
LHS 查询`var a = 2;`，简单理解就是赋值
RHS 查询`function foo(a) {};  foo(2); `，简单理解就是查询值

```
var a = 2;
function foo() {
   console.log(a);
}
```

全局作用域中创建了一个 a 变量。在 foo 函数中可以访问到这个变量 a。因为 console.log(a)在执行的时候，会在当前的作用域(foo)下进行查找，如果没有查找到该变量，会继续往上进行查找。直到没有找到为止。

```
function foo() {
   var a = 2;
}
console.log(a);
```

这时候输出 a，会提示 a is not defined，因为在当前作用域以及上一层作用域当中都没有 a 这个变量。

### 作用域嵌套

![image](https://user-images.githubusercontent.com/16217324/61353405-55d98d80-a8a2-11e9-9fb7-e7ff2ec7cdb9.png)

这样子就是作用域嵌套，函数 fn3 可以访问最外层的变量,a，b，c

## 强制转换和隐式转换

```
const b = '123';
Number(b);    // 123
const c = '123';
c * 1;  // 123
```

## == 与 ===

- == 允许强制转换条件下进行值比较。
  例如： [1,2,3] == '1,2,3' // true，或许你会好奇到底是 [1,2,3] == [1,2,3] or '1,2,3' == '1,2,3'，结果是 [1,2,3] == [1,2,3]。
- === 不允许强制转换类型进行比较值。
  例如：[1,2,3] === '1,2,3' // false
  参考[http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.1](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.1)

## undefined 出现的四种情况

- 变量声明未进行初始化
- 取对象某个值或数组中某个元素不存在时
- 函数没有返回值
- 引用没有提供实参值给形参

## JS 七种基本数据类型(以最新的 es6 为例)

- string
- number
- boolean
- null
- undefined
- object
- symbol

```
var    a;
typeof a;        //    'undefined'

a = 123;
typeof a;        //    'number'

a = '123';
typeof a;        //    'string'

a = {};
typeof a;        //    'object'

a = Symbol;
typeof a;        //    'symbol';

a = true;
typeof a;        //    'boolean';

a = null;
typeof a;        //    'object';
```

## 条件

```
if (a == 2) {
    // 做一些事情
} else if (a == 10) {
    // 做另一些事请
} else if (a == 42) {
    // 又是另外一些事情
} else {
    // 这里是备用方案
}
switch (a) {
    case 2:
        // 做一些事情
        break;
    case 10:
        // 做另一些事请
        break;
    case 42:
        // 又是另外一些事情
        break;
    default:
        // 这里是备用方案
}
// 如果条件超过2个以上， 改成使用switch， 语句结构更加清晰。
var a = 42;
var b = (a > 41) ? "hello" : "world";
if (a > 41) {
    b = "hello";
} else {
    b = "world";
}
```

## this

### this 指向

一句话理解，this 的指向是由所引用的对象来指定的(es5 中)

### 默认绑定

```
function foo() {
    console.log(this.a);
}

var a = 2;

foo();
```

### 隐含绑定

```
function foo() {
    console.log(this.a);
}

var obj2 = {
    a: 42,
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42
```

### 隐含丢失

```
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数引用！

var a = "oops, global"; // `a` 也是一个全局对象的属性

bar(); // "oops, global"
```

### 强制绑定

通过 call、apply、bind

## 事件

网景和微软曾经的战争还是比较火热的，当时，网景主张捕获方式，微软主张冒泡方式。后来 w3c 采用折中的方式，平息了战火，制定了统一的标准——先捕获再冒泡

### 事件流

![image](https://user-images.githubusercontent.com/16217324/50534108-be655500-0b72-11e9-831a-391288f1359f.png)
通常使用事件冒泡来进行事件处理，这样可以最大限度支持各大游览器

### 事件处理程序

```
var button = document.getElementById('button');
button.onClick = () => {
    console.log('我是DOM0级事件处理程序');
}
button.onClick = null;
button.addEventListener('click', () => {
    console.log('我是DOM2级事件处理程序');
}, false);
button.removeEventListener('click', handler, false)
```

### 事件委托

假设一间寝室，寝室长负责点外卖，那么委托的对象就是寝室长，寝室长拿到外卖之后，再分发到个人，这就是事件委托原理。
优点：性能提升

```
<li click=""></li>
<li click=""></li>
<li click></li>
<li click></li>
...
假设有1000个li标签，每个li标签都有onclick事件，内存开销大大增加。
<ul click>
   <li></li>
   <li></li>
   <li></li>
   <li></li>
...
```

通过事件委托的话，则只在 parentNode 上添加一个事件就可以完成所有的事。性能大大提高。

### 事件冒泡

就跟气泡一样，慢慢浮出水面。所以称之为冒泡事件 targetEvent -> ParentNode -> Body -> Html -> Document

### 事件监听

关于事件监听，W3C 规范中定义了 3 个事件阶段，依次是捕获阶段、目标阶段、冒泡阶段。
起初 Netscape 制定了 JavaScript 的一套事件驱动机制（即事件捕获）。随即 IE 也推出了自己的一套事件驱动机制（即事件冒泡）。最后 W3C 规范了两种事件机制，分为捕获阶段、目标阶段、冒泡阶段。IE8 以前 IE 一直坚持自己的事件机制（前端人员一直头痛的兼容性问题），IE9 以后 IE 也支持了 W3C 规范。
addEventListener 事件监听函数

## 对象

### 内建对象

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp
- Error

它们实际上仅仅是内建的函数。这些内建函数的每一个都可以被用作构造器（也就是一个可以通过 new 操作符调用的函数 —— 参照第二章），其结果是一个新 构建 的相应子类型的对象。例如

```
var a = "123";
typeof a; // "string"
a instanceof String; // false

var aa = new String("123");
typeof aa; // "object"
aa instanceof String; // true

// 考察 object 子类型
Object.prototype.toString.call(strObject);
```

面试的时候，可能会遇到面试官问你 var a = '123'与 new String 的区别
