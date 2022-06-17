import { computed, defineComponent } from 'vue';
import { useStore } from '@/store/system/theme';

export default defineComponent({
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const multiTab = computed(() => useStore().multiTab);
    return {
      multiTab,
    };
  },
  render() {
    const {
      $route: { meta },
      multiTab,
    } = this;
    const inKeep = (
      <router-view>
        <keep-alive>
          <component is={this.$slots.Component} />
        </keep-alive>
      </router-view>
    );
    const notKeep = <router-view />;
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    return this.keepAlive || multiTab || meta.keepAlive ? inKeep : notKeep;
  },
});
