-   首先，setState 会产生当前更新的优先级（老版本用 expirationTime ，新版本用 lane ）。
-   接下来 React 会从 fiber Root 根部 fiber 向下调和子节点，调和阶段将对比发生更新的地方，更新对比 expirationTime ，找到发生更新的组件，合并 state，然后触发 render 函数，得到新的 UI 视图层，完成 render 阶段。
-   接下来到 commit 阶段，commit 阶段，替换真实 DOM ，完成此次更新流程。
-   此时仍然在 commit 阶段，会执行 setState 中 callback 函数,如上的()=>{ console.log(this.state.number) }，到此为止完成了一次 setState 全过程。

`enqueueSetState` 作用实际很简单，就是创建一个 `update` ，然后放入当前 `fiber` 对象的待更新队列中，最后开启调度更新，进入上述讲到的更新流程。

```
enqueueSetState() {
     /* 每一次调用`setState`，react 都会创建一个 update 里面保存了 */
     const update = createUpdate(expirationTime, suspenseConfig);
     /* callback 可以理解为 setState 回调函数，第二个参数 */
     callback && (update.callback = callback)
     /* enqueueUpdate 把当前的update 传入当前fiber，待更新队列中 */
     enqueueUpdate(fiber, update);
     /* 开始调度更新 */
     scheduleUpdateOnFiber(fiber, expirationTime);
}
```

开启批量更新

```
function batchedEventUpdates(fn,a){
    /* 开启批量更新  */
    isBatchingEventUpdates = true;
    try {
        /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
        return batchedEventUpdatesImpl(fn, a, b);
    } finally {
        /* try 里面 return 不会影响 finally 执行  */
        /* 完成一次事件，批量更新  */
        isBatchingEventUpdates = false;
    }
}
```

原生方法比如 setTimeout、setInterval 会绕过批量更新机制，进行单个更新
