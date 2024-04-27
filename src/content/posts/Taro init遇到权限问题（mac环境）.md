---
title: Taro init遇到权限问题（mac环境）
pubDate: 2020-10-26 14:21:27
categories: ["React", "Taro"]
description: ""
---

## 问题描述

Taro init 遇到没有权限创建项目，具体报错如下：

```
(node:71338) UnhandledPromiseRejectionWarning: Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/@tarojs/cli/templates/taro-temp'
(node:71338) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:71338) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

## 解决办法

`$ sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`
