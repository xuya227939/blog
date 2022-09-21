## 例子

```
function ajax(options = {}) {
    const xhr = new XmlHttpRequest();
    options.type = (options.type || 'GET').toUpperCase();
    options.dataType = options.dataType || 'json';
    const params = options.data;
    if(options.type == 'GET') {
        xhr.open('GET', options.url + '?' + params, true);
        xhr.send(null);
    }
    if(options.type == 'POST') {
        xhr.open('POST', options.url, true);
        xhr.send(params);
    }

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if(xhr.status >= 200 && xhr.status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXml);
            } else {
                options.fail && options.fail(xhr.status);
            }
        }
    }
}
```

## 进阶 1，封装一个 all 函数，在实现的 ajax 基础上实现调用所有请求，等到所有请求结果成功之后，再返回结果

```
function all(arr, callback) {
    let values = [], count = 0;
    for(let i = 0; i < arr.length; i++) {
        ajax({ url: arr[i], success: (data) => {
            count++;
            if(count == arr.length) {
                values.push(data);
                callback(values);
            }
        }, fail: (error) => {
            count++;
            if(count == arr.length) {
                values.push(error);
                callback(values);
            }
        } });
    }
}
```

## 进阶 2， 在实现的 ajax 基础上实现请求顺序调用，第一个调用成功之后，再调用第二个，以此类推

```
function all(arr, callback) {
    let values = [], count = 0;
    for(let i = 0; i < arr.length; i++) {
        ajax({ url: arr[i], success: (data) => {
            count++;
            if(count == arr.length) {
                // 这里是区别，增加了索引，来保存这个值
                values[i] = data;
                callback(values);
            }
        }, fail: (error) => {
            count++;
            if(count == arr.length) {
                // 这里是区别，增加了索引，来保存这个值
                values[i] = error;
                callback(values);
            }
        } });
    }
}
```
