---
title: MobX 源码解析-observable
pubDate: 2019-12-06 17:56:13
categories: ["Mobx"]
description: ""
---

## 前言

最近一直在用 `MobX` 开发中小型项目，开发起来真的，真的很爽，响应式更新，性能快，样板代码减少(相对 `Redux`)。所以，想趁 2019 年结束前把 `MobX` 源码研究一遍。

## Tips

- 由于 `MobX` 的源码很大，因此只会把个人认为比较重要的部分截取说明
- 阅读的 `MobX` 源码版本@5.15.0
- 由于本人对 `TypeScript` 经验尚浅，所以我会将其编译成 `JavaScript` 阅读
- 下面会用 `mobx-source` 简称代替 `Mobx`

## 如何调试源码

- `$ git clone https://github.com/mobxjs/mobx.git`
- `$ cd mobx`
- `$ cnpm i`
- 查看 `package.json`，发现执行脚本有`quick-build` 和 `small-build`，我选择的是`small-build`，`cnpm run small-build` 然后在根目录下会生成 `.build.es5` 和 `.build.es6`

```
"scripts": {
    "quick-build": "tsc --pretty",
    "small-build": "node scripts/build.js"
},
```

- 把 `.build.es6` 改名为 `mobx-source` 放到我写好的脚手架中

  ![image](https://user-gold-cdn.xitu.io/2019/12/8/16ee3607057477ff?w=639&h=260&f=png&s=29533)

- 引入绝对路径

```
import { observable, action } from '../../mobx-source/mobx';
```

- 然后就可以愉快的调试源码了

```
function createObservable(v, arg2, arg3) {
    debugger;
    ...
}
```

## Demo

让我们从计数器开始，看看 `MobX` 最基础的使用方式
`React`

```
@inject('counterStore')
@observer
class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { counterStore } = this.props;
        return (
            <section>
                <button onClick={() => counterStore.add()}>+</button>
                <span>count is: {counterStore.obj.count}</span>
                <button onClick={() => counterStore.reduce()}>-</button>
            </section>
        );
    }
}
```

MobX

```
import { observable, action } from '../../mobx-source/mobx';
class CounterStore {
    @observable obj = {
        count: 0
    };

    @action
    add() {
        this.obj.count++;
    }

    @action
    reduce() {
        this.obj.count--;
    }
}

export default CounterStore;
```

界面如下

![image](https://user-gold-cdn.xitu.io/2019/12/8/16ee3606f0275295?w=176&h=92&f=png&s=1784)

功能非常简单，实现也非常简单。通过 `observable` 对 `count` 进行了监听，只要 `count` 产生了数据变化，就会自动刷新界面。那么，`MobX` 是如何做到的呢？让我们一步步来分析。

## observable

首先，看入口文件，`mobx-source -> mobx.js`，发现`observable，action，runInAction` 等其他方法都是从 `internal` 引入的。

```
export { observable, action, runInAction } from "./internal";
```

打开 `internal.js`

```
export * from "./api/action";
export * from "./api/autorun";
export * from "./api/observable";
```

然后看 `api/observable` 这个文件，发现 `export const observable = createObservable;`

```
function createObservable(v, arg2, arg3) {
    // @observable someProp;
    if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
        return deepDecorator.apply(null, arguments);
    }
    // it is an observable already, done
    if (isObservable(v))
        return v;
    // something that can be converted and mutated?
    const res = isPlainObject(v)
        ? observable.object(v, arg2, arg3)
        : Array.isArray(v)
            ? observable.array(v, arg2)
            : isES6Map(v)
                ? observable.map(v, arg2)
                : isES6Set(v)
                    ? observable.set(v, arg2)
                    : v;
}
```

`createObservable` 主要做了以下几件事：

1、如果被观察的对象是 `string` 或 `symbol` ，那么执行 `deepDecorator.apply(null, arguments);`
`export const deepDecorator = createDecoratorForEnhancer(deepEnhancer); ` deepEnhancer 方法内部会判断当前修改的值类型，来走不同的工厂方法。

2、如果第一个参数已经是一个可被观察的对象，那么返回这个对象。

3、对第一个参数进行类型(`object、array、map、set`)判断，然后调用不同的工厂方法。

```
const observableFactories = {
    box(value, options) {
        ...
    },
    array(initialValues, options) {
        ...
    },
    map(initialValues, options) {
        ...
    },
    set(initialValues, options) {
        ...
    },
    object(props, decorators, options) {
        ...
    },
    ref: refDecorator,
    shallow: shallowDecorator,
    deep: deepDecorator,
    struct: refStructDecorator
};
```

接下来，我们来分析 `createDecoratorForEnhancer` 方法，主要有两个参数，第一个默认为 `true`，第二个是个函数。`res.enhancer = enhancer;`，会把上面传的`deepEnhancer`，在此处进行挂载。根据变量不同类型，调用 `observable` 的不同参数，如 `object, array` 来进行劫持。

```
export function createDecoratorForEnhancer(enhancer) {
    invariant(enhancer);
    const decorator = createPropDecorator(true, (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) => {
        if (process.env.NODE_ENV !== "production") {
            invariant(!descriptor || !descriptor.get, `@observable cannot be used on getter (property "${stringifyKey(propertyName)}"), use @computed instead.`);
        }
        const initialValue = descriptor
            ? descriptor.initializer
                ? descriptor.initializer.call(target)
                : descriptor.value
            : undefined;
        asObservableObject(target).addObservableProp(propertyName, initialValue, enhancer);
    });
    const res =
    // Extra process checks, as this happens during module initialization
    typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production"
        ? function observableDecorator() {
            // This wrapper function is just to detect illegal decorator invocations, deprecate in a next version
            // and simply return the created prop decorator
            if (arguments.length < 2)
                return fail("Incorrect decorator invocation. @observable decorator doesn't expect any arguments");
            return decorator.apply(null, arguments);
        }
        : decorator;
    res.enhancer = enhancer;
    return res;
}
```

`createPropDecorator` 方法创建属性拦截器，`addHiddenProp` 方法为目标对象添加 `Symbol(mobx pending decorators)` 属性。

```
export function createPropDecorator(propertyInitiallyEnumerable, propertyCreator) {
    return function decoratorFactory() {
        let decoratorArguments;
        const decorator = function decorate(target, prop, descriptor, applyImmediately
        // This is a special parameter to signal the direct application of a decorator, allow extendObservable to skip the entire type decoration part,
        // as the instance to apply the decorator to equals the target
        ) {
            ...
            if (!Object.prototype.hasOwnProperty.call(target, mobxPendingDecorators)) {
                const inheritedDecorators = target[mobxPendingDecorators];
                addHiddenProp(target, mobxPendingDecorators, Object.assign({}, inheritedDecorators));
            }
            target[mobxPendingDecorators][prop] = {
                prop,
                propertyCreator,
                descriptor,
                decoratorTarget: target,
                decoratorArguments
            };
            return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
        };
    };
}
```

由于上面我定义的变量是对象，所以 Mobx 会把这个对象拦截，执行 `observableFactories.object`

```
object(props, decorators, options) {
    if (typeof arguments[1] === "string")
        incorrectlyUsedAsDecorator("object");
    const o = asCreateObservableOptions(options);
    if (o.proxy === false) {
        return extendObservable({}, props, decorators, o);
    }
    else {
        const defaultDecorator = getDefaultDecoratorFromObjectOptions(o);
        const base = extendObservable({}, undefined, undefined, o);
        const proxy = createDynamicObservableObject(base);
        extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator);
        return proxy;
    }
},
```

`asCreateObservableOptions` 创建一个可观察的对象，由于已经是 `object` 了，所以 `proxy` 为 `undefined`，则进 `else`， `const base = extendObservable({}, undefined, undefined, o);` 加工处理下 `o` 对象，转成 `Symbol` 数据类型，然后看 `createDynamicObservableObject`，很关键的方法，这个函数内部就是利用 `Proxy` 来创建拦截器，对这个对象的属性 `has， get， set， deleteProperty， ownKeys，preventExtensions` 方法进行了代理拦截。

```
export function createDynamicObservableObject(base) {
    const proxy = new Proxy(base, objectProxyTraps);
    base[$mobx].proxy = proxy;
    return proxy;
}

const objectProxyTraps = {
    has(target, name) {
        ...
    },
    get(target, name) {
        ...
    },
    set(target, name, value) {
        ...
    },
    deleteProperty(target, name) {
        ...
    },
    ownKeys(target) {
        ...
    },
    preventExtensions(target) {
        ...
    }
};
```

`extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator);`，会对对象属性遍历，来创建拦截器，而且这里面会牵扯到一个事务的概念，后面会分析事务。

## 博客

欢迎关注我的[博客](https://github.com/xuya227939/LiuJiang-Blog)
