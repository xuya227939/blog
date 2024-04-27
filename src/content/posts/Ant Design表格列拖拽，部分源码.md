---
title: Ant Design表格列拖拽，部分源码
pubDate: 2019-01-09 22:50:08
categories: ["Ant Design"]
description: ""
---

## 难点

- 如何与现有的自定义列、拖拽功能保持兼容。
- 如何与现有的代码和接口数据结构保持兼容。
- 拖动列宽的时候，如何阻止拖拽事件发生。
- 其他边缘情况。

## 源码

```
// 添加onmousedown事件和样式
const ResizeableTitle = (props) => {
    const { width, onMouseDown, index, ...restProps } = props;
    if(!width) {
        return <th {...restProps} />;
    }
    if(width.toString().indexOf('%') > -1) {
        return <th {...restProps} />;
    }
    const propsClassName = `${restProps.className} react-resizable-th`;
    const className = 'react-resizable';
    const key = `react-${index}`;
    // 通过cloneElement，添加span标签
    return React.cloneElement(
        <th {...restProps} />,
        {
            class: propsClassName,
        },
        [
            restProps.children,
            <span
                key={key}
                className={className}
                onMouseDown={onMouseDown}
                index={index}
                width={width}
                oldWidth={width}
            />
        ]
    );
};
this.newColums = (newColums) => {
    return newColums.map((col, index) => ({
        ...col,
        onHeaderCell: column => ({
            width: column.width,
            onMouseDown: this.onMouseDown,
            index
        }),
    }));
};
// 重新渲染列
components = {
    header: {
        cell: ResizeableTitle,
    },
};

// 获取列宽
getColumnWidth = (columnNames) => {
    const widths = [];
    if(document.getElementsByTagName('colgroup').length > 0) {
        const children = document.getElementsByTagName('colgroup')[0].children;
        if(children.length > 0) {
            for(let i = 0, len = children.length; i < len; i++) {
                if(children[i].className != 'ant-table-expand-icon-col') {
                    widths.push({
                        key: columnNames[i],
                        width: Number(children[i].style.width.match(/[0-9]+/)[0])
                    });
                }
            }
        }
    }
    document.onmousemove = null;
    document.onmouseup = null;
    return widths;
}

// 获取table宽度、当前点击列宽、鼠标x轴位置
onMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const table = document.getElementsByTagName('table');
    if(table.length === 0) {
        return;
    }
    if(!(table[0].getAttribute('style'))) {
        return;
    }
    const colgroup = document.getElementsByTagName('colgroup');
    if(colgroup.length === 0 || colgroup.length < 2) {
        return;
    }
    if(colgroup[0].children.length === 0) {
        return;
    }
    const target = e.target;
    const width = Number(target.getAttribute('width'));
    const oldWidth = Number(target.getAttribute('oldWidth'));
    const tableWidth = Number(table[0].getAttribute('style').match(/[0-9]+/));
    this.nativeEventX = e.nativeEvent.x;
    this.onMouseMove(table, colgroup, target, width, oldWidth, tableWidth);
    this.onMouseUp();
}

/**
 * @description 列宽拖动
 * @param table 表格
 * @param colgroup 表格
 * @param target 当前点击col
 * @param width col宽度        400px
 * @param oldWidth col宽度     400px
 * @param tableWidth 表格宽度  400px
 * @memberof FilterWrap
 */
onMouseMove = (table, colgroup, target, width, oldWidth, tableWidth) => {
    document.onmousemove = (e) => {
        let index = Number(target.getAttribute('index'));
        // 展开行特殊处理
        if(colgroup[0].children[0].className === 'ant-table-expand-icon-col') {
            index++;
        }
        const col = colgroup[0].children[index];
        const col2 = colgroup[1].children[index];
        const currentX = (e.clientX) - this.nativeEventX;
        let newWidth;
        document.body.style.cursor = 'col-resize';
        newWidth = width + currentX;
        // 如果移动的距离小于原始宽度
        if(newWidth < oldWidth) {
            return;
        }
        // 负数转换正数
        if(newWidth < 0) {
            newWidth = -(newWidth);
        }
        const colWidth = `width: ${newWidth}px; min-width: ${newWidth}px`;
        const newTableWidth = `width: ${tableWidth + currentX}px;`;
        col.setAttribute('style', colWidth);
        col2.setAttribute('style', colWidth);
        table[0].setAttribute('style', newTableWidth);
        table[1].setAttribute('style', newTableWidth);
        target.setAttribute('width', `${newWidth}`);
    };
}

onMouseUp = () => {
    document.onmouseup = () => {
        // 拖动结束，进行保存
        document.body.style.cursor = 'default';
        document.onmousemove = null;
        document.onmouseup = null;
        let params = {};
        const { columns } = this.state;
        const { pageId, actions } = this.props;
        const postData = this.getDataIndex(columns);
        params.type = pageId;
        params.columnNames = postData;
        params.columnWidth = this.getColumnWidth(postData);
        // 发起接口存储列数据
        actions && actions.updateCustomList(params);
    };
}
```
