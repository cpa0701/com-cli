/* eslint-disable*/
/* 加入表单校验器 */
import { phoneNumberValidator } from "./validator";

/* 自定义级别 组件 */
import custom from "./custom.vue"

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
    rules: [{ required: true, message:"类型必选", trigger: "change" }]
  },
  {
    key:"vendorCity",
    label:"供应商所在城市",
    component:"select",
    multiple: true,
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
    key: ["tmApplyStart","tmApplyEnd"],
    label: "供应商入驻申请时间",
    component:"picker",
    type: "datetimerange",
    default: ["",""],
    timeBetween:true,
    limit:3
  },
  {
    key:"search",
    label:"搜索用户",
    component:custom,
    default:"334"
  },
];

