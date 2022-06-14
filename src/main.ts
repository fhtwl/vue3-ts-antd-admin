import { message, Button } from 'ant-design-vue';
import { createApp } from 'vue';
import App from './App.vue';
// import '@/styles/common/common.less';
// import 'ant-design-vue/dist/antd.less';
// import 'ant-design-vue/dist/antd.variable.less';
import router from '@/router';
import { createPinia } from 'pinia';

// import '@/styles/common/common.less';

const app = createApp(App);
app.use(Button);
app.use(router);
app.use(createPinia());
app.mount('#app');
app.config.globalProperties.$message = message;
