import './index.less';
import MultipleFieldSelect from '../MultipleFieldSelect/index.vue';
import GradientColor from '../GradientColor/index.vue';
import { defineComponent, PropType, ref } from 'vue';
import { FormInstance } from 'ant-design-vue';
import { Fun } from '@fhtwl-admin/common';

type handleBeforeUpload = (file: File) => void;

export type CommonFormType =
  | 'input'
  | 'password'
  | 'select'
  | 'custom'
  | 'number'
  | 'select-group'
  | 'tree-select'
  | 'multiple-field-select'
  | 'color'
  | 'date'
  | 'date-range'
  | 'switch'
  | 'slider'
  | 'button'
  | 'upload'
  | 'textarea'
  | 'radio-group'
  | 'gradient-color';

export interface FormRule {
  required: boolean;
  message: string;
  trigger: string | string[];
}

export interface CommonFormItem {
  type: CommonFormType;
  label?: string;
  fieldName?: string;
  rules?: FormRule[];
  options?: Common.Option[];
  extraConfig?: Common.Params;
  onClick?: Fun<unknown, void>;
  beforeUpload?: handleBeforeUpload;
  notRender?: boolean;
  placeholder?: string;
  onChange?: Fun<unknown, void>;
  render?: Fun<unknown, JSX.Element | string>;
  dataType?: Fun<unknown, void>;
}

export interface FormItemEvent {
  target: { value: Common.OptionValue };
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export default defineComponent({
  name: 'CommonForm',
  props: {
    formJson: {
      type: Array as PropType<CommonFormItem[]>,
      default: () => [],
    },
    onChange: {
      type: Function,
      default: () => () => {},
    },
    colon: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => {},
    },
    layout: {
      type: String,
      default: 'inline',
    },
  },
  setup() {
    const formRef = ref<FormInstance>();

    return {
      formRef,
    };
  },

  data() {
    return {
      form: {},
    };
  },

  methods: {
    // 每种类型的表单item
    renderFormItem(item: CommonFormItem, index: number) {
      const { colon, formData } = this;
      const {
        type,
        label,
        fieldName = '',
        rules,
        options = [],
        extraConfig = {},
      } = item;
      let placeholder = item.extraConfig?.placeholder;
      if (extraConfig?.disabled) {
        placeholder = ' ';
      } else {
        if (!placeholder) {
          placeholder = ['select'];
        }
      }
      const formItemAttr = {
        prop: fieldName,
        colon,
        label,
        key: `form-item-${index}`,
        class: extraConfig?.className || '',
        rules,
      };
      switch (type) {
        // 自定义内容，当现有组件不满足需求时，可在外层组件中自定义表单项（或分组小标题等其他内容），写在配置项的content里即可
        case 'custom':
          return (
            <div key={`form-item-${index}`} v-bind={{ ...extraConfig }}>
              {item.render && item.render(formData)}
            </div>
          );
        // 普通文本
        case 'input':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-input
                v-model={formData[fieldName]}
                placeholder={placeholder || `请输入${label}`}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );

        // 数字输入框
        case 'number':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-input-number
                v-model={formData[fieldName]}
                placeholder={placeholder || `请输入${label}`}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );

        // 下拉选择框，extraConfig中配置{mode: 'tags'}可进行多选
        case 'select':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              {
                <a-select
                  v-model={formData[fieldName]}
                  v-bind={{ ...extraConfig }}
                >
                  {options.map((item2) => (
                    <a-select-option key={item2.value}>
                      {item2.label}
                    </a-select-option>
                  ))}
                </a-select>
              }
            </a-form-model-item>
          );
        case 'select-group':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              {
                <a-select
                  v-model={formData[fieldName]}
                  v-bind={{ ...extraConfig }}
                >
                  {options.map((item2, index2) => (
                    <a-select-opt-group key={index2} label={item2.label}>
                      {(item2.children as Common.Option[]).map((itme3) => (
                        <a-select-option
                          key={itme3.value}
                          data-parent-id={itme3.parentId}
                        >
                          {itme3.label}
                        </a-select-option>
                      ))}
                    </a-select-opt-group>
                  ))}
                </a-select>
              }
            </a-form-model-item>
          );
        // 树选择框
        case 'tree-select':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              {
                <a-tree-select
                  v-model={formData[fieldName]}
                  v-bind={{ ...extraConfig }}
                />
              }
            </a-form-model-item>
          );
        case 'multiple-field-select':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <MultipleFieldSelect
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        // 颜色选择器
        case 'color':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-input
                type="color"
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        // 日期选择器
        case 'date':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-date-picker
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        // 日期选择器
        case 'date-range':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-range-picker
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
                placeholder={placeholder || [`开始时间`, '结束时间']}
              />
            </a-form-model-item>
          );
        case 'switch':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-switch
                checked-children="开"
                un-checked-children="关"
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        case 'slider':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-slider
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        case 'button':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-button v-bind={{ ...extraConfig }}>{label}</a-button>
            </a-form-model-item>
          );
        case 'upload':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-upload
                list-type="picture-card"
                name="file"
                v-bind={{ ...extraConfig }}
              >
                {formData[fieldName] ? (
                  <img src={formData[fieldName]} alt="avatar" />
                ) : (
                  <div>
                    <a-icon
                      type={
                        formData[fieldName + 'loading'] ? 'loading' : 'plus'
                      }
                    />
                    <div class="ant-upload-text">上传图片</div>
                  </div>
                )}
              </a-upload>
            </a-form-model-item>
          );
        case 'textarea':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-textarea
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        case 'radio-group':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <a-radio-group
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        case 'gradient-color':
          return (
            <a-form-model-item v-bind={formItemAttr}>
              <GradientColor
                v-model={formData[fieldName]}
                v-bind={{ ...extraConfig }}
              />
            </a-form-model-item>
          );
        default:
          return null;
      }
    },
  },

  render() {
    const { formJson = [], formData, layout } = this;
    console.log(formData);
    return (
      <a-form-model
        {...{ props: { model: formData } }}
        {...formItemLayout}
        ref="formRef"
        labelAlign="right"
        layout={layout}
        class="common-form-container"
      >
        {formJson.map((item, index) =>
          item.notRender ? null : this.renderFormItem(item, index)
        )}
      </a-form-model>
    );
  },
});
