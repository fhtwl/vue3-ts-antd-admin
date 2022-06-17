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
@import url('@/assets/styles/common/var.css');
@import url('@/assets/styles/common/common.less');
</style>
