import './index.less';
import MultipleFieldSelect from '../MultipleFieldSelect/index.vue';
import GradientColor from '../GradientColor/index.vue';
import { defineComponent, PropType, ref } from 'vue';
import { FormInstance } from 'ant-design-vue';
type ItemHandleChange = (
  fieldName: string,
  value: Common.OptionValue,
  option: Common.Option
) => void;

type EventCallback = (...args: unknown[]) => void;

type handleBeforeUpload = (file: File) => void;

type CommonFormType =
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

interface CommonFormItem {
  type: CommonFormType;
  label: string;
  fieldName: string;
  rules: [];
  options: Common.Option[];
  extraConfig: Common.Params;
  onClick: EventCallback;
  beforeUpload: handleBeforeUpload;
  notRender: boolean;
  placeholder: string;
  onChange: EventCallback;
  render: EventCallback;
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
        fieldName,
        rules,
        options = [],
        extraConfig,
        onClick = () => {},
        beforeUpload = () => {},
      } = item;
      let { placeholder } = item;
      if (extraConfig && extraConfig.disabled) {
        placeholder = ' ';
      }
      const itemHandleChange = item.onChange;
      switch (type) {
        // 自定义内容，当现有组件不满足需求时，可在外层组件中自定义表单项（或分组小标题等其他内容），写在配置项的content里即可
        case 'custom':
          return (
            <div key={`form-item-${index}`} {...extraConfig}>
              {item.render(formData)}
            </div>
          );
        // 普通文本
        case 'input':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-input
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(e: FormItemEvent) =>
                  this.onFormChange(fieldName, e.target.value)
                }
              />
            </a-form-model-item>
          );

        // 数字输入框
        case 'number':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-input-number
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(e: Common.OptionValue) =>
                  this.onFormChange(fieldName, e)
                }
              />
            </a-form-model-item>
          );

        // 下拉选择框，extraConfig中配置{mode: 'tags'}可进行多选
        case 'select':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              {
                <a-select
                  v-model={formData[fieldName]}
                  onChange={(e: Common.OptionValue) =>
                    this.onFormChange(fieldName, e, itemHandleChange)
                  }
                  autoComplete="off"
                  disabled={extraConfig.disabled}
                  mode={extraConfig.mode}
                  allowClear={extraConfig.allowClear}
                  {...extraConfig}
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
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              {
                <a-select
                  v-model={formData[fieldName]}
                  onChange={(
                    value: Common.OptionValue,
                    option: Common.Option
                  ) =>
                    this.onFormChange(
                      fieldName,
                      value,
                      itemHandleChange,
                      option
                    )
                  }
                  autoComplete="off"
                  disabled={extraConfig.disabled}
                  mode={extraConfig.mode}
                  {...extraConfig}
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
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              {
                <a-tree-select
                  replaceFields={extraConfig.replaceFields}
                  v-model={formData[fieldName]}
                  treeData={extraConfig.treeData}
                  onChange={(e: Common.OptionValue) =>
                    this.onFormChange(fieldName, e, itemHandleChange)
                  }
                  autoComplete="off"
                  disabled={extraConfig.disabled}
                />
              }
            </a-form-model-item>
          );
        case 'multiple-field-select':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <MultipleFieldSelect
                v-model={formData[fieldName]}
                options={options}
                replaceFields={extraConfig.replaceFields}
                onChange={(e: Common.OptionValue) =>
                  this.onFormChange(fieldName, e, itemHandleChange)
                }
                autoComplete="off"
                disabled={extraConfig.disabled}
              />
            </a-form-model-item>
          );
        // 颜色选择器
        case 'color':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-input
                type="color"
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(e: FormItemEvent) =>
                  this.onFormChange(fieldName, e.target.value)
                }
              />
            </a-form-model-item>
          );
        // 日期选择器
        case 'date':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-date-picker
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                format={extraConfig.format}
                valueFormat={extraConfig.valueFormat}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-model-item>
          );
        // 日期选择器
        case 'date-range':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-range-picker
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || [`开始时间`, '结束时间']}
                {...extraConfig}
                disabled={extraConfig.disabled}
                format={extraConfig.format}
                valueFormat={extraConfig.valueFormat}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-model-item>
          );
        case 'switch':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-switch
                checked-children="开"
                un-checked-children="关"
                v-model={formData[fieldName]}
                autoComplete="off"
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-model-item>
          );
        case 'slider':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-slider
                v-model={formData[fieldName]}
                autoComplete="off"
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(value: Common.OptionValue) =>
                  this.onFormChange(fieldName, value, itemHandleChange)
                }
              />
            </a-form-model-item>
          );
        case 'button':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-button
                autoComplete="off"
                {...extraConfig}
                disabled={extraConfig.disabled}
                type={extraConfig.type}
                onClick={() => onClick(item)}
              >
                {label}
              </a-button>
            </a-form-model-item>
          );
        case 'upload':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-upload
                disabled={extraConfig.disabled}
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
            </a-form-model-item>
          );
        case 'textarea':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-textarea
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(e: FormItemEvent) =>
                  this.onFormChange(fieldName, e.target.value)
                }
              />
            </a-form-model-item>
          );
        case 'radio-group':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <a-radio-group
                v-model={formData[fieldName]}
                options={options}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(value: Common.OptionValue, option: Common.Option) =>
                  this.onFormChange(fieldName, value, itemHandleChange, option)
                }
              />
            </a-form-model-item>
          );
        case 'gradient-color':
          return (
            <a-form-model-item
              prop={fieldName}
              colon={colon}
              label={label}
              key={`form-item-${index}`}
              class={extraConfig ? extraConfig.className || '' : ''}
              rules={rules}
            >
              <GradientColor
                v-model={formData[fieldName]}
                autoComplete="off"
                placeholder={placeholder || `请输入${label}`}
                {...extraConfig}
                disabled={extraConfig.disabled}
                onChange={(e: FormItemEvent) =>
                  this.onFormChange(fieldName, e.target.value)
                }
              />
            </a-form-model-item>
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
