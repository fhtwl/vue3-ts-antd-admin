<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
export default defineComponent({
  name: 'RegisterResult',
  setup() {
    const instance = getCurrentInstance();
    const form = ref(
      instance?.proxy?.$route.params as unknown as { email: string }
    );
    const goHomeHandle = function () {
      instance?.proxy?.$router.push({ name: 'login' });
    };
    const email = computed(() => `你的账户：${form.value.email} 注册成功`);
    return {
      name: 'RegisterResult',
      description: '注册成功。',
      form,
      email,
      goHomeHandle,
    };
  },
});
</script>

<template>
  <a-result is-success :content="false" :title="email" :sub-title="description">
    <template #extra>
      <a-button size="large" style="margin-left: 8px" @click="goHomeHandle"
        >去登录</a-button
      >
    </template>
  </a-result>
</template>
