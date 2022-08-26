import { createApp } from 'vue';
import App from './App.vue';
import setupAtnd from '@/lib/ant-design-vue';
import router from '@/router';
import { createPinia } from 'pinia';
import axios from '@/utils/http';
import CIcon from '@/components/CIcon/index.vue';

import './permission';
import initCore from './core';

const app = createApp(App);
app.use(router);
app.component('CIcon', CIcon);
app.use(createPinia());

setupAtnd(app);
initCore(app);

app.config.globalProperties.$axios = axios;
app.mount('#app');
