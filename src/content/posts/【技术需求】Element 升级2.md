---
title: 【技术需求】Element 升级 2.x
pubDate: 2022-03-28 16:19:09
categories: ["技术需求"]
description: ""
---

## 背景

`link-center` 项目的技术栈比较老旧，未来可以预测到许多业务需要在最新的 `Element` 的基础上进行开发，靠原生 `Vue` 手写实现封装花费时间较多且稳定性不是很好，比如实现一个日期组件

1. 如今大多数开源的 `Vue` 应用，如 `vue-easytable
`、`vue-treeselect` 等都依赖于 `Vue 2.x` 以上的版本，`Vue 2.x` 以下版本显然是没有办法兼容这些组件的
2. 目前使用的版本也缺乏一些新的特性，升级之后，也是为了更好的适应

## 目标

1. 从 `1.4.13` 平稳过渡到 `Element 2.x` 以上
2. 兼容现有样式和组件

## 升级

移除 `package.json` 中的 `element-ui` 版本

```
// package.json
element-ui: '2.15.7'
```

安装最新版本

```
$ npm install element-ui @2.15.7 -S
```

## 改动点

### 引入位置替换

- 样式名称替换

      在 `src/index.js` 中修改新增的 `theme-chalk` 主题，将 `import 'element-ui/lib/theme-default/index.css` 替换为 `

  import 'element-ui/lib/theme-chalk/index.css`

- .babelrc

  把 `theme-default` 替换为 `theme-chalk`

### 引入优先级问题

有的组件样式需要进行定制覆盖，于是就在组件里面用 `css scoped` 进行了同类名的样式替换，这样在开发环境下效果是符合预期的，但是打包编译后，优先级就变了。需要在 `src/index.js` 修改引入文件路径顺序的问题

修改前：

```
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

修改后：

```
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
Vue.use(ElementUI)
```

### 页面全局报错修正

- 编译报错，`Vue packages version mismatch`

  这个错误是因为在 `element ui` 版本升级过后，对应的 `Vue` 版本 及 `vue-template-compiler` 的版本未升级的原因

  ```
  $ npm install vue-template-compile @2.6.14 -S
  ```

- 界面渲染失败，控制台报错：`_v` 属性不存在

  这里需要注意 `Element 2.x` 最低兼容 `Vue 2.5.x`，因此升级 Vue 到 2.5 以上

  ```
  $ npm uninstall vue
  $ npm install vue@2.6.12
  ```

- 编译报错, `TypeError: VueLoaderPlugin is not a constructor`

```
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        // 请确保引入这个插件！
        new VueLoaderPlugin()
    ]
}
```

`vue-loader` 也需要升级，以便支持 `Element 2.x`

### 组件属性变更

- 项目中的 icon 图标：

  升级后很多 `icon` 名称发生了变化导致无法显示，需要去文档查看最新的 icon 名称

- Button：

  为了方便使用第三方图标，`Button` 的 `icon` 属性现在需要传入完整的图标类名

- Checkbox：

  `Checkbox`的 `change` 事件中，参数由 `event` 变为了 `value`

- Input：

  1. 移除了 `input` 的 `icon` 属性。现在通过 `suffix-icon` 或者`suffix` 具名插槽来加入尾部图标

  2. 移除 `on-icon-click` 和 `click` 事件，现在如果需要为输入框中的图标添加点击事件，请以具名 `slot` 的方式添加图标

  3. `change` 事件现在仅在输入框失去焦点或用户按下回车时触发，与原生 `input` 元素一致。如果需要实时响应用户的输入，可以使用 `input` 事件

  4. 盒模型从 `block` 修改为 `inline-block`

  5. `Input` 的 `id` 属性被传递到了最底层的 `input` 元素，需要关注有 `id` 的 `el-input`

- Select：

  1. 盒模型从 `block` 修改为 `inline-block`

  2. `Select`，值为对象类型时，需要提供一个 `value-key` 作为唯一性标识

  3. `Select`，过滤情况下，`placeholder` 为选中选项的 `label`

- Switch：

  1. 由于 `on-*` 属性在 JSX 中会被识别为事件，导致 `Switch` 所有 `on-*` 属性在 JSX 中无法正常工作，所以 `on-*` 属性更名为 `active-`，对应地，`off-` 属性更名为 `inactive-*`。受到影响的属性有：`on-icon-class、off-icon-class、on-text、off-text、on-color、off-color、on-value、off-value`

  2. `active-text` 和 `inactive-text` 属性不再有默认值

- TimePicker：

  点击清空按钮时，`change` 中的参数由 `’’` 变为 `null`

- DatePicker：

  同 `timepicker`

- DateTimePicker：

  同 `timepicker`

- Upload：

  `Upload` 重构升级，`default-file-list` 属性更名为 `file-list`, `show-upload-list` 属性更名为 `show-file-list`，`thumbnail-mode` 属性被移除

- Form 组件：

  1. `Form validateField()` 方法回调的参数更新

  2. `Form` 移除输入框的成功状态

- Table 组件：

  1. 移除通过 `inline-template` 自定义列模板的功能

  2. `sort-method` 现在和 `Array.sort` 保持一致的逻辑，要求返回一个数字

  3. 将 `append slot` 移至 `tbody` 元素以外，以保证其只被渲染一次
  4. `expand` 事件更名为 `expand-change`，以保证 `API` 的命名一致性

  5. `row-class-name` 和 `row-style` 的函数参数改为对象，以保证 `API` 的一致性

- Tag：

  `type` 属性现在支持 `success、info、warning 和 danger` 四个值

- Pagination：

  表单组件的 `change` 事件和 `Pagination` 的 `current-change` 事件现在仅响应用户交互

- Loading：

  非全屏 `Loading` 遮罩层的 `z-index` 修改为 2000；
  全屏 `Loading` 遮罩层的 `z-index` 值会随页面上的弹出组件动态更新

- Tabs：

  1. 盒模型从 `inline-block` 修改为 `block`，`Tab-Pane` 移除 `label-content` 属性

  2. `Tabs` 现在内部不再维护 `tab` 实例，需要在外部通过相关事件去处理

- Dropdown：

  1. `menu-align` 属性变更为 `placement`，增加更多方位属性

  2. `show-timeout` 和 `hide-timeout` 属性现在仅在 `trigger` 为 `hover` 时生效

- Dialog：

  1. `Dialog` 的遮罩层现在默认插入至 `body` 元素上

  2. 移除 `size` 属性，现在 `Dialog` 的尺寸由 `width` 和 `fullscreen` 控制

  3. 移除通过 `v-model` 控制 `Dialog` 显示和隐藏的功能

- Tooltip：

  1. 重构 `Tooltip`，不再生成额外的 `HTML` 标签，确保被 `tooltip` 包裹的组件的结构不变

  2. `el-tooltip` 标签中，子元素如果有 `v-if`，则需要为 ` el-tooltip` 也加上 `v-if`

### 非兼容性更新带来的警告

虽然项目能跑起来了，但是控制台还会有很多警告，一部分是来自 `Vue` 本身的警告，还有一些是 `Element` 的非兼容属性或者即将废弃的属性所带来的警告，需要我们对这些警告进行修改。常见的有：

- `v-for` 循环渲染组件时，必须为组件绑定 `key` 值
- `v-for` 绑定的 `key` 值中，存在同样的 `key` 值
- `Element` 中的废弃属性带来的警告，比如：`input` 中的 `icon`改为 `suffix-icon`

## 测试事项

- 建议把测试时间尽量拉长一点，这样子才能发现项目中潜在的问题
- 全量测试
