import { MessageApi } from 'ant-design-vue/lib/message';
import { DefineComponent } from 'vue';
import { UserRes } from '../api/system/user';

declare namespace System {
  export interface Router {
    path: string;
    name: string | number;
    component?: VueComponent;
    meta: {
      title: string;
      icon: string | undefined;
      hiddenHeaderContent: boolean | undefined;
      permission: unknown;
      type: unknown;
      actions: UserRes.GetUserMenu[];
    };
    hidden: boolean;
    hideChildrenInMenu: boolean;
    redirect: string | undefined;
    children: Router[];
  }

  export type VueComponent = DefineComponent<{}, {}, any>;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageApi;
  }
}
