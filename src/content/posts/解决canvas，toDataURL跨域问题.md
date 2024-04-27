---
title: 解决canvas，toDataURL跨域问题
pubDate: 2020-04-05 23:03:45
categories: ["Canvas"]
description: ""
---

## 图片服务器需要配置 Access-Control-Allow-Origin

设置通配符，允许任何域名访问

```
header("Access-Control-Allow-Origin: *");
```

指定域名

```
header("Access-Control-Allow-Origin: www.xxx.com");
```

此时，Chrome 浏览器不会有 Access-Control-Allow-Origin 相关的错误信息，但是，还会有其他的跨域错误信息。

## HTML crossOrigin 属性解决资源跨域问题

在 HTML5 中，有些元素提供了`CORS(Cross-Origin Resource Sharing)`属性，这些元素包括<img>，<video>，<script>等，而提供的属性名就是 crossOrigin 属性。

因此，上面的跨域问题可以这么处理：

```
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    resolve(canvas.toDataURL());
};
img.src = url;
```

其中，只要`crossOrigin`的属性值不是`use-credentials`，全部都会解析为 anonymous，包括空字符串。

## url 加时间戳，清空缓存

如果上面还是没有解决跨域问题，那么要考虑图片是否被浏览器缓存住了。

没有加时间戳的请求

![image](https://user-images.githubusercontent.com/16217324/78502895-06235500-7796-11ea-85a7-a21076268933.png)

加上时间戳的请求
![94630f5b463e7c0db0c2b04d978b6a7](https://user-images.githubusercontent.com/16217324/78502902-150a0780-7796-11ea-9f2c-625bf6da8051.png)

因此，代码可以这么写

```
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.crossOrigin = 'Anonymous';
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    resolve(canvas.toDataURL());
};
img.src = url + '?time=' + new Date().valueOf();
```
