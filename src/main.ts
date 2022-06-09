import { message } from 'ant-design-vue';
import { createApp } from 'vue';
import App from './App.vue';
// import 'ant-design-vue/dist/antd.css';
import 'ant-design-vue/dist/antd.variable.min.css';
import router from '@/router';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');
app.config.globalProperties.$message = message;
