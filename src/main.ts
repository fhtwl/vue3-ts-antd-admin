import { message } from 'ant-design-vue';
import { createApp } from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
const app = createApp(App);
app.mount('#app');

app.config.globalProperties.$message = message;
