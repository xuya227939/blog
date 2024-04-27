---
title: Taro实现列表下拉刷新无限滚动
pubDate: 2020-08-03 10:18:47
categories: ["React", "Taro", "Taro UI"]
description: ""
---

## 订单页

`order.jsx`：

```
import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import request from '../../request';
import { STATUS } from './../../config';
import List from './components/list';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            datas: {},
            // 是否滚动到底部
            isScrollToLower: false,
            isRender: false
        };
        // 由于taro-ui 无法解决刷新五次的问题，所以通过这种方式解决
        this.refresherTriggered = false;
        this.refresherTriggered2 = false;
        this.refresherTriggered3 = false;
        this.refresherTriggered4 = false;
        this.refresherTriggered5 = false;
        this.user = Taro.getStorageSync('user') ? JSON.parse(Taro.getStorageSync('user')) : {};
        this.searchParams = {
            pageIndex: 1,
            pageSize: 10,
            agentId: this.user.agent ? (this.user.agent.agentRole.level != '1' ? '' : this.user.agent._id) : '',
            searchTenant: this.user.agent ? this.user.agent.tenant._id : '',
            searchOrgAccount: this.user.agent ? this.user.agent.orgAccount._id : '',
            searchAgent: this.user.agent ? this.user.agent._id : '',
            state: 'all'
        };
    }

    // 下拉刷新
    onRefresherRefresh = async () => {
        const { current } = this.state;
        if(current == 0) this.refresherTriggered = true;
        if(current == 1) this.refresherTriggered2 = true;
        if(current == 2) this.refresherTriggered3 = true;
        if(current == 3) this.refresherTriggered4 = true;
        if(current == 4) this.refresherTriggered5 = true;
        this.setState({ isRender: !this.state.isRender });

        let res = await this.getList(this.searchParams);
        if(current == 0) this.refresherTriggered = false;
        if(current == 1) this.refresherTriggered2 = false;
        if(current == 2) this.refresherTriggered3 = false;
        if(current == 3) this.refresherTriggered4 = false;
        if(current == 4) this.refresherTriggered5 = false;

        this.setState({
            datas: res.result
        });
    }

    componentDidMount() {
        Taro.setNavigationBarTitle({
            title: '工作台'
        });

        this.getList(this.searchParams).then(res => {
            this.setState({
                datas: res.result
            });
        });
    }

    // 获取工单列表
    getList(data) {
        return new Promise((resolve, reject) => {
            request({
                method: 'GET',
                url: 'report/list',
                data
            }).then(res => {
                if (res.errCode == 0) resolve(res);

                if (res.errCode != 0) {
                    Taro.showToast({
                        title: res.errInfo,
                        icon: 'none',
                        duration: 2000
                    });
                    reject(res.errInfo);
                }
            });
        });
    }

    handleClick = async (val) => {
        this.searchParams.state = STATUS[val];
        let res = await this.getList(this.searchParams);

        this.setState({
            datas: res.result,
            current: val
        });
    }

    itemClick = ({ flowId, item }) => {
        Taro.navigateTo({
            url: `/pages/WorkDetails/index?flowId=${flowId}&item=${JSON.stringify(item)}`
        });
    }

    // 滚动到底触发
    onScrollToLower = async () => {
        const { datas } = this.state;
        let pageIndex = this.searchParams.pageIndex + 1;
        if ((pageIndex - 1) * datas.pageSize < datas.count) {
            this.searchParams.pageIndex++;
            this.setState({ isScrollToLower: true });
            let res = await this.getList(this.searchParams);
            setTimeout(() => {
                this.setState({
                    datas: {
                        ...res.result,
                        list: datas.list.concat(res.result.list)
                    },
                    isScrollToLower: false
                });
            }, 500);
        }
    }

    render() {
        const { current, datas, isScrollToLower } = this.state;
        // const tabList = [{ title: datas && datas.stateList && datas.stateList.all ? `全部(${datas.stateList.all})` : '全部(0)' }, { title: datas && datas.stateList && datas.stateList.untreated ? `待处理(${datas.stateList.untreated})` : '待处理(0)' }, { title: datas && datas.stateList && datas.stateList.checking ? `处理中(${datas.stateList.checking})` : '处理中(0)' }, { title: datas && datas.stateList && datas.stateList.checked ? `已处理(${datas.stateList.checked})` : '已处理(0)' }, { title: datas && datas.stateList && datas.stateList.closed ? `已撤销(${datas.stateList.closed})` : '已撤销(0)' }];

        const tabList = [{ title: '全部' }, { title: '待处理' }, { title: '处理中' }, { title: '已处理' }, { title: '已撤销' }];
        return (
            <View className="work-orders-container">
                <AtTabs current={current} tabList={tabList} onClick={this.handleClick}>
                    {
                        tabList.map((item, index) => {
                            let refresherTriggered = false;
                            if(index == 0) refresherTriggered = this.refresherTriggered;
                            if(index == 1) refresherTriggered = this.refresherTriggered2;
                            if(index == 2) refresherTriggered = this.refresherTriggered3;
                            if(index == 3) refresherTriggered = this.refresherTriggered4;
                            if(index == 4) refresherTriggered = this.refresherTriggered5;

                            return (
                                <AtTabsPane key={index.title} current={current} index={index} >
                                    <List
                                        onScrollToLower={this.onScrollToLower}
                                        datas={datas}
                                        isScrollToLower={isScrollToLower}
                                        refresherTriggered={refresherTriggered}
                                        onRefresherRefresh={this.onRefresherRefresh}
                                        itemClick={this.itemClick}
                                    />
                                </AtTabsPane>
                            );
                        })
                    }
                </AtTabs>
            </View>
        );
    }
}

export default Index;

```

`order.less`：

```
page {
    overflow: hidden;
}

.work-orders-container {
    background-color: #fafafa;

    .tab-list {
        margin-bottom: 24px;
    }
}
```

## 卡片页

`list.jsx`：

```
import { View, ScrollView } from '@tarojs/components';
import { AtList } from 'taro-ui';
import RowCard from '../../../component/RowCard';
import './index.less';

// 列表
const List = (props) => {
    const { onScrollToLower, datas, isScrollToLower, refresherTriggered, onRefresherRefresh, itemClick } = props;
    return (
        <ScrollView
            scrollY
            scrollWithAnimation
            scrollTop={0}
            refresherEnabled
            refresherTriggered={refresherTriggered}
            onRefresherRefresh={onRefresherRefresh}
            style={{ height: '100vh' }}
            onScrollToLower={onScrollToLower}
        >
            <View>
                {
                    datas && datas.list && datas.list.map(item => {
                        return (
                            <AtList
                                className="tab-list"
                                key={item._id}
                            >
                                <View onClick={() => itemClick({ flowId: item.flowId, item })}>
                                    <RowCard
                                        title="业务类型："
                                    >
                                        <View>{item.taskType}</View>
                                    </RowCard>
                                    <RowCard
                                        title="客户姓名："
                                    >
                                        <View>{item.insurantName}</View>
                                    </RowCard>
                                    <RowCard
                                        title="联系电话："
                                    >
                                        <View>{item.insurantPhone}</View>
                                    </RowCard>
                                    <RowCard
                                        title="案件号："
                                    >
                                        <View>{item.reportIdArray}</View>
                                    </RowCard>
                                    <RowCard
                                        title="创建时间："
                                    >
                                        <View>{item.ctime}</View>
                                    </RowCard>
                                    <RowCard
                                        title="工单状态："
                                    >
                                        <View>{item.state}</View>
                                    </RowCard>
                                </View>
                            </AtList>
                        );
                    })
                }
                {
                    datas && datas.list && datas.list.length == 0 &&
                    <View className="empty-content">
                        没有内容
                    </View>
                }
                {
                    isScrollToLower &&
                    <View className="scroll-lower">
                        正在加载中
                    </View>
                }
            </View>
        </ScrollView>
    );
};

export default List;
```

`list.less`：

```
.scroll-lower {
    display: flex;
    justify-content: center;
    color: #a8a8a8;
    height: 150px;
}

.empty-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 28px;
    color: #a8a8a8;
}
```
