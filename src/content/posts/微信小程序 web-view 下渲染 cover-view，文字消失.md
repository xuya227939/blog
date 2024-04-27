---
title: 微信小程序 web-view 下渲染 cover-view，文字消失
pubDate: 2021-09-26 11:16:37
categories: ["微信小程序"]
description: ""
---

## 问题背景

上半年最开始做的一版是展业大厅页面和互动白板页面（以下统称 web-view）分离，后面由于腾讯那边对交互方式不满意，强调一定要展业大厅页面和白板页面在同一个页面进行交互，最开始我们没有思路，因为在小程序官方中的描述，web-view 页面不允许叠加任何组件，后面是产品找到一个 demo，发现可以叠加，我这边去翻了下他们的源码（renderingMode: 'seperated'），最终解决了该问题，也就导致后面很多问题的产生。

## 现有问题

### web-view 存在的情况

1. 安卓更新组件不生效，比如 tab 切换，tab1 切换到 tab2 ，不生效，内容不会更新

2. 安卓更新图片不生效

3. 安卓更新样式不生效

4. cover-view 文字消失

5. 按钮响应慢，机型性能低的手机比较明显

针对问题 2，目前的 hack 方案，先渲染一张透明的图片，然后再渲染其他图片，可以生效

针对问题 1、2、3，仅在安卓端出现，苹果手机上没有发现，目前有一个比较 hack 的方案，通过卸载组件，重新渲染，可以达到目的，但是产生的性能损耗比较大，对交互体验不友好，而且也导致了第四点问题的产生

针对问题 4 安卓复现频率比较高，苹果出现过一次

针对问题 5 安卓跟苹果都存在

### web-view 不存在的情况

都正常

## 尝试过的方案

针对 cover-view 文字消失

- 设置组件宽高
- 设置字体颜色和背景颜色
- 刷新

以上方案，都不行，也没法在开发者工具上查看 DOM 视图

### console

![WechatIMG13](https://user-images.githubusercontent.com/16217324/134792081-a01ea541-d204-400a-96e1-09edf9c95ff8.jpeg)

元素的宽高都在，偏移位置也正常，就是文字消失

### DOM

<img width="1024" alt="WechatIMG3085" src="https://user-images.githubusercontent.com/16217324/134792083-682f9111-ea88-43a6-a90d-dd5357baf446.png">

无法在开发者工具上查看 DOM 视图

## 现象

### 正常

![WechatIMG20](https://user-images.githubusercontent.com/16217324/134792087-47a6e113-fd23-4da0-b60c-c412c00a1bb4.jpeg)

### 文字消失

![WechatIMG19](https://user-images.githubusercontent.com/16217324/134792095-d09471ef-d4e6-468b-9b86-473120d61a76.jpeg)

这个元素的宽高都在，就是文字消失

## 微信小程序架构图

![WechatIMG3201](https://user-images.githubusercontent.com/16217324/134792105-ee98881e-38b0-4a5a-81b8-8d169ea68093.jpeg)

## 展业小程序架构图

![mini](https://user-images.githubusercontent.com/16217324/134792107-093c03ef-7fff-49fe-b56c-b777ebfca044.png)
