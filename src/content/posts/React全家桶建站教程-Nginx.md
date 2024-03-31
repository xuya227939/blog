---
title: React全家桶建站教程-Nginx
pubDate: 2018.06.07
categories: ["React"]
description: ""
---

## 介绍

- 轻量级，同样起 web 服务，比 apache 占用更少的内存及资源
- 抗并发，nginx 处理请求是异步非阻塞的，而 apache 则是阻塞型的，在高并发下 nginx 能保持低资源低消耗高性能
- 高度模块化的设计，编写模块相对简单
- 社区活跃，各种高性能模块出品迅速

## 例子

https://github.com/xuya227939/blog/tree/master/examples/nginx

## 安装

本地：`$ brew install nginx`
ECS(CentOs 系统)：`$ yum install nginx` 如果没有机器的话，现在有活动噢！学生好像可以每个月 10 块购买机器。
https://promotion.aliyun.com/ntms/act/group/team.html?group=9Az1ljXGL5

## 配置

1.清空 nginx 的默认配置项

- `$ 本地：cd /usr/local/etc/nginx/`
- `$ ECS：cd /etc/nginx/`
- `$ echo ''->nginx.conf`
- `$ vim nginx.conf` //好像 mac 需要安装 vim 命令，忘了。如果没有的话，安装一下或者使用 `$ vi nginx.conf`

  2.写入代码

```
events {
  worker_connections 1024;    #默认最大的并发数为1024
}
http {
  include             mime.types;     #设定mime类型,类型由mime.type文件定义
  default_type        application/octet-stream;   #默认返回值
  server {
    listen       2000 default_server;         #监听端口
    root         /Users/jiang/Desktop/WorkSpace;    #要访问的html文件所在目录
    access_log  logs/access.log;    #成功日志
    error_log logs/error.log;            #失败日志
    index index.html index.php;    #默认找寻文件
    location / {                              #访问2000端口的重定向
      root /Users/jiang/Desktop/WorkSpace;   #重定向访问的html文件所在目录
      try_files $uri /index.html;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header Host $host;
      index index.html index.htm index.php;
    }
    error_page 404 /404.html;
      location = /40x.html {
    }
    error_page 500 502 503 504 /50x.html;
      location = /50x.html {
    }
  }
}
```

`:wq // 保存并退出`

3.开启
`$ sudo nginx` 开启  
`open() "/usr/local/Cellar/nginx/1.15.0/logs/access.log" failed (2: No such file or directory)` 如果报了类似这样的错，说明该目录下没有文件。需要创建。

- `$ cd /usr/local/Cellar/nginx/1.15.0` //进入该目录
- `$ mkdir logs && chmod 777 logs` //创建 logs 目录并赋予最高权限组
  然后 sudo nginx 开启，访问 [http://localhost:2000/](http://localhost:2000/)，如果报 500，查看错误日志。
  `$ tail -f /usr/local/Cellar/nginx/1.15.0/logs/error.log`
  `/Users/jiang/Desktop/WorkSpace/index.html" failed (13: Permission denied)` 如果遇到这个问题的话
  nginx 没有权限访问该日志，需要赋予最高权限 `chmod 777  /Users/jiang/Desktop/WorkSpace && chmod 777 /Users/jiang/Desktop/WorkSpace/index.html`

  3.访问[http://localhost:2000/](http://localhost:2000/)

## 命令

1.Mac 上操作 nginx

- `$ sudo nginx -s reload` //刷新 nginx，每次修改完 nginx，默认不生效的，需要刷新才行。
- `$ sudo nginx` //开启 nginx
- `$ sudo nginx -s stop` //停止 nginx

  2.CentOs 上操作 nginx

- `$ service nginx start` //开启 nginx
- `$ service nginx stop` //停止 nginx
- `$ service nginx restart` //重启 nginx
- `$ service nginx reload` //刷新 nginx

## ECS 机器上配置 nginx

```
user nginx;
worker_processes auto;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;
events {
  worker_connections 1024;
}
http {
  gzip on;
  gzip_min_length 1k;
  gzip_buffers   4 16k;
  gzip_comp_level 2;
  gzip_types   text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/jpg image/gif image/png;
  gzip_vary on;
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
  sendfile            on;
  tcp_nopush          on;
  tcp_nodelay         on;
  keepalive_timeout   65;
  types_hash_max_size 2048;
  include             /etc/nginx/mime.types;
  default_type        application/octet-stream;
  include /etc/nginx/conf.d/*.conf;
  server {
    listen       80 default_server;
    server_name  localhost;
    root         /data/sight/build;
    include /etc/nginx/default.d/*.conf;
    access_log  /data/logs/access.log  main;
    error_log /data/logs/error.log;
    index index.html index.php;
    location ~ .*\.(gif|jpg|png)$ {
      access_log on;
      expires 30d;
      root /data/images/;#指定图片存放路径
      client_max_body_size    10m;
      client_body_buffer_size 1280k;
    }
    location ~* ^.+\.(eot|ttf|otf|woff|svg)$ {
      access_log off;
      expires max;
    }
    location / {
      root /data/sight/build;
      try_files $uri /index.html;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header Host $host;
      index index.html index.htm index.php;
    }
    error_page 404 /404.html;
      location = /40x.html {
    }
    error_page 500 502 503 504 /50x.html;
      location = /50x.html {
    }
  }
}
```

多了个图片服务器和开启了 gzip 压缩。

## 欢迎在此 issue 下进行交流、学习

## 结语

看完之后，是不是觉得特别简单，容易上手？只需要你编写下简单指令和块指令即可。
