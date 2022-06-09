import { defineStore } from 'pinia';
import { ACCESS_TOKEN } from '../const';

interface UserInfo {
  userName: string;
  password: string;
  code: string;
}

export const useStore = defineStore('user', {
  state: () => ({
    name: '',
    avatar: '',
    roles: [],
  }),
  getters: {
    nameLength: (state) => state.name.length,
  },
  actions: {
    // 登录
    async Login(userInfo: UserInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((token: string) => {
            localStorage.setItem(ACCESS_TOKEN, token);
            resolve(undefined);
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    },
  },
});
async function login(userInfo: UserInfo) {
  console.log(userInfo);
  const res = await fetch('/');
  return await res.json();
}
