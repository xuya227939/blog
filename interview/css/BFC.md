## BFC 概念

> Formatting context(格式化上下文) 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

## BFC 是什么？

`BFC` 即 `Block Formatting Contexts` (块级格式化上下文)，它属于上述定位方案的普通流。

具有 `BFC` 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 `BFC` 具有普通容器所没有的一些特性。

通俗一点来讲，可以把 `BFC` 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

## 触发 BFC

-   html 根元素
-   浮动元素：float 除 none 以外的值
-   绝对定位元素：position (absolute、fixed)
-   display 为 inline-block、table-cells、flex
-   overflow 除了 visible 以外的值 (hidden、auto、scroll)

## BFC 特性及应用

### 同一个 BFC 下外边距会发生折叠

理解外边距的一个关键是外边距折叠的概念。如果你有两个外边距相接的元素，这些外边距将合并为一个外边距，即最大的单个外边距的大小。

在下面的例子中，我们有两个段落。顶部段落的页 margin-bottom 为 50px。第二段的 margin-top 为 30px。因为外边距折叠的概念，所以框之间的实际外边距是 50px，而不是两个外边距的总和。

您可以通过将第 2 段的 margin-top 设置为 0 来测试它。两个段落之间的可见边距不会改变——它保留了第一个段落 margin-bottom 设置的 50 像素。

<body>
    <div style="width: 100px;height: 100px;background: lightblue;margin: 100px;"></div>
    <div style="width: 100px;height: 100px;background: lightblue;margin: 100px;"></div>
</body>

从效果上看，因为两个 `div` 元素都处于同一个 `BFC` 容器下 (这里指 body 元素) 所以第一个 `div` 的下边距和第二个 `div` 的上边距发生了重叠，所以两个盒子之间距离只有 `100px`，而不是 `200px`。

首先这不是 `CSS` 的 bug，我们可以理解为一种规范，如果想要避免外边距的重叠，可以将其放在不同的 `BFC` 容器中。

<div class="container" style="overflow: hidden; width: 100px; height: 100px; background: lightblue; margin: 100px;">
    <p></p>
</div>
<div class="container" style="overflow: hidden; width: 100px; height: 100px; background: lightblue; margin: 100px;">
    <p></p>
</div>

### BFC 可以包含浮动的元素（清除浮动）

我们都知道，浮动的元素会脱离普通文档流，来看下下面一个例子

```
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

由于容器内元素浮动，脱离了文档流，所以容器只剩下 2px 的边距高度。如果使触发容器的 BFC，那么容器将会包裹着浮动元素。

<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>

### BFC 可以阻止元素被浮动元素覆盖

<div style="height: 100px;width: 100px;float: left;background: lightblue; color: #000">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #3089dc; color: #000">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>

这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 `overflow: hidden`，就会变成：

<div style="height: 100px;width: 100px;float: left;background: lightblue; color: #000">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #3089dc; color: #000; overflow: hidden;">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
