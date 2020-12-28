import { axios } from "@xsyx/easy-api-h5"
/**
 * 更好的符合公司业务
 * 拦截器仅在开发本组件中使用
 * 单独发包后依赖 使用该组件的项目的node_modules中的依赖
 *
 * @请求使用规则
 * 只执行 get 与 post
 * get请求 axios 中，参数默认拼接在url后面，easyApi 中不明
 * post 请求中，参数默认放置在 request body
 *
 * @注意事项
 * 如果项目中存在 axios 请不要打开下面的 全局配置/拦截器配置 ，如果你的项目中存在拦截器 那么两个拦截器都会被调用！！！
 * 另外 已知导入的 Message 组件在element ui'跨版本升级会导致出错，请注意使用
 *  */

// import { Message, Loading } from "element-ui";
// import { toImitateFormData } from "./utils";

// let LOADING;
// let timeOut = 15000;
// let timerId = undefined;

// axios.defaults.baseURL = "";
// axios.defaults.timeout = timeOut;
// axios.defaults.withCredentials = true;

// axios.interceptors.request.use(
//   onFulfilledRequest => {
//     if (!LOADING && !onFulfilledRequest.noLoading) {
//       LOADING = Loading.service({
//         lock: true,
//         fullscreen: true,
//         text: "拼命加载中...",
//         background: "rgba(255,255,255,0)"
//       });
//     }

//     timerId = setTimeout(() => {
//       LOADING && LOADING.close();
//       LOADING = null;
//     }, timeOut);

//     /* 处理form data
//      * multipart/form-data 文件上传格式
//      * application/x-www-form-urlencoded;
//      */
//     onFulfilledRequest.headers["Content-Type"] &&
//     onFulfilledRequest.headers["Content-Type"].indexOf(
//       "application/x-www-form-urlencoded"
//     ) !== -1
//       ? (onFulfilledRequest.data = toImitateFormData(onFulfilledRequest.data))
//       : undefined;

//     return onFulfilledRequest;
//   },
//   onRejectRequest => {
//     LOADING && LOADING.close();
//     LOADING = null;
//     clearTimeout(timerId);

//     console.log(onRejectRequest);
//     Promise.reject(onRejectRequest);

//     Message({
//       message: "请求出错，请打开控制台查看详情",
//       type: "error",
//       duration: 3 * 1000,
//       showClose: true
//     });
//   }
// );
// axios.interceptors.response.use(
//   onFulfilledResponse => {
//     LOADING && LOADING.close();
//     LOADING = null;
//     clearTimeout(timerId);

//     return onFulfilledResponse.data;
//   },
//   onRejectResponse => {
//     console.log(onRejectResponse);
//     LOADING && LOADING.close();
//     LOADING = null;
//     clearTimeout(timerId);

//     let MSG =
//       onRejectResponse && onRejectResponse.toString().indexOf("timeout") !== -1
//         ? "网络超时"
//         : "请求出错，请打开控制台查看详情 !";
//     Message({
//       message: MSG,
//       type: "error",
//       duration: 3 * 1000,
//       showClose: true
//     });
//     return Promise.reject(onRejectResponse);
//   }
// );

const get = (url, data, options = {}) =>{
  /* 固定好请求方式。get 默认拼接在url 为 Query string params */
  url += "?";
  for (const key in data) {
    url += `${key}=${data[key]}&`;
  }
  url = url.slice(0, url.length - 1);

  const promise = axios.get(url, options);
  return new Promise((resolve, reject) => {
    promise
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const post = (url, data, options = {}) =>{
  /*  */
  const promise = axios.post(url, data, options);
  return new Promise((resolve, reject) => {
    promise
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const sa = 777
export const api = {
  get,
  post,
  sa
};
console.log(get("",{},{}))

