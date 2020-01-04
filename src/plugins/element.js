import Vue from 'vue';
import { Button, Form, FormItem, Input, Message } from 'element-ui';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// message注册到Vue原型对象
Vue.prototype.$message = Message;
