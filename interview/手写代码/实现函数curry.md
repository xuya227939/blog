## 核心思路

要判断当前传入函数的参数个数 (args.length) 是否大于等于原函数所需参数个数 (fn.length) ，如果是，则执行当前函数；如果是小于，则返回一个函数。

```
function curry(fn) {
    return function curriedFn() {
        var args = Array.prototype.slice.call(arguments);
        if(args.length < fn.length) {
            return function() {
                var args2 = Array.prototype.slice.call(arguments);
                return curriedFn.apply(null, args.concat(args2));
            }
        }

        return fn.apply(null, args);
    }
}

function sum(x, y, z) {
    return x + y + z;
}

var add = curry(sum);
console.log(add(1, 2, 3));
console.log(add(1)(2)(3));
```
