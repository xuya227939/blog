---
title: Node.js 爬虫获取网页内容乱码
pubDate: 2019-08-08 09:47:41
categories: ["Node.js"]
description: ""
---

## 返回的 html 乱码

网页内容格式是 GBK 和头部用 gzip 压缩，设置属性`gzip: true`和`encoding:null`，再通过 iconv 转成 utf8

```
npm install request
npm install iconv-lite
```

```
const request = require('request');
const iconv = require('iconv-lite');
const options = {
        url: `http://xxxx`,
        proxy: 'http://127.0.0.1:8888',
        secureProtocol: 'TLSv1_method',
        gzip: true,
        encoding: null
    };
request.get(options, function (err, response, data) {
        const result = iconv.decode(data, 'utf-8').toString();
        console.log(result);
});
```

## 返回参数乱码

去掉 encoding 参数即可

```
const request = require('request');
const iconv = require('iconv-lite');
const options = {
        url: `http://xxxx`,
        proxy: 'http://127.0.0.1:8888',
        secureProtocol: 'TLSv1_method',
        gzip: true
    };
request.get(options, function (err, response, data) {
        console.log(data.toString());
});
```

如果头部没有压缩过的，去掉 gzip 参数，然后再把返回的参数`data.toString()`一下
