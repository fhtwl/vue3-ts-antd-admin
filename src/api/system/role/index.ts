import http from '@/utils/http';

const Role = `/system/role`;

const api = {
  getRoleList: `${Role}/list`,
  editRoleById: `${Role}/edit`,
  addRole: `${Role}/add`,
  deleteRoleByIds: `${Role}/delete`,
  getRoleMap: `${Role}/getRoleMap`,
  editRolePermissionById: `${Role}/editPermission`,
};

/**
 * 根据ids删除角色
 * @param {*} parameter
 * @returns
 */
export function deleteRoleByIds(parameter: { ids: string }) {
  return http.get(api.deleteRoleByIds, parameter);
}

/**
 * 获取所有角色
 * @param {*} parameter
 * @returns
 */
export function getRoleMap() {
  return http.get(api.getRoleMap);
}

/**
 * 获取角色分页列表
 * @param {*} parameter
 * @returns
 */
export function getRoleList(parameter: Common.PaginationParams) {
  return http.post(api.getRoleList, parameter);
}

/**
 * 新增角色
 * @param {*} parameter
 * @returns
 */
export function addRole(parameter: System.Role) {
  return http.post(api.addRole, parameter);
}

/**
 * 根据id编辑角色
 * @param {*} parameter
 * @returns
 */
export function editRoleById(parameter: System.Role) {
  return http.post(api.editRoleById, parameter);
}

/**
 * 修改角色权限
 * @param {*} parameter
 * @returns
 */
export function editRolePermissionById(parameter: {
  ids: string;
  roleId: number;
}) {
  return http.post(api.editRolePermissionById, parameter);
}
