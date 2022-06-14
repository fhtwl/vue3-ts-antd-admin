// import System from '@fhtwl-admin/system';
export namespace UserRes {
  interface GetUserInfo {
    role: {
      name: string;
      roleId: number;
      id: number;
      menuType: System.Decode;
      show: number;
      parentId: number;
      serialNum: number;
      permission: string;
      actions: System.Action[];
    };
  }
}
