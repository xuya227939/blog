---
title: Ubuntu 下安装 WeChat
pubDate: 2024-03-14 16:50:19
categories: ["Ubuntu", "Wechat"]
description: ""
---

## 背景

工作电脑上装了 Ubuntu 系统，如何安装微信成了问题。目前业界主流有两种方案，[参考 Ubuntu 安装微信的两种方法
](https://www.yydnas.cn/2023/08/2023.08.16-Ubuntu%E5%AE%89%E8%A3%85%E5%BE%AE%E4%BF%A1%E7%9A%84%E4%B8%A4%E7%A7%8D%E6%96%B9%E6%B3%95/index.html)，我选择的是 Wine 安装方式，但 BUG 太多了（比如无法正常截图，表情无法正常显示，无法放入图片等等），无奈，看看 Linux 社区有没有微信发行版

最近 WeChat 新版本现已上架统信应用商店，UOS 用户可直接在统信应用商店搜索“微信（Universal）”下载体验！（支持 AMD64/ARM/Loongarch 三大主流架构）

本次微信（Universal）UOS 版是基于原生跨平台方案开展的一次大型版本重构与更新，以提高软件功能开发与迭代速度，旨在逐步实现微信 Windows/Mac/Linux 版本在功能与更新节奏保持一致。

什么？ WeChat 发行了 Linux Beta 版？（第三方发布的）

## 安装

开始尝试

[beta 安装地址](https://aur.archlinux.org/packages/wechat-beta-bwrap)

```
// 安装下载的软件包
$ sudo dpkg -i bf103d215f344e4e8d0e17a7a37eebe8.deb
```

安装过程中，出现错误，碰到了 `deepin-elf-verify >= 1.2.0`，`libssl >= 1.1.0`，两个软件版本要求版本号

```
(正在读取数据库 ... 系统当前共安装有 226651 个文件和目录。)
准备解压 e3546883de40401381ecd621a74d0cfe.deb  ...
正在解压 com.tencent.weixin (2.1.5) 并覆盖 (2.1.5) ...
dpkg: 依赖关系问题使得 com.tencent.weixin 的配置工作不能继续：
 com.tencent.weixin 依赖于 deepin-elf-verify (>= 1.1.1-1)；然而：
  软件包 deepin-elf-verify 尚未配置。

dpkg: 处理软件包 com.tencent.weixin (--install)时出错：
 依赖关系问题 - 仍未被配置
正在处理用于 mailcap (3.70+nmu1ubuntu1) 的触发器 ...
正在处理用于 gnome-menus (3.36.0-1ubuntu3) 的触发器 ...
正在处理用于 desktop-file-utils (0.26-1ubuntu3) 的触发器 ...
正在处理用于 hicolor-icon-theme (0.17-2) 的触发器 ...
正在处理用于 libc-bin (2.35-0ubuntu3.6) 的触发器 ...
在处理时有错误发生：
 com.tencent.weixin
```

1. 解决 deepin-elf-verify

[deepin-elf-verify.deb](https://mirrors.bfsu.edu.cn/deepin/pool/main/d/deepin-elf-verify/)

2. 解决 libssl

[libssl1.1-udeb_1.1.1f-1ubuntu2_amd64.udeb](http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/)

更新下两个软件的版本就行

安装完之后，就会有相应的图标

![](https://files.mdnice.com/user/27515/9a8f3add-28fc-4380-938b-7293758bd6ff.jpg)

## 使用

微信扫码之后，TM 反复登录，我屌！！！随后报错，有朋友能告诉我如何解决吗？

![](https://files.mdnice.com/user/27515/1a004c5d-0a67-4641-ae29-dc65f953abc6.jpg)

## 总结

cnm 张一龙

文章同步更新平台：掘金、CSDN、知乎、思否、博客，公众号（野生程序猿江辰）
我的联系方式，v：Jiang9684，欢迎和我一起学习交流

完
