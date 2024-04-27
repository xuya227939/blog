---
title: PhantomJS not found on PATH
pubDate: 2019-05-06 16:02:32
categories: ["PhantomJS"]
description: ""
---

今天 Win 上进行`npm install`的时候遇到一个问题

```
PhantomJS not found on PATH
Downloading https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-windows.zip
Saving to C:\Users\hezhi\AppData\Local\Temp\phantomjs\phantomjs-2.1.1-windows.zip
Receiving...
  [=---------------------------------------] 2%
```

这个 phantomjs-2.1.1-windows.zip 包一直下载不了，原来是天朝的网给墙了。

[http://phantomjs.org/download.html](http://phantomjs.org/download.html) 通过这个网址进行下载对应的包

把包放进此路径下`C:\Users\hezhi\AppData\Local\Temp\phantomjs\`(Win)

解压，然后复制 phantomjs 所在的路径`C:\Users\hezhi\AppData\Local\Temp\phantomjs\phantomjs-2.1.1-windows\phantomjs-2.1.1-windows\bin`

再设置环境变量，添加刚才复制的路径。
![image](https://user-images.githubusercontent.com/16217324/57213064-3ad3dd00-7018-11e9-81ad-f873201c364a.png)
