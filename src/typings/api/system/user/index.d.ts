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
    component?: string;
    componentPath?: string;
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

declare namespace UserReq {
  export interface EditUserByIdReq {
    userName: string;
    roleIds: string;
    id: number;
    email: string;
    info: System.UserInfo;
  }
}
