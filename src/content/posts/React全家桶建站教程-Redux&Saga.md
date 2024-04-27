---
title: React全家桶建站教程-Redux&Saga
pubDate: 2018-06-08 10:16:34
categories: ["React"]
description: ""
---

## Redux 介绍

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。Redux 除了和 React 一起用外，还支持其它界面库。 它体小精悍（只有 2kB，包括依赖）。

## 方法

- action //通过 action 把数据传递给 reducer
- reducer //纯函数式，负责把数据发送给 render
- dispatch //触发器
- store //数据源

## Redux 例子

https://github.com/xuya227939/blog/tree/master/examples/react-redux/my-app

## Redux 安装

`$ sudo npm install -g create-react-app`
`$ create-react-app my-app`
`$ cd my-app`
`$ npm install --save redux`

## 使用

1.修改 App.js，引用官方代码。

```
import React from 'react';
import { createStore } from 'redux';
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}
let store = createStore(counter)
store.subscribe(() =>
  console.log(store.getState())
)
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'DECREMENT' })
const BasicExample = () => (
  <div>123</div>
)
export default BasicExample
```

2.npm start 调出开发者工具，看 console.log 输出。

## Saga 介绍

- 官方介绍：是一个旨在使应用程序副作用（即数据获取等异步事件和访问浏览器缓存等不纯的内容）更容易管理，更高效执行，易于测试并更好地处理故障的库。
- 个人理解：类似于 thunk，就是解决异步 callBack 过多的问题。

## 方法

- call //发送异步请求
- takeEvery //每次发送 saga，都会更新数据
- takeLatest //会取消上次的 saga，更新最后一个 saga
- put //类似 dispatch，发送数据到 reducer

## Saga 例子

这里以计数器为例子
https://github.com/xuya227939/blog/tree/master/examples/saga/my-app

## Saga 安装

`$ sudo npm install -g create-react-app`
`$ create-react-app my-app`
`$ cd my-app`
`$ npm install --save redux`
`$ npm install --save redux-saga`

## 使用

```
export function* addFun() {
  yield put({
    type: "ADD"
  });
}
function* homeSaga() {
  yield takeEvery("ADD_SAGA", addFun);
}
```

`function*` Generato 函数
`homeSaga函数` 监听 action
`addFun函数` 逻辑处理

```
yield put({
    type: "ADD"
  });
```

类似 action 的 dispatch，发送数据到 reducer

## 问题处理

1.如果报类似这样的错，react-scripts command not found 那么就 $ rm -rf node_modules 模块，重新安装下 $ npm i，再重新 npm start

## 欢迎在此 issue 下进行交流、学习

## 结语

- Redux：只能通过 dispatch 去改变，让这一切变得可以预测。这是我认为 redux 做得最好的地方，类似时间管理器的概念。任何时刻发生的事，都可以预测到结果。方便追踪 BUG 的产生。而不像原先 H5 一样，任何人都可以任意修改数据。从而是数据的发生变得很混乱。
- saga：核心功能，解决了异步事件的回调地狱和浏览器刷新这些副作用。
