import router from './router';
import { useStore } from './store/system/user';
import NProgress from 'nprogress';
import '@/components/NProgress/nprogress.less';
import { notification } from 'ant-design-vue';
import { resetMenuRouter, updateMenuRouter } from './utils/router';

NProgress.configure({ showSpinner: false });

const allowList = ['login', 'register', 'registerResult'];
export const loginRoutePath = '/auth/login';
const defaultRoutePath = '/dashboard/my-dashboard';

router.beforeEach((to, from, next) => {
  NProgress.start();
  const userStore = useStore();
  // 如果已经登录
  if (userStore.token) {
    // 而跳转路径是登录页面
    if (to.path === loginRoutePath) {
      // 则直接跳转到默认页
      next({ path: defaultRoutePath });
      NProgress.done();
    } else {
      // 如果没有角色信息
      if (!userStore.role) {
        // 重新获取
        userStore
          .getInfo()
          .then(() => {
            // 重置之前的动态路由
            resetMenuRouter();
            // 更新动态路由
            updateMenuRouter().then(() => {
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
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
