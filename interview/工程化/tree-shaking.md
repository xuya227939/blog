## 什么是 tree-shaking

tree-Shaking 是一种基于 ES Module 规范的 Dead Code Elimination 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。

## 使用前提条件

tree-shakinng 基于 ES6 模块实现

-   只能作为模块顶层的语句出现
-   import 的模块名只能是字符串常量
-   import binding 是 immutable 的

## Webpack

Webpack 官网提到，要开启模块的 Tree-shaking，需要满足以下四个条件：

-   使用 ES6 的 import export 语句
-   确保 ES6 模块没有被 babel 等编译器转换成 ES5 CommonJS 的形式
-   项目 package.json 文件中，要有 "sideEffects" 属性的定义（false 表示所有文件无副作用，可启用 Tree Shaking）
-   使用 Webpack 的 production mode

## 实现原理

Webpack 中，tree-shaking 的实现一是先「标记」出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中

Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用

生成产物时，若变量没有被其它模块使用则删除对应的导出语句

## 最佳实践

虽然 Webpack 自 2.x 开始就原生支持 tree Shaking 功能，但受限于 JS 的动态特性与模块的复杂性，直至最新的 5.0 版本依然没有解决许多代码副作用带来的问题，使得优化效果并不如 Tree Shaking 原本设想的那么完美，所以需要使用者有意识地优化代码结构，或使用一些补丁技术帮助 Webpack 更精确地检测无效代码，完成 Tree Shaking 操作。
