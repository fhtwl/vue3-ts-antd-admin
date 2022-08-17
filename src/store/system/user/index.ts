import { defineStore } from 'pinia';
import { ACCESS_TOKEN } from './const';
import { login, logout } from '@/api/system/auth';
import { getUserInfo } from '@/api/system/user';
import { Permission } from '@fhtwl-admin/system';

interface UserInfo {
  userName: string;
  password: string;
  code: string;
}

export const useStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(ACCESS_TOKEN),
    name: '',
    avatar: '',
    role: undefined as UserRes.StoreRole | undefined,
    info: undefined as System.UserInfo | undefined,
    email: '',
  }),
  getters: {
    nameLength: (state) => state.name.length,
  },
  actions: {
    // 登录
    async login(userInfo: UserInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            const token = res;
            this.token = token;
            localStorage.setItem(ACCESS_TOKEN, token);
            this.getInfo();
            resolve(undefined);
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    },
    // 退出登录
    async logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.token = '';
            localStorage.removeItem(ACCESS_TOKEN);
            resolve(undefined);
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    },
    getInfo(): Promise<UserRes.GetUserInfo> {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((response) => {
            const result = response;
            if (result.role && result.role.permissions.length > 0) {
              const role = result.role;
              role.permissionList = role.permissions.map(
                (permission: Permission) => {
                  return permission.id;
                }
              );
              this.role = result.role;
              this.info = result.info;
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'));
            }
            this.name = result.info.nickName;
            this.avatar = result.info.avatar;
            this.email = result.email;

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteToken() {
      this.token = null;
      localStorage.removeItem(ACCESS_TOKEN);
    },
  },
});
