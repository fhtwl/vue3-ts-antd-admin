<script lang="ts">
import defaultSettings from '@/config/defaultSettings';
import RightContent from '@/components/GlobalHeader/RightContent.vue';
import GlobalFooter from '@/components/GlobalFooter/index.vue';
import LogoSvgImg from '@/assets/logo.svg?inline';
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer.vue';
import CustomLayout from './CustomLayout/index.vue';
import { defineRouterStore } from '@/store/system/async-router';
import { useStore } from '@/store/system/theme';
import {
  CONTENT_WIDTH_TYPE,
  SIDEBAR_TYPE,
  TOGGLE_NAV_THEME,
  TOGGLE_COLOR,
} from '@/store/system/theme/const';
const LogoSvg = () => LogoSvgImg;
import { computed, defineComponent, ref, watch } from 'vue';
export default defineComponent({
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    LogoSvg,
    CustomLayout,
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

    const settings = computed(() => {
      const {
        theme,
        color,
        fixedHeader,
        fixedSidebar,
        layout,
        colorWeak,
        multiTab,
        contentWidth,
      } = themeStore;
      return {
        // 布局类型
        layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth:
          layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : contentWidth,
        // 主题 'dark' | 'light'
        theme,
        // 主色调
        primaryColor: color,
        fixedHeader,
        fixedSidebar,
        colorWeak,
        multiTab,
        defaultSelectKey: undefined,
      };
    });
    type SettingType =
      | 'layout'
      | 'contentWidth'
      | 'theme'
      | 'primaryColor'
      | 'fixedHeader'
      | 'fixedSidebar'
      | 'colorWeak'
      | 'multiTab'
      | 'defaultSelectKey';

    interface SetSetting {
      type: SettingType;
      value: unknown;
    }
    const handleSettingChange = function ({ type, value }: SetSetting) {
      console.log(type, value);
      const settingValue = settings.value;
      switch (type) {
        case 'contentWidth':
          settingValue[type] = value as string;
          break;
        case 'layout':
          if (value === 'sidemenu') {
            settingValue.contentWidth = CONTENT_WIDTH_TYPE.Fluid;
          } else {
            settingValue.fixedSidebar = false;
            settingValue.contentWidth = CONTENT_WIDTH_TYPE.Fixed;
          }
          break;
        case 'theme': // 主题风格
          themeStore[TOGGLE_NAV_THEME](value as string);
          break;
        case 'primaryColor': // 主题色
          themeStore[TOGGLE_COLOR](value as string);
          // updateTheme(value)
          // this.$store.dispatch('ToggleColor', value)
          break;
        default:
          settingValue[type] = value as never;
      }
    };

    // 侧栏收起状态
    const collapsed = ref(false);
    const handleCollapse = function (bool: boolean) {
      collapsed.value = bool;
    };
    watch(collapsed, (bool) => {
      themeStore[SIDEBAR_TYPE](bool);
    });

    const key = ref(999);
    const reload = function () {
      key.value = Math.random();
    };

    return {
      mainMenu,
      menus,
      settings,
      handleSettingChange,
      collapsed,
      handleCollapse,
      key,
      reload,
    };
  },
  data() {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite:
        process.env.VUE_APP_PREVIEW === 'true' &&
        process.env.NODE_ENV !== 'development',
      // end
      isDev:
        process.env.NODE_ENV === 'development' ||
        process.env.VUE_APP_PREVIEW === 'true',
      title: defaultSettings.title,
    };
  },
});
</script>

<template>
  <CustomLayout
    :menus="menus"
    :collapsed="collapsed"
    :handle-collapse="handleCollapse"
    :settings="settings"
  >
    <template #menuHeaderRender>
      <div class="logo">
        <logo-svg />
        <h1>{{ title }}</h1>
      </div>
    </template>

    <template #headerContentRender>
      <div class="basic-head">
        <!-- <a-tooltip title="刷新页面">
          <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="reload" />
        </a-tooltip> -->
        <div class="multi-tab-container">
          <multi-tab v-if="settings.multiTab" />
        </div>
      </div>
    </template>
    <setting-drawer
      :settings="settings"
      @change="handleSettingChange"
    ></setting-drawer>
    <template #rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :theme="settings.theme"
      />
    </template>
    <template #footerRender>
      <global-footer />
    </template>
    <router-view :key="key" />
  </CustomLayout>
</template>

<style lang="less">
@import './BasicLayout.less';
</style>
