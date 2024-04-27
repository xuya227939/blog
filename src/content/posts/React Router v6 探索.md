---
title: React Router v6 探索
pubDate: 2022-03-28 01:11:58
categories: ["React"]
description: ""
---

## 前言

没事翻了翻 `React Router` 的文档，发现已推到了 `v6.2.2` 版本，这个版本做了很大的改动，让我们一起看看吧

## 为什么推出 v6

- 推出 `v6` 的最大原因是 `React Hooks` 的出现

- `v6` 写的代码要比 `v5` 代码更加紧凑和优雅

我们通过代码来感受下，这是 `v6` 写的伪代码

```
import { Routes, Route, useParams } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="blog/:id" element={<Head />} />
        </Routes>
  );
}

function Head() {
    let { id } = useParams();
    return (
        <>
            <Footer />
        </>
    );
}

function Footer() {
    let { id } = useParams();
}
```

这是 `v5` 写的伪代码

```
import * as React from "react";
import { Switch, Route } from "react-router-dom";

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route
                    path="head/:id"
                    render={({ match }) => (
                        <Head id={match.params.id} />
                    )}
                />
            </Switch>
        );
    }
}

class Head extends React.Component {
    render() {
        return (
            <>
                <Footer id={this.props.id} />
            </>
        );
    }
}

class Footer extends React.Component {
    render() {
        return (
            <>
                <ButtonComponent id={this.props.id} />
            </>
        );
    }
}
```

这个例子表明

- `Hooks` 消除了使用 `<Route render>` 访问路由器内部状态的需要
- 手动传递 `props` 将该状态传播到子组件的需要
- 应用程序包体积更小

![](https://files.mdnice.com/user/27515/fefec7d2-d2f3-48eb-87bf-3c0ee84d29e1.png)

## 增加了哪些特性？

1. `<Switch>` 升级为 `<Routes>`

   - Routes 内的所有 <Route> 和 <Link> 是相对的。这使得 <Route path> 和 <Link to> 中的代码更精简、更可预测
   - 路由是根据最佳匹配，而不是按顺序遍历，这避免了由于路由不可达而导致的错误
   - 路由可以嵌套在一个地方，而不是分散在不同的组件中

2. 新钩子 `useRoutes` 代替 `react-router-config`

之前：

```
import React, { lazy } from 'react';
import PrivateRoute from '@components/PrivateRoute/index';

const Dashboard = lazy(() => import('@pages/dashboard/index'));
const Abount = lazy(() => import('@pages/abount/index'));

const routes = [
    {
        path: '/home',
        component: Dashboard
    },
    {
        path: '/about',
        component: Abount
    },
];

const RouteWithSubRoutes = route => (
    <PrivateRoute path={route.path} component={route.component} routes={route.routes} />
);

const routeConfig = routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />);
export default routeConfig;

```

现在

```

function App() {
    let element = useRoutes([
        { path: '/', element: <Home /> },
        {
            path: 'users',
            element: <Users />,
            children: [
                { path: '/', element: <UsersIndex /> },
                { path: ':id', element: <UserProfile /> },
                { path: 'me', element: <OwnUserProfile /> },
            ]
        }
    ]);
    return element;
}
```

就感觉更优雅一些

3.  用 `useNavigate` 代替 `useHistory`

之前

```
import { useHistory } from "react-router-dom";

function App() {
    let history = useHistory();
    function handleClick() {
        history.push("/home");
    }
    return (
        <div>
            <button onClick={handleClick}>go home</button>
        </div>
    );
}
```

现在

```
import { useNavigate } from "react-router-dom";

function App() {
    let navigate = useNavigate();
    function handleClick() {
        navigate("/home");
    }
    return (
        <div>
            <button onClick={handleClick}>go home</button>
        </div>
    );
}
```

这个变化不是很大

4. Route 的变化

- 4.1 `<Route exact>` 移除，使用 `/*` 代替

```
<Route path="/*" element={<Home />} />
```

`

- 4.2 `<Route children>` 使用 `<Route element>` 代替

```
import Profile from './Profile';

// v5
<Route path=":userId" component={<Profile />} />

// v6
<Route path=":userId" element={<Profile />} />
```

- 4.3 Outlet
  我们使用一个 `<Outlet>` 元素作为占位符。在 `<Outlet>` 这种情况下，`Users` 组件如何呈现其子路由。因此，将根据当前位置 `<Outlet>` 呈现一个 `<UserProfile>` 或`<OwnUserProfile>` 元素

- 4.4

```
import {
	BrowserRouter,
	Routes,
	Route,
	Link,
	Outlet
} from 'react-router-dom';

function App() {
  	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="users" element={<Users />}>
				<Route path="/" element={<UsersIndex />} />
				<Route path=":id" element={<UserProfile />} />
				<Route path="me" element={<OwnUserProfile />} />
				</Route>
			</Routes>
		</BrowserRouter>
  	);
}

function Users() {
  	return (
    	<div>
      		<nav>
				<Link to="me">My Profile</Link>
			</nav>
			<Outlet />
    	</div>
  	);
}
```

## 体验 v6

这里我们使用 `create-react-app` 来创建项目，安装好之后，进入项目，安装 `react-router-dom@6` 依赖

```
$ npx create-react-app react-app
$ cd react-app
$ npm install react-router-dom@6
```

`src/index.js` 在编辑器中打开，`BrowserRouter` 从顶部附近导入 `react-router-dom` 并将 `<APP>` 包装在 `<BrowserRouter>`

```
// src/index.js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
```

打开 `src/App.js` 并用一些路由替换默认标记

```
// App.js
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <div className="App">
            <h1>Welcome to React Router!</h1>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="about" element={<About />} />
                </Routes>
        </div>
    );
}
```

现在，仍在 `src/App.js`，创建你的路由组件

```
// src/App.js
function Home() {
    return (
        <>
            <main>
                <h2>Home</h2>
            </main>
            <nav>
                <Link to="/about">About</Link>
            </nav>
        </>
    );
}

function About() {
    return (
        <>
            <main>
                <h2>About</h2>
            </main>
            <nav>
                <Link to="/">Home</Link>
            </nav>
        </>
    );
}
```

运行 `npm start` ，您应该会看到 `Home` 标识

## 如何升级 v6

官方的迁移指南在这里：[React Router v6 迁移指南](https://reactrouter.com/docs/en/v6/upgrading/v5)

## 参考文章

- [React Router v6 Preview](https://reacttraining.com/blog/react-router-v6-pre/)
- [React Router](https://reactrouter.com/docs/en/v6)

## 结语

如果你正在用 `Hook` 重构你的应用，我的建议是可以尝试

## 重要的事

如果你觉得这篇内容对你挺有启发，别忘记点赞 + 关注

欢迎添加我的个人微信：Jiang9684，一起交流前端技术
