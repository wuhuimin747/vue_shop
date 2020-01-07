import Vue from 'vue';
import App from './App.vue';
import router from './router';

// 引入全局样式
import './assets/css/global.css';
// 引入阿里图标库资源
import './assets/fonts/iconfont.css';
// 导入elementUI按需导入的配置
// import './plugins/element.js';
// 导入axios
import axios from 'axios';
// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
// axios全局配置
axios.defaults.baseURL = 'http://localhost:8666/api/private/v1/';
// axios挂载请求拦截器
axios.interceptors.request.use(config => {
  // 在请求头上加上Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // console.log(config.headers);
  NProgress.start();
  return config;
});
axios.interceptors.response.use(ret => {
  NProgress.done();
  return ret;
});
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
