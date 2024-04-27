---
title: 关于 TRTC (实时音视频通话模式)的实践
pubDate: 2019-09-17 13:49:35
categories: ["TRTC"]
description: ""
---

本文首发于微信公众号：野生程序猿江辰

欢迎大家点赞，收藏，关注

## 什么是 TRTC

腾讯实时音视频（Tencent Real-Time Communication，TRTC）将腾讯 21 年来在网络与音视频技术上的深度积累，以多人音视频通话和低延时互动直播两大场景化方案，通过腾讯云服务向开发者开放，致力于帮助开发者快速搭建低成本、低延时、高品质的音视频互动解决方案。

---

## TRTC 流程图

![](https://files.mdnice.com/user/27515/6f70c232-65d3-4a95-a218-28fdabbc5734.png)

## 加入房间

### 创建流

```
this.client = TRTC.createClient({
    mode: 'videoCall',
    sdkAppId,
    userId,
    userSig
});
```

- mode: 实时音视频通话模式，设置为`‘videoCall’`，互动直播模式，设置为 `'live'`
- sdkAppId: 您从腾讯云申请的 `sdkAppId`
- userId: 用户 ID，随机生成，一个房间内不允许重复的 `userId`
- userSig: 用户签名，基于后台算法生成，防盗刷

### 加入

```
this.client
    .join({ roomId })
    .catch(error => {
        console.error('进房失败 ' + error);
    })
    .then(() => {
        console.log('进房成功');
    });
```

- roomId：后台生成的房间 Id，不能重复

## 发布本地流

### 本地推流

```
this.localStream = TRTC.createStream({ userId: this.userId, audio: true, video: true });
```

- userId: 用户 ID，随机生成，一个房间内不允许重复的 `userId`
- audio: 是否从麦克风采集音频
- video: 是否从摄像头采集视频

### 初始化本地音视频流

```
this.localStream
    .initialize()
    .catch(err => {
        console.error('初始化本地流失败 ' + error);
    })
    .then((res) => {
        console.log('初始化本地流成功');
        this.localStream.play('localVideo');
    });
```

- localVideo: 绑定的 `div id`

### 发布

```
this.client
    .publish(this.localStream)
    .catch(err => {
        console.error('本地流发布失败 ' + error);
    })
    .then((res) => {
        console.log('本地流发布成功');
    });
```

- 本地流发布成功之后，可以注册本地推流函数，每三秒执行一次，处理异常情况。

## 订阅远端流

### 远端流增加

```
this.client.on('stream-added', event => {
    this.remoteStream = event.stream;
    //订阅远端流
    this.client.subscribe(this.remoteStream);
});
```

### 远端流订阅

```
this.client.on('stream-subscribed', event => {
    console.log('log', 'onRemoteStreamUpdate：' + event);
    this.remoteStream = event.stream;
    this.id = this.remoteStream.getId();
    const remoteVideoDom = document.querySelector('#remoteVideo');
    if(!document.querySelector(`#remoteStream-${this.id}`)) {
        const div = document.createElement('div');
        div.setAttribute('style', 'position: absolute; right: 0; left: 0; top: 0; width: 100%; height: 100%');
        div.setAttribute('id', `remoteStream-${this.id}`);
        remoteVideoDom.appendChild(div);
    }
    const videoLoading = document.querySelector('#video-loading');
    videoLoading.setAttribute('style', 'display: none;');
    // 播放远端流
    this.remoteStream.play(`remoteStream-${this.id}`);
});
```

可以在远端流监听成功之后，注册远端流状态变化函数，处理异常情况。

## 退出

### 取消发布本地流

```
this.client.unpublish(this.localStream)
    .catch((err) => {
        console.log('error', 'unpublish error：' + err);
    })
    .then((res) => {
        // 取消发布本地流成功
        console.log('log', 'unpublish error：' + res);
    });
```

### 退出房间

```
this.client.leave();
```

## 异常处理

### 本地流监听

```
// 每隔3秒获取本地推流情况
this.localTimer = setInterval(() => {
    this.client.getLocalVideoStats().then(stats => {
        for (let userId in stats) {
            console.log(new Date(), 'getLocalVideoStats', 'userId: ' + userId +
        'bytesSent: ' + stats[userId].bytesSent + 'local userId' + this.userId);
            if(this.userId == userId && stats[userId].bytesSent == 0) {
                this.onEvent('leave');
            }

            const bytesSentSR = (stats[userId].bytesSent - this.bytesSent) / 3000;

            if(this.userId == userId && bytesSentSR >= 20 && bytesSentSR <= 59) {

            }

            if(this.userId == userId) {
                this.bytesSent =  stats[userId].bytesSent;
            }
        }
    });
}, 3000);
```

- 可在本地流发布成功后，注册本地推流变化函数，处理异常情况
- bytesSent: 如果发送单位为 `0`，则表示本地断网
- 公式: 目前发送字节数 - 上一次发送字节数 / 3000

### 远端流监听

```
this.remoteTimer = setInterval(() => {
    this.client.getRemoteVideoStats().then(stats => {
        for (let userId in stats) {
            console.log('getRemoteVideoStats', 'userId: ' + userId +
        ' bytesReceived: ' + stats[userId].bytesReceived +
        ' packetsReceived: ' + stats[userId].packetsReceived +
        ' packetsLost: ' + stats[userId].packetsLost);
        }
    });
}, 3000);
```

- bytesReceived: 如果接受单位为 0，则表示对方断网
- 可在远端流监听成功之后，注册远端流状态变化函数，处理异常情况
- 公式: 目前接收字节数 - 上一次接收字节数 / 3000

目前通过 TRTC 的事件通知，搭配 `Socket`，能做到对异常处理有较好的支持。

## TRTC 兼容性

### Android(H5)

- 摄像头不匹配，比如，华为手机三个后置加一个前置，调用 `TRTC` 的获取摄像头接口，返回的却是 **6** 个，并且没有 `Label` 标注那个是后置，那个是前置，厂商问题，需要特殊适配。

- 必须使用微信游览器打开 `H5` 页面，其他游览器会偶尔崩溃以及其他问题(猜测微信游览器做了适配)。

- 华为 P30 部分机型，存在微信游览器环境下没有默认打开腾讯 `X5` 内核，需要进行特殊处理。打开方案：1、可以在手机设置、应用管理、微信、麦克风和摄像头权限重新开启。2、通过扫描 `X5` 内核开启二维码，引导开启。否则会发布流失败，因为 `X5` 内核关闭，导致没有权限获取。

- `TRTC` 对大部分机型能够有较好的支持。

### iOS(H5)

- 必须使用 `Safari` 游览器，其他游览器会出现各种问题。

- 需要用户手动触发播放，这时候需要在 `video` 组件上加上 `autoplay`、`muted`、`playsinline`、`controls`(SDK，4.0.0 版本以下)

```
<Video
    id="remoteVideo"
    autoplay
    muted
    playsinline
    controls
/>
```

- 切换前后置摄像头需要根据 `Label` 标签进行区分，获取前后置摄像头的 `deviceId`，切换流程如下:

  1、获取摄像头

  ```
      TRTC.getCameras().then(devices => {
          this.cameras = devices;
      });
  ```

  2、选择摄像头

  ```
  this.localStream.switchDevice('video', deviceId)
      .catch(err => {
          console.log('error', 'switchDevice error：' + err);
      })
      .then((res) => {
          console.log('log', 'switchDevice success' + res);
      });
  ```

### 小程序

- `React` 技术栈(我只使用了 `Taro`)能够支持视频播放，但推荐更好的 `Vue` 技术栈，因为 `Vue` 有官方封装的组件。

- 手机兼容性比较好，微信环境加持。

## 云端混流

```
request({
    url: `http://fcgi.video.qcloud.com/common_access?appid=${liveSign.appId}&interface=Mix_StreamV2&t=${liveSign.t}&sign=${liveSign.liveSign}`,
    method: 'POST',
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify(params)
}, (error, response, body) => {
    res.send({errCode: 0});
});
```

通过 `http://fcgi.video.qcloud.com/common_access` 接口，我们能够完美的监听房间内发生的情况，录制好的视频，会上传到腾讯的云点播平台，同时也支持客户自行导出。
