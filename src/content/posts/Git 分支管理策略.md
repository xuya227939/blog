---
title: Git 分支管理策略
pubDate: 2021-01-06 18:16:04
categories: ["Git"]
description: ""
---

## 在 Git 中管理分支流程的主要方法

### Git Flow

`Git Flow` 最开始是由 Vincent Driessen 发行并广受欢迎，这个模型是在 2010 年构思出来的，而现在距今已有 10 多年了，而 `Git` 本身才诞生不久。在过去的十年中，`Git Flow` 在许多软件团队中非常流行。

### GitHub Flow

`GitHub Flow` 是由 `GitHub` 发行，并得到 Vincent Driessen 推荐，`GitHub Flow` 最近几年在社区非常流行。

它们都有一个特点，都是采用”功能驱动式开发”（Feature-driven development，简称 FDD），有兴趣的可以自行了解一下。

`GitHub Flow` 的较大优点就是简单，只有一个 `master` 分支为长期分支，对于需要”可持续性发布”的产品，可以说是最合适的流程。

## 分支命名规范

1. master 分支：`master` 分支只有一个，名称即为 `master`。GitHub 现在叫 main（保护黑人）

2. develop 分支：`develop` 分支只有一个，名称即为 `develop`

3. feature 分支：feature/<功能名>，例如：`feature/login`，以便其他人可以看到你的工作

4. hotfix 分支：hotfix/日期，例如：`hotfix/0104`

## 分支说明

1. master || main 分支：存储正式发布的产品，`master || main` 分支上的产品要求随时处于可部署状态。`master || main` 分支只能通过与其他分支合并来更新内容，禁止直接在 `master || main` 分支进行修改。

2. develop 分支：汇总开发者完成的工作成果，`develop` 分支上的产品可以是缺失功能模块的半成品，但是已有的功能模块不能是半成品。`develop` 分支只能通过与其他分支合并来更新内容，禁止直接在 `develop` 分支进行修改。

3. feature 分支：当要开发新功能时，从 master 分支创建一个新的 `feature` 分支，并在 `feature` 分支上进行开发。开发完成后，需要将该 `feature` 分支合并到 `develop` 分支，最后删除该 `feature` 分支。

4. release 分支：当 `develop` 分支上的项目准备发布时，从 `develop` 分支上创建一个新的 `release` 分支，新建的 `release` 分支只能进行质量测试、bug 修复、文档生成等面向发布的任务，不能再添加功能。这一系列发布任务完成后，需要将 `release` 分支合并到 `master` 分支上，并根据版本号为 `master` 分支添加 `tag`，然后将 `release` 分支创建以来的修改合并回 `develop` 分支，最后删除 `release` 分支。

5. hotfix 分支：当 `master` 分支中的产品出现需要立即修复的 bug 时，从 `master` 分支上创建一个新的 `hotfix` 分支，并在 `hotfix` 分支上进行 BUG 修复。修复完成后，需要将 `hotfix` 分支合并到 `master` 分支和 `develop` 分支，并为 `master` 分支添加新的版本号 `tag`，最后删除 `hotfix` 分支。

## 提交信息规范

提交信息应该描述“做了什么”和“这么做的原因”，必要时还可以加上“造成的影响”，主要由 **3** 个部分组成：`Header`、`Body` 和 `Footer`。

Header
Header 部分只有 1 行，格式为`<type>(<scope>): <subject>`。

type 用于说明提交的类型，共有 8 个候选值：

1. feat：新功能（feature）

2. fix：问题修复

3. docs：文档

4. style：调整格式（不影响代码运行）

5. refactor：重构

6. test：增加测试

7. chore：构建过程或辅助工具的变动

8. revert：撤销以前的提交

9. scope 用于说明提交的影响范围，内容根据具体项目而定。

subject 用于概括提交内容。

Body 省略

Footer 省略

## Fork

```
$ git clone http://git@github.com:xxx/LiveCenterMobile.git
```

`Fork` 出来的仓库完全属于你的，你可以任意修改该仓库的代码及配置，除非你向主库提交 `PR` 并被通过，你才可以将你 `Fork` 仓库修改的代码合并到主库，否则不会对主库产生任何影响。

在控制台输入 `git remote -v` 命令查看当前远端仓库的地址，输出如下

```
$ origin  http://git@github.com:xxx/LiveCenterMobile.git (fetch)
$ origin  http://git@github.com:xxx/LiveCenterMobile.git (push)
```

然后设置一个名字为 `upstream` 的上游地址，也就是项目主库的地址：

```
$ git remote add upstream http://git@github.com:fe/LiveCenterMobile.git
```

再次执行 `git remote -v` 控制台输出如下

```
$ origin  http://git@github.com:xxx/LiveCenterMobile.git (fetch)
$ origin  http://git@github.com:xxx/LiveCenterMobile.git (push)
$ upstream        http://git@github.com:fe/LiveCenterMobile.git (fetch)
$ upstream        http://git@github.com:fe/LiveCenterMobile.git (push)
```

设置这个的目的就是，当主库代码有更新，本地需要同步主库的代码，并及时更新到 `origin`（远端）仓库，保证自己托管空间下本地和远端仓库的代码都是最新的。

```
$ git fetch upstream （同步远端代码）
$ git checkout master
$ git merge upstream/master || git pull upstream master
```

然后本地仓库推送到远端（`origin`）仓库：

```
$ git push origin master
```

这个时候可以在本地进行开发了，通常我们规定：

开发新功能要从 `master` 分支上新建一个 `feat/[name-desc]` 临时分支
BUG 修复 从 `master` 分支新建一个 `hotfix/[name-desc]` 临时分支

## 新建 feat || hotfix 分支

```
$ git checkout -b feat/login master || git checkout -b feat/login
```

在 `feat/login` 分支进行功能迭代，提交代码到本地仓库，当功能开发完成之后，若有其他人在同一个项目上进行某功能的开发，那么在 `PUSH` 本地代码之前，检查 `feat/login` 分支是否落后于上游（`upstream`） `develop` 分支：

```
$ git checkout develop
$ git pull
$ git log feat/login..develop
```

如果没有输出任何提交信息的话，即表示 `feat/login` 分支 相对于 `develop` 分支是最新的。如果有输出的话去执行 `git merge --no-ff` ，提交路线图就会分叉，为了得到一个干净清爽的提交路线图，合并前最好先执行：

```
$ git checkout feat/login
$ git rebase develop
```

或

```
$ git checkout feat/login
$ git pull upstream develop
```

这会将整个工作分支移到 `develop` 分支的前面（`HEAD`），可以使 `feat/login` 分支与上游（`upstream`） `develop` 分支同步，如果有冲突，就解决冲突，最后将代码推送到远端（`origin`）分支

```
$ git push origin feat/login
```

这样 `PR` 通过之后，`feat/login` 分支的代码执行合并操作之后，`commit` 历史更新到最新的 `develop` 分支之后，最终得到一个干净舒服的提交路线图。

## 删除 feat || hotfix 分支

使用 `PR Merge` 之后，对于已经合到 `upstream/develop` 的远端 `feature` 分支，可以将其进行删除了：

本地分支删除：

```
$ git branch -D feat/login  # 不检查状态，直接删除
```

远端分支删除：

```
$ git push origin :feat/login
```

## 分支同步

一段时间内，有多个小伙伴通过 `PR Merge` 的方式将代码合并到 `upstream` 上游 `develop` 分支了，此时我们要将 `upstream` 上游 `develop` 分支的代码同步到本地和远端，以保证自己仓库下的代码是最新的。

此时先要将 `upstream` 上游的改动同步到本地，再 `push` 到远端 `origin` 分支：

```
$ git checkout develop
$ git pull upstream develop
$ git push origin develop
```

## 撤回某个 commit

在开发过程中，会提交非常多 `commit`，当项目快要上线的时候，突然某个 `commit` 不需要合并进去，那么就需要通过`git revert` 来进行撤回。

```
$ git revert <commit>
```

## 回滚

在线上版本突然出现某个 BUG 的时候，经过长时间的研究，还未解决，可能需要回滚到上一个版本的代码，那么就需要通过`git reset`解决，这是一个非常危险的操作，当你用 `git reset` 来重设更改时(提交不再被任何引用或引用日志所引用)，无法获得原来的样子——这个撤销是永远的。使用这个命令的时候务必要小心，因为这是少数几个可能会造成工作丢失的命令之一。

```
$ git reset <commit>
```

## Git Flow 流程图

![10321609851083_ pic_hd](https://user-images.githubusercontent.com/16217324/103768812-27cfa680-505e-11eb-8fe9-7e94befa0125.jpg)

## Git 常用命令

### 新建代码库

- $ git init 在当前目录新建一个 Git 代码库

- $ git clone `<url>` `<LiveCenterMobile>` 克隆仓库

### 添加/删除文件

- $ git add `<file1>` `<file2>` || git add . || git `<dir>` 添加指定文件、所有文件、目录到暂存区

- $ git rm `<file1>` `<file2>` 删除工作区文件，并且将这次删除放入暂存区

### 代码提交

- $ git commit -m `<message>` 提交暂存区文件到仓库

- $ git commit -v 提交时显示所有 diff 信息

- $ git reset --hard

### 分支

- $ git branch 列出本地所有分支

- $ git branch -r 列出远端所有分支

- $ git branch -a 列出本地和远程所有分支

- $ git branch `<branch-name>` 新建一个分支，但依然停留在当前分支

- $ git checkout -b `<branch>` 新建一个分支，并切换到该分支

- $ git branch `<branch>` `<commit>` 新建一个分支，指向指定 commit

- $ git checkout `<branch-name>` 切换到指定分支，并更新工作区

- $ git merge `<branch>` 合并指定分支到当前分支

- $ git branch -d `<branch-name>` 删除分支

### 查看信息

- $ git status 显示所有变更文件

- $ git log 显示当前分支的版本历史

- $ git diff 显示暂存区和工作区的差异

### 远端同步

- $ git fetch `<remote>` 更新远端仓库所有变动

- $ git remote -v 显示所有远程仓库

- $ git remote add `<shortname>` `<url>` 增加一个新的远程仓库，并命名

- $ git pull `<remote>` `<branch>` 拉取远端仓库的变化，并与本地分支合并

- $ git push `<remote>` `<branch>` 推送本地代码到远端仓库指定分支

- $ git push `<remote>` --force 强行推送本地代码到远端仓库指定分支，即使有冲突

### 撤销

- $ git checkout `<file>` 恢复暂存区的指定文件到工作区

- $ git checkout . 恢复暂存区的所有文件到工作区

- $ git reset `<file>` 重置暂存区的指定文件，与上一次 commit 保持一致，但工作区不变

- $ git reset --hard 重置暂存区与工作区，与上一次 commit 保持一致

- $ git reset `<commit>` 重置当前分支的指针为指定 commit，同时重置暂存区，但工作区不变

- $ git checkout . && git clean -df 本地修改了一些文件，其中包含修改、新增、删除的，想要丢弃

- $ git revert `<commit>` 后者的所有变化都将被前者抵消，并且应用到当前分支

### 还原

- $ git reflog --no-abbrev 查看当前所有提交的 `commit`，包括已删除的分支

## 参考资料

- [GitHub Guides](https://guides.github.com/)
- [团队协作中的 Github flow 工作流程](https://zhuanlan.zhihu.com/p/39148914)
- [了解 GitHub 流程](https://guides.github.com/introduction/flow/)
- [Git 常用命令及方法大全](https://www.cnblogs.com/miracle77hp/articles/11163532.html)

## 博客

欢迎关注我的[博客](https://github.com/xuya227939/LiuJiang-Blog)
