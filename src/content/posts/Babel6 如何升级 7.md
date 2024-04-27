---
title: Babel6 如何升级 7
pubDate: 2019-06-05 13:25:00
categories: ["Babel"]
description: ""
---

## Babel

```
$ npm install babel-upgrade -g
$ babel-upgrade --write
```

然后会发现 package.json 依赖包，自动给转换到了最新版。

![image](https://user-images.githubusercontent.com/16217324/58931894-117fab80-8794-11e9-8dee-67a3abb6d498.png)

Babel7 新增了`babel.config.js`，这里我没有用到，所以还是选择使用`.babelrc`文件。
最终配置如下

```
{
    "presets": [
        [
            "@babel/env",
            {
                "targets": {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1"
                },
                "useBuiltIns": "usage"
            }
        ],
        [
            "@babel/preset-react",
        ],
    ],
    "plugins": [
        ["@babel/plugin-proposal-class-properties"],
        ["@babel/plugin-transform-runtime"],
        ["@babel/plugin-syntax-import-meta"],
        ["@babel/plugin-syntax-dynamic-import"],
        ["@babel/plugin-proposal-json-strings"],
        [
            "import", {
                "libraryName": "antd",
                "libraryDirectory": "es",
                "style": "css",
            }
        ],
    ]
}

```

这里引入了`Ant`，解决`Ant`按需加载

```
[
    "import", {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css",
    }
],
```

Webpack 配置如下

```
module: {
    rules: [
        {
            test: /\.js|jsx$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
        },
    ],
},
```

遇到的坑

![image](https://user-images.githubusercontent.com/16217324/58932163-2741a080-8795-11e9-85ef-984d2db54afb.png)

无法识别`JSX`语法，因为在`.babelrc`文件中没有引入`@babel/preset-react`

完美升级 babel7
