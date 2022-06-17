<script lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    return {
      color: '#18a058',
      setColor(color: string) {
        document.documentElement.style.setProperty(
          '--ant-primary-color',
          color
        );
        ConfigProvider.config({
          theme: {
            primaryColor: color,
          },
        });
      },
    };
  },
  methods: {
    handleChange(color: string) {
      this.color = color;
      this.setColor(this.color);
    },
  },
});
</script>

<template>
  <input v-model="color" type="color" @change="handleChange(color)" />
</template>

<style lang="less" scoped></style>
