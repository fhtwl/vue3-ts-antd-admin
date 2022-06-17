import { DefineComponent } from 'vue';

// import System from '@fhtwl-admin/system';
declare namespace UserRes {
  export interface StoreRole {
    permissions: System.Permission[];
    roleId: number;
    roleName: string;
    permissionList: number[];
  }

  export interface GetUserInfo {
    role: StoreRole;
    userName: string;
    info: System.UserInfo;
    email: string;
  }

  export interface GetUserMenu extends Common.TreeNode {
    key: number | string;
    name: string;
    path: string;
    component: string;
    redirect: string;
    meta: {
      title: string;
      show?: boolean;
      hideChildren?: boolean;
      hiddenHeaderContent?: boolean;
      //  target:
      icon?: string;
    };
    children: GetUserMenu[];
  }
}
