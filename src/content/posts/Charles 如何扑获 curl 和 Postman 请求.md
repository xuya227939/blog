---
title: Charles 如何扑获 curl 和 Postman 请求
pubDate: 2019-06-24 22:44:56
categories: ["React"]
description: ""
---

## Curl 请求如何设置

### 终端设置代理

```
$ export https_proxy=http://127.0.0.1:8888
$ export http_proxy=http://127.0.0.1:8888
```

### 取消终端代理

```
$ unset http_proxy
$ unset https_proxy
```

### Charles Proxy 设置

输入端口

![image](https://user-images.githubusercontent.com/16217324/60028211-85e1a680-96d1-11e9-96c0-fa3315b78f49.png)

### curl 发起请求

```
curl -X POST 127.0.0.1:8888 -H "Content-Type: application/x-www-form-urlencoded" -i https://ip:8118/mcpinterf/user/login -d "userId=45729907&imeiNo=99001123927671&simNo=89860315540101069256&pwd=eb4UecxU3vg9fgszuQqk7w..&loginFlag=0&timestamp=1560829091595" -k
```

### End

然后在 Charles 界面即可看到

## Postman 如何设置

打开 Postman 设置界面，然后进行代理设置，如下图。

![image](https://user-images.githubusercontent.com/16217324/60029480-ce9a5f00-96d3-11e9-8de8-7d23a1f5ff78.png)
