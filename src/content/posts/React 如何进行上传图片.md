---
title: React 如何进行上传图片
pubDate: 2018-06-15 16:16:03
categories: ["React"]
description: ""
---

## 标签

```
<input
 id="upload-file"
 accept="image/*"
 type="file"
 ref="upload"
 hidden="hidden"
 onChange={this.upload.bind(this, 1)}
/>
```

`input` //标签的 type 设置为 file 属性
`accept` //属性，支持很多类型，这里设置为只上传图片
`hidden` //隐藏文字，做下面这种效果的时候，就需要隐藏文字。
![image](https://user-images.githubusercontent.com/16217324/41458033-0f9a7d52-70b8-11e8-9037-ca6443298f97.png)
onChange //上传完成后的回调

## JS 代码

```
upload() {
    let files;
    files = this.refs.upload.files
    let count = files.length;
    let formData = new FormData();
    for (let i = 0; i < count; i++) {
        files[i].thumb = URL.createObjectURL(files[i]);
        formData.append('filedata', files[i]);
    }
}
```

这里主要是通过 `this.refs.upload`来获取上传之后的文件，然后通过`createObjectURL` 静态方法创建一个 `DOMString`(mac 测试通过 input 上传过来`webkitRelativePath` 是空的)，然后追加进 formData。再通过`send(body: formData)`方法传进后端

## 后端

```
const express = require('express');
const multiparty = require('multiparty');
const gm = require('gm').subClass({
    imageMagick: true
});
const fs = require('fs');
router.put(`uploadImages`, function (req, res) {
    let datas = {};
    if (!(fs.existsSync('./images/'))) {
        fs.mkdir('./images/', function (err, status) {

        });
    }
    const form = new multiparty.Form({
        uploadDir: './images/'
    });
    form.parse(req, function (err, fields, files) {
        const filesTmp = files.filedata;
        if (err) {
            throw err;
        } else {
            const relPath = filesTmp;
            for (let i in relPath) {
                gm(relPath[i].path)
                    .resize(240, 240)
                    .noProfile()
                    .write(relPath[i].path, function (err, data) {
                        if (err) {
                            throw err;
                        }
                        console.log(data);
                    });
            }
        }
    });
});
```

后端用的是 node.js，express 框架。fs 模块，来进行判断是否存在该文件夹，如果不存在，则创建。
`fs.existsSync()` 返回值为 true or false `fs.mkdir()` 创建文件夹 multiparty 模块来解析 form 表单
gm 进行裁剪图片。

## 错误处理

1、`Error: unsupported content-type`

这个错误是因为你的 content-type 设置错了，设置成`multipart/form-data`即可。

2、设置完成之后，还是不行。
去掉`headers`的设置
`body: formData` //body 的内容为表单内容

3、上传一次图片之后，无法上传第二次，是因为 value 此时有值，没有进行清空处理，在上传成功回调里，进行`e.target.value = '';`
