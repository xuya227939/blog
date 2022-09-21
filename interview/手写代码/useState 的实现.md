```
let values = [];
let curIndex = 0;
function useState(initialState) {
    values[curIndex] = values[curIndex] ? values[curIndex] : initialState;
    const setState = function(newState) {
        values[curIndex] = newState;
        curIndex = 0;
        render();
    }
    curIndex++;
    return [values[curIndex], setState];
}
```
