---
title: Webpack4 性能优化实践
pubDate: 2020-11-07 15:47:57
categories: ["Webpack4"]
description: ""
---

# 为什么需要性能优化

在使用 `Webpack` 时，如果不注意性能优化，可能会产生性能问题，会导致在开发体验上不是非常丝滑，性能问题主要是编译速度慢，打包体积过大，因此性能优化也主要从这些方面来分析。本文主要是自己平时的工作积累和参考别人的文章，而进行总结，基于 `Webpack4` 版本。

# 构建分析

## 编译速度分析

对 `Webpack` 构建速度进行优化的首要任务就是去知道哪些地方值得我们注意。
`speed-measure-webpack-plugin` 插件能够测量 Webpack 构建速度

```
 SMP  ⏱
General output time took 38.3 secs

 SMP  ⏱  Plugins
HtmlWebpackPlugin took 1.31 secs
CopyPlugin took 0.016 secs
OptimizeCssAssetsWebpackPlugin took 0.002 secs
ContextReplacementPlugin took 0.001 secs
MiniCssExtractPlugin took 0 secs
DefinePlugin took 0 secs

 SMP  ⏱  Loaders
_babel-loader@8.1.0@babel-loader took 29.98 secs
  module count = 1503
_babel-loader@8.1.0@babel-loader, and
_eslint-loader@3.0.4@eslint-loader took 18.74 secs
  module count = 86
_css-loader@3.6.0@css-loader, and
_less-loader@5.0.0@less-loader took 16.45 secs
  module count = 64
modules with no loaders took 2.24 secs
  module count = 7
_file-loader@5.1.0@file-loader took 1.03 secs
  module count = 17
_style-loader@1.3.0@style-loader, and
_css-loader@3.6.0@css-loader, and
_less-loader@5.0.0@less-loader took 0.102 secs
  module count = 64
_html-webpack-plugin@3.2.0@html-webpack-plugin took 0.021 secs
  module count = 1
```

居然达到了惊人的 **38.3** 秒，虽然有点不是很准确，但是非常慢。发现 `babel-loader、eslint-loader、css-loader、less-loader` 占据了大头。

```
const webpackBase = require('./webpack.base.conf');
const path = require('path');

const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();

module.exports = smp.wrap({
    // 配置源码显示方式
    devtool: 'eval-source-map',
    mode: 'development',
    entry: {
        app: ['./src/index.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    resolve: webpackBase.resolve,
    module: webpackBase.module,
    stats: webpackBase.stats,
    optimization: webpackBase.optimization,
    plugins: [
        webpackBase.plugins.html,
        webpackBase.plugins.miniCssExtract,
        webpackBase.plugins.optimizeCssAssets,
        // webpackBase.plugins.progressBarPlugin,
        webpackBase.plugins.ContextReplacementPlugin,
        webpackBase.plugins.DefinePlugin,
        // webpackBase.plugins.AntdDayjsWebpackPlugin,
        webpackBase.plugins.CopyPlugin
        // webpackBase.plugins.HotModuleReplacementPlugin
    ],
    devServer: webpackBase.devServer,
    watchOptions: webpackBase.watchOptions,
    externals: webpackBase.externals
});
```

## 打包体积分析

通过 `webpack-bundle-analyzer` 插件能够在 `Webpack` 构建结束后生成构建产物体积报告，配合可视化的页面，能够直观知道产物中的具体占用体积。

```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  plugins: bundleAnalyzer: new BundleAnalyzerPlugin({ analyzerPort: 8081 })],
};
```

效果图如下：

![5061604735941_ pic_hd](https://user-images.githubusercontent.com/16217324/98435967-3bb86400-2112-11eb-8508-6e3c5c6754e4.jpg)

可以看出一个很明显的问题就是 `Ant Design、TRTC、Mobx` 这些库，没有排除。

打包体积如下：

![image](https://user-images.githubusercontent.com/16217324/98436005-9356cf80-2112-11eb-8f01-5b8347890498.png)

# 如何优化

## 缩小构建目标

- 优化 `resolve.modules` 配置（减少模块搜索层级和不必要的编译工作）
- 优化 `resolve.extensions` 配置
- 增加缓存

```
const path = require('path');
module.exports = {
    resolve: {
        // 自动解析确定的扩展
        extensions: ['.js', '.jsx', '.css', '.less', '.json'],
        alias: {
            // 创建 import 或 require 的别名，来确保模块引入变得更简单
            'react': path.resolve( __dirname ,'./node_modules/react/dist/react.min.js')
        },
        // 当从 npm 包导入模块时，此选项将决定在 `package.json` 中使用哪个字段导入模块
        // 默认值为 browser -> module -> main
        mainFields: ['main']
    },
    module: {
        rules: [
            {
                // 排除node_modules模块
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                // 开启缓存
                loader: 'babel-loader?cacheDirectory=true'
            }
        ]
    }
};
```

## 使用 thread-loader，开启多进程

`thread-loader` 会将你的 `loader` 放置在一个 `worker` 池里面运行，每个 `worker` 都是一个单独的有 **600ms** 限制的 `node.js` 进程。同时跨进程的数据交换也会被限制。请在高开销的 `loader` 中使用，否则效果不佳。

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          // your expensive loader (e.g babel-loader)
        ],
      },
    ],
  },
};
```

## 使用 hard-source-webpack-plugin

在 `Webpack4` `中，hard-source-webpack-plugin` 是 `DLL` 的更好替代者。

`hard-source-webpack-plugin` 是 `Webpack` 的插件，为模块提供中间缓存步骤。为了查看结果，您需要使用此插件运行 `Webpack` 两次：第一次构建将花费正常的时间。第二次构建将显着加快（大概提升 **90%** 的构建速度）。不过该插件很久没更新了，不太建议使用。

## 去掉 eslint-loader

由于我项目中使用了 `eslint-loader` 如果配置了 `precommit`，其实可以去掉的。

## 通过 externals 把相关的包，排除

Webpack

```
module.exports = {
    // externals 排除对应的包，注：排除掉的包必须要用script标签引入下
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'trtc-js-sdk': 'TRTC',
        bizcharts: 'BizCharts',
        antd: 'antd',
        mobx: 'mobx',
        'mobx-react': 'mobxReact'
    }
};
```

index.html

```
<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta name="baidu-site-verification" content="ptk9VJudKz" />
        <link
            rel="stylesheet"
            href="https://xxx/antd.min3.26.20.css"
        />
        <title>webpack</title>
        <script
            type="text/javascript"
            src="https://xxx/17.0.0react.production.min.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/17.0.0react-dom.production.min.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/BizCharts3.5.8.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/trtc4.6.7.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/moment2.29.1.min.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/moment2.29.1zh-cn.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/polyfill.min7.8.0.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/antd.min3.26.20.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/mobx.umd.min5.13.1.js"
        ></script>
        <script
            type="text/javascript"
            src="https://xxx/mobx-react.index.min5.4.4.js"
        ></script>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>

```

## JS 压缩

从 `Webpack4` 开始，默认情况下使用 `terser` `压缩生产环境下的输出结果。Terser` 是一款兼容 `ES2015 +` 的 `JavaScript` 压缩器。与 `UglifyJS`（许多项目的早期标准）相比，它是面向未来的选择。有一个 `UglifyJS` 的分支—— `uglify-es`，但由于它不再维护，于是就从这个分支诞生出了一个独立分支，它就是 `terser`。

```
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            // 压缩js
            new TerserPlugin({
                test: /\.(jsx|js)$/,
                extractComments: true,
                parallel: true,
                cache: true
            })
        ]
    },
};
```

## CSS 压缩

`Webpack` 4.0 以后，官方推荐使用 `mini-css-extract-plugin` 插件来打包 `CSS` 文件。

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [MiniCssExtractPlugin.loader]
            }
        ]
    },
};
```

# FAQ

### Ant Design 无法加载

请确保加载顺序，`Moment、Polyfill` 放在 `Ant Design` 前面加载

### MobX 无法加载

`MobX` 引入 `mobx.umd.min.js` `库，mobx-react` 需要引入

# package.json

```
{
    "name": "webpack",
    "version": "1.0.0",
    "private": true,
    "main": "index.js",
    "dependencies": {
        "antd": "^3.26.20",
        "babel-eslint": "^10.0.3",
        "babel-loader": "^8.0.0",
        "babel-plugin-import": "^1.13.0",
        "babel-plugin-react-css-modules": "^5.2.6",
        "bizcharts": "^3.5.8",
        "china-division": "^2.3.1",
        "compression-webpack-plugin": "^3.0.1",
        "copy-webpack-plugin": "^5.1.1",
        "css-loader": "^3.2.0",
        "eslint": "^6.8.0",
        "eslint-config-prettier": "^6.11.0",
        "eslint-config-standard": "^14.1.0",
        "eslint-loader": "^3.0.4",
        "eslint-plugin-import": "^2.20.0",
        "eslint-plugin-promise": "^4.2.1",
        "eslint-plugin-react": "^7.17.0",
        "eslint-plugin-standard": "^4.0.1",
        "html-webpack-plugin": "^3.2.0",
        "less": "^3.8.1",
        "less-loader": "^5.0.0",
        "lint-staged": "^10.0.8",
        "mini-css-extract-plugin": "^0.8.0",
        "mobx": "^5.13.1",
        "mobx-react": "^5.4.4",
        "optimize-css-assets-webpack-plugin": "^5.0.1",
        "pre-commit": "^1.2.2",
        "progress-bar-webpack-plugin": "^1.12.1",
        "react": "^17.0.0",
        "react-dom": "^17.0.0",
        "speed-measure-webpack-plugin": "^1.3.1",
        "style-loader": "^1.2.1",
        "terser-webpack-plugin": "^2.2.1",
        "trtc-js-sdk": "^4.6.7",
        "viewerjs": "^1.5.0",
        "webpack": "^4.41.2",
        "webpack-bundle-analyzer": "^3.6.0",
        "webpack-cli": "^3.3.10",
        "webpack-dev-server": "^3.10.1"
    }
}
```

# 最终效果

打包体积：

![5381605008681_ pic](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fe2853c7aaa4168b4cb6a964e70d4c5~tplv-k3u1fbpfcp-zoom-1.image)

打包体积由原先 **2.1M** 变成了 **882KB**，可以说效果非常巨大。

包依赖：

![5441605062491_ pic_hd](https://user-images.githubusercontent.com/16217324/98758900-c64add00-240a-11eb-9cf2-ef9eb99e8a8d.jpg)

`Ant Design、TRTC、Mobx` 这些库也没了

编译速度：

```
SMP  ⏱
General output time took 10.67 secs

 SMP  ⏱  Plugins
HtmlWebpackPlugin took 1.69 secs
BundleAnalyzerPlugin took 0.091 secs
CopyPlugin took 0.011 secs
MiniCssExtractPlugin took 0.003 secs
OptimizeCssAssetsWebpackPlugin took 0.002 secs
DefinePlugin took 0.001 secs
ContextReplacementPlugin took 0 secs

 SMP  ⏱  Loaders
_babel-loader@8.1.0@babel-loader took 8.26 secs
  module count = 277
_babel-loader@8.1.0@babel-loader, and
_eslint-loader@3.0.4@eslint-loader took 7.18 secs
  module count = 86
_css-loader@3.6.0@css-loader, and
_less-loader@5.0.0@less-loader took 1.94 secs
  module count = 28
modules with no loaders took 0.728 secs
  module count = 12
_file-loader@5.1.0@file-loader took 0.392 secs
  module count = 17
_style-loader@1.3.0@style-loader, and
_css-loader@3.6.0@css-loader, and
_less-loader@5.0.0@less-loader took 0.052 secs
  module count = 28
_html-webpack-plugin@3.2.0@html-webpack-plugin took 0.026 secs
  module count = 1
```

编译速度由原先 **38.3 secs**（实际编译速度大概 15 秒左右），减少到 **10.67 secs**（实际编译速度 10 秒左右）。

# 国内外公共 CDN 地址

- [BootCDN](https://www.bootcdn.cn/)
- [cdnjs](https://cdnjs.com/)

# 参考资料

- [Webpack Guidebook](https://tsejx.github.io/webpack-guidebook/)
- [Webpack 核心知识有哪些？](https://mp.weixin.qq.com/s/g9n7RIMldSDl-1XPlZRJKg)

# 博客

[博客](https://github.com/xuya227939/LiuJiang-Blog)
