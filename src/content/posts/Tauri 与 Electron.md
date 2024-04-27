---
title: Tauri 与 Electron
pubDate: 2022-04-05 23:36:26
categories: ["Tarui", "Electron"]
description: ""
---

# Tauri

## 什么是 Tauri ?

> Tauri 是一个为所有主流桌面平台构建小型、快速二进制文件的框架。开发人员可以集成任何编译成 HTML、 JS 和 CSS 的前端框架来构建他们的用户界面。应用程序的后端是一个 Rust 二进制文件，具有前端可以与之交互的 API。

## 安装方式

### Xcode

```
$ xcode-select --install
```

### Rust

```
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装过程中如果报错 `curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused`

需要开启代理：

```
# 7890 和 789 需要换成你自己的代理端口
$ export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:789
```

要确保 Rust 已成功安装，请运行以下命令

```
$ rustc --version

$rustc 1.59.0 (9d1b2106e 2022-02-23)
```

### 启动一个新的 Tauri

```
$ yarn create tauri-app
```

创建项目的时候，如果报错 `An unexpected error occurred: "https://registry.yarnpkg.com/create-vite: tunneling socket could not be established`

同样的，需要开启代理，使用：

```
$ yarn config set proxy http://username:password@host:port
$ yarn config set https-proxy http://username:password@host:port
```

按照说明选择您喜欢的 `Web` 前端框架，`create-tauri-app` 根据您的输入创建模板项目，之后你可以直接去检查 `tauri info`

### 启动

```
$ yarn tauri dev
```

### 打包

```
$ yarn tauri build
```

# Electron

## 什么是 Electron ?

> Electron 框架允许您使用 JavaScript、HTML 和 CSS 编写跨平台的桌面应用程序。它基于 Node.js 和 Chromium，并被 Atom 编辑器和许多其他应用程序使用。

## 安装方式

### 创建项目

```
$ mkdir my-electron-app && cd my-electron-app
$ yarn init
```

修改 `package.json`，"main" 字段为 `main.js`，你的 `package.json` 应该是如下样子：

```
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Jiang Chen",
  "license": "MIT"
}
```

### Electron

```
$ yarn add --dev electron
```

执行 `Electron`。在 `package.json` 配置字段 `scripts`，添加 `start` 如下命令

```
{
  "scripts": {
    "start": "electron ."
  }
}
```

### 根目录新增 main.js

代码如下

```
// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

### 根目录新增 index.html

代码如下

```
<!--index.html-->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.

    <!-- You can also require other files to run in this process -->
    <script src="./renderer.js"></script>
  </body>
</html>
```

### 根目录新增 renderer.js

代码如下

```
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

```

### 启动

```
$ npm run start
```

### 打包

#### 添加 Electron Forge 作为应用程序的开发依赖项

```
$ cnpm install --dev @electron-forge/cli
$ npx electron-forge import
```

#### make 使用 Forge 的命令创建一个打包

```
$ yarn run make
```

# 两者区别

1. 大小对比

- Electron 官方介绍有提到，它基于 Node.js 和 Chromium，很明显的问题，包太大（62.5mb）使用 Chromium 的决定，也是解决 WebView 暂时无法解决的一些兼容性问题
- Tauri，前端是通过系统的 WebView2，后端使用 Rust，包很小（4.32MB）

2. 官方文档

- Electron 官方文档和社区迭代，目前比较稳定，发布了多个版本，可以稳定在生产使用

- Tauri 作为一款新型桌面端开发框架，1.0.0 版本暂时未出，可以持续关注，尝试做些小工具

# 总结

Tauri 作为一款新型桌面端开发框架，踩在了 Rust 和 WebView2 的两位巨人的肩膀上，可以说是时代的产物，Rust 近几年非常受欢迎，Deno 采用 Rust，微软拥抱 Rust 等，微软又开始推广 WebView2，天然的优势

# 结语

如果你觉得这篇内容对你挺有启发，别忘记点赞 + 关注

欢迎添加我的个人微信：Jiang9684，备注昵称 + [岗位或专业]，实例 Faker-前端，通过更快噢，一起交流前端技术
