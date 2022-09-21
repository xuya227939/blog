Promise.resolve()
    .then(() => {
        console.log(0);
        return Promise.resolve(4);
    })
    .then(res => {
        console.log(res);
    })
    .catch(() => {});

Promise.resolve()
    .then(() => {
        console.log(1);
    })
    .then(() => {
        console.log(2);
    })
    .then(() => {
        console.log(3);
    })
    .then(() => {
        console.log(5);
    })
    .then(() => {
        console.log(6);
    });
