## Promise.all 方法的实现

```
function all(list) {
    return new MyPromise((resolve, reject) => {
        let values = [];
        let count = 0;
        for(let [i, v] of list.entreis()) {
            values[i] = v;
            count++;
            if(count == list.length) resolve(values);
        }
    }, err => {
        reject(err);
    });
}
```

## Promise.race 方法的实现

```
function race (list) {
    return new MyPromise((resolve, reject) => {
        for (let p of list) {
            // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
            this.resolve(p).then(res => {
                resolve(res)
            }, err => {
                reject(err)
            })
        }
    })
}
```
