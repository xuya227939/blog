---
title: VS Code 用户自定义配置推荐
pubDate: 2019-05-07 10:31:15
categories: ["VS Code"]
description: ""
---

## settings.json

```
{
    // 启用或禁用在 VS Code 中重命名或移动文件时自动更新 import 语句的路径
    "javascript.updateImportsOnFileMove.enabled": "always",
    // 禁止vscode的默认制表符
    "editor.detectIndentation": false,
    // 自动换行
    "editor.wordWrap": "on",
    // 字体大小
    "editor.fontSize": 16,
    // 选中糟糕的-
    "editor.wordSeparators": "./\\()\"':,.;<>~!@#$%^&*|+=[]{}`~?",
    // 启用后，将不会显示扩展程序建议的通知。
    "extensions.ignoreRecommendations": true,
    // 关闭默认的js验证，js中使用flow或ts语法会报错，需要关闭
    "javascript.validate.enable": false,
    "fileheader.Author": "Jiang",
    "fileheader.LastModifiedBy": "Jiang",
    "files.associations": {
        "*.wxml": "xml",
        "*.wxss": "css",
        "*.cjson": "jsonc",
        "*.wxs": "javascript"
    },
    "eslint.trace.server": "messages",
    "eslint.validate": [
        "javascript",
        "javascriptreact"
    ],
    "typescript.tsdk": "node_modules/typescript/lib",
    "emmet.includeLanguages": {
        "wxml": "html"
    },
    "[json]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },
    "[css]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },
    "[html]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },
    "[less]": {
        "editor.defaultFormatter": "michelemelluso.code-beautifier"
    },
    "[javascript]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },
    "workbench.colorTheme": "Monokai",
    "workbench.iconTheme": "vscode-icons",
    "[javascriptreact]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "[jsonc]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    }
}
```
