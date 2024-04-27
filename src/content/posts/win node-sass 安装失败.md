---
title: win node-sass 安装失败
pubDate: 2023-03-24 15:34:18
categories: ["node-sass"]
description: ""
---

> 事件起因是由于最近在看一块业务代码，用到了 Vue + 装饰器，业务代码很庞大，很复杂，出于原子化原则，先从简单的 Demo 看起，随即从 GitHub 上拉了一个模板代码下来看看，git clone, yarn ，yarn 安装依赖，报错，发现是 node-sass 安装失败，这玩意确实很难安装，主要是不兼容 Python3 ，记录下解决流程

### 报错提示

1. Can't find Python executable "python"

   报找不到 python 命令，从官网下载 python, [Python2.7](https://www.python.org/download/releases/2.7/)，注意，这里要看下你的 node-sass 版本是多少的，对应 python2.7 还是 python3.x，找到自己的电脑所属版本，比如 win64, win32, macOS 等

2. gyp ERR! stack Error: `C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe`

   第二步蛮复杂的，Win 上缺少相关的编译环境，先运行 `npm install -g node-gyp`，然后运行 `npm install --global --production windows-build-tools` 可以自动安装跨平台的编译器，注：第二句执行下载好 msi 文件卡着不懂不安装 ， 手动去对应的目录底下安装一下 在执行一边。

3. Node Sass version 8.0.0 is incompatible with ^4.0.0 版本不兼容

   安装的依赖版本不对，安装了 node-sass 高版本，重新手动安装下低版本

### 相关链接

1. https://blog.csdn.net/zeroheitao/article/details/112545324
2. https://proustibat.medium.com/how-to-fix-error-node-sass-does-not-yet-support-your-current-environment-os-x-64-bit-3.with-c1b3298e4af0
3. https://stackoverflow.com/questions/37415134/error-node-sass-does-not-yet-support-your-current-environment-windows-64-bit-w
4. https://www.zhaojun.ink/archives/node-sass-install
5. https://www.python.org/download/releases/2.7/
