---
title: React全家桶建站教程-Router
pubDate: 2018-06-08 10:16:04
categories: ["React"]
description: ""
---

## 介绍

React Router 是一个基于 React 之上的强大路由库，它可以让你向应用中快速地添加视图和数据流，同时保持页面与 URL 间的同步。

## 例子

https://github.com/xuya227939/blog/tree/master/examples/react-router/my-app

## 安装

`$ sudo npm install -g create-react-app`
`$ create-react-app my-app`
`$ cd my-app`
`$ npm install react-router-dom`

## 使用

1.引用的官方代码，在 App.js 插入以下代码

```
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic}/>
    <Route exact path={match.path} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)
export default BasicExample
```

2.npm start

## 标签

- Link //类似 a 标签的跳转。
- Router //与 Route 一样都是 react 组件，它的 history 对象是整个路由系统的核心，它暴露了很多属性和方法在路由系统中使用；
- Route //path 属性表示路由组件所对应的路径，可以是绝对或相对路径，相对路径可继承；
- 4.0 版本之后，history 通过父组件传递进来，this.props.history.push('/user'); //进行路由之间跳转

## 问题处理

1.如果报类似这样的错，react-scripts command not found 那么就 $ rm -rf node_modules 模块，重新安装下 $ npm i，再重新 npm start

## 欢迎在此 issue 下进行交流、学习

## 结语

使用 react-router 可以更方便的管理页面刷新、跳转。
