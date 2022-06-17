<template>
  <my-icon :type="type" class="icon" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { defineComponent } from 'vue-demi';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3233276_vdxns10ldqf.js', // 在 iconfont.cn 上生成
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
