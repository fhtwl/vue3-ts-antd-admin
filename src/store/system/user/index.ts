import { defineStore } from 'pinia';
import { ACCESS_TOKEN } from '../const';
import { login } from '@/api/system/auth';

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
    roles: [],
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
            const token = res.data as string;
            this.token = token;
            localStorage.setItem(ACCESS_TOKEN, token);
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
  },
});

async function logout() {
  const res = await fetch('/');
  return await res.json();
}
