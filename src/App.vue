<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('cn');
ConfigProvider.config({
  theme: {
    primaryColor: '#18a058',
  },
});
</script>

<template>
  <ConfigProvider :locale="zhCN">
    <router-view />
  </ConfigProvider>
</template>

<style lang="less">
@import url('ant-design-vue/dist/antd.variable.less');
// // @import url('@/styles/common/common.less');
// // 引入官方主题
// // @import url('ant-design-vue/lib/style/themes/default.less');
// // 变量申明和计算
// @pre-primary-color: #18a058;
// body {
//   --pirmary-color: tint(@pre-primary-color, 20%);
// }
// // 修改组件库主题
// @primary-color: var(--pirmary-color, tint(#18a058, 20%));
</style>
