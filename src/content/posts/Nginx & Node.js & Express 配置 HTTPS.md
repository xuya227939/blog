---
title: Nginx & Node.js & Express 配置 HTTPS
pubDate: 2018-06-25 17:19:07
categories: ["Nginx"]
description: ""
---

## 购买

以阿里云示例，免费 SSL 证书购买地址：https://common-buy.aliyun.com/?spm=5176.2020520163.cas.1.zTLyhO&commodityCode=cas#/buy
![image](https://user-images.githubusercontent.com/16217324/41887383-f4876ba0-7932-11e8-83ab-0386210b2957.png)

## 补全

![image](https://user-images.githubusercontent.com/16217324/41887438-27d7149c-7933-11e8-8472-c9fc41f4b7dc.png)

购买好证书之后，进行资料补全。 1.输入域名 2.填写资料 3.域名验证类型，选择 DNS 4.系统生成 CSR

## 下载

![image](https://user-images.githubusercontent.com/16217324/41887470-5606c998-7933-11e8-8c71-e9af1965c202.png)

补全好之后，进行下载证书

## Nginx 配置

1.在 nginx 目录下新增 cert 目录 2.把下载好的包上传至 cert 目录下 3.修改 nginx.conf，替换为以下内容

```
server {
    listen 443;
    server_name localhost;
    ssl on;
    root html;
    index index.html index.htm;
    ssl_certificate   cert/214799830030327.pem;      #访问的证书目录
    ssl_certificate_key  cert/214799830030327.key; #访问的证书目录
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location / {
        root html;
        index index.html index.htm;
    }
}
```

4.重启 nginx
5.https 访问您的站点。

## Node.js 配置

1.安装 node.js 2.编辑 web.js 内容

```
var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('213949634960268.key'),
    cert: fs.readFileSync('213949634960268.pem')
};
var a = https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(443);
```

3.启动
node web.js 4.访问您的站点

## Express 配置

1.修改 `/bin/www` 文件，写入以下代码

```
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('myapp:server');
var https = require('https');
const fs = require('fs');

/**
 * Get port from environment and store in Express.
 */

const options = {
    key: fs.readFileSync('/etc/nginx/cert/214799830030327.key'),
    cert: fs.readFileSync('/etc/nginx/cert/214799830030327.pem')
};

var port = normalizePort(process.env.PORT || '9000');
app.set('port', port);

/**
 * Create HTTP server.
 */

//var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);


var servers = https.createServer(options, app);


servers.listen(port);
servers.on('error', onError);
servers.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = servers.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
```

2.重新访问您的站点

## 示例

https://downfuture.com:9000/api/v1/getCard

## 遇到问题

配置好了，访问您的站点出现无法访问网站的报错，可能是安全组没有开放 443 端口。
