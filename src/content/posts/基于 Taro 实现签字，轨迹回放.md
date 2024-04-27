---
title: 基于 Taro 实现签字，轨迹回放
pubDate: 2020-06-16 14:02:18
categories: ["Taro"]
description: ""
---

## 前言

最近公司要在小程序上实现签字笔迹追踪，看了下网上关于 Taro 如何实现的文章，代码都很乱，很杂，所以，想记录下自己是如何实现的，并附上源码。

## 效果演示

![演示](https://user-images.githubusercontent.com/16217324/84784978-82030e80-b01d-11ea-8815-baf3ff328455.gif)

## 源码

`index.js`

```
import Taro, { Component } from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';
import './index.less';

// 图片url（或filepath）转base64
const fileTobase64 = path => {
    return 'data:image/jpeg;base64,' + Taro.getFileSystemManager().readFileSync(path, 'base64');
};

// 签字轨迹
const historyTrajectory = {
    historyData:[
        {
            //操作时间
            time: 0,
            /**
            * 操作类型
            * 绘图：mapping
            */
            operation: 'mapping',//操作类型
            /**
            * 绘制路径
            * startX：开始x坐标
            * startY：开y纵坐标
            * currentX：目标位置的 x 坐标
            * currentY：目标位置的 y 坐标
            * z：1代表画线时鼠标处于move状态，0代表处于松开状态
            * colorStr：线的填充颜色
            * pen：笔迹大小
            */
            lineArr: {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                z: 0,
                colorStr: '#000',
                pen: 3
            }
        }
    ]
};

export default class Signature extends Component {
    constructor(props) {
        super(props);
        this.state = { };
        this.pen = 3;
        this.context = '';
        this.signPath = '';
        this.moveToX = 0;
        this.moveToY = 0;
        // 签字开始时间
        this.startDate = new Date().getTime();
        this.timer = '';
        this.colorStr = '#000';
    }

    componentDidMount() {
        const context = Taro.createCanvasContext('myCanvas', this.$scope);
        this.context = context;
        this.context.draw();
        this.context.lineWidth = this.pen;
    }

    // 手指触摸动作开始
    touchStart = (e) => {
        this.context.lineWidth = this.pen;
        this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y);

        this.moveToX = Math.floor(e.changedTouches[0].x);
        this.moveToY = Math.floor(e.changedTouches[0].y);
        historyTrajectory.historyData.push({
            time: new Date().getTime() - this.startDate,
            operation: 'mapping',
            lineArr: {
                startX: this.moveToX,
                startY: this.moveToY,
                currentX: Math.floor(e.changedTouches[0].x),
                currentY: Math.floor(e.changedTouches[0].y),
                z: 1,
                colorStr: this.colorStr,
                pen: this.pen
            }
        });
    }

    // 手指触摸后移动
    touchMove = (e) => {
        const lineToX = Math.floor(e.changedTouches[0].x);
        const lineToY = Math.floor(e.changedTouches[0].y);
        this.context.lineWidth = this.pen;
        this.context.lineTo(lineToX, lineToY);
        this.context.stroke();
        this.context.draw(true);
        this.context.moveTo(lineToX, lineToY);

        historyTrajectory.historyData.push({
            time: new Date().getTime() - this.startDate,
            operation: 'mapping',
            lineArr: {
                startX: this.moveToX,
                startY: this.moveToY,
                currentX: lineToX,
                currentY: lineToY,
                z: 1,
                colorStr: this.colorStr,
                pen: this.pen
            }
        });

        this.moveToX = lineToX;
        this.moveToY = lineToY;
    }

    onTouchEnd = () => {

    }

    // 清空画布
    clearCanvas = () => {
        this.signPath = '';
        this.context.draw();
        historyTrajectory.historyData = [];
        historyTrajectory.historyData.push({
            time: 0,
            operation: 'mapping',
            lineArr: {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                z: 0,
                colorStr: this.colorStr,
                pen: this.pen
            }
        });
    }

    replay = () => {
        this.signPath = '';
        this.context.draw();
        clearInterval(this.timer);
        const startDate = new Date().getTime();
        let i = 0;
        let len = historyTrajectory.historyData.length;
        this.timer = setInterval(() => {
            const curTime = new Date().getTime() - startDate;
            if (curTime >= historyTrajectory.historyData[i].time) {
                switch (historyTrajectory.historyData[i].operation) {
                    case 'mapping':
                        this.context.setStrokeStyle(historyTrajectory.historyData[i].lineArr.colorStr);
                        this.context.lineWidth = historyTrajectory.historyData[i].lineArr.pen;
                        this.context.moveTo(historyTrajectory.historyData[i].lineArr.startX, historyTrajectory.historyData[i].lineArr.startY);
                        this.context.lineTo(historyTrajectory.historyData[i].lineArr.currentX, historyTrajectory.historyData[i].lineArr.currentY);
                        this.context.stroke();
                        this.context.draw(true);
                        break;
                }
                i++;
            }
            if(i >= len) {
                clearInterval(this.timer);
            }
        }, 1);
    }

    // 获取签字base64
    confirm() {
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'myCanvas',
            success: (res) => {
                console.log('cofirm：', fileTobase64(res.tempFilePath));
            },
            fail: (error) => {
                console.error('btnConfirm：', error);
            }
        }, this.$scope);
    }

    render() {
        return (
            <View className="signature-container">
                <View className="canvas-area" style={{ height: (Taro.getSystemInfoSync().screenHeight - 150 + 'px') }}>
                    <Canvas
                        canvasId="myCanvas"
                        className="my-canvas"
                        disableScroll="false"
                        onTouchStart={this.touchStart}
                        onTouchMove={this.touchMove}
                        onTouchEnd={this.onTouchEnd}
                    />
                </View>
                <View className="canvas-btn">
                    <View className="btn" onClick={this.confirm}>确认</View>
                    <View className="btn" onClick={this.clearCanvas}>清除</View>
                    <View className="btn" onClick={this.replay}>回放</View>
                </View>
            </View>
        );
    }
}
```

`index.less`

```
.signature-container {

    padding: 24px;

    .canvas-area {
        overflow: hidden;
        width: 100%;
        border: 2px dashed #dcdcdc;
    }

    .my-canvas {
        width: 100%;
        height: 100%;
    }

    .canvas-btn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 24px;

        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            border-radius: 5px;
            flex: 1;
            background-color: #359a64;
            color: #fff;
            height: 60px;
            margin: 0 24px;
        }
    }
}

```
