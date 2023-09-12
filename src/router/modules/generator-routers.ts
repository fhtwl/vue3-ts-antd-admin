// eslint-disable-next-line
import { getUserMenu } from '@/api/system/user';
// eslint-disable-next-line
import { BasicLayout, BlankLayout, RouteView } from '@/layouts';
import { markRaw } from 'vue';
export const ROOT_NAME = 'dynamics';

// 前端路由表
const constantRouterComponents: {
  [propsName: string]: unknown;
} = {
  // 基础页面 layout 必须引入
  BasicLayout: markRaw(BasicLayout),
  BlankLayout: markRaw(BlankLayout),
  RouteView: markRaw(RouteView),
  404: () => import('@/views/system/exception/404/index.vue'),

  // system
  UserCenter: () => import('@/views/system/user/Center/index.vue'),
  UserSettings: () => import('@/views/system/user/Settings'),
  UserManager: () => import('@/views/system/user/Manager'),
  RoleManager: () => import('@/views/system/user/RoleManager'),
  MenuManager: () => import('@/views/system/user/MenuManager'),

  // 你需要动态引入的页面组件
  MyDashboard: () => import('@/views/dashboard/MyDashboard'),
};
// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '/:catchAll(.*)', // 不识别的path自动匹配404
  redirect: '/404',
  hidden: true,
  serialNum: 0,
  parentId: 0,
  name: '404',
  component: undefined,
  meta: {
    title: '404',
    icon: undefined,
    hiddenHeaderContent: undefined,
    permission: undefined,
    type: undefined,
    actions: [],
  },
  hideChildrenInMenu: false,
  children: [],
};

// 根级菜单
const rootRouter: UserRes.GetUserMenu = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/system/user/center',
  meta: {
    title: '首页',
  },
  children: [],
  serialNum: 0,
  parentId: -11,
  id: -1,
  hideChildrenInMenu: false,
};

/**
 * 动态生成菜单
 * @returns
 */
export function generatorDynamicRouter(): Promise<Common.Router[]> {
  return new Promise((resolve, reject) => {
    getUserMenu()
      .then((result) => {
        console.log('generatorDynamicRouter response:', result);
        const menuNav = [];
        const childrenNav: UserRes.GetUserMenu[] = [];
        // 后端数据, 根级树数组,  根级 PID
        listToTree(result as unknown as Common.List, childrenNav, 0);
        rootRouter.children = childrenNav;
        menuNav.push(rootRouter);
        console.log('menuNav', menuNav);
        const routers = generator(menuNav);
        routers.push(notFoundRouter);
        console.log('routers', routers);
        resolve(routers);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (
  routerMap: UserRes.GetUserMenu[],
  parent?: Common.Router
) => {
  return routerMap.map((item) => {
    const { title, show, hideChildren, hiddenHeaderContent, icon } =
      item.meta || {};
    const currentRouter: Common.Router = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/my-dashboard
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.id || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.component || item.key] ||
        (() => import(`@/views/${item.componentPath}`))) as Common.VueComponent,

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        // target,
        permission: item.permission,
        type: item.type,
        actions: (item.children || []).filter(
          (action: UserRes.GetUserMenu) => action.type === 3
        ),
      },
      /**
       * 是否设置了隐藏菜单
       */
      hidden: show === false,
      /**
       * 是否设置了隐藏子菜单
       */
      hideChildrenInMenu: !!hideChildren,
      children: [],
      redirect: '',
    };
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/');
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect);
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter);
    }
    return currentRouter;
  });
};

// interface TreeItem {
//   id: number;
//   [propsName: string]: unknown;
// }

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
function listToTree(
  list: Common.List,
  tree: Common.TreeNode[],
  parentId: number
) {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        id: item.id!,
        key: item.id || item.name,
        children: [],
        serialNum: item.serialNum as number,
        parentId: item.parentId,
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id!);
      // 删掉不存在 children 值的属性
      // if (child.children.length <= 0) {
      //   delete child.children;
      // }
      // 加入到树中
      tree.push(child);
    }
  });
}
