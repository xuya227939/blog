## new 运算符做了那些事

-   创建一个空的简单 JavaScript 对象（即{}）；
-   为步骤 1 新创建的对象添加属性**proto**，将该属性链接至构造函数的原型对象 ；
-   将步骤 1 新创建的对象作为 this 的上下文 ；
-   如果该函数没有返回对象，则返回 this

## 代码实现

```
function objectFactory() {
    var obj = new Object();
    Constructor = [].shift.call(arugments);
    obj._proto_ = Constructor.prototype;
    var res = Constructor.apply(obj, arguments);
    return typeof res == 'object' ? res : obj;
}
```
