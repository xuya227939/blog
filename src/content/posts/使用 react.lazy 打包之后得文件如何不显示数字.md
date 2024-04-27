---
title: 使用 react.lazy 打包之后得文件如何不显示数字
pubDate: 2019-06-28 13:17:10
categories: ["React"]
description: ""
---

## 解决方法

```
/* webpackChunkName: "name"*/' '文件路径'
const Chart = lazy(() => import(/* webpackChunkName: "chart"*/'./pages/Chart/index'));
```
