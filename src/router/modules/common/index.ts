/**
 * @description 公共的一些路由，不属于功能模块的都放这里统一管理
 * @author fhtwl */

import UserLayout from '@/layouts/UserLayout.vue';

/**
 *
 * 基础路由
 */
export const constantRouterMap = [
  {
    path: '/auth',
    component: UserLayout,
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/system/auth/Login/index.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/system/auth/Register/index.vue'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import('@/views/system/auth/RegisterResult/index.vue'),
      },
    ],
  },

  {
    path: '/404',
    component: () => import('@/views/system/exception/404/index.vue'),
  },
];

export default [...constantRouterMap];
