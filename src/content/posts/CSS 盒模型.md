---
title: CSS 盒模型
pubDate: 2018-07-23 15:20:49
categories: ["CSS"]
description: ""
---

## 盒模型

盒模型分 IE 盒模型(怪异盒模型)和 W3C 盒模型，属性分别是 margin、border、padding、content，两者的区别在于，IE 盒模型：`width=content + padding + border`，而 w3c 盒模型：`width=content`，这个和现实当中的盒子比较类似，所以称之为盒模型。w3c 在 CSS3 中新增了一个属性,box-sizing。包含两个属性：`content-box`和`border-box`。`content-box：width=width`，`border-box：width=content+padding+border`
