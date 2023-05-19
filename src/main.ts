import { createApp } from 'vue';
import App from './App.vue';
import setupAtnd from '@/lib/ant-design-vue';
import router from '@/router';
import { createPinia } from 'pinia';
import axios from '@/utils/http';
import CIcon from '@/components/CIcon/index.vue';
import piniaPluginpersistedstate from 'pinia-plugin-persist';

import './permission';
import initCore from './core';

const app = createApp(App);
app.use(router);
app.component('CIcon', CIcon);
const pinia = createPinia();
pinia.use(piniaPluginpersistedstate);
app.use(pinia);

setupAtnd(app);
initCore(app);

app.config.globalProperties.$axios = axios;
app.mount('#app');
