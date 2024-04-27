---
title: Webpack 如何配置代理
pubDate: 2021-06-10 09:22:49
categories: ["Webpakc"]
description: ""
---

## 前言

`Webpack` 提供的 `devServer` 配置，使我们可以非常方便的设置请求代理目标，通过改配置，有时候可以帮我们解决本地环境的跨域问题。

## 正向代理

当拥有单独的 `API` 后端开发服务器并且希望在同一域上发送 `API` 请求时，代理某些 `URL` 可能会很有用。

webpack.dev.js

```
devServer: {
    // ...
    proxy: {
        '/api2': {
            target: 'http://192.168.10.183:8103',
            changeOrigin: true
        }
    }
},
```

axios：

```
axios({
    baseURL: '/api2/',
    url: '/user/login',
    method: 'GET'
})
```

配置 `proxy`，本地环境中的请求，以 `/api` 开头的，都会把请求代理转发到 `target` 目标中，但是在浏览器中查看 `network`，发现请求依旧没有改变，实际上可以看到控制台打印或看后端 `log`，请求已经转发。

![image](https://user-images.githubusercontent.com/16217324/122594087-24265e00-d099-11eb-974c-b46412e4c127.png)

`proxy`，仅针对本地环境有效，对线上环境无效，一般线上环境是通过 `Nginx` 做转发。

## 反向代理

当需要对域名进行校验，比如企业微信或微信公众号的一些可信域名配置，需要通过域名来访问，会非常有用。

编辑你的本地 hosts，是本地转发到指定域名，这里不要带端口号，如果有端口号，输入域名的时候，带上端口号。

```
127.0.0.1	order.downfuture.com
```

![B A CLATTE zsx-test ikandy cn8080commonIndex html#userlogin](https://user-images.githubusercontent.com/16217324/122594621-d3fbcb80-d099-11eb-9e61-08a44d01ea6b.png)

如果访问报这个错误，需要在

```
devServer: {
    // ...
    disableHostCheck: true
},
```

配置完之后，本地启动开发服务，输入域名和端口号跳转页面，则可以看到修改了，受缓存影响，最好用无痕浏览器噢。
