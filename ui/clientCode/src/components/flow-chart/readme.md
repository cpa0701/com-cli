#### 流程图组件

##### API

| 参数      | 说明       | 类型   | 默认值 | 版本  |
| --------- | ---------- | ------ | ------ | ----- |
| nodeList  | 节点列表   | Object | -      | 0.1.0 |
| asideList | 工具栏列表 | Array  | -      | 0.1.0 |

##### nodeList 格式

```
{
    nodeList: [
        {
            id: 'nodeA',
            name: '流程A-节点A',
            type: 'task',
            left: '26px',
            top: '161px',
            icon: 'el-icon-user-solid'
        },
        ...
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB'
    }, {
        from: 'nodeB',
        to: 'nodeC'
    }]
}
```

##### asideList 格式

```
[
    {
        icon: 'el-icon-document',
        name: 'java'
    },
    {
        icon: 'el-icon-document-checked',
        name: 'jar'
    },
    {
        icon: 'el-icon-link',
        name: 'http'
    }
]
```

| 事件名     | 说明         | 参数                 | 版本  |
| ---------- | ------------ | -------------------- | ----- |
| connection | 连线事件     | {from: from, to: to} | 0.1.0 |
| deleteLine | 删除连线     | sourceId， targetId  | 0.1.0 |
| deleteNode | 删除节点     | nodeId               | 0.1.0 |
| dblClick   | 节点双击事件 | node                 | 0.1.0 |
| addNode    | 新增节点     | node                 | 0.1.0 |
