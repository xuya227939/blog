## 核心流程

-   npm run start 启动静态编译服务
-   node 启动监听文件更新服务，生成 webpack 编译主引擎 `compiler`，`setupApp` 生成 `express` 服务
-   `setupApp` 监听文件改动以及编译结束，当监听到 `webpack` 编译结束的时候，就会调用 `sendStats` 方法通过通过 `webSocet` 传输到前端，根据传入的 `hash` 值和变更的文件，与上一次的 `hash` 值进行对比，进行更新，
-   客户端进行热模块更新、替换，`module.hot.check`
-   真正实现更新的是 `hotApply` 方法进行遍历所有模块，删除之前的模块，替换新的模块，`moduleId`，如果在热更新的过程中，遇到代码报错，则会调用 `window.location.reload()` 进行页面刷新

## 回答字节的问题

前端如何实现在某个文件更新之后，打印 console.log

当用新的模块代码替换老的模块后，但是我们的业务代码并不能知道代码已经发生变化，也就是说，当 hello.js 文件修改后，我们需要在 index.js 文件中调用 HMR 的 accept 方法，添加模块更新后的处理函数，及时将 hello 方法的返回值插入到页面中。代码如下

```
// index.js
if(module.hot) {
    module.hot.accept('./hello.js', function() {
        div.innerHTML = hello()
    })
}
```
