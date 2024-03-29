import { computed, defineComponent, PropType } from 'vue';
import './index.less';
import { SystemTheme, useStore } from '@/store/system/theme';
import { RouteLocationNormalizedLoaded } from 'vue-router';
export default defineComponent({
  props: {
    menus: {
      type: Array as PropType<Common.Router[]>,
      default: () => [],
    },
    settings: {
      type: Object as PropType<SystemTheme>,
      default: () => {},
    },
    collapsed: {
      type: Boolean,
      default: () => {},
    },
  },

  setup() {
    const themeStore = useStore();
    const theme = computed(() => themeStore.navTheme);
    const layout = computed(() => themeStore.layout);
    return {
      theme,
      layout,
    };
  },
  data() {
    const defaultOpenKeys = this.$route.matched
      .filter((item) => item.name && item.name !== this.$route.name)
      .map((item) => item.name);
    console.log(defaultOpenKeys);
    return {
      selectedKeys: this.$route.matched
        .filter((item) => item.name)
        .map((item) => item.name),
      defaultOpenKeys,
    };
  },
  watch: {
    $route: function (newVal: RouteLocationNormalizedLoaded) {
      this.selectedKeys = newVal.matched
        .filter((item) => item.name)
        .map((item) => item.name);
      this.defaultOpenKeys = newVal.matched
        .filter((item) => item.name && item.name !== newVal.name)
        .map((item) => item.name);
    },
  },
  methods: {
    renderSubMenuItem(node: Common.Router) {
      const children = node.children?.filter((item) => !item.hidden) || [];
      const solts = {
        title: () => this.renderTitle(node),
      };
      return (
        <a-sub-menu v-slots={solts} key={node.name}>
          {children.map((item) => this.renderMenuItem(item))}
        </a-sub-menu>
      );
    },
    renderMenuItem(node: Common.Router) {
      return (
        <a-menu-item title={node.meta.title} key={node.name}>
          {this.renderLinkTitle(node)}
        </a-menu-item>
      );
    },
    renderTitle(node: Common.Router) {
      return (
        <span class="title">
          <c-icon class="icon" type={node.meta.icon} />
          <span>{node.meta.title}</span>
        </span>
      );
    },
    renderLinkTitle(node: Common.Router) {
      return <router-link to={node.path}>{this.renderTitle(node)}</router-link>;
    },
  },
  render() {
    const {
      theme,
      menus,
      renderSubMenuItem,
      renderMenuItem,
      layout,
      selectedKeys,
      defaultOpenKeys,
    } = this;
    const children =
      (menus as unknown as Common.Router[]).filter((item) => !item.hidden) ||
      [];
    return (
      children.length && (
        <a-menu
          class="custom-menus"
          mode={layout === 'sidemenu' ? 'inline' : 'horizontal'}
          theme={theme}
          openKeys={defaultOpenKeys}
          selectedKeys={selectedKeys}
        >
          {children.map((item) =>
            item.meta.type === 1
              ? renderSubMenuItem(item)
              : renderMenuItem(item)
          )}
        </a-menu>
      )
    );
  },
});
