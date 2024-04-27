---
title: Weex如何实现dialog
pubDate: 2019-03-09 08:41:04
categories: ["Weex"]
description: ""
---

```
<template>
    <div class="modal-wrapper" v-if="show">
        <div class="modal-mask" />
        <div class="dialog-box" :style="{top:top + 'px'}">
            <slot />
            <div class="dialog-footer" v-if="single">
                <div class="footer-btn cancel"
                    @click="secondaryClicked">
                    <text
                        class="btn-text"
                        :style="{ color: secondBtnColor }"
                    >{{ cancelText }}</text>
                </div>
                <div
                    class="footer-btn confirm"
                    @click="primaryClicked"
                >
                    <text
                        class="btn-text"
                        :style="{ color: mainBtnColor }"
                    >{{ confirmText }}</text>
                </div>
            </div>

            <div class="dialog-footer" v-if="!single">
                <div class="footer-btn confirm"
                    @click="primaryClicked">
                    <text
                        class="btn-text"
                        :style="{ color: mainBtnColor }"
                    >{{ confirmText }}</text>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * 二次确认弹窗组件
 * 支持自定义标题、内容、二次确认按钮文案和样式
 * show 是否显示， 默认不显示
 * top 距离顶部的距离，默认400
 * secondBtnColor  取消按钮样式
 * mainBtnColor 确定按钮样式
 * cancelText 取消文案，默认取消
 * confirmText 确定文案，默认确定
 * single 单个按钮 or 两个按钮，默认两个按钮
*/
export default {
    name: 'Modal',
    props: {
        show: {
            type: Boolean,
            default: false,
        },

        top: {
            type: Number,
            default: 400
        },

        secondBtnColor: {
            type: String,
            default: '#666666'
        },

        mainBtnColor: {
            type: String,
            default: '#0081FF'
        },

        cancelText: {
            type: String,
            default: '取消'
        },

        confirmText: {
            type: String,
            default: '确定'
        },

        single: {
            type: Boolean,
            default: true
        },
    },

    methods: {
        secondaryClicked () {
            this.$emit('secondaryClicked', {
                type: 'cancel'
            });
        },

        primaryClicked () {
            this.$emit('primaryClicked', {
                type: 'confirm'
            });
        },
    },
};
</script>
<style scoped>
.modal-mask {
    width: 750px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.6);
}

.dialog-box {
    z-index: 9999;
    position: fixed;
    left: 96px;
    width: 558px;
    border-radius:8px;
    background-color: #FFFFFF;
}

.dialog-title {
    font-size: 36px;
    text-align: center;
}

.dialog-content {
    padding-top: 36px;
    padding-bottom: 36px;
    padding-left: 36px;
    padding-right: 36px;
}

.dialog-footer {
    flex-direction: row;
    align-items: center;
    border-top-color: #F3F3F3;
    border-top-width: 1px;
}

.footer-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 92px;
}

.cancel {
    border-right-color: #F3F3F3;
    border-right-width: 1px;
}

.btn-text {
    font-size: 36px;
    color: #666666;
    text-align: center;
}
</style>
```
