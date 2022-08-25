import { ConfigProvider } from 'ant-design-vue';
import { defineStore } from 'pinia';
import {
  SIDEBAR_TYPE,
  TOGGLE_COLOR,
  TOGGLE_HIDE_SETTING,
  TOGGLE_LAYOUT,
  TOGGLE_MULTI_TAB,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK,
} from './const';
import defaultSettings from '@/config/defaultSettings';
import { getSystemThemeData, updateSystemThemeData } from './storage';
export interface SystemTheme {
  navTheme: string;
  multiTab: boolean;
  layout: string;
  hideSetting: boolean;
  colorWeak: boolean;
  primaryColor: string;
}

const { navTheme, multiTab, layout, hideSetting, colorWeak, primaryColor } =
  getSystemThemeData() || defaultSettings;

export const useStore = defineStore('theme', {
  state: () => ({
    navTheme,
    sideCollapsed: false,
    layout,
    primaryColor,
    colorWeak,
    multiTab, // 多页签模式
    hideSetting, // 隐藏设置
  }),
  getters: {},
  actions: {
    // 设置主题色
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
      save(this);
    },
    /**
     * 主题风格
     * @param theme
     */
    [TOGGLE_NAV_THEME]: function (theme: string) {
      this.navTheme = theme;
      save(this);
    },
    /**
     * 主题色
     * @param color
     */
    [TOGGLE_COLOR]: function (color: string) {
      this.primaryColor = color;
      save(this);
    },
    /**
     * 色弱模式
     * @param bool
     */
    [TOGGLE_WEAK]: function (bool: boolean) {
      this.colorWeak = bool;
      save(this);
    },
    /**
     * 开启页签模式
     * @param bool
     */
    [TOGGLE_MULTI_TAB]: function (bool: boolean) {
      this.multiTab = bool;
      save(this);
    },

    /**
     * 布局
     * @param mode
     */
    [TOGGLE_LAYOUT]: function (mode: string) {
      this.layout = mode;
      save(this);
    },

    /**
     * 隐藏设置
     * @param bool
     */
    [TOGGLE_HIDE_SETTING]: function (bool: boolean) {
      this.hideSetting = bool;
      save(this);
    },
  },
});

function save(data: SystemTheme) {
  const { navTheme, multiTab, layout, hideSetting, colorWeak, primaryColor } =
    data;
  updateSystemThemeData({
    navTheme,
    multiTab,
    layout,
    hideSetting,
    colorWeak,
    primaryColor,
  });
}
