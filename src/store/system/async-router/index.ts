import { defineStore } from 'pinia';
import { generatorDynamicRouter } from '@/router/modules/generator-routers';
import { System } from '@/typings/common';
import { UserRes } from '@/typings/api/system/user';

export const defineRouterStore = defineStore('async-router', {
  state: () => ({
    addRouters: [] as System.Router[],
  }),
  actions: {
    generateRoutes(role: UserRes.StoreRole) {
      return new Promise((resolve) => {
        console.log(role);
        generatorDynamicRouter().then((routers) => {
          this.addRouters = routers;
          resolve(undefined);
        });
      });
    },
  },
});
