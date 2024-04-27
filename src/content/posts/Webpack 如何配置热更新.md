---
title: Webpack 如何配置热更新
pubDate: 2020-05-20 18:23:46
categories: ["Webpack"]
description: ""
---

## 什么是 HMR

是指 `Hot Module Replacement`，缩写为 `HMR`。对于你需要更新的模块，进行一个"热"替换，所谓的热替换是指在不需要刷新页面的情况下，对某个改动进行无缝更新。如果你没有配置 `HMR`，那么你每次改动，都需要刷新页面，才能看到改动之后的结果，对于调试来说，非常麻烦，而且效率不高，最关键的是，你在界面上修改的数据，随着刷新页面会丢失，而如果有类似 `Webpack` 热更新的机制存在，那么，则是修改了代码，不会导致刷新，而是保留现有的数据状态，只将模块进行更新替换。也就是说，既保留了现有的数据状态，又能看到代码修改后的变化。

总结：

- 加载页面时保存应用程序状态
- 只更新改变的内容，节省调试时间
- 修改样式更快，几乎等同于在浏览器中更改样式

## 安装依赖

```
$ npm install webpack webpack-dev-server --save-dev
```

`package.json`：

```
"dependencies": {
    "webpack": "^4.41.2",
    "webpack-dev-server": "^3.10.1"
},
```

## 配置

`webpack`:

```
devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    historyApiFallback: true,
    compress: true
},
```

- `hot` 为 `true`，代表开启热更新

- `contentBase` 表示告诉服务器从哪里提供内容。（也就是服务器启动的根目录，默认为当前执行目录，一般不需要设置）

- `historyApiFallback` 使用 `HTML5` 历史记录 `API` 时，`index.html` 很可能必须提供该页面来代替任何 404 响应

- `compress` 对所有服务启用 `gzip` 压缩

```
plugins: {
    HotModuleReplacementPlugin: new webpack.HotModuleReplacementPlugin()
},
```

配置热更新插件

```
module: {
    rules: [
        {
            test: /\.(css|less)$/,
            use: [
                process.env.NODE_ENV == 'development' ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                }
            ]
        }
    ]
},
```

`style-loader` 库实现了 `HMR` 接口，当通过 `HMR` 收到更新时，它将用新样式替换旧样式。区分开发环境和生产环境，用不同 `loader。`

`src/index.jsx`：

```
if (module.hot) {
    module.hot.accept();
}
```

入口文件，新增上面代码，就可以了，非常简单。

## react-hot-loader

`react-hot-loader` 插件，[传送门](https://github.com/gaearon/react-hot-loader)

### 如何使用

安装

```
$ npm install react-hot-loader --save-dev
```

配置 `babelrc`

```
{
  "plugins": ["react-hot-loader/babel"]
}
```

将根组件标记为热导出

```
import { hot } from 'react-hot-loader/root';
const App = () => <div>Hello World!</div>;
export default hot(App);
```

在 `React` 和 `React Dom` 之前，确保需要 `React` 热加载程序

```
// webpack.config.js
module.exports = {
  entry: ['react-hot-loader/patch', './src'],
  // ...
};
```

### 遇到问题

- 如果遇到 `You cannot change <Router history>` ，那么应该这样配置：

```
import { hot } from 'react-hot-loader/root';
const Routes = () => {};
export default hot(Routes);
```

- 配置完热更新之后，遇到`webpack`自动编译两次问题，很大概率出现，具体原因，没有分析，找到一个讨巧的解决办法，配置：

```
watchOptions: {
    aggregateTimeout: 600
},
```

也有可能是其他问题，比如你在`index.html`页面，重复引入了`index.js`，又或者是全局安装了`webpack-dev-server`，与本地`webpack-dev-server`重复，卸载全局`webpack-dev-server`，即可。

## 案例

[Tristana](https://github.com/xuya227939/tristana)

## 博客

欢迎关注我的[博客](https://github.com/xuya227939/LiuJiang-Blog)
