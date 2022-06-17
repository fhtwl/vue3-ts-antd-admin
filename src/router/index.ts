import { createRouter, createWebHistory } from 'vue-router';
// import { UserLayout, BasicLayout, BlankLayout } from '@/layouts';
// import { bxAnaalyse } from '@/core/icons';

import common from './modules/common';
const routes = [...common];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

// hack router push callback
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch((err) => err);
// };

// Vue.use(Router);

// export default new Router({
//   mode: 'history',
//   routes: constantRouterMap,
// });
