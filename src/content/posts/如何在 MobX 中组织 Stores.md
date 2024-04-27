---
title: 如何在 MobX 中组织 Stores
pubDate: 2020-04-16 11:46:49
categories: ["Mobx", "Stores"]
description: ""
---

## Stores(存储)

`Store` 可以在任何 `Flux` 系架构中找到，可以与 MVC 模式中的控制器进行比较。 `Store` 的主要职责是将逻辑和状态从组件中移至一个独立的，可测试的单元，这个单元在 `JavaScript` 前端和后端中都可以使用。

## 单一 Stores

RootStore

```
import { observable, action, configure } from 'mobx';

// configure({ enforceActions: 'always' });

class RootStore {

    @observable
    name = '123';

    @action('name')
    updateCount() {
        this.name = '456';
    }
}
export default new RootStore();
```

Stores 注入

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import RootStore from './mobx/rootStore';

ReactDOM.render(
    <Provider rootStore={RootStore}>
        ...
    </Provider>,
    document.getElementById('root')
);
```

页面引入

```
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('rootStore')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export default Index;
```

优点：

- 好理解，容易入手，经典的 MVC 模式。

缺点：

- 如果 Store 越来越大，那么非常不好维护。

## 单一 Stores 进阶版

RootStore

```
import { observable, action } from 'mobx';
import { configure } from 'mobx';

configure({ enforceActions: 'always' });

class RootStore {

    @observable
    test = '123';

    @action('test')
    updateCount() {
        this.test = '456';
    }
}
export default new RootStore();
```

页面 Store

```
import { observable, action } from 'mobx';

class DashBoardStore extends BasicStore {
    @observable
    name = 'Faker';

    @action
    updateName() {
        this.name = 'Jiang';
    }
}

export default DashBoardStore;
```

注入 RootStore

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import RootStore from './mobx/rootStore';

ReactDOM.render(
    <Provider rootStore={RootStore}>
        ...
    </Provider>,
    document.getElementById('root')
);
```

页面引入

```
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DashboardStore from '../../mobx/Dashboard/store';

@inject('rootStore')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
        this.dashboardStore = new DashboardStore();
    }

    componentDidMount() {
        this.dashboardStore.updateName();
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export default Index;
```

优点：

- 每个页面对应一个 `Store`，`Store` 不会非常庞大

- 各个 `Store` 相对独立

- 不同页面需要共享的数据存入 `RootStore`

- 在进入页面，会对 `Store` 初始化

缺点：

- 组件侵入性，需要改变 `React` 组件原本的结构，例如所有需要响应数据变动的组件都需要使用 `observer` 装饰，组件本地状态也需要 `observable` 装饰，以及数据操作方式等等，对 `Mobx` 耦合较深，日后切换框架或重构的成本很高

- 状态可以被随意修改，通过`configure({ enforceActions: 'always' });`杜绝在 `Action` 以外对 `Store` 的修改

## 多 Store 组合

RootStore

```
import UserStore from './User/store';
import StatisticalCenterStore from './StatisticalCenter/store';
import AccountSettingStore from './AccountSetting/store';
import CallRecordStore from './CallRecord/store';
class RootStore {
    constructor() {
        this.userStore = new UserStore();
        this.statisticalCenterStore = new StatisticalCenterStore();
        this.accountSettingStore = new AccountSettingStore();
        this.callRecordStore = new CallRecordStore();
    }
}
export default new RootStore();
```

Stores 注入

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import RootStore from './mobx/rootStore';

ReactDOM.render(
    <Provider {...RootStore}>
        ...
    </Provider>,
    document.getElementById('root')
);
```

页面引入

```
import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('userStore')
@inject('statisticalCenterStore')
@observer
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export default Index;
```

优点：

- 每个页面对应一个 `Store`，`Store` 不会非常庞大

- 各个 `Store` 相对独立

- 那个页面需要那个 `Store`，引入即可

- 不刷新游览器，页面状态一直保持着

缺点：

- 组件侵入性，需要改变 `React` 组件原本的结构，例如所有需要响应数据变动的组件都需要使用 `observer` 装饰，组件本地状态也需要 `observable` 装饰，以及数据操作方式等等，对 `Mobx` 耦合较深， 日后切换框架或重构的成本很高

- 无数据快照，如果要重置 `Store`，那么得写`reset action`，一个个变量还原，当然也可以通过 `mobx-state-tree` 实现

中性：

状态可以被随意修改：

- 直接在视图层给状态赋值，比如我有 A，B 两个页面，都要修改 C 页面，那么，我在 A 和 B 页面修改 C 的 Store，很方便，但是，如果不制定一套规范，如果数据改变，要追踪来源，很困难，而且很容易产生意想不到的情况。

- 通过`configure({ enforceActions: 'always' });`杜绝在 `Action` 以外对 `Store` 的修改

## 博客

欢迎关注我的[博客](https://github.com/xuya227939/LiuJiang-Blog)
