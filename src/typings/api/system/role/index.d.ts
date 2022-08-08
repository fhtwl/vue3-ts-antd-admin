declare namespace RoleReq {
  interface AddRole {
    name: string;
    parentId: number | undefined;
    serialNum: number;
    describe: string;
  }

  interface EditRoleById extends AddRole {
    id: number;
  }
}
