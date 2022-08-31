<script lang="ts">
import defaultSettings from '@/config/defaultSettings';
import RightContent from '@/components/GlobalHeader/RightContent.vue';
import GlobalFooter from '@/components/GlobalFooter';
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer.vue';
import CustomLayout from './CustomLayout/index.vue';
import { defineRouterStore } from '@/store/system/asyncRouter';
import { useStore } from '@/store/system/theme';
import MultiTab from '@/components/MultiTab';

import { computed, defineComponent, markRaw, ref } from 'vue';
import LOGO from '@/assets/logo.svg?inline';

type SettingType =
  | 'layout'
  | 'navTheme'
  | 'primaryColor'
  | 'colorWeak'
  | 'multiTab'
  | 'defaultSelectKey'
  | 'hideSetting';

export interface SetSetting {
  type: SettingType;
  value: unknown;
}
export default defineComponent({
  name: 'BasicLayout',
  components: {
    SettingDrawer: markRaw(SettingDrawer),
    RightContent: markRaw(RightContent),
    GlobalFooter: markRaw(GlobalFooter),
    CustomLayout: markRaw(CustomLayout),
    MultiTab: markRaw(MultiTab),
  },
  setup() {
    const routerStore = defineRouterStore();

    const themeStore = useStore();

    // 主路由
    const mainMenu = computed(() => routerStore.addRouters);
    const menus = computed(() => {
      const routes = mainMenu.value.find((item) => item.path === '/');
      return (routes && routes.children) || [];
    });
    const logoSvgImg = LOGO;

    const settings = computed(() => {
      const { navTheme, primaryColor, layout, colorWeak, multiTab } =
        themeStore;
      return {
        // 布局类型
        layout, // 'sidemenu', 'topmenu'
        // 主题 'dark' | 'light'
        navTheme,
        // 主色调
        primaryColor,
        colorWeak,
        multiTab,
        defaultSelectKey: undefined,
      };
    });
    const routerKey = ref<number>(999);
    const collapsed = ref<boolean>(false);

    const handleCollapse = function (bool: boolean) {
      collapsed.value = bool;
    };

    const reload = function () {
      routerKey.value = Math.random();
    };

    return {
      mainMenu,
      menus,
      settings,
      handleCollapse,
      routerKey,
      collapsed,
      reload,
      logoSvgImg,
    };
  },
  data() {
    return {
      title: defaultSettings.title,
    };
  },
});
</script>

<template>
  <CustomLayout
    :menus="menus"
    :default-collapsed="collapsed"
    :handle-collapse="handleCollapse"
    :settings="settings"
  >
    <template #menuHeaderRender>
      <div class="logo">
        <img :src="logoSvgImg" />
        <h1>{{ title }}</h1>
      </div>
    </template>

    <template #headerContentRender>
      <div class="basic-head">
        <a-tooltip title="刷新页面">
          <reload-outlined
            style="font-size: 18px; cursor: pointer"
            @click="reload"
          />
        </a-tooltip>
        <div class="multi-tab-container">
          <multi-tab v-if="settings.multiTab" />
        </div>
      </div>
    </template>
    <setting-drawer :settings="settings"></setting-drawer>
    <template #rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :theme="settings.navTheme"
      />
    </template>
    <template #footerRender>
      <global-footer />
    </template>
    <router-view :key="routerKey" />
  </CustomLayout>
</template>

<style lang="less">
@import './BasicLayout.less';
</style>
