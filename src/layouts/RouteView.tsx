import { computed, defineComponent, KeepAlive, Transition } from 'vue';
import { useStore } from '@/store/system/theme';
import './RouteView.less';
export default defineComponent({
  name: 'RouteView',
  components: {
    'keep-alive': KeepAlive,
    Transition,
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
    const RootBox = (
      _props: unknown,
      { slots }: { slots: { default: () => unknown } }
    ) => <div class="transition">{slots.default ? slots.default() : ''}</div>;
    const inKeep = (
      <router-view>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {({ Component }: { Component: any }) => {
          return (
            <transition
              name={meta.transition || 'fade-translate'}
              mode="out-in"
              appear
            >
              <RootBox key={this.$route.path}>
                {/* <div class="transition"> */}
                <keep-alive>
                  <Component key={this.$route.path} />
                  {/* <component is={Component} /> */}
                  {/* {Component} */}
                </keep-alive>
                {/* </div> */}
              </RootBox>
            </transition>
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
