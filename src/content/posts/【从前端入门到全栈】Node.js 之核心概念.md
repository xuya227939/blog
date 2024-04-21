---
title: 【从前端入门到全栈】Node.js 之核心概念
pubDate: 2024-04-16 10:40:31
categories: ["从前端入门到全栈"]
description: ""
---

## 从前端入门到全栈-系列介绍

1. 你会学到什么？

可能学不到什么东西，该系列是作者本人工作和学习积累，用于复习

2. 作者介绍

江辰，前网易高级前端工程师

3. 系列介绍

现在的 Web 前端已经离不开 Node.js，我们广泛使用的 Babel、Webpack、工程化都是基于 Node 的，各个互联网大厂也早已大规模落地 Node 项目。因此，想要成为一名优秀的前端工程师，提升个人能力、进入大厂，掌握 Node.js 技术非常有必要。

Node.js 不仅可以用来完善手头的开发环境，实现减少代码和 HTTP 请求，降低网页请求消耗的时间，提升服务质量。还可以扩展前端工程师的工作领域，用作 HTTP 服务，让前端也能完成一部分后端的工作，减少对后端的依赖，降低沟通成本，提升开发效率。

而且，Node.js 和浏览器的 JavaScript 只是运行时环境不同，编程语言都是 JavaScript ，所以掌握 Node.js 基础对前端工程师来说并不难，难点在于应用。由于浏览器的 JavaScript 主要是负责内容呈现与交互，而 Node.js 应用领域包括工具开发、Web 服务开发和客户端开发，这些都与传统的 Web 前端领域不一样，用来应对不同的问题。

4. 适宜人群

- 对 Node.js 感兴趣的 JavaScript 程序员
- 希望拓展知识边界，往全栈方向发展的前端工程师

> Node（正式名称 Node.js）是一个开源的、跨平台的运行时环境，有了它，开发人员可以使用 JavaScript 创建各种服务器端工具和应用程序。 此运行时主要用于浏览器上下文之外（即可以直接运行于计算机或服务器操作系统上）。

## 阻塞和非阻塞 I/O

### 非阻塞 I/O

在非阻塞 I/O 中，如果数据不可用（例如，文件还未准备好写入，或网络包尚未到达），I/O 调用会立即返回，线程可以继续执行其他任务。线程需要定期检查 I/O 操作的完成情况。

```node.js
const fs = require("fs");

fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});

console.log("程序执行结束!");
```

### 阻塞 IO

在阻塞 I/O 中，调用 I/O 操作的线程会被挂起，直到 I/O 操作完成。在此期间，线程不能做任何其他工作。

```node.js
const fs = require("fs");

const data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("程序执行结束!");
```

## 事件循环

Node.js 的事件循环是其工作原理的核心。事件循环允许 Node.js 进行非阻塞 I/O 操作，即使 JavaScript 是单线程的。每当在 Node.js 中发生一个 I/O 事件（如 API 调用返回结果，文件读取完成等）时，会触发回调函数，加入到事件循环等待执行，任务可以根据它们在事件循环中的调度方式和执行时间被分为微任务（microtasks）和宏任务（macrotasks）。

### 微任务（Microtasks）

微任务是在当前执行栈剩余任务执行完毕后立即执行的，这意味着他们会在事件循环的下一阶段之前执行。微任务通过他们的执行机制确保了任务执行的顺序和预测性。

例子包括：

- `process.nextTick()` （这是 Node.js 特有的，其他环境没有）
- Promises 的回调，例如 `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `queueMicrotask()`（这是一个将任务排入微任务队列的方法）

微任务的特点是它们的任务优先级很高，会在当前事件循环迭代的宏任务之后，下一迭代宏任务之前执行。这也意味着微任务的执行可能会导致阻塞宏任务的开始，如果微任务连续产生（比如，一个微任务在执行时创建了另一个微任务），可能会导致 I/O 饥饿。

### 宏任务（Macrotasks）

宏任务通常表示一个封装了一个较大操作的任务，这些任务将会按照队列的顺序一个接一个地执行。宏任务之间的间隔，是处理浏览器渲染和用户互动操作的机会。

例子包括：

- `setTimeout()`
- `setInterval()`
- `setImmediate()`（Node.js 特有）
- I/O 操作，如读写文件、网络请求等
- 用户交互，如点击、滚动事件等
- 定时器
- `requestAnimationFrame()`（浏览器特有）

每一个事件循环迭代通常只执行一个宏任务。在一个宏任务执行完成后，事件循环会处理所有已经排队的微任务，之后才会开始新的宏任务。

### 区别

关键区别在于：

- 微任务的执行时间是在当前宏任务执行完后，当前事件循环阶段结束前，它们拥有更高的优先级并且是在同一事件循环迭代中执行的。
- 宏任务每次事件循环迭代会新开始一个，它们的执行可能会被微任务延迟。

这种区分可以确保异步操作的适当处理顺序，微任务提供了一种在当前操作完成立即处理任务的方法，而宏任务则安排了一种更为分散的任务处理方式。对于开发者来说，理解这两者的区别有助于编写更高效、响应更快的应用程序。

```node.js
console.log("首先执行");

// 在定时器队列中安排一个宏任务（macro-task）
setTimeout(() => {
  console.log("由 setTimeout() 安排的宏任务");
}, 0);

// 在检查队列中安排一个宏任务
setImmediate(() => {
  console.log("由 setImmediate() 安排的宏任务");
});

// 安排一个微任务（micro-task），它会在当前操作结束后立即执行
process.nextTick(() => {
  console.log("由 process.nextTick() 安排的微任务");
});

console.log("最后执行");

// 执行结果
首先执行
最后执行
由 process.nextTick() 安排的微任务
由 setImmediate() 安排的宏任务
由 setTimeout() 安排的宏任务
```

### 和 Event Loop 的区别

两者的主要区别在于它们的用途：Node.js 事件循环主要处理非阻塞 I/O 操作，而浏览器事件循环主要关注 UI 渲染和用户交互。因此，虽然两者都是事件循环，但它们由于环境的特性，采取了略有不同的策略。

## 中间件

Node.js 中中间件是一个非常关键的概念，特别是在使用如 Express.js 这类的框架构建 web 应用时。中间件基本上是一个函数，它可以访问请求对象（request），响应对象（response），和 web 应用中处理请求-响应周期的流程中的下一个中间件函数，通常以 `next` 变量表示。

以下是中间件的一些基本点和它们的工作原理：

### 接入请求-响应周期

中间件的主要用途是在服务器收到请求和发送响应之间的某个时点执行一些代码，也就是说，它们介于请求到达服务器和最终发送响应的过程之间。

### 修改请求和响应

中间件能够修改请求和响应对象。它们可以添加头信息、处理身份验证、进行日志记录、设置 cookies、解析请求体中的数据等等。

### 分类

- **应用级中间件**：绑定到 `app` 实例的中间件，可用于任何请求的路径和方法。
- **路由级中间件**：与应用级中间件相似，但它绑定于 `express.Router()` 的实例。
- **错误处理中间件**：专门用来处理应用中发生的错误。
- **内置中间件**：Express 内置的中间件，如 `express.static` 用于提供静态资源，或 `express.json` 用于解析请求体中的 JSON。
- **第三方中间件**：由社区提供的中间件，需要通过 npm 安装，用来添加更多功能。

### 使用方法

中间件可以用 `app.use()` 和 `app.METHOD()`（其中 METHOD 是 HTTP 动词，例如 GET、POST 等）来应用。例如：

```javascript
const express = require("express");
const app = express();

// 应用级中间件
app.use(function (req, res, next) {
  console.log("时间：", Date.now());
  next();
});

// 路由级中间件
app.get(
  "/user/:id",
  function (req, res, next) {
    // 如果用户 ID 是 0，跳到下一个路由
    if (req.params.id === "0") next("route");
    // 否则将控制权传递给堆栈中的下一个中间件
    else next();
  },
  function (req, res, next) {
    // 渲染普通页面
    res.send("常规用户");
  }
);

// 错误处理中间件
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = app.listen(3000, () =>
  console.log("Server running on port 3000")
);
```

### 顺序很重要

中间件的执行顺序取决于它们在代码中的顺序。`next()` 函数被调用时，执行会传递给堆栈中的下一个中间件。

### `next` 和路由完成

当中间件完成时，它必须调用 `next()` 来传递控制权给下一个中间件，除非它完全结束了请求-响应周期。否则，请求将会被挂起。

理解中间件如何工作，以及如何去使用它们，对于构建有效和功能丰富的 web 应用程序是非常有帮助的。通过组合使用多个中间件，你可以为你的应用程序构建可重用、模块化的功能部件。

## Buffer 和 Stream

### Buffer

在 Node.js 中，Buffer 是一个用于处理二进制数据流的类。在早期的 JavaScript 中，并没有用于处理原始数据的八位字节序列的机制。但在服务器端，你需要处理像 TCP 流或文件系统等涉及二进制数据的操作。Buffer 类为这些二进制数据提供了一个接口。

Buffer 是一个类似于数组的对象，它可以存储任意类型的字节。因为 JavaScript 的字符串是以 UTF-16 编码，所以如果要处理像 UTF-8、Base64、二进制数据或其他任何格式的字符串，使用 Buffer 是非常需要的。

```jsx
// 简单的 Buffer 示例
const buf = Buffer.from("Hello, World!");

console.log(buf); // 打印出 Buffer 对象
console.log(buf.toString()); // 将 Buffer 对象转换为字符串
```

### Stream

在 Node.js 中，Stream 是一个抽象接口，被 Node 中的许多对象实现。流可以是可读的、可写的，或者既可读又可写。它们是处理流式数据的优雅方式，比如文件的读写、网络通信等。
流处理数据时不必等待所有的数据下载完毕，而是一旦有数据就开始处理，这是非常高效的数据处理方法，因为它减少了内存的使用，并且在某些情况下可以减少总体的处理时间。

```
const fs = require('fs');
const readableStream = fs.createReadStream('file.txt');
const writableStream = fs.createWriteStream('new-file.txt');

readableStream.on('data', function(chunk) {
    writableStream.write(chunk);
});

readableStream.on('end', function() {
    writableStream.end();
});
```

## 单线程

Node.js 被认为是单线程的，这是因为 JavaScript 在 Node.js 环境中的执行模型基于一个主单线程，单线程意味着有一个主线程来处理所有的 JavaScript 代码。所有的异步操作（例如 I/O、网络请求、文件系统操作）在开始时被提交到主线程之外的地方，在 Node.js 中通常由底层的 C++ APIs 来处理这些操作。一旦这些异步操作完成（或部分完成，比如流数据），它们的回调函数将返回到事件队列中排队等待执行。

## 多线程和并发

虽然 Node.js 主线程是单线程的，但这并不意味着 Node.js 不能执行多线程的操作或者处理并发。通过 Node.js 的 child_process 模块，你可以启动子进程来执行 CPU 密集型任务。此外，Node.js v10.5.0 以后引入了 worker_threads 模块，允许直接在 Node 应用程序中使用多个线程。

## 总结

文章同步更新平台：掘金、CSDN、知乎、思否、博客，公众号（野生程序猿江辰）
我的联系方式，v：Jiang9684，欢迎和我一起学习交流

完
