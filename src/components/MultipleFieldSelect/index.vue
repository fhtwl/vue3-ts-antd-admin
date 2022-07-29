<template>
  <div class="multiple-field-select" :class="disabled ? 'disabled' : ''">
    <div class="input" :class="status">
      <input
        :disabled="disabled"
        type="text"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="value">
        {{ valueFormat }}
      </div>
      <a-icon class="icon clear" type="close" @click="handleClear()" />
      <a-icon v-if="status === 'blur'" class="icon open" type="down" />
      <a-icon v-if="status === 'focus'" class="icon open" type="up" />

      <div
        id="board"
        class="board"
        :class="status === 'focus' ? 'open' : 'close'"
      >
        <div
          v-for="component in options"
          :key="component.value"
          class="component"
        >
          <div class="component-title">{{ component.label }}</div>
          <!-- <div class="field-list">
            <div
              v-for="field in component.children"
              :key="field.value"
              class="field"
              :class="
                value.includes(
                  `${component.value}/${field.value}/${field.id}/${field.filterType}/${field.colType}`
                )
                  ? 'active'
                  : itemDisabled(component.value, field.value)
                  ? 'disabled'
                  : ''
              "
              @mousedown="
                handleSelect(
                  component.value,
                  field.value,
                  field.id,
                  field.filterType,
                  field.colType,
                  $event
                )
              "
            >
              {{ field.label }}
              <a-icon
                v-show="
                  value.includes(
                    `${component.value}/${field.value}/${field.id}/${field.filterType}/${field.colType}`
                  )
                "
                class="check"
                type="check"
              />
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Common from '@fhtwl-admin/common';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<Common.OptionValue[]>,
      default: () => [],
    },
    options: {
      type: Array as PropType<Common.Option[]>,
      default: () => [],
    },
    // 是否要求需要保证多选的组件的字段名相同
    isSameField: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  data() {
    return {
      status: 'blur',
      // selectValue: undefined,
    };
  },
  computed: {
    valueFormat() {
      const { value, options } = this;
      if (options.length === 0) {
        return '';
      }
      const arr = value.map((item: unknown) => {
        const [componentValue, fieldValue] = (item as string).split('/');
        // 经过转换,value可能是数字或者字符串,所以用==
        // eslint-disable-next-line no-undef
        const component = options.find(
          (option) => option.value == componentValue
        );
        // console.log(options, item, componentValue, component)
        const componentName = component!.label;
        const field = component!.children!.find(
          (option) => option.value === fieldValue
        );
        const fieldName = field!.label;
        return `${componentName}/${fieldName}`;
      });

      return arr.join(',');
    },

    itemDisabled() {
      return (component: Common.OptionValue, field: string | number) => {
        const { isSameField, selectValue } = this;

        // 是否字段名唯一
        if (isSameField) {
          // 当前字段名不等于已选择字段
          return selectValue && selectValue !== field;
        } else {
          const selectComponent = (this.value as string[]).find(
            (item) => item.split('/')[0] === component
          );
          // console.log(selectComponent, this.value,component, field)
          // 如果当前组件没有选择字段
          if (!selectComponent) {
            return false;
          } else {
            return selectComponent.split('/')[1] !== field;
          }
        }
      };
    },
    selectValue() {
      if (this.value.length > 0) {
        return (this.value[0] as string).split('/')[1];
      } else {
        return undefined;
      }
    },
  },
  methods: {
    handleClear() {
      this.$emit('change', []);
    },
    handleFocus() {
      this.status = 'focus';
    },
    handleBlur() {
      this.status = 'blur';
    },
    // eslint-disable-next-line no-undef
    handleSelect(
      component: Common.OptionValue,
      field: Common.OptionValue,
      id: Common.OptionValue,
      filterType: string,
      colType: string,
      e: Event
    ) {
      e.stopPropagation();
      e.preventDefault();
      const disabled = this.itemDisabled(component, field);
      if (disabled) {
        return false;
      }
      const newValue = `${component}/${field}/${id}/${filterType}/${colType}`;
      const index = this.value.indexOf(newValue);
      const value = [...this.value];
      if (index > -1) {
        value.splice(index, 1);
      } else {
        value.push(newValue);
      }

      this.$emit('change', value);
    },
  },
});
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
