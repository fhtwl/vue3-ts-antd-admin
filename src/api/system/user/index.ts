import { common } from '@/typings/common';
import { system } from '@/typings/system';
import http from '@/utils/http';

const User = `/system/user`;

const api = {
  getUserList: `${User}/list`,
  editUserInfo: `${User}/editUserInfo`,
  email: `${User}/editPassword/email`,
  editPassword: `${User}/editPassword`,
  getUserInfo: `${User}/query`,
  getUserMenu: `${User}/getUserMenu`,
  editUserById: `${User}/editUserById`,
};

export function getUserList(parameter: common.PaginationParams) {
  http.post(api.getUserList, parameter);
}

/**
 * 修改用户info
 * @param {*} parameter
 * @returns
 */
export function editUserInfo(parameter: system.UserInfo) {
  http.post(api.editUserInfo, parameter);
}

/**
 * 修改用户信息
 * @param {*} parameter
 * @returns
 */
export function editUserById(parameter: {
  userName: string;
  avatar: string;
  password: string;
  roleIds: string;
  nickName: string;
  email: string;
}) {
  http.post(api.editUserById, parameter);
}

/**
 * 发送邮件获取验证码
 * @param {*} parameter
 * @returns
 */
export function email() {
  http.post(api.email);
}

/**
 * 修改密码
 * @param {*} parameter
 * @returns
 */
export function editPassword(parameter: {
  password: string;
  code: string;
  emailCode: string;
}) {
  http.post(api.editPassword, parameter);
}

export function getUserInfo() {
  http.get(api.getUserInfo);
}

export function getUserMenu() {
  http.post(api.getUserMenu);
}
