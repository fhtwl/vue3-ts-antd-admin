<script lang="ts">
import { Button } from 'ant-design-vue';
import { defineComponent } from 'vue';
import { useStore } from '@/store/system/user';

const userStore = useStore();

export default defineComponent({
  name: 'Login',
  components: {
    Button,
  },
  setup() {
    return {
      pageName: 'Login',
    };
  },
  computed: {
    nameLength() {
      return userStore.nameLength;
    },
    name() {
      return userStore.name;
    },
  },
  methods: {
    handleLogin() {
      userStore.$patch({
        name: '张三',
      });
      userStore.Login();
    },
  },
});
</script>

<template>
  {{ pageName }}
  {{ name }}
  {{ nameLength }}
  <Button @click="handleLogin">登录</Button>
</template>
