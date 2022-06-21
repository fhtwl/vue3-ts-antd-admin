<script lang="ts">
import { ref } from 'vue';
import { defineComponent } from 'vue-demi';
import './index.less';
import Menus from './Menus';

export default defineComponent({
  components: {
    Menus,
  },
  props: {
    // collapsed: {
    //   type: Boolean,
    //   default: true,
    // },
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    menus: {
      type: Array,
      default: () => [],
    },
    handleCollapse: {
      type: Function,
      default: () => () => {},
    },
    settings: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const collapsed = ref(props.defaultCollapsed);
    const handleCollapsedChange = function () {
      const newValue = !collapsed.value;
      collapsed.value = newValue;
      props.handleCollapse(newValue);
      console.log(collapsed.value);
    };
    return {
      collapsed,
      handleCollapsedChange,
    };
  },
  methods: {},
});
</script>

<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    :class="`layout-${settings.layout}`"
  >
    <a-layout-sider
      v-if="settings.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :theme="settings.theme"
      width="256"
      class="layout-sider"
    >
      <slot name="menuHeaderRender"></slot>
      <Menus :menus="menus" :settings="settings" :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :class="`layout-header ${settings.theme} ${
          settings.fixedHeader ? 'fixed' : ''
        }`"
      >
        <div class="left">
          <template v-if="settings.layout === 'sidemenu'">
            <div class="trigger" @click="handleCollapsedChange">
              <c-icon :type="!collapsed ? 'menu-unfold' : 'menu-fold'" />
            </div>
          </template>
          <slot name="headerContentRender"></slot>
          <template v-if="settings.layout === 'topmenu'">
            <slot name="menuHeaderRender"></slot>
            <Menus :menus="menus" :settings="settings" :collapsed="collapsed" />
          </template>
        </div>
        <div class="right">
          <slot name="rightContentRender"></slot>
        </div>
      </a-layout-header>
      <a-layout-content
        :class="`layout-content ${settings.multiTab ? '' : 'no-multi-tab'} ${
          settings.fixedHeader ? 'fixed-top' : ''
        }`"
      >
        <slot></slot>

        <slot name="footerRender"></slot>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import url('./index.less');
</style>
