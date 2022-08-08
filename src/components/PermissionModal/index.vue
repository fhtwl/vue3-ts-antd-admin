<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="width"
    :cancel-text="cancelText"
    :ok-text="okText"
    :mask-closable="maskClosable"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button @click="handleCancel">{{ cancelText }}</a-button>
      <a-button
        v-action="permission"
        type="primary"
        :loading="confirmLoading"
        @click="handleOk"
        >{{ okText }}</a-button
      >
    </template>

    <slot />
  </a-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '提示',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: '360px',
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: String,
      default: '*:*:*',
    },
  },
  emits: ['ok', 'cancel'],
  methods: {
    handleCancel() {
      this.$emit('cancel');
    },
    handleOk() {
      this.$emit('ok');
    },
  },
});
</script>

<style lang="less" scoped></style>
