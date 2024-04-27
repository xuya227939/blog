---
title: 微信小程序 Canvas 签字
pubDate: 2020-05-13 09:53:52
categories: ["微信小程序"]
description: ""
---

最近迫于签字结果返回太慢，所以需要把旋转图片由原先后端处理改为前端处理，查阅文档，研究一番，发现小程序上旋转，主要是通过 canvas 的 translate、rotate 完成。

![image](https://user-images.githubusercontent.com/16217324/81764019-29fb5880-9503-11ea-80d6-939a977247c5.png)

Canvas 坐标系统，由上图可得，Canvas 2D 环境中坐标系统和 Web 的坐标系统是一致的，有以下几个特点：

1. 坐标原点 (0,0) 在左上角
2. X 坐标向右方增长
3. Y 坐标向下方延伸

## 伪代码

```
wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    canvasId: 'myCanvas',
    success: (res) => {
        wx.getImageInfo({
            src: res.tempFilePath,
            success: (imageRes) => {
                const height = imageRes.height;
                const width = imageRes.width;
                this.setState({
                    canvasHeight: width,
                    canvasWidth: height
                });
                const context2 = wx.createCanvasContext('myCanvas2', this.$scope);
                context2.translate(height / 2, width / 2);
                context2.rotate(270 * Math.PI / 180);
                context2.drawImage(imageRes.path, -width / 2, -height / 2, width, height);
                context2.draw(false, () => {
                    this.getTempFilePath();
                });
            }
        });
    },
    fail: (error) => {
        console.error('canvasToTempFilePathfail', error);
    }
}, this);

// 获取图片url，安卓有性能问题，所以需要延迟
getTempFilePath(errorCount = 5) {
    setTimeout(() => {
        const { signInfo } = this.props;
        const { signers, signerNames } = this.state;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'myCanvas2',
            success: (res) => {
                const signPic = this.fileTobase64(res.tempFilePath);
            },
            fail: (err) => {
                if(errorCount < 7) {
                    this.getTempFilePath(++errorCount);
                }
                console.error('canvasToTempFilePathfail', err);
            }
        }, this);
    }, errorCount * 100);
}

fileTobase64 = path => {
    return 'data:image/jpeg;base64,' + Taro.getFileSystemManager().readFileSync(path, 'base64');
};

render() {
    return (
        <Canvas
            canvasId="myCanvas"
            style={{ width: '305px', height: wx.getSystemInfoSync().windowHeight + 'px' }}
            id="myCanvas"
            disableScroll="false"
            onTouchStart={(e) => this.touchStart(e)}
            onTouchMove={(e) => this.touchMove(e)}
        />
        <Canvas
            canvasId="myCanvas2"
            id="myCanvas2"
            disableScroll="false"
            style={{ width: canvasWidth + 'px', height: canvasHeight + 'px' }}
        />
    );
}
```

## 旋转角度代码

```
wx.getImageInfo({
    src: path,
    success: (res) => {
        let canvasContext = wx.createCanvasContext('my-canvas', _this);
        // 下面按比例写死宽度高度是为了压缩图片提升上传速度，可按实际需求更改
        let rate = res.height / res.width;
        let width = 500;
        let height = 500 * rate;
        // 根据orientation值处理图片
        switch (res.orientation) {
            case 'up':
                // 不需要旋转
                _this.setData({
                    canvasWidth: width,
                    canvasHeight: height,
                });
                canvasContext.drawImage(path, 0, 0, width, height);
                break;
            case 'down':
                // 需要旋转180度
                _this.setData({
                    canvasWidth: width,
                    canvasHeight: height,
                });
                canvasContext.translate(width / 2, height / 2);
                canvasContext.rotate(180 * Math.PI / 180);
                canvasContext.drawImage(path, -width / 2, -height / 2, width, height);
                break;
            case 'left':
                // 顺时针旋转270度
                _this.setData({
                    canvasWidth: height,
                    canvasHeight: width,
                });
                canvasContext.translate(height / 2, width / 2);
                canvasContext.rotate(270 * Math.PI / 180);
                canvasContext.drawImage(path, -width / 2, -height / 2, width, height);
                break;
            case 'right':
                // 顺时针旋转90度
                _this.setData({
                    canvasWidth: height,
                    canvasHeight: width,
                });
                canvasContext.translate(height / 2, width / 2);
                canvasContext.rotate(90 * Math.PI / 180);
                canvasContext.drawImage(path, -width / 2, -height / 2, width, height);
                break;
        }
    }
});
```

## Canvas 2d

```
export default class Signature extends Component<IProps, IState> {
    constructor(props: IProps | Readonly<IProps>) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

        // 放到下一个时间切片执行
        wx.nextTick(() => {
            const query = wx.createSelectorQuery();
            query
                .select('#myCanvas')
                .fields({ node: true, size: true })
                .exec(res => {
                    if (res && res[0]) {
                        this.initCanvas(res);
                    } else {
                        wx.nextTick(() => {
                            query
                                .select('#myCanvas')
                                .fields({ node: true, size: true })
                                .exec(res => {
                                    if (res && res[0]) this.initCanvas(res);
                                });
                        });
                    }
                });
        });
    }

    initCanvas = (res: any) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        this.context = ctx;
        this.context.lineWidth = 4.5;
        ctx.scale(dpr, dpr);
    };

    // 手指触摸动作开始
    touchStart = (e: any) => {
        this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y);
    };

    // 手指触摸后移动
    touchMove = (e: any) => {
        this.context.lineTo(e.changedTouches[0].x, e.changedTouches[0].y);
        this.context.stroke();
        this.isClear = false;
        this.context.draw(true);
        this.context.moveTo(e.changedTouches[0].x, e.changedTouches[0].y);
    };

    // 清空画布
    clearCanvas = () => {
        this.signPath = '';
        this.isClear = true;
        this.context.draw();
        this.context.lineWidth = 4.5;
    };

    btnConfirm() {

        const query = wx.createSelectorQuery();
        query
            .select('#myCanvas')
            .fields({ node: true, size: true })
            .exec(res => {
                const canvas = res[0].node;
                wx.canvasToTempFilePath(
                    {
                        x: 0,
                        y: 0,
                        canvas,
                        success: (res: { tempFilePath: string }) => {
                            this.signPath = res.tempFilePath;

                        },
                        fail: () => {}
                    },
                    this.$scope
                );
            });
    }

    render() {
        return (
            <Canvas
                type="2d"
                style={{ width: '100%', height: '100%' }}
                id="myCanvas"
                disableScroll={false}
                onTouchStart={this.touchStart}
                onTouchMove={this.touchMove}
            />
        );
    }
}

```

自定义组件，没有 `onReady` 方法，放在 `didmout` 执行，如果 `didmout` 获取不到 `Canvas` 实例，则通过 `wx.nextTick`，放到下一个时间切片获取。

如果不是自定义组件，页面组件，则通过 `onReady` 方法获取，`Canvas 2d` 方案，该方案有很大的问题，无法清除画布，微信小程序官方 BUG，截止到 `2021.06.03`，还未解决。
