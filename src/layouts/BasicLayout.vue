<template>
  <CustomLayout
    :menus="menus"
    :collapsed="collapsed"
    :media-query="query"
    :is-mobile="isMobile"
    :handle-media-query="handleMediaQuery"
    :handle-collapse="handleCollapse"
    :settings="settings"
  >
    <!-- :i18nRender="i18nRender" -->
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template #menuHeaderRender>
      <div class="logo">
        <logo-svg />
        <h1>{{ title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
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
    <!-- <a-layout-content v-if="settings.multiTab" :style="{ height: '40px', margin: '0 0 10px 0', paddingTop: settings.fixedHeader ? '64px' : '0' }">
      <multi-tab></multi-tab>
    </a-layout-content> -->
    <setting-drawer
      :settings="settings"
      @change="handleSettingChange"
    ></setting-drawer>
    <template #rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme"
      />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template #footerRender>
      <global-footer />
    </template>
    <router-view :key="key" />
  </CustomLayout>
</template>

<script>
import { mapState } from 'vuex';
import {
  CONTENT_WIDTH_TYPE,
  SIDEBAR_TYPE,
  TOGGLE_MOBILE_TYPE,
  TOGGLE_NAV_THEME,
  TOGGLE_COLOR,
} from '@/store/mutation-types';

import defaultSettings from '@/config/defaultSettings';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter';
import LogoSvg from '../assets/logo.svg?inline';
import SettingDrawer from '@/components/SettingDrawer';
import CustomLayout from './CustomLayout';

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    LogoSvg,
    CustomLayout,
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

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      defaultSettings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth:
          defaultSettings.layout === 'sidemenu'
            ? CONTENT_WIDTH_TYPE.Fluid
            : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,
        multiTab: defaultSettings.multiTab,
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,
      key: 999,
    };
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
    }),
    settings() {
      const {
        theme,
        color,
        fixedHeader,
        fixSiderbar,
        layout,
        colorWeak,
        multiTab,
      } = this.$store.state.app;
      const { defaultSettings } = this;
      return {
        // 布局类型
        layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth:
          defaultSettings.layout === 'sidemenu'
            ? CONTENT_WIDTH_TYPE.Fluid
            : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme,
        // 主色调
        primaryColor: color,
        fixedHeader,
        fixSiderbar,
        colorWeak,
        multiTab,
        defaultSelectKey: undefined,
      };
    },
  },
  created() {
    const routes = this.mainMenu.find((item) => item.path === '/');
    const menus = (routes && routes.children) || [];
    // const each = (tree) => {
    //   tree.forEach(item => {
    //     const type = item.meta.icon
    //     item.meta.icon = () => <CIcon type={type} />
    //     if (item.children && item.children.length > 0) {
    //       each(item.children)
    //     }
    //   })
    // }
    // each(menus)
    // this.menus = (routes && routes.children) || []
    this.menus = menus;
    this.defaultSelectKey = location.pathname;
    console.log(menus);
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed);
    });
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile);
    });
  },
  mounted() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed;
        setTimeout(() => {
          this.collapsed = !this.collapsed;
        }, 16);
      });
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    // if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
    //   updateTheme(this.defaultSettings.primaryColor)
    // }
    // updateTheme(this.defaultSettings.primaryColor)
  },
  methods: {
    handleMediaQuery(val) {
      this.query = val;
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false;
        return;
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true;
        this.collapsed = false;
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid;
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse(val) {
      this.collapsed = val;

      console.log(this.collapsed);
    },
    handleSettingChange({ type, value }) {
      console.log(type, value);
      const settings = {
        ...this.defaultSettings,
      };
      type && (settings[type] = value);
      switch (type) {
        case 'contentWidth':
          settings[type] = value;
          break;
        case 'layout':
          if (value === 'sidemenu') {
            settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid;
          } else {
            settings.fixSiderbar = false;
            settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed;
          }
          break;
        case 'theme': // 主题风格
          this.$store.commit(TOGGLE_NAV_THEME, value);
          break;
        case 'primaryColor': // 主题色
          this.$store.commit(TOGGLE_COLOR, value);
          // updateTheme(value)
          // this.$store.dispatch('ToggleColor', value)
          break;
      }
      this.defaultSettings = settings;
    },
    reload() {
      this.key = Math.random();
    },
  },
};
</script>

<style lang="less">
@import './BasicLayout.less';
</style>
