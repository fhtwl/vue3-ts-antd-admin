<template>
  <div :class="wrpCls">
    <avatar-dropdown
      :menu="showMenu"
      :current-user="currentUser"
      class=""
      :class="prefixCls"
    />
  </div>
</template>

<script lang="ts">
import AvatarDropdown from './AvatarDropdown.vue';
import { useStore } from '@/store/system/user';
import { computed, defineComponent } from 'vue';
export default defineComponent({
  name: 'RightContent',
  components: {
    AvatarDropdown,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action',
    },
    topMenu: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const userStore = useStore();

    const wrpCls = computed(() => {
      const { topMenu, theme } = props;
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${!topMenu ? 'light' : theme}`]: true,
      };
    });

    const currentUser = computed(() => {
      return {
        name: userStore.info?.nickName,
      };
    });
    return {
      wrpCls,
      currentUser,
    };
  },
  data() {
    return {
      showMenu: true,
    };
  },
});
</script>
