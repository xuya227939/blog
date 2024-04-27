---
title: pm2 The "data" argument must be of type string or an instance of Buffer 问题排查
pubDate: 2023-10-15 22:54:13
categories: ["PM2"]
description: ""
---

## 问题

```
pm2 The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received type number
```

## 解决

在本地运行 Node.js 发现并没有这个问题，后面随想可能是 PM2 启动的时候，路径查找不到

两个问题要解决：
1、PM2 版本过低，服务器上的 PM2 版本还是 2
通过 pm2 update 更新到了 5

2、每次上传大文件，Node.js 进程一定会挂

```
module.exports = {
 apps: [
     {
         watch: false,
     }
 ]
};
```

watch 设置为 false，即可解决
