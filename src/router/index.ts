import { createRouter, createWebHistory } from 'vue-router';

import common from './modules/common';
const routes = [...common];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
