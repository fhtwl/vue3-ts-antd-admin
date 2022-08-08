import { PaginationResponse } from '@/components/TableLayout';
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
 * @param {*} params
 * @returns
 */
export function deleteRoleByIds(params: { ids: string }) {
  return http.get(api.deleteRoleByIds, { params });
}

/**
 * 获取所有角色
 * @param {*} params
 * @returns
 */
export function getRoleMap(): Promise<System.Role[]> {
  return http.get(api.getRoleMap);
}

/**
 * 获取角色分页列表
 * @param {*} params
 * @returns
 */
export function getRoleList(
  params: Common.PaginationParams
): Promise<PaginationResponse<Common.TreeNode>> {
  return http.post(api.getRoleList, params);
}

/**
 * 新增角色
 * @param {*} params
 * @returns
 */
export function addRole(params: RoleReq.AddRole) {
  return http.post(api.addRole, params);
}

/**
 * 根据id编辑角色
 * @param {*} params
 * @returns
 */
export function editRoleById(params: RoleReq.EditRoleById) {
  return http.post(api.editRoleById, params);
}

/**
 * 修改角色权限
 * @param {*} params
 * @returns
 */
export function editRolePermissionById(params: {
  ids: string;
  roleId: number;
}) {
  return http.post(api.editRolePermissionById, params);
}
