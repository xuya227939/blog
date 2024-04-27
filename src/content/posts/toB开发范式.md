---
title: toB开发范式
pubDate: 2024-03-10 17:46:39
categories: ["React", "toB", "TOB"]
description: ""
---

## 前言

B 端开发，也被称为后台开发或者企业级开发，是针对企业或者组织的业务需求进行的软件开发。在 B 端开发中，我们通常关注的是系统的功能性、稳定性、可扩展性以及安全性，从面向过程编程 -> 面向对象编程 + 组合式编程

以下是 B 端开发体系的一些主要元素：

1. **技术栈**：B 端开发通常涉及到复杂的技术栈，包括编程语言（ JavaScript ）、框架（React）等等。

2. **架构设计**：因为 B 端业务的复杂性，所以架构设计尤为重要。包括如何有效地分层（视图层，逻辑层，服务层）、如何进行微服务化、如何保证系统稳定性等等。

3. **性能优化**：B 端开发需要关注系统的性能。这不仅包括服务响应速度的提升，还包括如何在高并发环境下保持系统的稳定性。

4. **安全**：B 端开发需要对安全进行严格的考虑，包括数据的加密存储、传输安全、权限控制等等。

5. **设计模式**：针对一些复杂的场景设计，设计模式的建立，往往会带来可靠的代码维护和扩展。

6. **其他**

理解和掌握 B 端开发体系需要一点时间，但是这对于追求成为一名优秀的前端开发者来说，是非常必要的。

![](https://files.mdnice.com/user/27515/8610a878-43dd-4113-9485-cc9f17b8fcf6.jpg)

我们以典型的 B 端页面组成为例，上层搜索组件，下层列表展示 + 分页

## 技术栈

iCE + React + Zustand + SWR + Ant Design + react-intl

## 架构设计

![](https://files.mdnice.com/user/27515/7e7fb884-dc58-4b23-acd0-8cdd64a2aad3.png)

### 视图层

```jsx
// Container 容器
/*
 * @Author: Jiang
 * @Date: 2024-03-05 16:09:33
 * @Last Modified by: Jiang
 * @Last Modified time: 2024-04-27 17:09:04
 */

import { useState } from "react";
import Search from "./components/search/";
import List from "./components/list";
import styles from "./index.module.less";

const Container = () => {
  const [condition, setCondition] = useState(null);
  const { setStoreFilterConditions, setAdvConditionGroups } = tradeStore();

  return (
    <div className={styles.logPageView}>
      <Search />
      <List />
    </div>
  );
};

export default Container;
```

```jsx
/*
 * 列表组件
 * @Author: Jiang
 * @Date: 2024-03-05 16:09:33
 * @Last Modified by: Jiang
 * @Last Modified time: 2024-03-05 16:10:03
 */

import { useState } from "react";
import Search from "./components/search";
import List from "./components/list";
import styles from "./index.module.less";

const List = () => {
  const [condition, setCondition] = useState(null);
  const { setStoreFilterConditions, setAdvConditionGroups } = tradeStore();

  return (
    <div className={styles.logPageView}>
      <div>123</div>
    </div>
  );
};

export default List;
```

### 逻辑层

```jsx
import { create } from "zustand";
import containerService from "@/services/system/cacheService";

const initialState = {
  tabCondition: "",
};

export const containerStore = create()((set) => ({
  ...initialState,
  getLocation: ({ location }) => {
    set((state) => ({ ...state, tabCondition: location }));
  },
  reset: () => {
    set(initialState);
  },
}));
```

### 服务层

```js
export default {
  async getQueryField(param) {
    const queryParam = {
      catalog: param.catalog,
      codes:
        typeof param.codes === "string" ? param.codes.split(",") : param.codes,
    };
    const url = `${config.tradecURL}${config.apiVersion}/databases/query-fields`;
    const data = await request.post(url, queryParam);
    return query_field_format(data);
  },
  // 修改自定义列
  async updateDisplayField(param) {
    let res = await request.post(
      `${config.tradecURL}${config.apiVersion}/databases/custom-query-columns`,
      param
    );
    return {
      list: displayFieldFormat(res.columns, res.id),
      type: res.type ? res.type : "COMPACT",
    };
  },
};
```

## 性能优化

核心，避免重复渲染，useState，useRef，useEffect，这种常用的狗子，很多都搞不清楚

### useState

useState 是一个 React Hook，可让您向组件添加状态变量，重点是会重新渲染页面

### useRef

useRef 它返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

### useEffect

在`useEffect`的依赖数组中，使用的是浅比较来决定是否触发副作用。也就是说，实际比较的是引用，而不是引用的内容。如果指定为数组或对象的引用，那么只有当引用改变（指向一个新的对象或数组）时，才会触发副作用。即使新旧对象或数组的内容完全一样，只要引用不相同，也会触发副作用。

## 安全

- 界面安全（手机号隐私，用户隐私）
- Http 请求明文
- Cookie 注入
- CSV 脚本注入

## 设计模式

推荐一本书籍，人人都懂设计模式：从生活中领悟设计模式

- 订阅者模式
- 组合模式
- 单例模式
- 代理模式
- 策略模式
- ...

## 其他

### UI

- 热区点击
- 中英文，文字间距排版
- 鼠标样式（对于链接，鼠标移动上去的小手）
- 按钮 Loading
- 占位符，比如没有数据的时候，显示 - ，特别是表格上的数据
- ...

### 逻辑

- 翻页，比如翻到第二页，删除所有选项，请求的仍然是第二页的数据
- 代码做好降级方案，比如对象或数组，做判空处理
- ...
-

## 总结

toB 端开发，其实很简单

文章同步更新平台：掘金、CSDN、知乎、思否、博客，公众号（野生程序猿江辰）
我的联系方式，v：Jiang9684，欢迎和我一起学习交流

完
