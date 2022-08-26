<template>
  <my-icon :type="type" class="icon" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';
import config from '@/config/defaultSettings';

const MyIcon = createFromIconfontCN({
  scriptUrl: config.iconfontUrl, // 在 iconfont.cn 上生成
});

export default defineComponent({
  components: {
    MyIcon,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
});
</script>

<style type="text/css" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
