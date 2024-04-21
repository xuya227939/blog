---
title: React全家桶建站教程-React&Ant
pubDate: 2018.06.08
categories: ["React"]
description: ""
---

## 介绍

这里使用到的 UI 库是蚂蚁金服开源的 ant-design，为啥使用？我觉得是使用人数比较多，坑比较少吧。

## 例子

https://github.com/xuya227939/blog/tree/master/examples/react/my-app

## 安装

```
$ sudo npm install -g create-react-app //全局安装的话，需要权限，所以使用sudo
$ create-react-app my-app
$ cd my-app
$ npm install antd
$ npm start
```

## 使用

1.引用官方代码，修改 App.js 文件，引入 ant 组件

```
import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

export default App;
```

2.引用官方代码，修改 App.css

```
@import '~antd/dist/antd.css';
.App {
  text-align: center;
}

.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.App-header {
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
}

.App-title {
  font-size: 1.5em;
}

.App-intro {
  font-size: large;
}

@keyframes App-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

你就可以看到蓝色的按钮了。

## 问题处理

1.如果报类似这样的错，react-scripts command not found 那么就 $ rm -rf node_modules 模块，重新安装下 $ npm i，再重新 npm start

## 结语

react 入门，首先从搭建 react 开始。
