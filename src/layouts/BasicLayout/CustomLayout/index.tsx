import { SystemTheme } from '@/store/system/theme';
import { PropType, ref } from 'vue';
import { defineComponent } from 'vue-demi';
import './index.less';
import Menus from './Menus';

export default defineComponent({
  components: {
    Menus,
  },
  props: {
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    menus: {
      type: Array as PropType<Common.Router[]>,
      default: () => [],
    },
    handleCollapse: {
      type: Function,
      default: () => () => {},
    },
    settings: {
      type: Object as PropType<SystemTheme>,
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
  render() {
    const { settings, menus, collapsed, handleCollapsedChange } = this;

    return (
      <>
        <a-layout
          id="components-layout-demo-custom-trigger"
          class={`layout-${settings.layout}`}
        >
          {settings.layout === 'sidemenu' && (
            <a-layout-sider
              v-model:collapsed={collapsed}
              trigger={null}
              collapsible
              theme={settings.navTheme}
              width="256"
              class="layout-sider"
            >
              {this.$slots.menuHeaderRender!()}
              <Menus menus={menus} settings={settings} collapsed={collapsed} />
            </a-layout-sider>
          )}

          <a-layout>
            <a-layout-header class={`layout-header ${settings.navTheme}`}>
              <div class="left">
                {settings.layout === 'sidemenu' && (
                  <div class="trigger" onClick={handleCollapsedChange}>
                    <c-icon type={!collapsed ? 'menu-unfold' : 'menu-fold'} />
                  </div>
                )}

                {this.$slots.headerContentRender!()}

                {settings.layout === 'topmenu' && (
                  <>
                    {this.$slots.menuHeaderRender!()}
                    <Menus
                      menus={menus}
                      settings={settings}
                      collapsed={collapsed}
                    />
                  </>
                )}
              </div>
              <div class="right">{this.$slots.rightContentRender!()}</div>
            </a-layout-header>
            <a-layout-content
              class={`layout-content ${
                settings.multiTab ? '' : 'no-multi-tab'
              }`}
            >
              {this.$slots.default!()}

              {this.$slots.footerRender!()}
            </a-layout-content>
          </a-layout>
        </a-layout>
      </>
    );
  },
});
