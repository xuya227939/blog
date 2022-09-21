## 如何回答 promise 原理

从 es5 的 callback 调用 -> es6 的 promise -> es7 的 aync 和 await

es5 回调地域， es6 同步写法， es7 的真正同步

## promise.all

```
Promise.all = function(arr) {
    let res = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        for(let i = 0; i < arr.length; i++) {
            Promise.resove(arr[i]).then(res => {
                count++;
                res[index] = res;
                if(count == arr.length) {
                    return resolve(res);
                }
            }).catch(error => {
                return reject(error);
            });
        }
    });
}
```

## promise.race

```
Promise.race = function(arr) {
    return new Promise((resolve, reject) => {
        for(let i = 0; i < arr.length; i++) {
            Promise.resolve(arr[i]).then((res) => {
                return resolve(res);
            }, (error) => {
                return reject(error);
            });
        }
    })
}
```

## promise 的链式调用

then 方法中，创建并返回了新的 Promise 实例，这是串行 Promise 的基础，是实现真正链式调用的根本
