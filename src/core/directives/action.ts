import { DirectiveBinding } from 'vue';
import { useStore } from '@/store/system/user';
import { defineRouterStore } from '@/store/system/async-router';
import { Action } from '@fhtwl-admin/system';
/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action="[methods]" , 如下：
 *    <i-button v-action="system:menu:add" >添加用户</a-button>
 *    <a-button v-action="system:menu:delete">删除用户</a-button>
 *    <a v-action="system:menu:edit" @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 */
const directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding<string>) => {
    const actionName = binding.arg || binding.value;
    const vm = binding.instance;
    const node = vm!.$route;
    const userStore = useStore();
    const routerStore = defineRouterStore();
    userStore.role!.permissionList;
    // // 由于在切换用户后，vnode的$route没有正常更新, 所以要去store里去最新的数据
    const each = (tree: Common.Router[]) => {
      for (let i = 0; i < tree.length; i++) {
        const treeNode = tree[i];
        if (treeNode.name === node.name) {
          node.meta.actions = treeNode.meta.actions;
          break;
        }
        if (treeNode.children && treeNode.children.length > 0) {
          each(treeNode.children);
        }
      }
    };
    each(routerStore.addRouters);
    const actions: Action[] = node.meta.actions as Action[];
    if (
      !actions.find((action) => action.permission === actionName) &&
      actionName !== '*:*:*'
    ) {
      (el.parentNode && el.parentNode.removeChild(el)) ||
        (el.style.display = 'none');
    }
  },
};
export default {
  name: 'action',
  directive,
};
