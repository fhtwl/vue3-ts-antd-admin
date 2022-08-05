import './index.less';
import MultipleFieldSelect from '../MultipleFieldSelect/index.vue';
import GradientColor from '../GradientColor/index.vue';
import { defineComponent, PropType, ref } from 'vue';
import { FormInstance } from 'ant-design-vue';
import { Fun } from '@fhtwl-admin/common';
type ItemHandleChange = (
  fieldName: string,
  value: Common.OptionValue,
  option: Common.Option
) => void;

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
    renderFormItem(item: CommonFormItem) {
      const { colon, formData } = this;
      const {
        type,
        label = '',
        fieldName = '',
        rules,
        options = [],
        extraConfig = {},
        onClick = () => {},
        beforeUpload = () => {},
      } = item;
      console.log(extraConfig);
      let { placeholder } = item;
      if (extraConfig) {
        extraConfig.placeholder = extraConfig.placeholder || `请输入${label}`;
        if (extraConfig.disabled) {
          placeholder = ' ';
        }
      }

      const formItemAttr = {
        name: fieldName,
        colon,
        label,
        key: `form-item-${fieldName}`,
        rules,
        class: extraConfig.className,
      };
      console.log(formItemAttr);
      const itemHandleChange = item.onChange;
      switch (type) {
        // 自定义内容，当现有组件不满足需求时，可在外层组件中自定义表单项（或分组小标题等其他内容），写在配置项的content里即可
        case 'custom':
          return item.render && item.render!(formData);
        // 普通文本
        case 'input':
          return (
            <a-form-item {...formItemAttr}>
              <a-input
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                v-model:value={formData[fieldName]}
              />
            </a-form-item>
          );

        // 数字输入框
        case 'number':
          return (
            <a-form-item {...formItemAttr}>
              <a-input-number
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                v-model:value={formData[fieldName]}
              />
            </a-form-item>
          );

        // 下拉选择框，extraConfig中配置{mode: 'tags'}可进行多选
        case 'select':
          return (
            <a-form-item {...formItemAttr}>
              {
                <a-select
                  autoComplete="off"
                  {...extraConfig}
                  v-model:value={formData[fieldName]}
                >
                  {options.map((item2) => (
                    <a-select-option key={item2.value}>
                      {item2.label}
                    </a-select-option>
                  ))}
                </a-select>
              }
            </a-form-item>
          );
        case 'select-group':
          return (
            <a-form-item {...formItemAttr}>
              {
                <a-select
                  v-model={formData[fieldName]}
                  {...extraConfig}
                  v-model:value={formData[fieldName]}
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
            </a-form-item>
          );
        // 树选择框
        case 'tree-select':
          return (
            <a-form-item {...formItemAttr}>
              {
                <a-tree-select
                  v-model:value={formData[fieldName]}
                  {...extraConfig}
                />
              }
            </a-form-item>
          );
        case 'multiple-field-select':
          return (
            <a-form-item {...formItemAttr}>
              <MultipleFieldSelect
                v-model:value={formData[fieldName]}
                {...extraConfig}
              />
            </a-form-item>
          );
        // 颜色选择器
        case 'color':
          return (
            <a-form-item {...formItemAttr}>
              <a-input
                type="color"
                {...extraConfig}
                v-model:value={formData[fieldName]}
              />
            </a-form-item>
          );
        // 日期选择器
        case 'date':
          return (
            <a-form-item {...formItemAttr}>
              <a-date-picker
                autoComplete="off"
                {...extraConfig}
                v-model:value={formData[fieldName]}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-item>
          );
        // 日期选择器
        case 'date-range':
          return (
            <a-form-item {...formItemAttr}>
              <a-range-picker
                autoComplete="off"
                placeholder={placeholder || [`开始时间`, '结束时间']}
                {...extraConfig}
                v-model:value={formData[fieldName]}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-item>
          );
        case 'switch':
          return (
            <a-form-item {...formItemAttr}>
              <a-switch
                checked-children="开"
                un-checked-children="关"
                autoComplete="off"
                {...extraConfig}
                v-model:checked={formData[fieldName]}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-item>
          );
        case 'slider':
          return (
            <a-form-item {...formItemAttr}>
              <a-slider
                {...extraConfig}
                v-model:value={formData[fieldName]}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-item>
          );
        case 'button':
          return (
            <a-form-item {...formItemAttr}>
              <a-button
                autoComplete="off"
                {...extraConfig}
                onClick={() => onClick(item)}
              >
                {label}
              </a-button>
            </a-form-item>
          );
        case 'upload':
          return (
            <a-form-item {...formItemAttr}>
              <a-upload
                list-type="picture-card"
                name="file"
                {...extraConfig}
                beforeUpload={beforeUpload}
                showUploadList={extraConfig.showUploadList}
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
            </a-form-item>
          );
        case 'textarea':
          return (
            <a-form-item {...formItemAttr}>
              <a-textarea
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                v-model:value={formData[fieldName]}
                onChange={(e: FormItemEvent) =>
                  this.onFormChange(fieldName, e.target.value)
                }
              />
            </a-form-item>
          );
        case 'radio-group':
          return (
            <a-form-item {...formItemAttr}>
              <a-radio-group
                options={options}
                {...extraConfig}
                v-model:value={formData[fieldName]}
                onChange={(value: Common.OptionValue, option: Common.Option) =>
                  this.onFormChange(fieldName, value, itemHandleChange, option)
                }
              />
            </a-form-item>
          );
        case 'gradient-color':
          return (
            <a-form-item {...formItemAttr}>
              <GradientColor
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                v-model:value={formData[fieldName]}
                onChange={(e: FormItemEvent) =>
                  this.onFormChange(fieldName, e.target.value)
                }
              />
            </a-form-item>
          );

        default:
          return null;
      }
    },
    // 表单变化处理
    onFormChange(
      fieldName: string,
      value: string | number,
      itemHandleChange?: ItemHandleChange,
      option?: Common.Option
    ) {
      const { onChange = () => {} } = this;
      // const item = formJson.find(item => item.fieldName === fieldName)
      // const itemHandleChange = item.itemHandleChange
      if (itemHandleChange) {
        itemHandleChange(fieldName, value, option!);
      } else {
        onChange(fieldName, value, option);
      }

      // console.log({fieldName, value, ...args});
    },
  },
  render() {
    const { formJson = [], formData, layout } = this;
    console.log(formData);
    return (
      <a-form
        {...{ props: { model: formData } }}
        model={formData}
        {...formItemLayout}
        ref="formRef"
        labelAlign="right"
        layout={layout}
        class="common-form-container"
      >
        {formJson.map((item) =>
          item.notRender ? null : this.renderFormItem(item)
        )}
      </a-form>
    );
  },
});
