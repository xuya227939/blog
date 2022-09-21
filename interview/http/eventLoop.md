## 什么是 Event Loop

我的理解是浏览器事件循环，说到 Event Loop，首先我们同步下几个概念：

-   JS 分同步任务和异步任务
-   同步任务都在 JS 引擎线程上执行，形成一个执行栈
-   事件触发线程管理一个任务队列
-   执行栈中所有同步任务执行完毕，此时 JS 引擎线程空闲，系统会读取任务队列，将可执行的异步任务回调事件添加到执行栈中，开始执行

## 宏任务

我们可以将每次执行栈执行的代码当做是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）， 每一个宏任务会从头到尾执行完毕，不会执行其他。

我们前文提到过 JS 引擎线程和 GUI 渲染线程是互斥的关系，浏览器为了能够使宏任务和 DOM 任务有序的进行，会在一个宏任务执行结果后，在下一个宏任务执行前，GUI 渲染线程开始工作，对页面进行渲染。

### 哪些是宏观任务

-   setTimeout 的回调
-   setInterval 的回调
-   setImmediate 的回调
-   requestAnimationFrame (浏览器独有)
-   I/O
-   UI rendering (浏览器独有)
-   promise 的回调（new Promise()）

## 微任务

我们已经知道宏任务结束后，会执行渲染，然后执行下一个宏任务，
而微任务可以理解成在当前宏任务执行后立即执行的任务。
也就是说，当宏任务执行完，会在渲染前，将执行期间所产生的所有微任务都执行完。
Promise，process.nextTick 等，属于微任务

### 哪些是微观任务

-   process.nextTick (Node 独有)
-   Promise 的 then 的回调（注意，new Promise()的函数参数是同步代码，then 的回调才是异步）
-   await 下方的代码和赋值代码（注意，await 后方的函数是同步代码）
-   MutationObserver

## 总结

-   执行一个宏任务（栈中没有就从事件队列中获取）
-   执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
-   宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
-   当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染
-   渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取）

eventLoop 执行的生命周期是，首先执行同步任务队列栈，同步任务执行完之后，执行过程中碰到微观任务，则放到微任务队列栈中，执行宏观任务，所有的宏观任务执行完之后，如果有微观任务，立即执行当前微任务队列中的所有微任务，当前宏任务执行完毕，开始检查渲染，再执行 GUI 渲染线程，然后回到执行栈，一直重复这个这个循环过程。

## 例题

### 例题一

```
console.log(1);

setTimeout(function () {
    console.log(2);
}, 0);

const p = new Promise((resolve, reject) => {
    resolve(1000);
});

p.then(data => {
    console.log(data);
});

console.log(3);

// 代码运行结果为 1 3 1000 2
```

### 例题二

```
console.log(1);

setTimeout(function () {
    console.log(2);
}, 0);

const p = new Promise((resolve, reject) => {
    resolve(1000);
});

const p2 = new Promise((resolve, reject) => {
    resolve(2000);
});

const p3 = new Promise((resolve, reject) => {
    reject(3000);
});

p.then(data => {
    console.log(data);
    setTimeout(() => {
      console.log('t3');
    }, 0);
});

p2.then(data => {
    console.log(data);
    setTimeout(() => {
        console.log('t2');
    }, 0);
});

p3.catch(err => {
    console.log(err);
    setTimeout(() => {
        console.log('t1');
    }, 1000);
});

console.log(3);

// 代码运行结果为 1 3 1000 2000 3000，2，t3，t2, t1
```

### 例题三

```
new Promise((resolve, reject) => {
    console.log(1)
    resolve(2)
}).then((data) => {
    // 1号回调
    console.log(data);
    return 3
}).then((data) => {
    // 2号回调
    console.log(data);
    return 4;
}).then((data) => {
    console.log(data);
});

new Promise((resolve, reject) => {
    console.log(5)
    resolve(6)
}).then((data) => {
    // 3号回调
    console.log(data);
    return 7;
}).then((data) => {
    // 4号回调
    console.log(data);
    return 8;
}).then((data) => {
    console.log(data);
});
```

// 代码运行结果为 1 5 2 6 3 7 4 8

### 例题四

```
console.log('script start');

async function async1() {
    await async2();
    console.log('async1 end');
};

async function async2() {
    console.log('async2 end');
};

async1()

setTimeout(() => {
    console.log('setTimeout')
}, 0)

new Promise((resolve, reject) => {
    console.log('promise start');
    resolve()
})
.then(() => console.log('promise end'))

console.log('script end')

// 执行结果

script start

async2 end

promise start

script end

async1 end

promise end

setTimeout
```
