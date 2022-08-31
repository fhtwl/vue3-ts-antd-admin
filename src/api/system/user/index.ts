import { PaginationResponse } from '@/components/TableLayout';
import http from '@/utils/http';

const User = `/system/user`;

const api = {
  getUserList: `${User}/list`,
  editInfo: `${User}/editInfo`,
  email: `${User}/editPassword/email`,
  editPassword: `${User}/editPassword`,
  getUserInfo: `${User}/query`,
  getUserMenu: `${User}/getUserMenu`,
  editUserById: `${User}/edit`,
  deleteUserByIds: `${User}/deleteUserByIds`,
  addUser: `${User}/add`,
};

export function getUserList(
  parameter: Common.PaginationParams
): Promise<PaginationResponse<Common.TreeNode>> {
  return http.post(api.getUserList, parameter);
}

/**
 * 修改用户info
 * @param {*} parameter
 * @returns
 */
export function editInfo(parameter: System.UserInfo) {
  return http.post(api.editInfo, parameter);
}

/**
 * 修改用户信息
 * @param {*} params
 * @returns
 */
export function editUserById(params: UserReq.EditUserByIdReq) {
  return http.post(api.editUserById, params);
}

/**
 * 发送邮件获取验证码
 * @returns
 */
export function email() {
  return http.post(api.email);
}

/**
 * 修改密码
 * @param {*} params
 * @returns
 */
export function editPassword(params: {
  password: string;
  code: string;
  emailCode: string;
}) {
  return http.post(api.editPassword, params);
}

/**
 * 获取用户信息
 * @returns
 */
export function getUserInfo(): Promise<UserRes.GetUserInfo> {
  return http.get(api.getUserInfo);
}

/**
 * 获取动态路由
 * @returns
 */
export function getUserMenu(): Promise<UserRes.GetUserMenu[]> {
  return http.post(api.getUserMenu);
}

/**
 * 根据ids批量删除用户
 * @param params
 * @returns
 */
export function deleteUserByIds(params: { ids: string }) {
  return http.get(api.deleteUserByIds, { params });
}

/**
 * 新增用户
 * @param {*} params
 * @returns
 */
export function addUser(params: {
  userName: string;
  avatar: string;
  password: string;
  roleIds: string;
  nickName: string;
  email: string;
}) {
  return http.post(api.addUser, params);
}
