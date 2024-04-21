---
title: 【从前端入门到全栈】Node.js之大文件分片上传
pubDate: 2023-06-18 21:46:46
categories: ["从前端入门到全栈"]
description: ""
---

## 从前端入门到全栈-系列介绍

1. 你会学到什么？

可能学不到什么东西，该系列是作者本人工作和学习积累，用于复习

2. 作者介绍

江辰，前网易高级前端工程师

3. 系列介绍

现在的 Web 前端已经离不开 Node.js，我们广泛使用的 Babel、Webpack、工程化都是基于 Node 的，各个互联网大厂也早已大规模落地 Node 项目。因此，想要成为一名优秀的前端工程师，提升个人能力、进入大厂，掌握 Node.js 技术非常有必要。

Node.js 不仅可以用来完善手头的开发环境，实现减少代码和 HTTP 请求，降低网页请求消耗的时间，提升服务质量。还可以扩展前端工程师的工作领域，用作 HTTP 服务，让前端也能完成一部分后端的工作，减少对后端的依赖，降低沟通成本，提升开发效率。

而且，Node.js 和浏览器的 JavaScript 只是运行时环境不同，编程语言都是 JavaScript ，所以掌握 Node.js 基础对前端工程师来说并不难，难点在于应用。由于浏览器的 JavaScript 主要是负责内容呈现与交互，而 Node.js 应用领域包括工具开发、Web 服务开发和客户端开发，这些都与传统的 Web 前端领域不一样，用来应对不同的问题。

4. 适宜人群

- 对 Node.js 感兴趣的 JavaScript 程序员
- 希望拓展知识边界，往全栈方向发展的前端工程师

## 定义

> 分片上传是把一个大的文件分成若干块，一块一块的传输，这样做的好处就是在文件上传/下载过程中，遇到不可抗力，比如网络中断，服务器异常，或者其他原因导致操作中断；再次操作时，可以从已经上传/下载的部分开始继续上传/下载未完成的部分，而没有必要从头开始上传/下载。

## 步骤

**前端部分**

1. 首先，我们需要使用 `HTML` 的 `File API`，通过 `input` 标签获取用户上传的大文件。
2. 使用 `slice` 方法将大文件分割成若干个小文件块，即分片。
3. 再使用 `fetch` 或 `axios` 等方法向服务器发送 POST 请求，上传文件的分片。

**后端部分**

1. 使用 `express` 或类似的框架接收前端上传的文件分片。
2. 将接收到的文件分片保存到服务器的一个临时位置。
3. 图所接收到所有的文件分片后，将这些分片合并成一个完整的文件。

## 流程图

![无标题-2023-03-19-0835](https://github.com/xuya227939/blog/assets/16217324/8686c839-1474-44c1-9836-5848f143a201)

## 实现

```javascript
import React, { useState } from "react";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      // 没有文件则直接返回
      return;
    }

    // 以1MB为一个分片
    const blockSize = 1024 * 1024 * 1;
    const fileSize = file.size;

    let start = 0;
    let end = blockSize;

    while (start < fileSize) {
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk, file.name);

      // 分片上传
      await axios.post("/upload", formData);

      start = end;
      end = start + blockSize;
    }

    // 合并
    await axios.get(`/merge?filename=${file.name}`);
  };

  const onChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="file" onChange={onChange} />
      <button type="submit">上传</button>
    </form>
  );
};

export default FileUploader;
```

```javascript
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const app = express();

app.post("/upload", upload.single("file"), (req, res) => {
  const chunk = req.file; // 获取上传的文件分片
  const { originalname } = req.file;
  const chunkDirPath = path.resolve(__dirname, "chunks");
  const chunkPath = path.resolve(chunkDirPath, originalname);

  // 如果 chunks 文件夹不存在，就创建一个
  if (!fs.existsSync(chunkDirPath)) {
    fs.mkdirSync(chunkDirPath);
  }

  // 将文件分片保存到 chunks 文件夹下
  fs.renameSync(chunk.path, chunkPath);

  res.sendStatus(200);
});

app.get("/merge", (req, res) => {
  const { filename } = req.query;
  const chunkDirPath = path.resolve(__dirname, "chunks");
  const filePath = path.resolve(__dirname, "files", filename);

  fs.readdirSync(chunkDirPath).forEach((chunkPath) => {
    // 读取每一个文件分片，然后将它们一起写入一个新文件，完成合并
    fs.appendFileSync(
      filePath,
      fs.readFileSync(path.resolve(chunkDirPath, chunkPath))
    );
    // 合并后删除文件分片
    fs.unlinkSync(path.resolve(chunkDirPath, chunkPath));
  });

  // 删除用于保存文件分片的文件夹
  fs.rmdirSync(chunkDirPath);

  res.sendStatus(200);
});

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
```

**请注意这是一种简化的实现，无法处理有些复杂情况，如并发上传，断点续传，错误恢复等。如果你需要这些功能，可能需要引入更完善的库或服务，如 tus-js-client，Plupload，Resumable.js 或 UpChunk。**

## 需要注意的点

**1. 上传进度：** 用户上传大文件时，提供一个进度条可以改善用户体验。你可以使用 XMLHttpRequest 或 Fetch 的 API 获得正在上传的进度信息，并实时展示。

**2. 错误处理和重试：** 你需要处理可能会发生的错误，比如网络问题或者服务器错误。为了避免用户再次上传文件，可以实现重试机制，当某个分片上传失败时，可以重新上传这个分片。

**3. 并发控制：** 如果你一次上传多个分片，可能会消耗大量的用户网络带宽。你需要控制同时上传分片的数量，比如使用 Promise.all。

**4. 断点续传：** 用户在上传大文件时，可能会中断，比如网络连接可能会断开，或者用户关闭了页面。你可以实现断点续传，让用户可以在重新打开页面时，继续上次的上传，而不需要从头开始。通常需要后台支持，记录已经上传的分片。

**5. 安全性：** 文件上传是一个重要的安全问题，你应该检查并限制用户上传的文件类型，防止上传恶意文件。同时，你应该在服务器端再次检查文件。

## 总结

文章同步更新平台：掘金、CSDN、知乎、思否、博客，公众号（野生程序猿江辰）
我的联系方式，v：Jiang9684，欢迎和我一起学习交流

完
