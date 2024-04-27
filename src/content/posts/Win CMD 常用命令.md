---
title: Win CMD 常用命令
pubDate: 2023-04-04 15:42:42
categories: ["Win", "CMD"]
description: ""
---

### 查看进程号

1. 输入端口查看

输入端口号，如 8080，查看对应得 pid 号

```
 netstat -aon | findstr 8080
```

2. 输入服务查看

```
tasklist | findstr nginx
```

### 杀掉进程

[/F] 强制删除

```
taskkill /F /pid 17416
```

### Nginx 启动命令

找到 Nginx 安装目录

```
start .\nginx.exe
```

### Nginx 停止命令

找到 Nginx 安装目录

```
 .\nginx.exe -s stop
```

### 文件夹无法删除

![image](https://user-images.githubusercontent.com/16217324/229761007-84dd0cce-6cef-4ec3-a213-fb78d14a51e2.png)

比如这种文件夹无法删除，提示需要管理员权限或要删除得文件夹不存在

通过新建记事本

```
DEL /F /A /Q \\?\%1
RD /S /Q \\?\%1
```

另存为 `del.bat` 可执行文件，通过把要删除得项目，拖拽到可执行文件中，即可删除
