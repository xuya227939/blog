## 考察知识点

-   基本实现

    迭代遍历

    循环引用

    如何去重

## 核心问题

-   如何遍历数组的每一个元素；
    forEach、for 循环
-   如何去重
    通过新数组 || filter 或 es6

## 代码实现

### 产生一个新的数组，indexOf

```
function unique(arr) {
   if(arr && !Array.isArray(arr)) return;

   var newArr = [];
   arr.forEach((item) => {
        if(newArr.toString().indexOf(item) < 0) {
            newArr.push(item);
        }
   });
   return newArr;
}
```

### filter，不产生新的数组

```
var array = [1, 2, 1, 1, '1', '2'];

function unique(array) {
    var res = array.filter(function(item, index, array){
        return array.indexOf(item) === index;
    })
    return res;
}
```

### es6

```
var array = [1, 2, 1, 1, '1'];

function unique(array) {
    return Array.from(new Set(array));
}

console.log(unique(array));
```
