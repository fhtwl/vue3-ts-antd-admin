import { common } from '../common';
export namespace system {
  type MenuType = 1 | 2 | 3;
  interface Menu {
    id?: common.Id;
    name: string;
    parentId: common.Id;
    icon: string;
    show: common.BooleanNumber;
    path: string;
    type: MenuType;
  }

  interface Role {
    id?: common.Id;
    name: string;
    parentId: common.Id;
    show: common.BooleanNumber;
    path: string;
  }

  interface UserInfo {
    nickName: string;
    avatar: string;
    profile: string;
  }

  interface User {
    id?: common.Id;
  }
}
