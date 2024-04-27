---
title: 使用 Sourcetree 提示需要输入密码
pubDate: 2019-06-10 11:30:47
categories: ["React"]
description: ""
---

![image](https://user-images.githubusercontent.com/16217324/59170575-e3261580-8b71-11e9-8610-0c9679a1ef54.png)
使用公司`GitLab`提交的时候，每次都需要输入密码

## 解决方案(mac)

### 命令行解决

输入以下命令
`git config --global credential.helper osxkeychain`
执行完成后，再次在 SourceTree 里面输入一下 GitLab 里面的密码。注意勾选选项“store password in keychain”。
这个时候，会跳出钥匙串的对话框，这个时候要输入的密码，是 mac 的开机密码。并且一定要勾选始终允许。否则，还是要一直跳出现在的这个登陆窗口了

![image](https://user-images.githubusercontent.com/16217324/59170661-41eb8f00-8b72-11e9-89bf-d9db9f437f9b.png)

### 还有一种就是 Keychain 中产生了冲突，使勾选失效

将已失效的 git.a. Access Key for git 删除，再次操作输入密码后新的密码就会存储在 Keychain，以后就不用每次远程操作都手动输入密码了

![image](https://user-images.githubusercontent.com/16217324/59170836-f2f22980-8b72-11e9-9765-0cfbf1631e3b.png)
