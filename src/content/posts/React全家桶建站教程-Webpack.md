---
title: React全家桶建站教程-Webpack
pubDate: 2018-06-08 09:47:55
categories: ["React"]
description: ""
---

## 介绍

打包工具，时下流行。

## 例子

https://github.com/xuya227939/blog/tree/master/examples/webpack/my-app

## 安装

```
$ sudo npm install -g create-react-app //全局安装的话，需要权限，所以使用sudo
$ create-react-app my-app
$ cd my-app

$ npm install webpack         //安装webpack包
$ npm install webpack-cli   //脚本
$ npm install html-webpack-plugin       //生成html插件
$ npm install extract-text-webpack-plugin@next   //抽离css，ant的css代码体积非常大，这样抽离之后，减少了代码体积。
$ npm install babel-preset-es2015   //预先加载es6编译的相关模块，这个软件包已被弃用，但并不影响使用。
$ npm install babel-preset-react      //编译react
$ npm install babel-preset-stage-3  //这个看你想要支持什么语法了，就选择0-3的其中一种。
$ npm install babel-plugin-transform-class-properties   //此插件转换es2015静态类属性以及使用es2016属性初始值设定项语法声明的属性。
$ npm install style-loader        //将css插入页面
$ npm install file-loader          //文件打包
$ npm install babel-loader     //转化es6代码
$ npm install babel-polyfill    //如果想使用 new Set()，Object.assign语法，就得用到它
$ npm install babel-plugin-import  //支持import 引入插件
$ npm install webpack-dev-server  //提供web服务
```

觉得麻烦？两条命令搞定 1.`$ npm install webpack  webpack-cli html-webpack-plugin babel-preset-es2015 babel-preset-react babel-preset-stage-3 babel-plugin-transform-class-properties style-loader file-loader babel-loader babel-polyfill babel-plugin-import webpack-dev-server`

2.`$ npm install extract-text-webpack-plugin@next`
这个得单独安装下，不能一起安装，因为这种 `$ npm install extract-text-webpack-plugin` 方式安装的版本是 3.0.2 与 4.12.0 版本的 webpack 不兼容

## 使用

1.在根目录下，新建 webpack.config.js 文件并写入下面代码

```
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");   //引入对应插件
module.exports = {
  devtool: 'source-map',       //模式选择，这里选择原始代码，因为开发环境不需要去混淆代码。
  mode: 'development',        //环境区分，是开发环境development还是生产环境production
  entry: ['babel-polyfill', './src/index.js'],   //入口文件
  output: {
    filename: '[name].js',    //输出文件
    hashDigestLength: 7,   //hash值设置
    path: path.resolve(__dirname, 'build')         //输出文件路径
  },
  module: {
    rules: [
      {
        //匹配js或jsx文件进行编译转换
        test: /\.js|jsx$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'babel-preset-env', 'stage-3'],
            plugins: [["transform-class-properties"],["import",{ "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]]
          }
        }
      },
      {
        //匹配css文件，进行抽离css
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
       //匹配图片
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          'file-loader'
        ]
      },
      {
       //匹配字体
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    //输出特定的html文件
    new HtmlWebpackPlugin({
      title: 'my-app',
      template: 'public/index.html'
    }),
    //抽离的css文件名
    new ExtractTextPlugin({
      filename: '[name].css'
    }),

    new webpack.NamedModulesPlugin()    //当开启 HMR 的时候使用该插件会显示模块的相对路径
  ],
  devServer: {      //虚拟服务器
    hot: false,        //热模块更新作用。即修改或模块后，保存会自动更新 true开启，false关闭
    historyApiFallback: true,         //如果为 true ，页面出错不会弹出 404 页面
    compress: true      //如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用
  }
};

```

2.修改 public/index.html
把 link 屏蔽

```
<!-- <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
 <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico"> -->
```

3.修改 package.json
把 scripts 下的 ` "start": "react-scripts start",` 替换为 `"start": "webpack-dev-server --open --config webpack.config.js",`

4.npm start

## 问题处理

- 如果提示这个错误 Cannot find module 'webpack/bin/config-yargs'，可能是 Webpack 与 webpack-dev-server 版本不兼容导致，我是安装了 `$ npm install webpack-dev-server@3.1.3` 版本解决的。webpack 版本是 4.12.0

- 特别要注意下这个插件 extract-text-webpack-plugin，`$ npm install extract-text-webpack-plugin` 这种方式安装的版本是 3.0.2，与 4.12.0 版本的 webpack 不兼容，所以需要安装它的^4.0.0-beta.0 版本。`$ npm install extract-text-webpack-plugin@next`，即可。

- Unknown plugin "import" specified in "base" at 1, attempted to resolve relative to 如果遇到这个错，请确保你安装了 babel-plugin-import，如果没有，则安装下 `$ npm install babel-plugin-import`

- Failed to decode param '/%PUBLIC_URL%/favicon.ico' 如果报这个错的话，先把 public/index.html 页面的 Link 屏蔽了。

- Module build failed (from ./node_modules/babel-loader/lib/index.js) Cannot find module 'babel-core' ，如果报这个错的话，则 `$ rm -rf node_modules/` `$ npm i` 重新安装下，再 `$ npm start`

## 想知道如何区分生产 or 开发环境？如何压缩 js 代码？如何打包代码发布吗？

~~https://github.com/xuya227939/ak47~~

## 欢迎在此 issue 下进行交流、学习

## 结语

webpack 还是简单易学的。
