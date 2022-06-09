// import router from './router';
// // import store from './store';
// // import storage from 'store';
// import NProgress from 'nprogress'; // progress bar
// import '@/components/NProgress/nprogress.less'; // progress bar custom style
// // import { notification } from 'ant-design-vue';
// // import { ACCESS_TOKEN } from '@/store/mutation-types'
// const ACCESS_TOKEN = 'authorization';

// NProgress.configure({ showSpinner: false }); // NProgress Configuration

// const allowList = ['login', 'register', 'registerResult']; // no redirect allowList
// const loginRoutePath = '/auth/login';
// const defaultRoutePath = '/dashboard/my-dashboard';

// router.beforeEach((to, from, next) => {
//   NProgress.start(); // start progress bar
//   /* has token */
//   if (ACCESS_TOKEN) {
//     if (to.path === loginRoutePath) {
//       next({ path: defaultRoutePath });
//       NProgress.done();
//     } else {
//       // check login user.roles is null
//       if (store.getters.roles.length === 0) {
//         // request login userInfo
//         // store
//         //   .dispatch('GetInfo')
//         //   .then((res) => {
//         //     const roles = res && res.role;
//         //     // generate dynamic router
//         //     store.dispatch('GenerateRoutes', { roles }).then(() => {
//         //       store.getters.addRouters.forEach((r) => {
//         //         router.addRoute(r);
//         //       });
//         //       // 请求带有 redirect 重定向时，登录自动重定向到该地址
//         //       const redirect = decodeURIComponent(
//         //         from.query.redirect || to.path
//         //       );
//         //       if (to.path === redirect) {
//         //         // set the replace: true so the navigation will not leave a history record
//         //         next({ ...to, replace: true });
//         //       } else {
//         //         // 跳转到目的路由
//         //         next({ path: redirect });
//         //       }
//         //     });
//         //   })
//         //   .catch(() => {
//         //     notification.error({
//         //       message: '错误',
//         //       description: '请求用户信息失败，请重试',
//         //     });
//         //     // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
//         //     // store.dispatch('Logout').then(() => {
//         //     //   next({ path: loginRoutePath, query: { redirect: to.fullPath } });
//         //     // });
//         //   });
//       } else {
//         next();
//       }
//     }
//   } else {
//     if (to.name && allowList.includes(to.name.toString())) {
//       // 在免登录名单，直接进入
//       next();
//     } else {
//       next({ path: loginRoutePath, query: { redirect: to.fullPath } });
//       NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
//     }
//   }
// });

// router.afterEach(() => {
//   NProgress.done(); // finish progress bar
// });
