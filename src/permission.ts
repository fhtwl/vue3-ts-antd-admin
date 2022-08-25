import router from './router';
import { useStore } from './store/system/user';
import { defineRouterStore } from '@/store/system/async-router';
import NProgress from 'nprogress'; // progress bar
import '@/components/NProgress/nprogress.less'; // progress bar custom style
import { notification } from 'ant-design-vue';
import { RouteRecordRaw } from 'vue-router';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const allowList = ['login', 'register', 'registerResult']; // no redirect allowList
export const loginRoutePath = '/auth/login';
const defaultRoutePath = '/dashboard/my-dashboard';

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  /* has token */
  const userStore = useStore();
  if (userStore.token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath });
      NProgress.done();
    } else {
      if (!userStore.role) {
        userStore
          .getInfo()
          .then((res) => {
            const roles = res && res.role;
            // generate dynamic router
            const routerStore = defineRouterStore();
            routerStore.generateRoutes(roles).then(() => {
              routerStore.addRouters.forEach((r) =>
                router.addRoute(r as unknown as RouteRecordRaw)
              );
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(
                (from.query?.redirect as string | undefined) || to.path
              );
              if (to.path === redirect) {
                next({ ...to, replace: true });
              } else {
                // 跳转到目的路由
                next({ path: redirect });
              }
            });
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试',
            });
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            userStore.logout().then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } });
            });
          });
      } else {
        next();
      }
    }
  } else {
    if (to.name && allowList.includes(to.name.toString())) {
      // 在免登录名单，直接进入
      next();
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
