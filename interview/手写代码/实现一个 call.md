## 核心问题

-   call 支持传入默认值，如何解决 this 指向问题
    context.fn = obj || window;
-   如何处理多个传参问题
    arguments，从 1 开始，0 默认是数组当前的函数
-   如何执行函数
    eval

## 实现代码如下

```
Function.prototype.call2 = function(obj) {
    let context = obj || window;
    let arr = [];
    context.fn = this;
    for(let i = 1; i < arguments.length; i++) {
        arr.push(`arguments[${i}]`);
    }

    const res = eval('context.fn(' + arr + ')');

    delete context.fn;
    return res;
}

function test(name) {
    console.log(111, name);
}

test.call2(this, 'Faker');
```

eval 和 new Function 都可以动态解析和执行字符串。但是它们对解析内容的运行环境判定不同。

eval 中的代码执行时的作用域为当前作用域。它可以访问到函数中的局部变量。

new Function 中的代码执行时的作用域为全局作用域

## apply 的实现

```
Function.prototype.apply = function (context, arr) {
    let context = Object(context) || window;
    context.fn = this;

    let result;
    if (!arr) {
        result = context.fn();
    } else {
        let args = [];
        for (var i = 0, i < arr.length; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```
