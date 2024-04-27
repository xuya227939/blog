---
title: 如何基于tristana项目模板，打造一个基本列表展示
pubDate: 2020-06-17 10:28:49
categories: ["Tristana"]
description: ""
---

基于 tristana 这套项目模板，引导大家如何创建列表展示，搜索，自动处理 loading 状态等。全部代码在仓库下。

最终效果：

![image](https://user-images.githubusercontent.com/16217324/76682388-c6ee6200-6636-11ea-9737-ebee3bab0b19.png)

网站效果预览：https://order.downfuture.com

## 开始之前

1. 确保 node 版本是 8.4 或以上
2. 用 cnpm 或 yarn 能节约你安装依赖的时间

## Step 1. 安装 tristana 并创建项目

```
$ git clone https://github.com/Cherry-Team/tristana.git
$ cd tristana
$ cnpm i
$ npm start
```

浏览器会自动开启，并打开 http://localhost:8080

## Step 2. 生成 Dashboard 路由

我们要新增路由，新建页面文件和在 routeConfig 引入该文件即可。

新建 `src/pages/Dashboard/index.js`，内容如下：

```
import React, { Component } from 'react';
class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section>
                123
            </section>
        );
    }
}

export default Index;
```

然后在`src/routeConfig` 文件下，引入该组件

```
// 路由配置文件
import React, { lazy } from 'react';
import PrivateRoute from './components/PrivateRoute/index';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard"*/'./pages/Dashboard/index'));

const routes = [
    {
        // 仪表盘页
        path: '/dashboard',
        component: Dashboard
    }
];

const RouteWithSubRoutes = route => {
    return <PrivateRoute exact path={route.path} component={route.component} />;
};

const routeConfig = routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />);
export default routeConfig;

```

然后访问 [http://localhost:8080/#/dashboard](http://localhost:8080/#/dashboard)，你会看到 123 的输出。

## Step 3. 构造 mobx 和 service

新增 `src/mobx/Dashboard/store.js`，内容如下：

```
import { observable, action, runInAction } from 'mobx';
import BasicStore, { initLoading } from '../basicStore';
import { isResultError } from '../../utils/index';
import * as api from '../../servers/dashboard';
class DashBoardStore extends BasicStore {
    @observable list = [];

    @initLoading
    @action
    async getTable() {
        const list = await api.getTable();
        runInAction(() => {
            this.list = isResultError(list);
        });
    }
}

export default DashBoardStore;
```

basicStor 类，是我单独封装的，用于监听每个请求，这样就不用手动处理 loading。

然后在`src/mobx/rootStore.js`引入：

```
import DashboardStore from './Dashboard/store';
class Store {
    constructor() {
        this.dashboardStore = new DashboardStore();
    }
}
export default new Store();
```

新建 `src/servers/dashboard.js`：

```
import request from '../request';

// 获取表格数据
export function getTable(params = {}) {
    return request({
        url: 'getTable',
        method: 'POST',
        data: params
    });
}
```

## Step 4. 页面组件引入 mobx

在`src/pages/Dashboard/index.js`文件中，引入：

```
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('dashboardStore')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dashboardStore } = this.props;
        dashboardStore.getTable();
    }

    render() {
        const { dashboardStore: { list }, dashboardStore } = this.props;
        return (
            <section>
                123
            </section>
        );
    }
}

export default Index;
```

## Step 5. 添加界面，让列表展现出来

在 src/pages/Dashboard/index.js 文件中，引入筛选组件和列表组件：

筛选组件：

```
// 筛选项
const OrderSearch = (props) => {
    const { handleSubmit } = props;
    return (
        <section className="search">
            <Form
                layout="inline"
                name="orderListSearch"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="订单编号"
                    name="orderId"
                >
                    <Input placeholder="请输入订单编号" style={{ width: colWidth }} />
                </Form.Item>
                <Form.Item
                    label="客户名称"
                    name="customerName"
                >
                    <Input placeholder="请输入客户名称" style={{ width: colWidth }} />
                </Form.Item>
                <Form.Item
                    label="下单方式"
                    name="placeOrder"
                >
                    <Select
                        allowClear
                        style={{ width: colWidth }}
                        placeholder="请选择下单方式"
                    >
                        <Option value={1}>自主下单</Option>
                        <Option value={2}>代下单</Option>
                    </Select>
                </Form.Item>
                <section className="button">
                    <Form.Item>
                        <Button
                            htmlType="submit"
                        >
                            重置
                        </Button>
                        <Button
                            htmlType="submit"
                            className="btn-left"
                        >
                            导出
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="btn-left"
                        >
                            搜索
                        </Button>
                    </Form.Item>
                </section>
            </Form>
        </section>
    )
}
```

列表组件：

```
// 订单表格
const OrderTable = ({ list, isLoading }) =>  {

    // 表格列配置
    const columns = [
        {
            title: '订单编号',
            dataIndex: 'orderId'
        },
        {
            title: '客户名称',
            dataIndex: 'customerName'
        },
        {
            title: '下单方式',
            dataIndex: 'placeOrder'
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName'
        },
        {
            title: '价格',
            dataIndex: 'price'
        },
        {
            title: '下单时间',
            dataIndex: 'placeOrderTime'
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={list || []}
            loading={isLoading}
            rowKey="orderId"
        />
    );
}
```

在 Index 类下引入两个组件：

```
render() {
    const { dashboardStore: { list }, dashboardStore } = this.props;
    return (
        <section className="dashboard">
            <OrderSearch handleSubmit={this.handleSubmit} />
            <OrderTable list={list} isLoading={dashboardStore.isLoading.get('getTable')} />
        </section>
    );
}
```

`dashboardStore.isLoading.get('getTable')` 用于判断请求是否完成，bool 值，true || false

完
