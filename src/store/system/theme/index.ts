import { ConfigProvider } from 'ant-design-vue';
import { defineStore } from 'pinia';
import {
  SIDEBAR_TYPE,
  TOGGLE_COLOR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_HIDE_SETTING,
  TOGGLE_LAYOUT,
  TOGGLE_MULTI_TAB,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK,
} from './const';
import defaultSettings from '@/config/defaultSettings';

const {
  navTheme,
  multiTab,
  layout,
  hideSetting,
  fixedHeader,
  fixedSidebar,
  contentWidth,
  autoHideHeader,
  colorWeak,
  primaryColor,
} = defaultSettings;

export const useStore = defineStore('theme', {
  state: () => ({
    theme: navTheme,
    sideCollapsed: false,
    layout,
    contentWidth,
    fixedHeader,
    fixedSidebar,
    autoHideHeader,
    color: primaryColor,
    colorWeak,
    multiTab, // 多页签模式
    hideSetting, // 隐藏设置
    _antLocale: {},
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

    /**
     * 侧边导航
     * @param bool
     */
    [SIDEBAR_TYPE]: function (bool: boolean) {
      this.sideCollapsed = bool;
    },
    /**
     * 主题风格
     * @param theme
     */
    [TOGGLE_NAV_THEME]: function (theme: string) {
      this.theme = theme;
    },
    /**
     * 主题色
     * @param color
     */
    [TOGGLE_COLOR]: function (color: string) {
      this.color = color;
    },
    /**
     * 色弱模式
     * @param bool
     */
    [TOGGLE_WEAK]: function (bool: boolean) {
      this.colorWeak = bool;
    },
    /**
     * 开启页签模式
     * @param bool
     */
    [TOGGLE_MULTI_TAB]: function (bool: boolean) {
      this.multiTab = bool;
    },

    /**
     * 布局
     * @param mode
     */
    [TOGGLE_LAYOUT]: function (mode: string) {
      this.layout = mode;
    },

    /**
     * Sidebar定位
     * @param bool
     */
    [TOGGLE_FIXED_SIDEBAR]: function (bool: boolean) {
      this.fixedSidebar = bool;
    },
    /**
     * header定位
     * @param bool
     */
    [TOGGLE_FIXED_HEADER]: function (bool: boolean) {
      this.fixedHeader = bool;
    },

    /**
     * 隐藏设置
     * @param bool
     */
    [TOGGLE_HIDE_SETTING]: function (bool: boolean) {
      this.hideSetting = bool;
    },

    /**
     *
     * @param contentWidth
     */
    [TOGGLE_CONTENT_WIDTH]: function (contentWidth: string) {
      this.contentWidth = contentWidth;
    },
  },
});
