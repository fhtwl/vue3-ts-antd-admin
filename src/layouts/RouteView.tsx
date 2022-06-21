import { computed, defineComponent, KeepAlive } from 'vue';
import { useStore } from '@/store/system/theme';

export default defineComponent({
  name: 'RouteView',
  components: {
    'keep-alive': KeepAlive,
    // Transition,
  },
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
    console.log(this.$slots);
    // const inKeep = (
    //   <router-view>
    //     {{
    //       default: ({ Component }: { Component: unknown }) => {
    //         return <keep-alive>{Component}</keep-alive>;
    //       },
    //     }}
    //   </router-view>
    // );
    const inKeep = (
      <router-view>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {({ Component }: { Component: any }) => {
          return (
            // <transition name={meta.transition || 'fade'} mode="out-in">
            <keep-alive>
              <Component key={this.$route.path} />
              {/* <component is={Component} /> */}
              {/* {Component} */}
            </keep-alive>
            // </transition>
          );
        }}
      </router-view>
    );
    const notKeep = <router-view />;
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    return this.keepAlive || multiTab || meta.keepAlive ? inKeep : notKeep;
  },
});
