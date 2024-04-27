---
title: ERR_SSL_PROTOCOL_ERROR
pubDate: 2019-05-12 20:15:52
categories: ["ERR_SSL"]
description: ""
---

起因是因为阿里云机器快要到期了，然后重新买了台低配的机器，在上面跑我的服务。根据快照直接进行创建，发现新机器和老机器的数据一摸一样，这功能真舒服，根据自定义镜像创建机器。购买完毕，启动服务。然后就遇到了下面这个问题

![image](https://user-images.githubusercontent.com/16217324/57581972-d6ba8880-74f1-11e9-8cf3-c27d0fa62827.png)

- 尝试 Google、百度解决方法，发现没有跟我一样的。
- 尝试重新申请 SSL 证书和重新配置 Nginx SSL 也是一样。
- 实在没辙，下午先放着了，晚上再解决。

到了晚上，查看了下 9000 端口占用情况，发现正常。

![image](https://user-images.githubusercontent.com/16217324/57582015-5c3e3880-74f2-11e9-87e7-7df938115799.png)

把 PM2 进程管理给停止，然后重新 npm start，发现可以正常访问了，刺激！

然后怀疑跟 PM2 有关系，一直使用的是`pm2 start all`以为开启了，才发现 all 其实是管理。

需要重新`pm2 start ./bin/www --watch` 一下才行。

![image](https://user-images.githubusercontent.com/16217324/57582054-bb03b200-74f2-11e9-96c7-555ffdf86e15.png)

还有可能就是证书无效了，重新配置下证书。
