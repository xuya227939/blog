---
title: 解决如何知道iframe下载完成
pubDate: 2020-04-15 13:52:30
categories: ["iframe"]
description: ""
---

## 问题

当使用 iframe 作为文件下载的载体时，如何知道文件已经下载完毕，现有的 iframe 的`onload`方法具有兼容性问题，在 Chrome、IE 下无法监听`onload`事件监听文件下载完毕，因为`onload`事件本身也是对 iframe 中的 html 结构的加载进度监听。

```
const url = 'http://www.example.com/file.zip';
const iframe = document.createElement('iframe');
iframe.src = url;
iframe.style.display = 'none';
iframe.onload = function() {
    console.log('start downloading...');
    document.body.removeAttribute(iframe);
}
document.body.appendChild(iframe);
```

当 Chrome、IE 下时，如果 HTTP 文件头中包含 Content-disposition: attachment；即下载文件的链接的话，不会触发这个事件`onload`事件。

## 关于 Content-disposition

Content-disposition 是 MIME 协议的扩展，MIME 协议指示 MIME 用户代理如何显示附加的文件。Content-disposition 其实可以控制用户请求所得的内容存为一个文件的时候提供一个默认的文件名，文件直接在浏览器上显示或者在访问时弹出文件下载对话框。 Content-Disposition 为属性名 disposition-type 是以什么方式下载，如 attachment 为以附件方式下载 disposition-parm 为默认保存时的文件名服务端向客户端游览器发送文件时，如果是浏览器支持的文件类型，一般会默认使用浏览器打开，比如 txt、jpg 等，会直接在浏览器中显示，当代码里面使用 Content-Disposition 来确保浏览器弹出下载对话框的时候。 `response.addHeader(‘Content-Disposition’, ‘attachment’);`，一定要确保没有做过关于禁止浏览器缓存的操作。 代码如下: `response.setHeader(‘Pragma’, ‘No-cache’);response.setHeader(‘Cache-Control’, ‘No-cache’); response.setDateHeader(‘Expires’, 0); `不然会发现下载功能在 Opera 和 FireFox 里面好好的没问题，在 IE 下面就是不行。

## 解决 1：利用 Cookie

Nginx 配置如下：

```
add_header Set-Cookie "fileDownloaded=1; path=/;" always;
```

后端将文件下载进度放在 Cookie 中，通过轮询 Cookie 的方式，对文件下载进度进行获取，判断文件是否已经下载完毕。

```
let link = document.createElement('iframe');
link.src = '/your/file/path/name.zip';
link.style.display = 'none';
document.body.appendChild(link);

let timer = setInterval(() => {
    // 通过判断是否有这个cookie来确定是否下载完成
    if (Cookies.get('fileDownloaded')) {
        console.log('下载完成啦');
        clearInterval(timer);
        document.body.removeChild(link);
        Cookies.remove('fileDownloaded');
    }
}, 500);`
```

缺陷：

1. 需要后端配合
2. 如果客户端禁用了 Cookie，则该方案完全失效；在无痕浏览模式下，读取 Cookie，甚至代码报错。

## 解决 2：轮询监听 readyState

定时器轮询监听 readyState 的状态，如果是 complete 或者 interactive 说明文件加载完成。

```
let iframe = document.createElement('iframe');
iframe.src = path;
iframe.style.display = 'none';
document.body.appendChild(iframe);
const timer = setInterval(() => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (iframeDoc.readyState == 'complete' || iframeDoc.readyState == 'interactive') {
        document.body.removeAttribute(iframe);
        clearInterval(timer);
        resolve('success');
    }
}, 1000);
```

该种方法比较好，因为不需要后端进行配合，且不依赖与 Cookie 等变量带来的问题，且能实现我们的需求。
