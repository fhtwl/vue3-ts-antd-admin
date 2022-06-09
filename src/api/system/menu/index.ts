// import { common } from '@/types/common';
import { common } from '@/typings/common';
import { system } from '@/typings/system';
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

export function deleteMenuByIds(parameter: { ids: number[] }) {
  return http.get(api.deleteMenuByIds, parameter);
}

/**
 * 获取所有角色
 * @param {*} parameter
 * @returns
 */
export function getMenuMap() {
  return http.get(api.getMenuMap);
}

export function getMenuList(parameter: common.PaginationParams) {
  return http.post(api.getMenuList, parameter);
}

/**
 * 新增菜单
 * @param {*} parameter
 * @returns
 */
export function addMenu(parameter: system.Menu) {
  return http.post(api.addMenu, parameter);
}

/**
 * 修改菜单
 * @param {*} parameter
 * @returns
 */
export function editMenuById(parameter: system.Menu) {
  return http.post(api.editMenuById, parameter);
}

/**
 * 根据角色获取菜单
 * @param {*} parameter
 * @returns
 */
export function getMenuByRoleId(parameter: { id: common.Id }) {
  return http.get(api.getMenuByRoleId, parameter);
}
