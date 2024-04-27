---
title: React全家桶建站教程-Express
pubDate: 2018-06-07 11:37:22
categories: ["React"]
description: ""
---

## 介绍

- 丰富的 HTTP 快捷方法和任意排列组合的 Connect 中间件，让你创建健壮、友好的 API 变得既快速又简单。
- Express 是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。

## 例子

https://github.com/xuya227939/blog/tree/master/examples/express/myapp

## 安装

```
$ sudo npm install express-generator -g  //因为是在mac下安装的，所以要注意权限问题，使用sudo
$ express myapp  //通过express生成器，生成项目
$ cd myapp
$ npm i   //安装相关依赖
$ npm install compression  //安装compression  压缩请求
$ npm start  //开启
```

访问 [http://localhost:3000](http://localhost:3000)

## 使用

在 app.js 中使用如下代码

```
  const compression = require('compression');
  app.use(compression());
```

```
app.use('/', function(req, res) {
  const count = 24;
  // const count = req.body.count;
  let listData = [];
  for (let i = 0; i < count; i++) {
    listData.push({
      src: '',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      title: `Title Jiang ${i}`,
      description:'Rise n’ shine and don’t forget to smile',
      star: i * 2,
      like: i * 3
    });
  }
  let data = {};
  data.listData = listData;
  data.count = count;
  res.send(JSON.stringify(data));
});
```

在 app.js 中替换 app.use('/users', indexRouter); 即可，然后 npm start 访问下[http://localhost:3000](http://localhost:3000) 就会看到输出了。

## 更新代码

通过 npm start 开启之后，你会发现你修改代码之后，刷新没有效果？这是因为 npm start 不支持动态更改代码，这时候就需要 supervisor 来管理 node 进程

```
$ npm install supervisor
$ supervisor bin/www
```

然后试试？
线上的话，通过 pm2 管理。
`$yum install pm2 `
在根目录下新建 start.json `$ vim start.json`
输入以下代码

```
{
   "apps" : [{
        "name"        : "app",
        "script"      : "bin/www",
        "log_date_format"  : "YYYY-MM-DD HH:mm:SS",
        "log_file"   : "logs/success.log",
        "error_file" : "logs/error.log",
        "out_file"   : "logs/out.log",
        "pid_file"   : "logs/app.pid",
        "watch"      :  true
    }]
}
```

`$ :wq` //保存并退出

## pm2 常用命令

- `$ pm2 start start.json` //进行启动，帮你管理 node 进程。
- `$ pm2 stop all` //停止所有应用。
- `$ pm2 restart all` //重启所有应用。
- `$ pm2 log` //查看应用日志。

## 欢迎在此 issue 下进行交流、学习

## 结语

~~https://github.com/xuya227939/m4a1~~ 可以参考这个项目。
通过 express 框架，建立后端服务速度还是蛮快的。简单方便，适合初学者入门。
