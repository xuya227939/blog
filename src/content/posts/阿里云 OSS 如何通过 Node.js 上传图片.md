---
title: 阿里云 OSS 如何通过 Node.js 上传图片
pubDate: 2019-03-29 11:45:46
categories: ["阿里云"]
description: ""
---

```
const multiparty = require('multiparty');
require('../../conf/util.js');
require('../../conf/oss.js');
const fs = require('fs');
const fsE = require('fs-extra');

global.router.put(`${global.api}uploadAvatar`, function (req, res) {
    let datas = {};
    const {
        account,
        avatar
    } = req.session;
    if (!(fs.existsSync(global.location + account))) {
        fs.mkdir(global.location + account);
    }
    const form = new multiparty.Form({
        uploadDir: global.location + account
    });
    form.parse(req, function (err, fields, files) {
        let filesTmp = files.filedata;
        filepath = filesTmp[0].path;
        const img = filesTmp[0].path.split('/')[2];
        const result = put(filepath, account, img);
        result.then((value) => {
            if (value.res.statusCode === 200) {
                let updateSql = 'UPDATE users SET avatar = ? WHERE account = ?;';
                let newAvatar = `//img.downfuture.com/${account}/${img}-avatar2`;
                req.getConnection(function (err, conn) {
                    conn.query(`${updateSql}`, [newAvatar, account], function (err, result) {
                        unlinkFile(account);
                        if (avatar.indexOf('user.png') == -1) {
                            let bucket = avatar.split('/')[3] + '/' + avatar.split('/')[4];
                            deleteFile(bucket.split('-')[0]);
                        }
                        req.session.avatar = newAvatar;
                        datas.avatar = newAvatar;
                        datas.code = 200;
                        res.json(datas);
                    });
                });
            } else {
                unlinkFile(account);
                // fix:错误回参不对，需要给到具体报错参数
                datas.avatar = '//img.downfuture.com/images/user.png';
                datas.error = value;
                datas.code = 500;
                res.json(datas);
            }
        });
    });
});

function unlinkFile(account) {
    fsE.remove(global.location + account);
}

async function deleteFile(bucket) {
    try {
        const result = await ossClient.delete(bucket);
    } catch (err) {
        console.error(err);
    }
}

async function put(filepath, account, img) {
    try {
        let result = await ossClient.put(`${account}/${img}`, filepath);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = global.router;
```
