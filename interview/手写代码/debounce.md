## 防抖和节流都要解决的核心问题

-   this 指向
    let context = this;
-   arguments 传参
    let args = arguments;
-   形成一个闭包
    return function() {

    };

-   增加锁的条件，比如通过时间判断，通过当前是否有正在执行的定时器等
    let timeout = setTimeout(() => {}, wait);
    if(previous - now > wait) {};

## 防抖

> 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

### 非立即执行版

```
function debounce(func, wait) {
    var timeout;
    return function () {
        let context = this;
        let args = arguments;
        if(timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    }
}
```

### 立即执行版

```
function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;

        if(timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
        }, wait);

        if(!timeout) func.apply(context, args);
    }
}
```

## 节流

> 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。

```
function throttle(func, wait) {
    let last = 0, deferTimer;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if(now - last > wait) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function () {
                last = now;
                fun.apply(context, args);
            }, wait)
        } else {
            last = now;
            fun.apply(context, args);
        }
    }
}
```
