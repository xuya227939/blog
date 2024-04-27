---
title: 基于React、Mobx、Webpack 和 React-Router的项目模板
pubDate: 2020-02-09 16:09:49
categories: ["React", "Mobx", "Webpack"]
description: ""
---

## 前言

自己利用业余时间，基于 React、Ant、Webpack、Mobx、React-Router 写了一个后台管理模板，接下来会出三部曲系列，分为前端、后端、运维到发布，从零搭建 React 后台管理模板，目前已在公司内部搭建了几套项目，并都已上线，希望这个系列，帮助自己梳理各技术最新知识点，同时也希望对看到的人有所帮助。

## 项目效果：

登录页：

![b1350cab0e03f4550fc4df4e732ec66](https://user-images.githubusercontent.com/16217324/76694589-93035300-66af-11ea-9cdc-9f5f816772a8.png)

404 页：

![1f9521098f4b515ccd7dbf96f466f6f](https://user-images.githubusercontent.com/16217324/76694593-a0204200-66af-11ea-8e57-0bb35313f93f.png)

列表页：

![715ecc9a20f23420ceef4677f0b3277](https://user-images.githubusercontent.com/16217324/76694597-ad3d3100-66af-11ea-8a8e-a3ae644bdcee.png)

## GitHub 源码地址

[Tristana](https://github.com/Cherry-Team/tristana)

## 在线预览地址

[Tristana](https://order.downfuture.com)

## 技术栈

- React
- Ant
- React-Router
- Mobx
- Webpack
- ES6
- Babel
- Axios
- Eslint
- Stylelint

## 项目结构

```
│  .babelrc                     // babelrc配置
│  .eslintrc.json               // eslint配置
│  .gitignore                   // git忽略配置
│  package.json                 // 依赖包配置
│  README.md                    // 项目说明
│  stylelint.config.js          // stylelint配置
│
├─dist                          // 打包输出目录
├─public                        // 项目公开目录
│      index.html
│
├─script                        // webpack配置
│      webpack.base.conf.js     // webpack通用配置
│      webpack.dev.js           // webpack开发环境配置
│      webpack.prod.js          // webpack生产环境配置
│
└─src                           // src入口目录
    │  config.js                // 基础配置文件
    │  index.jsx                // 项目入口文件
    │  request.jsx              // 接口请求配置
    │  routeConfig.jsx          // 路由配置
    │
    ├─assets                    // 静态资源
    │  └─images
    │          sign_bg.jpg
    │
    ├─components                // 公用组件
    │  ├─LayoutHeader
    │  │      index.jsx
    │  │      index.less
    │  │
    │  ├─PrivateRoute
    │  │      index.jsx
    │  │
    │  └─Socket
    │          index.jsx
    │
    ├─mobx                      // mobx配置
    │  │  basicStore.js
    │  │  rootStore.js
    │  │
    │  ├─AddGoods
    │  │      store.js
    │  │
    │  ├─CounterStore
    │  │      store.js
    │  │
    │  └─Dashboard
    │          store.js
    │
    ├─pages                      // 页面组件
    │  ├─AddGoods
    │  │      index.jsx
    │  │      index.less
    │  │
    │  ├─Counter
    │  │      index.jsx
    │  │      index.less
    │  │
    │  ├─Dashboard
    │  │      index.jsx
    │  │      index.less
    │  │
    │  ├─Home
    │  │  │  index.jsx
    │  │  │  index.less
    │  │  │
    │  │  └─components
    │  │          menu.jsx
    │  │
    │  └─User
    │          error.jsx
    │          error.less
    │          login.jsx
    │          login.less
    │
    ├─servers                     // 接口配置
    │      dashboard.js
    │
    ├─styles                      // 公共样式
    │      index.less
    │
    └─utils                       // 工具库
            index.js
```

## 各大库版本

```
"dependencies": {
    "@babel/cli": "^7.8.0",
    "@babel/core": "^7.8.0",
    "@babel/plugin-proposal-class-properties": "^7.8.0",
    "@babel/plugin-proposal-decorators": "^7.8.0",
    "@babel/plugin-proposal-json-strings": "^7.8.0",
    "@babel/plugin-syntax-dynamic-import": "^7.8.0",
    "@babel/plugin-syntax-import-meta": "^7.8.0",
    "@babel/plugin-transform-runtime": "^7.8.0",
    "@babel/polyfill": "^7.8.0",
    "@babel/preset-env": "^7.8.2",
    "@babel/preset-react": "^7.8.0",
    "@babel/preset-stage-2": "^7.8.0",
    "antd": "^4.0.0",
    "axios": "^0.19.2",
    "babel-eslint": "^10.0.3",
    "babel-loader": "^8.0.0",
    "babel-plugin-import": "^1.13.0",
    "babel-plugin-react-css-modules": "^5.2.6",
    "classnames": "^2.2.6",
    "clean-webpack-plugin": "^3.0.0",
    "compression-webpack-plugin": "^3.0.1",
    "core-js": "^3.6.4",
    "cross-env": "^6.0.3",
    "css-loader": "^3.2.0",
    "dayjs": "^1.8.15",
    "eslint": "^6.8.0",
    "eslint-config-standard": "^14.1.0",
    "eslint-loader": "^3.0.3",
    "eslint-plugin-import": "^2.20.0",
    "eslint-plugin-jsx-a11y": "^6.2.3",
    "eslint-plugin-node": "^11.0.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-react": "^7.17.0",
    "eslint-plugin-standard": "^4.0.1",
    "file-loader": "^5.0.2",
    "history": "^4.7.2",
    "html-webpack-plugin": "^3.2.0",
    "install": "^0.12.2",
    "is-promise": "^2.1.0",
    "less": "^3.8.1",
    "less-loader": "^5.0.0",
    "lint-staged": "^10.0.8",
    "mini-css-extract-plugin": "^0.8.0",
    "mobx": "^5.13.1",
    "mobx-react": "^6.1.4",
    "npm": "^6.10.2",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss-loader": "^3.0.0",
    "pre-commit": "^1.2.2",
    "progress-bar-webpack-plugin": "^1.12.1",
    "prop-types": "^15.7.2",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "react-router": "^5.1.2",
    "react-router-dom": "^5.1.2",
    "react-scripts": "^3.0.0",
    "speed-measure-webpack-plugin": "^1.3.1",
    "stylelint": "^13.0.0",
    "stylelint-config-standard": "^19.0.0",
    "terser-webpack-plugin": "^2.2.1",
    "webpack": "^4.41.2",
    "webpack-bundle-analyzer": "^3.6.0",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.10.1"
  },
```

## 下篇文章

[React 全家桶建站教程系列-前端](https://github.com/xuya227939/LiuJiang-Blog/issues/1)

## 最后

如果你觉得还不错或者有帮助的同学，欢迎关注、多多 star；欢迎你关注我的[Blog](https://github.com/xuya227939/LiuJiang-Blog)
