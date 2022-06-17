import { computed, defineComponent } from 'vue';
import './index.less';
import { useStore } from '@/store/system/theme';
import { System } from '@/typings/common';
import { RouteLocationNormalizedLoaded } from 'vue-router';
export default defineComponent({
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
    settings: {
      type: Object,
      default: () => {},
    },
  },

  setup() {
    const themeStore = useStore();
    const theme = computed(() => themeStore.theme);
    return {
      theme,
    };
  },
  data() {
    return {
      selectedKeys: this.$route.matched
        .filter((item) => item.name)
        .map((item) => item.name),
      defaultOpenKeys: this.$route.matched
        .filter((item) => item.name && item.name !== this.$route.name)
        .map((item) => item.name),
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
    renderSubMenuItem(node: System.Router) {
      const solt = {
        title: this.renderTitle(node),
      };
      const children = node.children?.filter((item) => !item.hidden) || [];
      return (
        <a-sub-menu v-slot={solt} key={node.name}>
          {/* <template #title>{this.renderTitle(node)}</template> */}
          {/* <span slot="title">{this.renderTitle(node)}</span> */}
          {children.map((item) => this.renderMenuItem(item))}
        </a-sub-menu>
      );
    },
    renderMenuItem(node: System.Router) {
      return (
        <a-menu-item key={node.name}>{this.renderLinkTitle(node)}</a-menu-item>
      );
    },
    renderTitle(node: System.Router) {
      return (
        <span class="title">
          <c-icon class="icon" type={node.meta.icon} />
          <span>{node.meta.title}</span>
        </span>
      );
    },
    renderLinkTitle(node: System.Router) {
      return <router-link to={node.path}>{this.renderTitle(node)}</router-link>;
    },
  },
  render() {
    const {
      theme,
      menus,
      renderSubMenuItem,
      settings,
      selectedKeys,
      defaultOpenKeys,
    } = this;
    const children =
      (menus as unknown as System.Router[]).filter((item) => !item.hidden) ||
      [];

    return (
      children.length && (
        <a-menu
          class="custom-menus"
          theme={theme}
          mode={settings.layout === 'sidemenu' ? 'inline' : 'horizontal'}
          default-open-keys={defaultOpenKeys}
          selectedKeys={selectedKeys}
        >
          {children.map((item) => renderSubMenuItem(item))}
        </a-menu>
      )
    );
  },
});
