import './index.less';
import MultipleFieldSelect from '../MultipleFieldSelect/index.vue';
import GradientColor from '../GradientColor/index.vue';
import { defineComponent, PropType, ref } from 'vue';
import { FormInstance } from 'ant-design-vue';
import { Fun } from '@fhtwl-admin/common';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';

export enum AcceptType {
  ALL = 0,
  IMG,
  DOC,
  EXCEL,
}

const fileAccept = {
  [AcceptType.ALL]: '*',
  [AcceptType.IMG]:
    '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.webp.WEBP,.svg,.SVG,.bmp,.BMP',
  [AcceptType.DOC]: '.doc,.DOC,.docx,.DOCX',
  [AcceptType.EXCEL]: '.csv,.CSV,.xlsx,.XLSX',
};
function getAccept(acceptType: AcceptType | AcceptType[]): string {
  if (typeof acceptType === 'string') {
    return fileAccept[acceptType];
  } else {
    let accept = '';
    (acceptType as AcceptType[]).forEach((type: AcceptType) => {
      accept = accept + fileAccept[type];
    });
    return accept;
  }
}

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
  | 'custom-form'
  | 'gradient-color';

export interface FormRule {
  required: boolean;
  message: string;
  trigger: string | string[];
}

export type FieldName = string | string[];

export interface CommonFormItem extends Common.Params {
  type: CommonFormType;
  label?: string;
  fieldName?: FieldName;
  rules?: FormRule[];
  options?: Common.Option[];
  extraConfig?: Common.Params;
  notRender?: boolean;
  placeholder?: string;
  render?: Fun<unknown, Common.RenderElement>;
  dataType?: Fun<unknown, void>;
  initialValue?: string;
  vModel?: string | number | boolean | unknown[];
  className?: string;
}

export interface FormItemEvent {
  target: { value: Common.OptionValue };
}

export const getLoading = (fieldName: FieldName) => {
  return typeof fieldName === 'string'
    ? `${fieldName}loading`
    : `${(fieldName as string[]).join('')}loading`;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default defineComponent({
  name: 'CommonForm',
  props: {
    formJson: {
      type: Array as PropType<
        CommonFormItem[] | Fun<unknown, CommonFormItem[]>
      >,
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
        vModel,
        extraConfig = {},
        className = '',
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
        key: `form-item-${
          fieldName instanceof Array ? fieldName.join('-') : fieldName
        }`,
        rules,
        class: className,
      };
      switch (type) {
        // 自定义内容，当现有组件不满足需求时，可在外层组件中自定义表单项（或分组小标题等其他内容），写在配置项的content里即可
        case 'custom':
          return item.render && item.render!(formData);
        // 普通文本
        case 'custom-form':
          return (
            <a-form-item {...formItemAttr}>
              {item.render && item.render!(formData, extraConfig)}
            </a-form-item>
          );

        case 'input':
          return (
            <a-form-item {...formItemAttr}>
              <a-input
                {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );

        // 数字输入框
        case 'number':
          return (
            <a-form-item {...formItemAttr}>
              <a-input-number
                {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );
        case 'password':
          return (
            <a-form-item {...formItemAttr}>
              <a-input-password
                {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );
        // 下拉选择框，extraConfig中配置{mode: 'tags'}可进行多选
        case 'select':
          return (
            <a-form-item {...formItemAttr}>
              {
                <a-select
                  {...extraConfig}
                  v-model:value={formData[fieldName as string]}
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
                  {...extraConfig}
                  v-model:value={formData[fieldName as string]}
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
                  v-model:value={formData[fieldName as string]}
                  {...extraConfig}
                />
              }
            </a-form-item>
          );
        case 'multiple-field-select':
          return (
            <a-form-item {...formItemAttr}>
              <MultipleFieldSelect
                v-model:value={formData[fieldName as string]}
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
                v-model:value={formData[fieldName as string]}
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
                v-model:value={formData[fieldName as string]}
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
                v-model:value={formData[fieldName as string]}
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
                value:checked={formData[fieldName as string]}
              />
            </a-form-item>
          );
        case 'slider':
          return (
            <a-form-item {...formItemAttr}>
              <a-slider
                {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );
        case 'button':
          return (
            <a-form-item {...formItemAttr} label="">
              <a-button autoComplete="off" {...extraConfig}>
                {label}
              </a-button>
            </a-form-item>
          );
        case 'upload':
          // extraConfig.accept = fileAccept[extraConfig?.acceptType];
          if (extraConfig?.cceptType) {
            extraConfig.accept = getAccept(
              extraConfig.acceptType as AcceptType | AcceptType[]
            );
          }

          return (
            <a-form-item {...formItemAttr}>
              <a-upload list-type="picture-card" name="file" {...extraConfig}>
                {vModel === undefined || vModel === null ? (
                  formData[fieldName as string]
                ) : vModel ? (
                  <img
                    src={vModel || formData[fieldName as string]}
                    alt="avatar"
                  />
                ) : (
                  <div>
                    {formData[getLoading(fieldName)] === true ? (
                      <LoadingOutlined />
                    ) : (
                      <PlusOutlined />
                    )}

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
                {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );
        case 'radio-group':
          return (
            <a-form-item {...formItemAttr}>
              <a-radio-group
                options={options}
                {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );
        case 'gradient-color':
          return (
            <a-form-item {...formItemAttr}>
              <GradientColor
                // {...extraConfig}
                v-model:value={formData[fieldName as string]}
              />
            </a-form-item>
          );

        default:
          return null;
      }
    },
  },
  render() {
    const { formJson = [], formData, layout } = this;
    console.log(formData);
    const json = formJson instanceof Array ? formJson : formJson(formData);
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
        {json.map((item) =>
          item.notRender ? null : this.renderFormItem(item)
        )}
      </a-form>
    );
  },
});
