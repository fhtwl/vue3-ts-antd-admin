import defaultSettings from '@/config/defaultSettings';
import RightContent from '@/components/GlobalHeader/RightContent.vue';
import GlobalFooter from '@/components/GlobalFooter';
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer.vue';
import CustomLayout from './CustomLayout';
import { defineRouterStore } from '@/store/system/async-router';
import { SystemTheme, useStore } from '@/store/system/theme';
import MultiTab from '@/components/MultiTab';
import './index.less';

import { computed, ComputedRef, defineComponent, markRaw, ref } from 'vue';
import LOGO from '@/assets/logo.svg?inline';

type SettingType =
  | 'layout'
  | 'navTheme'
  | 'primaryColor'
  | 'colorWeak'
  | 'multiTab'
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
      const routes = mainMenu.value.find(
        (item: { path: string }) => item.path === '/'
      );
      return (routes && routes.children) || [];
    });

    console.log('this.addRouters', menus.value);
    const logoSvgImg = LOGO;
    const settings: ComputedRef<SystemTheme> = computed(() => {
      const {
        navTheme,
        primaryColor,
        layout,
        colorWeak,
        multiTab,
        hideSetting,
      } = themeStore;
      return {
        // 布局类型
        layout, // 'sidemenu', 'topmenu'
        // 主题 'dark' | 'light'
        navTheme,
        // 主色调
        primaryColor,
        colorWeak,
        multiTab,
        hideSetting,
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

  render() {
    const { menus, collapsed, handleCollapse, settings, reload, routerKey } =
      this;

    const slots = {
      menuHeaderRender: () => (
        <div class="logo">
          <img src={LOGO} />
          <h1>{defaultSettings.title}</h1>
        </div>
      ),
      headerContentRender: () => (
        <div class="basic-head">
          <a-tooltip title="刷新页面">
            <reload-outlined
              style="font-size: 18px; cursor: pointer"
              onClick={reload}
            />
          </a-tooltip>
          <div class="multi-tab-container">
            {settings.multiTab && <multi-tab />}
          </div>
        </div>
      ),
      rightContentRender: () => (
        <right-content
          top-menu={settings.layout === 'topmenu'}
          theme={settings.navTheme}
        />
      ),
      footerRender: () => <global-footer />,
    };
    console.log('menus render', menus);
    return (
      <CustomLayout
        menus={menus}
        default-collapsed={collapsed}
        handle-collapse={handleCollapse}
        settings={settings}
        v-slots={slots}
      >
        <setting-drawer settings={settings}></setting-drawer>
        <router-view key={routerKey} />
      </CustomLayout>
    );
  },
});
