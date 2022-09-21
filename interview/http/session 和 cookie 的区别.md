## 差异

1. 储存位置

session 储存在服务器端

cookie 储存在客户端

2. 安全性

cookie 不是很安全，储存在客户端，有 cookie 欺骗的风险

session 则储存在服务器端，相对安全

3. 储存大小

单个 cookie 储存大小不能超过 4k

4. 存储类型

cookie 只能存储 string 对象

session 则支持 java 对象

## session 和 cookies 不同点

session 和 cookies 同样都是针对单独用户的变量（或者说是对象好像更合适点），不同的用户在访问网站的时候 都会拥有各自的 session 或者 cookies，不同用户之间互不干扰。
他们的不同点是：

1. 存储位置不同
   session 在服务器端产生，比较安全，但是如果 session 较多则会影响性能
   cookies 在客户端产生，安全性稍弱
2. 生命周期不同
   session 生命周期 在指定的时间（如 20 分钟）到了之后会结束，不到指定的时间，也会随着浏览器进程的结束而结束。
   cookies 默认情况下也随着浏览器进程结束而结束，但如果手动指定时间，则不受浏览器进程结束的影响。
