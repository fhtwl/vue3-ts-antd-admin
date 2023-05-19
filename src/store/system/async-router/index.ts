import { defineStore } from 'pinia';
import { generatorDynamicRouter } from '@/router/modules/generator-routers';

export const defineRouterStore = defineStore('async-router', {
  state: () => ({
    addRouters: [] as Common.Router[],
  }),
  actions: {
    generateRoutes() {
      return new Promise((resolve) => {
        generatorDynamicRouter().then((routers) => {
          this.addRouters = routers;
          resolve(undefined);
        });
      });
    },
  },
});
