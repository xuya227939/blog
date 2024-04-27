---
title: JS 语法规范
pubDate: 2019-07-23 10:59:08
categories: ["JS"]
description: ""
---

## 采用小写驼峰式命名

```
// good
studentInfo

// bad
studentinfo
STUDENTINFO
```

## 常量命名方式

```
// good
const COL_NUM = 10;

// bad
const col_num = 10;
```

## 使用字面量

```
// good
const obj = {
    name:'faker'
}

// bad
let obj = {};
obj.name = 'faker';
```

## 函数参数使用解构

```
// good
function createPerson({ name, age }) {
    // ...
}
createPerson({
    name: 'Faker',
    age: 18,
});

// bad
function createPerson(name, age) {
    // ...
}
```

## 使用参数默认值

```
// good
function createMicrobrewery(name = 'faker') {
    // ...
}

// bad
function createMicrobrewery(name) {
    const breweryName = name || 'faker';
    // ...
}
```

## 函数式编程

```
// good
const programmerOutput = [
    {
        name: 'Uncle Bobby',
        linesOfCode: 500
    }, {
        name: 'Suzie Q',
        linesOfCode: 1500
    }, {
        name: 'Jimmy Gosling',
        linesOfCode: 150
    }, {
        name: 'Gracie Hopper',
        linesOfCode: 1000
    }
];
let totalOutput = programmerOutput
  .map(output => output.linesOfCode)
  .reduce((totalLines, lines) => totalLines + lines, 0)

// bad
const programmerOutput = [
    {
        name: 'Uncle Bobby',
        linesOfCode: 500
    }, {
        name: 'Suzie Q',
        linesOfCode: 1500
    }, {
        name: 'Jimmy Gosling',
        linesOfCode: 150
    }, {
        name: 'Gracie Hopper',
        linesOfCode: 1000
    }
];

let totalOutput = 0;

for (let i = 0; i < programmerOutput.length; i++) {
    totalOutput += programmerOutput[i].linesOfCode;
}
```

## 缩进

统一使用一个 `tab` 作为缩进

## 空格

二元运算符两侧必须有一个空格，一元运算符与操作对象之间不允许有空格。
用作代码块起始的左花括号 { 前必须有一个空格。

```
// good
var a = !arr.length;
a++;
a = b + c;

// good
if (condition) {
}

while (condition) {
}

function funcName() {
}

// bad
if (condition){
}

while (condition){
}

function funcName(){
}
```

## 禁止使用 var，使用 let、const 代替

```
// good
let a = 123;

// bad
var a = 123;
```

## JS 中使用单引号'，在 DOM 中使用双引号"

```
// good
const str = '我是一个字符串';
<div className="div" />

// bad
const str = "我是一个字符串";
<div className='div' />
```

## 使用模板字符拼接字符串``

```
// good
const name = 'faker';
const str = `我叫${a}`;

// bad
const name = 'faker';
const str = '我叫' + a;
```

## 变量命名语义化

```
// good
const student = 'faker';

// bad
const a = 'faker';
```

## 注释

- 单行注释：必须独占一行。`//` 后跟一个空格，缩进与下一行被注释说明的代码一致
- 多行注释：避免使用 `/_..._/` 这样的多行注释。有多行注释内容时，使用多个单行注释
- 文档化注释：为了便于代码阅读和自文档化，以下内容必须包含以 `/\*_..._/` 形式的块注释中。

## 每个 JS 文件在头部需要给出该页面的信息

```
// good
/*
 * 充值记录页面
 * @Author: Jiang
 * @Date: 2019-06-12 15:21:19
 * @Last Modified by: Jiang
 * @Last Modified time: 2024-04-27 15:42:23
*/

// bad
无任何注释
```

## 不要省略分号

```
// good
const student = 'faker';

// bad
const student = 'faker'
```

## 博客

[欢迎关注我的博客](https://github.com/xuya227939/LiuJiang-Blog)
