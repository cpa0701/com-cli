import Vue from 'vue'   // 引入vue模块
import App from './app.vue'  //引入文件(组件) app
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import axios from '../utils/axios';
import router from '../router'


import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'// 设置语言
import 'element-ui/lib/theme-chalk/index.css'

import 'amfe-flexible';

Vue.prototype.$http = axios;


Vue.use(ElementUI, { locale });

new Vue({                //vue写法 新建一个实例
  el:"#app",    //元素
  router,
  render: h => h(App)// 组件app
});
