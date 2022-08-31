import { getUserMenu } from '@/api/system/user';
import { BasicLayout, BlankLayout, RouteView } from '@/layouts';
import { markRaw } from 'vue';

export const ROOT_NAME = -1;

const modules = getModules();

// 前端路由表
const constantRouterComponents: Common.Params = {
  // 基础页面 layout 必须引入

  // 二级路由包裹组件
  BasicLayout: markRaw(BasicLayout),
  // 空白布局
  BlankLayout: markRaw(BlankLayout),
  // 一级路由
  RouteView: markRaw(RouteView),
  404: () => import('@/views/system/exception/404/index.vue'),
};

function loadAllPage() {
  for (const path in modules) {
    modules[path]().then((mod) => {
      const file = mod.default;
      console.log(file.name);
      if (file.isPage) {
        constantRouterComponents[`${file.name}`] = markRaw(file);
      }
    });
  }
}
// 获取所有的页面并放入路由表中
loadAllPage();

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '/:catchAll(.*)', // 不识别的path自动匹配404
  redirect: '/404',
  hidden: true,
  serialNum: 0,
  parentId: 0,
  name: '404',
  id: '404',
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
  redirect: '/dashboard',
  meta: {
    title: '首页',
  },
  children: [],
  serialNum: 0,
  parentId: -11,
  id: ROOT_NAME,
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
 * @param routerMap
 * @param parent
 * @returns
 */
export const generator = (
  routerMap: UserRes.GetUserMenu[],
  parent?: Common.Router
) => {
  return routerMap.map((item) => {
    const { component, meta } = item;
    const { title, show, hideChildren, hiddenHeaderContent, icon } = meta || {};
    const currentRouter: Common.Router = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/my-dashboard
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.id.toString(),
      // 该路由对应页面的组件
      component: constantRouterComponents[
        component!
      ] as unknown as Common.VueComponent,

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
      // 是否设置了隐藏菜单
      hidden: show === false,
      // 是否设置了隐藏子菜单
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
      // 加入到树中
      tree.push(child);
    }
  });
}

/**
 * 加载views目录下的所有组件
 * @returns
 */
function getModules() {
  const components = import.meta.glob('../../views/**/*.tsx');
  return components;
}
