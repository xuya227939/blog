---
title: MobX or Redux
pubDate: 2019-10-04 22:14:34
categories: ["Redux", "Mobx"]
description: ""
---

## 前言

在过去的项目中一直用的都是 `Redux`，觉得挺不错的，按照官方推荐的一些写法，再加上团队风格，打造了一套关于 `Redux` 的架构，但是，现在觉得写 `Action`、`Reducer` 太繁琐，随着业务不断的增量，相应的文件和代码也会不断的增加，而且对新人来说不是非常友好(理解 `Redux` 比较困难)，听说一方诸侯 `MobX` 非常不错，所以在尝试使用了，目前项目中两套架构都是并存，写下自己的一些感想。

## 都解决什么问题？

1、组件之间复用状态非常困难

`React` 本身没有提供将可复用性状态“附加”到组件的途径（例如，把组件连接到 `Store`）。如果你使用过 `React` 一段时间，你也许会熟悉一些解决此类问题的方案，比如 `Props` 和 `HOC`。但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。写下这片博客的时候，`React` 已提供 `Hook`，但是本人觉得这都是些 `hack` 方案。

2、复杂组件变得难以理解

我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据。但是，同一个 `componentDidMount` 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 `componentWillUnmount` 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 BUG，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。

## Redux

`Redux` 由 `Flux` 演变而来，但受 Elm 的启发，避开了 `Flux` 的复杂性。它主要有以下三个核心概念：

1、Actions

一个 `JavaScript` 对象，描述发生的动作，主要包含 `type` 和 `payload` 两个属性。
`payload` 可以是普通的数据或是函数。

```
const GET_LIST = 'getList';
return {
    type: GET_LIST,
    payload: api.getList(params)
};
```

2、Reducer

定义应用状态如何响应不同动作（`Action`），如何更新状态；

```
switch (action.type) {
  case GET_LIST:
  	return Object.assign({}, state, { list: action.payload.result });
  default:
    retur state;
}
```

3、Store

```
const initialState = {
    orderListData: {}
};
```

存储组件的数据，主要提供以下功能：

3.1. 维护应用状态并支持访问状态(`getState()`)；

3.2. 支持监听 `Action` 的分发，更新状态(`dispatch(action)`)；

3.3. 支持订阅 `Store` 的变更(`subscribe(listener)`);

4、异步流

由于 `Redux` 所有对 `Store` 状态的变更，都应该通过 `Action` 触发，异步任务（通常都是业务或获取数据任务）也不例外，而为了不将业务或数据相关的任务混入 `React` 组件中，就需要使用其他框架配合管理异步任务流程，如 `redux-thunk`、`redux-saga`、`redux-promise`

5、数据流向

<img width="640" alt="one-way-data-flow-04fe46332c1ccb3497ecb04b94e55b97" src="https://github.com/xuya227939/blog/assets/16217324/3ce51a12-63b2-42ec-bb19-d8e7a1661638">

### 优点

1、流程规范，按照官方推荐的规范和结合团队风格打造一套属于自己的流程。

2、函数式编程，在 `Reducer` 中，接受输入，然后输出，不会有副作用发生，幂等性。

3、可追踪性，很容易追踪产生 BUG 的原因。

### 缺点

1、流畅太繁琐，需要写各种 `Action`，`Reducer`。

2、要想完成异步数据，得配合其他库。

## MobX

`MobX` 是一个经过战火洗礼的库，它通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展。其中核心概念也非常简单，主要有以下几个：

1、Store

使用 `observable` 很像把对象的属性变成 `Excel` 的单元格。 但和单元格不同的是，这些值不只是原始值，还可以是引用值，比如对象和数组。

```
import { observable } from "mobx";

class Todo {
    @observable title = '';
}
```

2、Computed values

当添加了一个新的 `todo` 或者某个 `todo` 的 `finished` 属性发生变化时，`MobX` 会确保 `unfinishedTodoCount` 自动更新。 像这样的计算可以类似于 `MS Excel` 这样电子表格程序中的公式。每当只有在需要它们的时候，它们才会自动更新。

```
class TodoList {
    @observable todos = [];
    @computed get unfinishedTodoCount() {
        return this.todos.filter(todo => !todo.finished).length;
    }
}
```

3、Reactions

`Reactions` 和计算值很像，但它不是产生一个新的值，而是会产生一些副作用，比如打印到控制台、网络请求、递增地更新 `React` 组件树以修补 `DOM`、等等。

```
autorun(() => {
    console.log("Tasks left: " + todos.unfinishedTodoCount)
})
```

4、Actions

描述要发生的动作

```
class TodoList {
    @observable title = '';

    @action
    changeTitle() {
        this.title = 'test';
    }
}
```

5、异步流

`MobX` 不需要额外配置另外的库。

6、数据流向

![flow2](https://github.com/xuya227939/blog/assets/16217324/439042e4-7125-44a4-834c-2758dc126208)

### 优点

1、学习成本少，基础知识非常简单，跟 `Vue` 一样的核心原理，响应式编程。

2、写更少的代码，完成更多的事。不会跟 `Redux` 一样写非常多的样板代码。

3、使组件更加颗粒化拆分。

### 缺点

1、过于自由，`MobX` 提供的约定及模版代码很少，如果团队不做一些约定，容易导致团队代码风格不统一。

2、可拓展，可维护性，也许你会担心 `Mobx` 能不能适应后期项目发展壮大呢？确实 `Mobx` 更适合用在中小型项目中，但这并不表示其不能支撑大型项目，关键在于大型项目通常需要特别注意可拓展性，可维护性，相比而言，规范的 `Redux` 更有优势，而 `Mobx` 更自由，需要我们自己制定一些规则来确保项目后期拓展，维护难易程度；

## 案例

[Redux 项目模板](https://github.com/xuya227939/lucian)

[MobX 项目模板](https://github.com/xuya227939/tristana)

## 总结

对于 `Redux` 更规范，更靠谱，应该使用 `Redux` 或 `Redux` 模版太多，太复杂了，应该选择 `Mobx` 这类推断，我们都应该避免，也应该要避免这些，这些都是相对而言，每个框架和库都有各自的实现，特色，及其适用场景，正如 Redux 流程更复杂，但熟悉流程后就更能把握它的一些基础／核心理念，使用起来可能更有心得及感悟；而 `Mobx` 简单化，把大部分东西隐藏起来，如果不去特别研究就不能接触到它的核心／基本思想，也许使得开发者一直停留在使用层次。

所以无论是技术栈还是框架类库，并没有绝对的比较我们就应该选择什么，抛弃什么，我们应该更关注它们解决什么问题，它们解决问题的关注点，或者说实现方式是什么，它们的优缺点还有什么，哪一个更适合当前项目，以及项目未来发展。

## 参考资料

1、[你需要 Mobx 还是 Redux？](https://juejin.im/post/6844903562095362056)

2、[MobX](https://cn.mobx.js.org/)

3、[React](https://react-1251415695.cos-website.ap-chengdu.myqcloud.com/)

4、[Redux](https://www.redux.org.cn/)

## 博客

[欢迎关注我的博客](https://github.com/xuya227939/LiuJiang-Blog)
