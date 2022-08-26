<script lang="ts">
import config from '@/config/defaultSettings';
import { updateTheme, updateColorWeak, colorList } from './settingConfig';
import {
  TOGGLE_MULTI_TAB,
  TOGGLE_LAYOUT,
  TOGGLE_HIDE_SETTING,
  TOGGLE_WEAK,
  TOGGLE_NAV_THEME,
  TOGGLE_COLOR,
  NAV_THEME,
  NavTheme,
} from '@/store/system/theme/const';
import { useStore } from '@/store/system/theme';
import { computed, defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  emits: ['change'],
  setup() {
    const themeStore = useStore();

    const settings = computed(() => themeStore);

    const visible = ref(false);
    const showDrawer = function () {
      visible.value = true;
    };
    const handleClose = function () {
      visible.value = false;
    };
    const toggle = function () {
      visible.value = !visible.value;
    };

    const handleColorWeakChange = function (checked: boolean) {
      themeStore[TOGGLE_WEAK](checked);
      updateColorWeak(checked);
    };

    const handleMenuTheme = function (theme: string) {
      themeStore[TOGGLE_NAV_THEME](theme);
    };

    const layout = computed(() => themeStore.layout);

    const handleLayoutChange = function (mode: string) {
      themeStore[TOGGLE_LAYOUT](mode);
    };

    const handleHideSettingChange = function (checked: boolean) {
      themeStore[TOGGLE_HIDE_SETTING](checked);
    };

    const primaryColor = computed(() => settings.value.primaryColor);

    const handleColorChange = function (color: string) {
      if (primaryColor.value !== color) {
        themeStore[TOGGLE_COLOR](color);
        updateTheme(color);
      }
    };

    const colorWeak = computed(() => settings.value.colorWeak);

    onMounted(() => {
      updateTheme(settings.value.primaryColor);
      if (colorWeak.value !== config.colorWeak) {
        updateColorWeak(colorWeak.value);
      }
    });

    const navTheme = computed(() => settings.value.navTheme);

    const hideSetting = computed(() => settings.value.hideSetting);

    const handleMultiTabChange = function (checked: boolean) {
      themeStore[TOGGLE_MULTI_TAB](checked);
    };

    const dark = ref<NavTheme>(NAV_THEME.DARK);

    return {
      settings,
      visible,
      showDrawer,
      handleClose,
      toggle,
      handleColorWeakChange,
      handleMultiTabChange,
      handleMenuTheme,
      layout,
      handleLayoutChange,
      handleHideSettingChange,
      handleColorChange,
      navTheme,
      primaryColor,
      colorWeak,
      hideSetting,
      dark,
    };
  },
  data() {
    return {
      colorList,
    };
  },
});
</script>

<template>
  <div class="setting-drawer">
    <a-drawer
      width="300"
      placement="right"
      :closable="false"
      :visible="visible && !settings.hideSetting"
      :drawer-style="{ position: 'absolute' }"
      @close="handleClose"
    >
      <div class="setting-drawer-index-content">
        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>
          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template #title> 暗色菜单风格 </template>
              <div
                class="setting-drawer-index-item"
                @click="handleMenuTheme(dark)"
              >
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg"
                  :alt="dark"
                />
                <div
                  v-if="navTheme === dark"
                  class="setting-drawer-index-selectIcon"
                >
                  <check-outlined />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template #title> 亮色菜单风格 </template>
              <div
                class="setting-drawer-index-item"
                @click="handleMenuTheme('light')"
              >
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
                  alt="light"
                />
                <div
                  v-if="navTheme !== dark"
                  class="setting-drawer-index-selectIcon"
                >
                  <check-outlined />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px">
            <a-tooltip
              v-for="(item, index) in colorList"
              :key="index"
              class="setting-drawer-theme-color-colorBlock"
            >
              <template #title>
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="handleColorChange(item.color)">
                <check-outlined v-if="item.color === primaryColor" />
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">导航模式</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template #title> 侧边栏导航 </template>
              <div
                class="setting-drawer-index-item"
                @click="handleLayoutChange('sidemenu')"
              >
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg"
                  alt="sidemenu"
                />
                <div
                  v-if="layout === 'sidemenu'"
                  class="setting-drawer-index-selectIcon"
                >
                  <check-outlined />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template #title> 顶部栏导航 </template>
              <div
                class="setting-drawer-index-item"
                @click="handleLayoutChange('topmenu')"
              >
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg"
                  alt="topmenu"
                />
                <div
                  v-if="layout !== 'sidemenu'"
                  class="setting-drawer-index-selectIcon"
                >
                  <check-outlined />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">其他设置</h3>
          <div>
            <a-list :split="false">
              <a-list-item>
                <template #actions>
                  <a-switch
                    size="small"
                    :checked="colorWeak"
                    @change="handleColorWeakChange"
                  />
                </template>

                <a-list-item-meta>
                  <template #title><div>色弱模式</div></template>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <template #actions>
                  <a-switch
                    :checked="hideSetting"
                    size="small"
                    @change="handleHideSettingChange"
                  />
                </template>

                <a-list-item-meta>
                  <template #title>
                    <a-tooltip placement="topLeft">
                      <template #title>
                        <span
                          >可在
                          <b>我的</b
                          >-<b>个人设置</b>-<b>个性化</b>-<b>打开设置面板</b>中再次打开</span
                        >
                      </template>
                      <span>
                        <question-circle-outlined
                          class="hide-icon-help"
                        />隐藏设置</span
                      >
                    </a-tooltip>
                  </template>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <template #actions>
                  <a-switch
                    :checked="settings.multiTab"
                    size="small"
                    @change="handleMultiTabChange"
                  />
                </template>

                <a-list-item-meta>
                  <template #title>多页签模式</template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
      </div>
      <template #handle>
        <div
          v-show="!settings.hideSetting"
          class="setting-drawer-index-handle"
          @click="toggle"
        >
          <setting-outlined v-if="!visible" />
          <close-outlined v-else />
        </div>
      </template>
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
@import url('./index.less');
</style>
