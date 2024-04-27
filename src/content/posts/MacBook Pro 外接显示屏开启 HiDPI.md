---
title: MacBook Pro 外接显示屏开启 HiDPI
pubDate: 2021-06-25 19:29:35
categories: ["HiDPI"]
description: ""
---

## 前言

最近向公司申请了一台 2K 显示器，弄来之后，接上 MacBook Pro，结果，由于像素太高，导致整个屏幕都缩放，字体变的非常小，而且也没有达到 Retina 的效果。经查询，苹果需要开启 HiDPI 技术

## HiDPI

本质上是用软件的方式实现单位面积内的高密度像素。用四个像素点来表现一个像素，因此能够更加清晰细腻

高 PPI(硬件) + HiDPI 渲染(软件) = 更细腻的显示效果(Retina)

<img width="640" alt="WechatIMG2168" src="https://user-images.githubusercontent.com/16217324/123499689-13fb1980-d66b-11eb-8f33-b473d58ef351.png">

## 获取外接显示器 DisplayVendorID 和 DisplayProductID

在终端输入以下命令：

```
$ ioreg -l | grep "DisplayVendorID"

$ ioreg -l | grep "DisplayProductID"
```

如果获得两个，那说明的你的 Macbook 还在亮着，可以合盖来排除掉

## 制作外接显示屏系统配置文件

### 转换 16 进制

将 DisplayVendorID 和 DisplayProductID 的数值，转换为 16 进制，[在线转换工具](https://tool.lu/hexconvert/)

### 创建显示器配置文件夹

新建文件夹，命名为：DisplayVendorID-XXXX，其中 XXXX 是刚才转换的 DisplayVendorID 的 16 进制值小写

### 创建显示器配置内容

这里需要借助工具来生成，[在线生成工具](https://codeclou.github.io/Display-Override-PropertyList-File-Parser-and-Generator-with-HiDPI-Support-For-Scaled-Resolutions/)，将显示器的名称、DisplayVendorID（16 进制） 和 DisplayProductID（16 进制） 对应填写进去，即可获得配置文件，下载文件到刚创建的 DisplayVendorID-XXXX 文件夹内，将 plist 的后缀去掉

![WechatIMG2169](https://user-images.githubusercontent.com/16217324/123499686-0c3b7500-d66b-11eb-96be-234022b2c651.png)

然后需要将文件放到系统的 `/System/Library/Displays/Contents/Resources/Overrides/` 文件夹中

如果 `Overrides` 没有权限操作，在终端中输入

```
$ csrutil status
```

![WechatIMG2170](https://user-images.githubusercontent.com/16217324/123499683-05acfd80-d66b-11eb-843e-a70b6fc736f8.png)

如果是关闭状态，则需要开启

### 开启 rootless

1. 重启 MacBook，按住 command + R 直到屏幕上出现苹果的标志和进度条，进入 Recovery 模式
2. 在屏幕左上方的工具栏找到实用工具（左数第 3 个），打开终端
   ```
   $ csrutil disable
   ```
3. 重启 MacBook

### 关闭 rootless

1. 重启 MacBook，按住 command + R 直到屏幕上出现苹果的标志和进度条，进入 Recovery 模式
2. 在屏幕左上方的工具栏找到实用工具（左数第 3 个），打开终端
   ```
   $ csrutil disable
   ```
3. 重启 MacBook

如果已关闭 rootless，还是不行，那么需要在终端输入以下命令：

```
$ sudo mount -rw /
```

Tips:

1. 10.15 之后，系统的目录除了几个 rootless 可以修改的，都是只读的，所有对系统的修改都不支持，你的那个目录是在只读分区内的。要是写机器域的文件，在/Library 目录中操作。

2. macOS 有个内核保护机制 rootless，有时候你需要装什么软件时，需要一些 root 权限，但是在 macOS 上 root 虽然权力是最大的，但是苹果还是限制了它一下。

## 开启 HiDPI

[one-key-hidpi](https://github.com/xzhih/one-key-hidpi/blob/master/README-zh.md)

此脚本的目的是为中低分辨率的屏幕开启 HiDPI 选项，并且具有原生的 HiDPI 设置，不需要 RDM 软件即可在系统显示器设置中设置

macOS 的 DPI 机制和 Windows 下不一样，比如 1080p 的屏幕在 Windows 下有 125%、150% 这样的缩放选项，而同样的屏幕在 macOS 下，缩放选项里只是单纯的调节分辨率，这就使得在默认分辨率下字体和 UI 看起来很小，降低分辨率又显得模糊

同时，此脚本也可以通过注入修补后的 EDID 修复闪屏，或者睡眠唤醒后的闪屏问题，当然这个修复因人而异

开机的第二阶段 logo 总是会稍微放大，因为分辨率是仿冒的

### 使用方法

1. 远程模式: 在终端输入以下命令回车即可

```
$ bash -c "$(curl -fsSL https://raw.githubusercontent.com/xzhih/one-key-hidpi/master/hidpi.sh)"
```

2. 本地模式: 下载项目解压,双击 `hidpi.command` 运行

![WechatIMG2171](https://user-images.githubusercontent.com/16217324/123499664-ec0bb600-d66a-11eb-85cb-524aff4757ef.jpeg)

![WechatIMG2172](https://user-images.githubusercontent.com/16217324/123499670-f5951e00-d66a-11eb-9a74-99e150806caa.jpeg)

## RDM

RDM 全称为 Retina Display Manage，[安装地址](http://avi.alkalay.net/software/RDM)

重启后打开 RDM，选取带雷电符号的 1920x1080，即可开启 HiDPI。

![WechatIMG2173](https://user-images.githubusercontent.com/16217324/123499675-fc239580-d66a-11eb-8731-5fe3a320558f.png)

## 总结

![src=http___2d zol-img com cn_product_123_500x2000_269_cew9IvrLCwGQY jpg refer=http___2d zol-img com](https://user-images.githubusercontent.com/16217324/123500068-e06dbe80-d66d-11eb-814b-1780aea939ff.jpeg)
