---
title: 基于MobX 封装 Action 接口 Loading
pubDate: 2019-11-19 17:37:42
categories: ["Mobx"]
description: ""
---

# 代码如下

```
import { action, observable } from 'mobx';

export default class BasicStore {
    @observable isLoading  = observable.map({ });

    @action
    changeLoadingStatus (loadingType, type) {
        this.isLoading.set(loadingType, type);
    }
}

// 初始化loading
export function initLoading(target, key, descriptor) {
    const oldValue = descriptor.value;

    descriptor.value = async function(...args) {
        this.changeLoadingStatus(key, true);
        let res;
        try {
            res = await oldValue.apply(this, args);
        } catch (error) {
            // 做一些错误上报之类的处理
            throw error;
        } finally {
            this.changeLoadingStatus(key, false);
        }
        return res;
    };

    return descriptor;
}
```
