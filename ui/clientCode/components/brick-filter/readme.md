# Filter 



## 适用场景描述

本组件提供配置化的 Form 生成，无需再书写 template , 适用于表单查询区域的联动性不强的情况。

> 当前版本只能做 v-model 绑定值的联动，暂不支持 select options 的改动，查看联动请参考 <a href="#联动介绍">联动介绍</a>

```html
<amazing-filter
      :view-brick="filterView"
      :http-action="request"
      @change="handleChange"
      @query="handleQuery">
  
</amazing-filter>
```

## Attribute

| 属性名称    | 说明                                 | 类型   | 默认值 |
| ----------- | ------------------------------------ | ------ | ------ |
| view-brick  | 表单项配置                           | Array  | 无     |
| http-action | 点击 "查询" 按钮时获取远程数据的配置 | Object | 无     |

- view-brick 的情况请跳转至 <a href="#View-Brick">View-Brick</a> 查看

- http-action 的配置符合 axios 库的配置之外提供一个参数预处理可选配置[beforeRequest]
  - url [String]
  - method [String]
  - options [Object]
  - success [Function( response )] 
  - fail  [Function( error )] 
  - beforeRequest [Function( data )] 



> success 回调函数是http状态码正常的结果
>
> fail 相反
>
> beforeRequest 可以在其中使用this，this已指向 *使用该amazing-filter组件的实例*

## Event

| 属性名称 | 说明                             | 类型     | 默认值                                   |
| -------- | -------------------------------- | -------- | ---------------------------------------- |
| change   | 内部任意响应式数据发生改变时触发 | Function | ( key,newValue,oldValue,filter ) => {  } |
| query    | 点击 "查询" 按钮触发的回调       | Function | ( data ) => {  }                         |



## Filter 用法

查询数据，提供两种方式，

- `query`  的回调自行处理
- `http-action` 中传入符合 axios 的配置,自动完成请求

```html
<template>
  <div id="app">
    <amazing-filter
      :view-brick="filterView"
      :http-action="request"
      @change="handleChange"
      @query="handleQuery"
    >
    </amazing-filter>
  </div>
</template>
<script>
import AmazingFilter from "./components/amazing-filter";
import viewConfig from "./viewConfig";
export default {
  name: "App",
  components: {
    AmazingFilter
  },
  data() {
    return {
      filterView: viewConfig,
      request:{
        url: "/api/vendorCityEnumList",
        method: "POST",
        options: {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        },
        success:this.response
      }
    };
  },
  methods: {
    handleChange(key, newval, oldval,filter) {
      console.table([
        `当前变更的字段为${key}`,
        `当前值为 ${newval}`,
        `旧的值为 ${oldval}`
      ]);
    },
    handleQuery(data) {
      console.log(data);
    },
    response(res){
      console.log(res)
    },
  },
  
  mounted(){
    console.log(this.$refs)
  }
};
</script>
```



## 联动介绍

若需表单值之间的联动，请走 change 事件,并拿到 emit 出来的值，第四个值 `filter`（我推荐这么叫） 即是内部双向绑定了表单的对象

```javascript
change( key,newValue,oldValue,filter ) { 
  if(key === "xxx"){
     filter[key] = "666666" //已双向绑定，内部值会自动更新
  }
}
```

> 暂时不支持 select option 之类的变动，后续可能加入



# View-Brick

视图砖块，会随传入的数组item的顺序来进行渲染。

## 最简单的使用

只需提供 key 与 label ，可生成输入框

```javascript
{
  key: "vendorId",
  label: "供应商ID",
}
```





## 现可用配置概览

```javascript
/* eslint-disable*/
/* 加入表单校验器 */
import { phoneNumberValidator } from "./validator";

/* 自定义级别 组件 */
import custom from "./components/custom.vue"
import testRange from "./components/testRange.vue"

export default [
  {
    key: "vendorId",
    label: "供应商ID",
  },
  {
    key:"vendorCode",
    label:"供应商编号",
    component:"input",
    default:20200819
  },
  {
    key:"vendorPhoneNumber",
    label:"供应商手机号",
    component:"input",
    rules: [{ validator: phoneNumberValidator, trigger: "blur" }],
    default:"13973140494"
  },
  {
    key:"vendorType",
    label:"供应商类型",
    component:"select",
    multiple: true,
    options:[
      {
        text:"蔬菜供应商",
        value:"VEGETABLE"
      },
      {
        text:"常规供应商",
        value:"SIMPLE"
      }
    ],
    default:[],
    rules: [{ required: true, message:"类型必选", trigger: "change" }]
  },
  {
    key:"vendorCity",
    label:"供应商所在城市",
    component:"select",
    options:{
      url:"/api/vendorCityEnumList",
      method:"POST",
      params: { enumType: "VENDOR_CITY" },
      options:{},
      fit:(res) => {
        /* 提前知道接口成功情况*/
        if(res && res.rspCode === 'success'){
          /* 处理完后返回，数据需是 [{text:"",value:""}] 的形式 */
          return res.data
        }
      }
    }
  },
  {
    key: "signInTime",
    label: "注册时间",
    component:"picker",
    type: "datetime",
    //default: "2020-07-08"
  },
  {
    key: "vendorXTimeStart",
    label: "供应商牛逼时间（起）",
    component:"picker",
    type: "datetime",
    default: "2020-07-12 00:00:00"
  },
  {
    key: "vendorXTimeEnd",
    label: "供应商牛逼时间（止）",
    component:"picker",
    type: "datetime",
    default: "2020-08-25 23:59:59"
  },
  {
    key: ["tmApply","tmApplyStart","tmApplyEnd"],
    label: "供应商入驻申请时间",
    component:"picker",
    type: "datetimerange",
    default: ["2020-07-08 00:00:00","2020-07-08 00:00:00"],
    timeBetween:true,
    limit:3
  },
  {
    key:"search",
    label:"搜索用户",
    component:custom,
    default:"334"
  },
  {
    key:"testRange",
    label:"测试用例",
    component:testRange,
    default:[]
  },
];


```



## input

用于生成 input 输入框，指定`component:"input"` 即可，不指定默认渲染为 input 类型


| 属性名称  | 说明                                                         | 类型             | 默认值  |
| --------- | ------------------------------------------------------------ | ---------------- | ------- |
| key       | 字段名                                                       | String           | 无      |
| label     | label名称                                                    | String           | 无      |
| component | 最终渲染成什么                                               | String \| Object | "input" |
| default   | 默认值                                                       | String \| Number | 无      |
| rules     | 校验规则,可参考[async-validator](https://github.com/yiminghe/async-validator) | Array            | 无      |



## select

用于生成 select 下拉框，支持远程数据源配置，传入后自动请求，返回体提供 `fit()` 方法，需要处理格式为 `return [{text:"",value:""}]`


| 属性名称  | 说明           | 类型             | 默认值  |
| --------- | -------------- | ---------------- | ------- |
| key       | 字段名         | String           | 无      |
| label     | label名称      | String           | 无      |
| component | 最终渲染成什么 | String \| Object | "input" |
| default   | 默认值         | Array            | 无      |
| rules     | 校验规则       | Array            | 无      |
| options   | 下拉框可选值   | Array \| Object  | [ ]     |

| 属性名称        | 说明                                            | 类型     | 默认值               |
| --------------- | ----------------------------------------------- | -------- | -------------------- |
| options.url     | XMLHttpRequest 请求url                          | String   | 无                   |
| options.method  | XMLHttpRequest 请求 Method                      | String   | 无                   |
| options.params  | XMLHttpRequest 请求参数                         | Object   | 无                   |
| options.options | XMLHttpRequest 请求配置，例如需要带token 的情况 | Object   | 无                   |
| options.fit()   | 用于处理 Response ，一定要返回处理值            | Function | Function(response){} |



## picker



用于生成 `["date","daterange","datetime","datetimerange"]` 类型的 picker，如需要其它类型的 picker 请走 `component `  <a href="#component <Object>" ><object> </a>配置

| 属性名称    | 说明                                                         | 类型                               | 默认值  |
| ----------- | ------------------------------------------------------------ | ---------------------------------- | ------- |
| key         | 字段名                                                       | String                             | 无      |
| label       | label名称                                                    | String                             | 无      |
| component   | 最终渲染成什么                                               | String \| Object                   | "input" |
| default     | 默认值                                                       | String \| Array \|Date(好像没必要) | 无      |
| rules       | 校验规则                                                     | Array                              | 无      |
| type        | date \| daterange \| datetime \| datetimerange               | String                             | 无      |
| timeBetween | 类型为datetimerange 的时候 开始时间为 00:00:00，结束为 23:59:59 | Boolean                            | false   |
| Limit       | range类型的时间 最多为多少 天（单位）                        | Number （int）                     | /       |



## `component` `<Object>`

本组件默认没提供的表单类型 或 复杂的表单输入，你都可以通过 import 进来，然后传入，注意新加入的表单无需附上 `el-form-item` 

示例代码 :

```javascript
{
    key:"search",
    label:"搜索用户",
    component:CustomComponent, // import CustomComponent from "xxx"
    default:"334"
}
```

## `component` `<Object> `自定义组件的双向数据流方式：

三要素:接收父级值、监听本地值、监听父级值

```javascript
<template>
      <el-input placeholder="请输入内容" v-model="content">
          <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
</template>
<script>
export default {
    name:"CustomComponent",
    props:{
        vModel:[String]
    },
    data(){
        return {
            content:""
        }
    },
    watch:{
        content(newval){
            /* 已在组件内部注入change方法，此组件只需emit，表单中就能接收到此自定义组件的值 */
            /* 自定义的组件，一定要有这一步，父子组件的通讯靠的就是 emit */
            this.$emit("change",newval) 
        },
        vModel:{
            immediate:true,
            handler:function (newval){
                this.content = newval
            }
        }
    }
}
</script>
```

> props 一定要接收 vModel
>
> vModel，需要提供默认值时必须使用watch 高级用法，设置立即执行，或者在 mounted 中手动赋值给本地变量，
>
> content ，这个名字随便起，需要响应式数据就必须 emit 注入的 change 事件





# 关于按钮

<img src="https://cdn.nlark.com/yuque/0/2020/png/1185510/1598088762455-cf79e5a0-81fe-4bb1-87db-e08cf196145d.png">

- 重置 就是 default 给的是什么值，点了后就是什么值
- 清空就是所有的值都为原始形态
- 展开全部是因为 表单过大的情况下把有效数据区域都挡住了，这个按钮可以隐藏、显示悬浮框，（大于两条配置时 自动将内容渲染在 下方悬浮区域）



