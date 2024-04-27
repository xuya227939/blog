---
title: EventSource 引发的一系列事件
pubDate: 2023-04-25 16:51:18
categories: ["EventSource"]
description: ""
---

### 背景

大家好，我是江辰，最近小小的实现了下 chatGPT 的问答式回复，调研了前端如何实现这种问答式请求，有几种方案，Http、EventSource、WebSocket，三种实现方案各有优缺点，Http 和 WebSocket ，想必大家耳闻能详，这里我讲讲 EventSource

### EventSource

> EventSource 是服务器推送的一个网络事件接口。一个 EventSource 实例会对 HTTP 服务开启一个持久化的连接，以 text/event-stream 格式发送事件，会一直保持开启直到被要求关闭。

一旦连接开启，来自服务端传入的消息会以事件的形式分发至你代码中。如果接收消息中有一个事件字段，触发的事件与事件字段的值相同。如果没有事件字段存在，则将触发通用事件。

与 [WebSockets](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API),不同的是，服务端推送是单向的。数据信息被单向从服务端到客户端分发。当不需要以消息形式将数据从客户端发送到服务器时，这使它们成为绝佳的选择。例如，对于处理社交媒体状态更新，新闻提要或将数据传递到客户端存储机制（如 IndexedDB 或 Web 存储）之类的，EventSource 无疑是一个有效方案。

--- 引自 MDN

对比 WebSocket，它就是**简单，方便**，在特定的一些场景下，比如聊天消息或市场价格，这就是 EventSource 擅长的

#### 使用方式

它的使用方式极其简单

```
const evtSource = new EventSource('sse.php');
const eventList = document.querySelector('ul');

evtSource.onmessage = function(e) {
 let newElement = document.createElement("li");

  newElement.textContent = "message: " + e.data;
  eventList.appendChild(newElement);
}
```

对吧，几行代码搞定，如何携带参数，在 `new EventSource('sse.php?id=123');` 其中 `id=123`，就是我们要给链接传的参数

问题来了

![image](https://user-images.githubusercontent.com/16217324/235046901-e3a94d7e-20a3-4fdb-a666-bf24db31c069.png)

当我实现之后，发现它在不断的**自动重连**？搜了很多文档，想不通，为何会自动重连，这里伏笔。想不通，ok，我就换个思路，改用 Axios 实现

### axios

axios 实现如下

```
const streamToString = async (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data);
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks).toString('base64'))
    });
    readableStream.on("error", reject);
  });
}


axios({
  method: 'get',
  url:`//xxx/api/chat/stream?prompt=${textarea.current.value.trim()}`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  responseType: 'stream'
}).then(async res => {
  const raw = await streamToString(res.data);
})
```

此时还不知问题的**严重性！**实现完之后，发现不对劲啊，`readableStream.on is not a fucntion`，？？？（黑人问号脸），遂打印 log 看看输出的 `res.data` 是啥，字符串？根本不是一个方法啊，但看网上实现，是这样啊，没错？又看了几遍，都是这样实现的，很懵，直到看了下 axios 的 issue，[传送门](https://github.com/axios/axios/issues/479)，2016 年就有人提出了这个问题，也就是说 axios 在浏览器侧一直没有实现 steram，我内心 cnm，网上的文档都是假的！！！

也就是说，按照目前 MDN 说法，`responseType ` 支持的类型有，`arraybuffer、blob、document、json、text、ms-stream`，其中 `ms-stream`，此响应类型仅允许用于下载请求，并且仅受 Internet Explorer 支持

坑坑坑，又要开始了其他方案，想想 Fetch 能不能行，浏览器原生支持哦！

### Fetch

> [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的一些具体部分，例如请求和响应。它还提供了一个全局 [fetch()](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch) 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。

这种功能以前是使用 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 实现的。Fetch 提供了一个更理想的替代方案，可以很容易地被其他技术使用，例如 [Service Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)。Fetch 还提供了专门的逻辑空间来定义其他与 HTTP 相关的概念，例如 [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) 和 HTTP 的扩展。

--- 引自 MDN

利用 Fetch 实现了如下代码

```
const response = await fetch(`//xxx/api/chat/stream?prompt=${textarea.current.value.trim()}`);
const reader = response.body.getReader();

const eventList = document.querySelector('ul');
while (true) {
  const { value, done } = await reader.read();
  const utf8Decoder = new TextDecoder('utf-8');
  let data: any = value ? utf8Decoder.decode(value, {stream: true}) : '';
  try {
    data = JSON.parse(data)
    if (data.id || !data.content) {
      return
    }

    let newElement = document.createElement("li");
    newElement.textContent = "message: " + data.content;
    eventList.appendChild(newElement);
  } catch (e) {
  }
  if (done) {
    break;
  }
}
```

实现没有问题，在我电脑上也跑通了，能稳定接收服务端消息，不会自动重连，**万事大吉**，转交朋友试用
。。。。

交给朋友试用，反馈说，会出现回复不全？？？，调试搞起

浏览器侧接收的消息
![image](https://user-images.githubusercontent.com/16217324/235064685-7a527f0d-5e74-46ef-b350-e8b2844401dc.png)

抓包看的消息
![image](https://user-images.githubusercontent.com/16217324/235064723-f26b5c86-7c07-4fbd-861e-ad6f3a47cb75.png)

对比看，浏览器侧**丢包！丢包了！！！**几番排查下来，不知为何会丢包，而且是只有 Windows 上会丢包（必现），macOS 上不会，不懂了呀，我们自己测试 Win 下 ping 都是稳定的，有懂的同学，可以告知下，谢谢！

### 最终解决方案

又回到 EventSource，没错，又回来了，折腾下来发现，每次收完消息，你必须手动关闭下，`evtSource.close();`，才不会自动重连，而且自动重连就是 EventSource 的特性之一，害，伏笔解决了。这个关闭有个前提是，服务端下发字段告诉你，能关闭，你才能关闭哦，折腾啊！！！

### 总结

通过这次的学习，让我对 EventSource 以及 Fetch、Axios 有了一次深刻的认知，大家看完觉得还不错的话，欢迎点赞，收藏哦
文章同步更新平台：掘金、CSDN、知乎、思否、博客，公众号（野生程序猿江辰）
我的联系方式，v：Jiang9684，欢迎和我一起学习交流

完
