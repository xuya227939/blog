---
title: 配置多入口 Webpack 热更新失效
pubDate: 2021-05-20 11:01:36
categories: ["Webpack"]
description: ""
---

## 前言

`Webpack` 对于现代前端开发者，想必是相当熟悉了，在很多项目中，应用非常广泛，而 `webpack-dev-server`，相信大家应该也都接触过。最近，作者在配置多入口，热更新在单入口是好使的，结果到了多入口不好使？，然后通过 Google 寻找答案，找到了一篇 `issue`，[HMR not working with multiple entries](https://github.com/webpack/webpack-dev-server/issues/2792)，跟我的问题类似，好像真的有 BUG？看到作者回复

![WechatIMG1679](https://user-images.githubusercontent.com/16217324/120896702-4362cb80-c655-11eb-878a-c4510eb7df8f.png)

v4 修复了该问题，我丢，我还在使用 v3，翻看 v4 文档

![WechatIMG1680](https://user-images.githubusercontent.com/16217324/120896712-48277f80-c655-11eb-9d7b-7a9ce1039f71.png)

此时，只有一个感觉，热更新都多久的东西了，不应该存在多入口，热更新有问题吧？升级到 v4 之后，还是不行，当时我这暴脾气就上来了，直接翻看源码。翻看源码之前，首先要对热更新是个什么，有个基础的了解。

## 模块热更新

模块热更新(Hot Module Replacement)是指在浏览器运行过程中，替换、添加或删除模块，而无需重新加载整个页面。

- 保留在完全重新加载页面期间丢失的应用程序状态
- 在源代码中对 `CSS/JS` 进行修改，会立刻在浏览器中进行更新，并只更新改变的内容，节省开发时间

对比 `Live Reload` 方案，`HMR` 体现了其强大之处，实时模块热刷新和保存应用状态，极大的提高了开发效率和开发体验。

## 启用模块热更新

`HMR` 的启用十分简单，一个带有热更新功能的 `webpack.config.js` 文件的配置如下：

```
const path = require('path');

module.exports = {
    // ...
    entry: {
        app: ['./src/index.js']
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true,
        historyApiFallback: true,
        compress: true
    }
};
```

src/index.js

```
if (module.hot) {
    module.hot.accept();
}
```

## 原理

网上关于 `Webpack` 热更新原理文章很多，这里就不详细描述了，推荐几个。

- [模块热更新](https://tsejx.github.io/webpack-guidebook/principle-analysis/operational-principle/hot-module-replacement)

- [轻松理解 webpack 热更新原理](https://juejin.cn/post/6844904008432222215)

- [Webpack HMR 原理解析](https://juejin.cn/post/6844904008432222215)

## 调试

### npm link

```
$ git clone https://github.com/webpack/webpack-dev-server.git
```

一定要找到你项目中对应的版本包，对号入座噢，否则会报错，把 `webpack-dev-server` 项目拉下来之后，尝试在 `webpack-dev-server/lib/Server.js` 该文件增加一行 `console.log`

![carbon](https://user-images.githubusercontent.com/16217324/120896791-96d51980-c655-11eb-948c-dd2f3c172414.png)

然后进入根目录

```
$ cd webpack-dev-server
$ npm link
```

生成软链

```
cd 项目地址
npm link webpack-dev-server
```

link 成功之后，会提示下面，更换了 webpack-dev-server 地址

```
jiang@JiangdeMacBook-Pro-3 commonVideoClient % cnpm link webpack-dev-server
/Users/jiang/Desktop/commonVideoClient/node_modules/webpack-dev-server -> /usr/local/lib/node_modules/webpack-dev-server -> /Users/jiang/Desktop/webpack-dev-server
```

然后在项目跑 `webpack-dev-server`，在控制台应该就会看到对应的输出了，调试源码非常方便。

`npm link` 方案，第三方库和项目属于不同的项目，它们有自己的 `node_modules`，如果第三方库和项目都使用了同一个依赖，它们会在各自的 `node_modules` 去查
找，如果这个依赖不支持多例，应用就会异常。

### yalc

在开发和创作多个包（私有或公共）时，您经常发现自己需要在本地环境中正在处理的其他项目中使用最新/WIP 版本，而无需将这些包发布到远程注册中心。NPM 和 Yarn 使用类似的符号链接包( npm/yarn link)方法解决了这个问题。虽然这在许多情况下可能有效，但它经常带来令人讨厌的约束和依赖解析、文件系统之间的符号链接互操作性等问题。

![yalc](https://user-images.githubusercontent.com/16217324/120896797-a2284500-c655-11eb-8870-382fd0606309.png)

全局安装 yalc

```
npm install -g yalc
```

生成 yalc 包

```
$ cd webpack-dev-server
$ yalc publish
```

可以在自己本地 `/Users/jiang/.yalc/packages/webpack-dev-server`，找到对应的包

```
cd 项目地址
yalc link webpack-dev-server
```

link 后，可以在自己项目下，找到 `.yalc`

每次手动修改第三方库的代码，都需要手动 link，就很麻烦，对不对？ok，神器来了，`nodemon`，

```
npm install -g nodemon

nodemon
--ignore dist/
--ignore node_modules/
--watch lib # 观察目录
-C # 只在变更后执行，首次启动不执行命令
-e js,ts,html,less,scss 监控指定后缀名的文件
--debug # 调试
-x "yalc publish" 自定义命令
```

然后，我们来试试这个工具，在 `webpack-dev-server`，新增三行可执行命令

![carbon2](https://user-images.githubusercontent.com/16217324/120896803-a9e7e980-c655-11eb-8ffe-1ad8739681c4.png)

运行下 `npm run watch`，然后每次修改，都会自动更新，是不是很舒服？

<img width="119" alt="WeChat7c8e2813667093e82dc47a836e6d5cdb" src="https://user-images.githubusercontent.com/16217324/120896810-b1a78e00-c655-11eb-8c4f-3a4101336d7d.png">

### 网页调试

![WechatIMG1776](https://user-images.githubusercontent.com/16217324/120896814-b8360580-c655-11eb-80a0-e2c925c90bac.png)

找到对应的文件位置和代码行数，通过浏览器进行断点调试，这个就不展开讲了。

## 找到问题

经过一番折腾，升级 `webpack-dev-server@v4`，原理分析，源码调试，与之前正常的单页应用进行对比，发现都是正常的，还是不行，我就郁闷了，为何呢？突然之间，我悟了，好像多页应用没有在入口进行 `module.hot`

之前在 `app.jsx` 中写的 `module.hot`

![carbon3](https://user-images.githubusercontent.com/16217324/120896817-bf5d1380-c655-11eb-84b1-c8c477e54b15.png)

改在入口文件 进行 `module.hot`

![carbon4](https://user-images.githubusercontent.com/16217324/120896823-c421c780-c655-11eb-92b8-44c6d46647a3.png)

ok，成功，喜大普奔。

![WechatIMG1780](https://user-images.githubusercontent.com/16217324/120896832-cab03f00-c655-11eb-8ee6-0713c6b92432.jpeg)

## 总结

带着问题，阅读源码是最高效的，这样你在阅读源码的过程中也不会感到无聊，因为你是要解决问题，才会去看源码，对于不懂的代码，一点一点调试，一步一步走下去，再结合现有的一些原理文章（站在巨人的肩膀上）就会找到答案。这次的经历，也算很有意思，感谢小伙伴们的阅读，喜欢的可以点个赞噢 🌟 ～
