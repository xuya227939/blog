---
title: 前端如何支持PDF、Excel、Word在线预览
pubDate: 2018-12-27 15:54:14
categories: ["前端", "Excel", "Word"]
description: ""
---

## 注意一下几点：

- url 必须经过 encodeURIComponent 转移，且是能够打开的文件域名。
- 谷歌文件在线预览，必须使用代理，各种文件都支持。
- 不想用代理，可以用微软这个，但是微软这个，不支持最新的 xlsx 格式，xls 格式可以。
- 谷歌格式：https://docs.google.com/viewer?url=[url]
- 微软格式：https://view.officeapps.live.com/op/view.aspx?src=[url]

## 例子(Word)

```
谷歌：
https://docs.google.com/viewer?url=http%3A%2F%2Fsruserfiletest.oss-cn-hangzhou.aliyuncs.com%2Fcrm%2Fcc604886ae8d4be9afffab02313d646d.docx%3FExpires%3D1545898717%26OSSAccessKeyId%3DLTAIm573A7RmsqeQ%26Signature%3DVOaSsvyYy9f%252BF6R1GcSnCG%252BaVI4%253D

微软：
https://view.officeapps.live.com/op/view.aspx?src=http%3A%2F%2Fsruserfiletest.oss-cn-hangzhou.aliyuncs.com%2Fcrm%2Fcc604886ae8d4be9afffab02313d646d.docx%3FExpires%3D1545898717%26OSSAccessKeyId%3DLTAIm573A7RmsqeQ%26Signature%3DVOaSsvyYy9f%252BF6R1GcSnCG%252BaVI4%253D
```

## 例子(Excel)

```
谷歌：
https://docs.google.com/viewer?url=http%3A%2F%2Fsruserfiletest.oss-cn-hangzhou.aliyuncs.com%2Fcrm%2F981f08e66ffa4f64934b37e543f5700b.xlsx%3FExpires%3D1545898717%26OSSAccessKeyId%3DLTAIm573A7RmsqeQ%26Signature%3DFgItdsB%252BPrm2%252BOQShja1HkfqKyY%253D

微软：
https://view.officeapps.live.com/op/view.aspx?src=http%3A%2F%2Fsruserfiletest.oss-cn-hangzhou.aliyuncs.com%2Fcrm%2F981f08e66ffa4f64934b37e543f5700b.xlsx%3FExpires%3D1545898717%26OSSAccessKeyId%3DLTAIm573A7RmsqeQ%26Signature%3DFgItdsB%252BPrm2%252BOQShja1HkfqKyY%253D
```

## PDF

window.open([url])
