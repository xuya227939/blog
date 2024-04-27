---
title: VS Code 提高前端开发效率插件
pubDate: 2019-11-15 09:45:16
categories: ["React", "VS Code"]
description: ""
---

## Auto Close Tag

自动添加 `HTML/XML` 关闭标记，与 `Visual Studio IDE` 或 `Sublime` 文本相同

![usage](https://user-images.githubusercontent.com/16217324/76220978-5076ec00-6253-11ea-8a0c-3a45fbf8cad0.gif)

键入开始标签的结束括号后，将自动插入结束标签。

## Auto Rename Tag

自动重命名配对的 `HTML/XML` 标记

![usage](https://user-gold-cdn.xitu.io/2020/3/9/170bfe5fe438ed72?w=1440&h=938&f=gif&s=158502)

## Beautify

为 `Visual Studio` 代码美化代码

选中需要美化的代码，右键 `Format Document`

## GitLens

增强 `Visual Studio` 代码中内置的 `Git` 功能-通过 `Git` 责怪注释和代码镜头一目了然地可视化代码作者，无缝导航和浏览 `Git` 存储库，通过强大的比较命令获得有价值的见解，等等

![7bf310ecae2e4fb92499bdcc3ea723e](https://user-gold-cdn.xitu.io/2020/3/9/170bfe50b60cb655?w=683&h=118&f=png&s=5530)

## JavaScript (ES6) code snippets

`ES6` 语法中 `JavaScript` 的代码段

## Path Autocomplete

提供 `Visual Studio` 代码的路径完成。

![path-autocomplete](https://user-gold-cdn.xitu.io/2020/3/9/170bfe66dd619f57?w=817&h=439&f=gif&s=251155)

## Path Intellisense

自动完成文件名的 `Visual Studio` 代码插件

![iaHeUiDeTUZuo](https://user-gold-cdn.xitu.io/2020/3/9/170bfe66dd73b02d?w=480&h=270&f=gif&s=87934)

## React-Native/React/Redux snippets for es6/es7

在 `JS/TS` 中使用 `ES7` 语法对 `React`、`Redux` 和 `Graphql` 进行简单扩展

## StandardJS - JavaScript Standard Style

将 `JavaScript` 标准样式集成到 `Visual Studio` 代码中。

1. 安装 "JavaScript 标准样式" 扩展

   如果您不知道如何在 `Visual Studio` 中安装扩展，请查看文档。

   您将需要重新加载 `Visual Studio` 才能使用新的扩展。

2. 安装 standard 或 semistandard

   这可以在全局或本地完成。我们建议您在本地安装它们（即保存在项目的中 `devDependencies`），以确保在开发项目时其他开发人员也已安装它们。

3. 禁用内置的 Visual Studio 验证器

   为此，请 `"javascript.validate.enable": false` 在 `Visual Studio` 中进行设置 `settings.json`

## Vetur

VS 代码的 Vue 工具

## vscode wxml

微信 `wxml` 支持 `/vscode` 片段

## vscode-fileheader

插入标题注释，并自动更新时间。

![fileheader](https://user-gold-cdn.xitu.io/2020/3/9/170bfe7f0061bd4a?w=921&h=510&f=gif&s=120076)

在 `“settings.json”` 中，设置并修改创建者的名称。

```
"fileheader.Author": "Jiang",
"fileheader.LastModifiedBy": "Jiang",
```

热键

```
ctrl+alt+i
```

## vscode-icons

`Visual Studio` 代码的图标

![image](https://user-gold-cdn.xitu.io/2020/3/9/170bfe50cd3f173d?w=1920&h=1041&f=png&s=180390)

## wxml

微信小程序 `wxml` 格式化以及高亮组件(高度自定义)

## ESLint

将 `ESLint JavaScript` 集成到 `Visual Studio` 代码中。

以下设置为包括 `ESLint` 在内的所有提供程序都启用了自动修复：

```
"editor.codeActionsOnSave": {
    "source.fixAll": true
}
```

相反，此配置仅在 `ESLint` 上将其打开：

```
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

您还可以通过以下方式有选择地禁用 ESLint：

```
"editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": false
}
```

## Import Cost

在编辑器中显示导入/要求包大小

![import-cost](https://user-images.githubusercontent.com/16217324/76226912-799a7b00-6259-11ea-986b-a5613e35312c.gif)

## Beautify css/sass/scss/less

美化 `CSS`、`Sass` 和更少的代码（`Visual Studio` 代码的扩展）

选中需要美化的代码，右键 `Format Document`

## TSLint

对 `Visual Studio` 代码的 `TSLint` 支持

## Settings Sync

使用 `GitHub Gist` 跨多台计算机同步设置、代码段、主题、文件图标、启动、键绑定、工作区和扩展名。

## CSS Peek

允许查看 `CSS ID` 和类字符串作为从 `HTML` 文件到相应 `CSS` 的定义。允许查看和转到定义。

![symbolProvider](https://user-images.githubusercontent.com/16217324/76229270-e105fa00-625c-11ea-8b48-6a48506b725c.gif)

## Stylelint

使用 `stylelint` 对 `lint CSS/SCSS/Less` 的 `Visual Studio` 代码扩展，进行格式校验。

## 博客

欢迎关注我的[博客](https://github.com/xuya227939/LiuJiang-Blog)
