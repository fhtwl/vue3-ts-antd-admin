import router from '@/router';
import { ROOT_NAME } from '@/router/modules/generator-routers';
import { defineRouterStore } from '@/store/system/async-router';
import { RouteRecordRaw } from 'vue-router';

export function resetMenuRouter() {
  // 动态路由都挂在name为ROOT_NAME的路由下
  if (router.hasRoute(ROOT_NAME.toString())) {
    // 更新前先清空动态路由
    router.removeRoute(ROOT_NAME.toString());
  }
}

/**
 * 更新系统导航和路由
 */
export async function updateMenuRouter() {
  const routerStore = defineRouterStore();
  await routerStore.generateRoutes().then(() => {
    routerStore.addRouters.forEach((r) =>
      router.addRoute(r as unknown as RouteRecordRaw)
    );
  });
}
