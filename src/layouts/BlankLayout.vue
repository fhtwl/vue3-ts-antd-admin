<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// 空白布局, 备用
export default defineComponent({
  name: 'BlankLayout',
});
</script>

<style scoped></style>
