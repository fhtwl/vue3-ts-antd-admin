import { PaginationResponse } from '@/components/TableLayout';
import http from '@/utils/http';
const Menu = `/system/menu`;

const api = {
  getMenuList: `${Menu}/list`,
  editMenuById: `${Menu}/edit`,
  addMenu: `${Menu}/add`,
  deleteMenuByIds: `${Menu}/delete`,
  getMenuMap: `${Menu}/getMenuMap`,
  getMenuByRoleId: `${Menu}/getMenuByRoleId`,
};

export function deleteMenuByIds(params: { ids: string }) {
  return http.get(api.deleteMenuByIds, { params });
}

/**
 * 获取所有角色
 * @returns
 */
export function getMenuMap(): Promise<System.Menu[]> {
  return http.get(api.getMenuMap);
}

export function getMenuList(
  params: Common.PaginationParams
): Promise<PaginationResponse<Common.TreeNode>> {
  return http.post(api.getMenuList, params);
}
// Promise<TableSearchFun>

/**
 * 新增菜单
 * @param {*} params
 * @returns
 */
export function addMenu(params: {
  name: string;
  parentId: number | undefined;
  icon: string;
  show: Common.BooleanNumber;
  path: string;
  type: System.MenuType;
}) {
  return http.post(api.addMenu, params);
}

/**
 * 修改菜单
 * @param {*} params
 * @returns
 */
export function editMenuById(params: {
  name: string;
  parentId: number | undefined;
  icon: string;
  show: Common.BooleanNumber;
  path: string;
  type: System.MenuType;
  id: number;
}) {
  return http.post(api.editMenuById, params);
}

/**
 * 根据角色获取菜单
 * @param {*} parameter
 * @returns
 */
export function getMenuByRoleId(params: { id: number }) {
  return http.get(api.getMenuByRoleId, { params });
}
