import Vue from 'vue';
import App from './App.vue';
import router from './router';

// 引入全局样式
import './assets/css/global.css';
// 引入阿里图标库资源
import './assets/fonts/iconfont.css';
// 导入elementUI按需导入的配置
import './plugins/element.js';
// 导入axios
import './plugins/axios.js';
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
