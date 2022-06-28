import { MessageApi } from 'ant-design-vue/lib/message';
import { DefineComponent } from 'vue';
import { UserRes } from '../api/system/user';
declare global {
  namespace System {}
  module Common {
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

    export type OptionValue = string | number;
    export interface Option {
      label: string;
      value: OptionValue;
      [prop: string]: unknown;
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageApi;
  }
}
