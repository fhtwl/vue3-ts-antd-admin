<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormItemEvent } from '../CommonForm';
import { getGradientBg } from './gradientBg';

interface Value {
  angle: number;
  color: string[];
  opacity: number;
}

export default defineComponent({
  components: {},
  props: {
    value: {
      type: Object as PropType<Value>,
      default: () => {
        return {
          angle: 0,
          color: ['#fff'],
          opacity: 1,
        };
      },
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    background() {
      return getGradientBg(this.value as unknown as Value);
    },
  },
  methods: {
    addColor() {
      const { color } = this.value;
      color.push('#ffffff');
    },
    removeColor(index: number) {
      const { color } = this.value;
      color.splice(index, 1);
    },
    handleColorChange(e: unknown, index: number) {
      const { color } = this.value;
      color[index] = ((e as FormItemEvent).target?.value as string) || '';
      // this.$set(this.value, 'color', [...color]);
      // eslint-disable-next-line vue/no-mutating-props
      this.value.color = [...color];
    },
    handleVisibleChange(val: boolean) {
      this.visible = val;
    },
  },
});
</script>

<template>
  <div class="gradient-color">
    <a-dropdown
      :trigger="['click']"
      :visible="visible"
      @visible-change="handleVisibleChange"
    >
      <div class="input" :style="{ background }"></div>
      <template #overlay>
        <div class="popup" style="width: 320px">
          <div class="content">
            <a-form
              ref="formRef"
              class="color-arr-form"
              :model="value"
              layout="inline"
            >
              <span>渐变方向</span>
              <a-form-item label="偏转角度" prop="angle" class="item">
                <a-slider :value="value.angle" :min="0" :max="360" />
              </a-form-item>
              <span>颜色透明</span>
              <a-form-item label="透明度" prop="opacity" class="item">
                <a-slider
                  :value="value.opacity"
                  :min="0"
                  :max="1"
                  :step="0.05"
                />
              </a-form-item>
              <span>颜色数组</span>
              <div
                v-for="(item, index) in value.color"
                :key="index"
                class="item"
              >
                <a-form-item
                  :label="`颜色${index + 1}`"
                  :prop="`color.${index}`"
                  class="color-item"
                >
                  <a-input
                    type="color"
                    :value="item"
                    @change="(e: unknown) => handleColorChange(e, index)"
                  />
                </a-form-item>
                <a-form-item class="btn">
                  <a-button
                    type="dashed"
                    :disabled="value.color.length < 2"
                    @click="() => removeColor(index)"
                  >
                    <a-icon
                      class="dynamic-delete-button"
                      type="minus-circle-o"
                    />
                  </a-button>
                </a-form-item>

                <a-form-item class="btn">
                  <a-button type="dashed" @click="addColor">
                    <a-icon type="plus" />
                  </a-button>
                </a-form-item>
              </div>
            </a-form>
          </div>
        </div>
      </template>
    </a-dropdown>
  </div>
</template>
<style lang="less" scoped>
@import url('./index.less');
</style>
