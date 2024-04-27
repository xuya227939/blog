---
title: 解决toDataURL空白问题
pubDate: 2020-04-04 16:19:30
categories: ["Canvans"]
description: ""
---

## 起因

最近，笔者接到一个需求，需要在前端把 PDF 转成图片，再把图片转成 Base64，传给小程序。然后发现，只有 PDF.js 这个库，才能满足我们的需求。

## 核心代码

```
renderPage(url) {
    return new Promise((resolve, reject) => {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then((pdf) => {
            const pages = pdf.numPages;
            // 添加canvas, 根据pdf的页数添加
            for (let i = 1; i <= pages; i++) {
                const canvas = document.createElement('canvas');
                const showPdf = document.getElementById('show-pdf');
                canvas.setAttribute('id', 'canvas' + i.toString());
                showPdf.appendChild(canvas);
            }
            let count = 0;
            for (let i = 1; i <= pages; i++) {
                pdf.getPage(i).then((page) => {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.getElementById(('canvas' + i).toString());
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext)
                });
            }
        });
    });
}


// 推送
push(record) {
    this.renderPage(record.url).then(() => {
        const canvas = document.querySelectorAll('#show-pdf > canvas');
        let datas = [];
        for(let i = 0; i < canvas.length; i++) {
            datas.push(canvas[i].toDataURL("image/png"));
        }
    });
}
```

这段代码写完之后，调试，发现获取出来的 Base64，无法还原图片。才疏学浅，死活找不到原因。找了好久，终于看到一篇文章，要看全文，还得关注公众号，获取二维码解锁。emmm，然后，我就解锁了。看到最最关键的两行代码，抱着试试的心态，写上。

![481585839610_ pic_hd](https://user-images.githubusercontent.com/16217324/78422123-90cd5c80-768f-11ea-9e47-7b2b8410da34.jpg)

居然成功了！！！

然后，反思我的代码哪里不对，几次尝试之后，找到问题了，page.render 绘制有延迟。。。把 page.render 代码修改如下。

```
page.render(renderContext).promise.then(() => {
    count++;
    // 已全部完成绘制
    if(count == pages) {
        resolve();
    }
});
```

大功告成，完美解决。
