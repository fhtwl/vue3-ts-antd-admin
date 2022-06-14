import { ConfigProvider } from 'ant-design-vue';
import { defineStore } from 'pinia';

export const useStore = defineStore('theme', {
  state: () => ({
    theme: '#f00',
  }),
  getters: {},
  actions: {
    // 登录
    async setTheme(color: string) {
      document.documentElement.style.setProperty('--ant-primary-color', color);
      ConfigProvider.config({
        theme: {
          primaryColor: color,
        },
      });
    },
  },
});
