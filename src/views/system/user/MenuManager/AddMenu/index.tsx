import { addMenu, editMenuById, getMenuMap } from '@/api/system/menu';
import CommonForm, { CommonFormItem } from '@/components/CommonForm';
import { menuIconList as defaultMenuIconList } from '../menuIcon';
import { foreachTree } from '@/utils/utils';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue';
import './index.less';

export interface MenuFormData {
  name: string;
  parentId: number | undefined;
  icon: string;
  show: Common.BooleanNumber;
  path: string;
  type: System.MenuType;
  id: number | undefined;
  permission: string;
}

const defaultFormData: MenuFormData = {
  name: '',
  parentId: undefined,
  icon: '',
  show: 1,
  path: '',
  type: 1,
  id: undefined,
  permission: '',
};

export type ActionType = 'edit' | 'add' | 'query';

const actionConfig: { [propsName: string]: unknown } = {
  edit: '编辑',
  add: '新增',
  query: '详情',
};

export default defineComponent({
  components: {
    CommonForm,
  },
  emits: ['update'],
  setup(_props, { emit }) {
    const instance = getCurrentInstance();
    const commonFormRef = ref<InstanceType<typeof CommonForm>>();
    // 弹窗显示
    const visible = ref(false);
    const formData = ref<MenuFormData>(defaultFormData);
    const type = ref<ActionType>('add');
    const title = computed(() => actionConfig[type.value]);

    const isIconShow = ref(false);

    const menuIconList = ref(defaultMenuIconList);
    const menuOption = ref<System.Menu[]>([]);

    const formJson = computed<CommonFormItem[]>(function (): CommonFormItem[] {
      foreachTree(menuOption.value, (node) => {
        node.disabled = formData.value.id === node.id;
      });
      let filterMenuOption;
      switch (formData.value.type) {
        case 1:
          filterMenuOption = [];
          break;
        case 2:
          foreachTree(menuOption.value, (node) => {
            node.disabled = node.type !== 1;
          });
          filterMenuOption = menuOption;
          break;
        case 3:
          foreachTree(menuOption.value, (node) => {
            node.disabled = node.type !== 2;
          });
          filterMenuOption = menuOption;
          break;
      }
      const disabled = type.value === 'query';

      const base: CommonFormItem[] = [
        {
          type: 'input',
          label: '名称',
          fieldName: 'name',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          dataType: String,
        },

        {
          type: 'radio-group',
          label: '菜单类型',
          fieldName: 'type',
          className: 'row',
          extraConfig: { disabled },
          options: [
            {
              label: '目录',
              value: 1,
            },
            { label: '菜单', value: 2 },
            { label: '按钮', value: 3 },
          ],
          dataType: Number,
        },
      ];
      console.log('filterMenuOption', filterMenuOption);
      const parent: CommonFormItem[] = [
        {
          type: 'tree-select',
          label: '上级菜单',
          fieldName: 'parentId',
          className: 'row',
          extraConfig: {
            treeData: filterMenuOption,
            fieldNames: {
              children: 'children',
              label: 'name',
              key: 'id',
              value: 'id',
            },
            disabled,
          },
          dataType: Number,
        },
      ];
      const sort: CommonFormItem[] = [
        {
          type: 'number',
          label: '菜单排序',
          fieldName: 'serialNum',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [
            { required: true, message: '菜单排序不能为空', trigger: 'blur' },
          ],
          dataType: String,
        },
      ];
      const address: CommonFormItem[] = [
        {
          type: 'input',
          label: '菜单地址',
          fieldName: 'path',
          className: 'row',
          extraConfig: { disabled },
          dataType: String,
        },
      ];

      const icon: CommonFormItem[] = [
        {
          type: 'custom',
          rules: [
            { required: true, message: '菜单图标不能为空', trigger: 'blur' },
          ],
          render: (formData: unknown) => {
            return (
              <a-form-item
                class="row"
                name="icon"
                colon={false}
                key="icon"
                label="菜单图标"
              >
                <a-input
                  disabled={disabled}
                  onClick={!disabled ? handleIconClick : () => {}}
                  value={(formData as MenuFormData)['icon']}
                  readOnly
                />
              </a-form-item>
            );
          },
          dataType: String,
        },
      ];
      const permissions: CommonFormItem[] = [
        {
          type: 'input',
          label: '权限标识',
          fieldName: 'permission',
          className: 'row',
          extraConfig: {
            disabled,
          },
          dataType: String,
        },
      ];
      const render: CommonFormItem[] = [
        {
          type: 'input',
          label: '渲染组件',
          fieldName: 'component',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [
            { required: true, message: '渲染组件不能为空', trigger: 'blur' },
          ],
          dataType: String,
        },
      ];
      const show: CommonFormItem[] = [
        {
          type: 'radio-group',
          label: '是否显示',
          fieldName: 'show',
          className: 'row',
          extraConfig: {
            disabled,
          },
          options: [
            {
              label: '显示',
              value: 1,
            },
            {
              label: '隐藏',
              value: 0,
            },
          ],
          dataType: Boolean,
        },
      ];
      switch (formData.value.type) {
        case 1:
          return [...base, ...sort, ...icon, ...render, ...show];
        case 2:
          return [
            ...base,
            ...parent,
            ...sort,
            ...icon,
            ...render,
            ...permissions,
            ...address,
            ...show,
          ];
        case 3:
          return [...base, ...parent, ...sort, ...permissions, ...show];
        default:
          return [];
      }
    });

    const handleIconClick = function () {
      isIconShow.value = true;
    };

    const handleCancel = function () {
      visible.value = false;
      formData.value = {
        ...defaultFormData,
      };
      getData();
      emit('update');
    };
    const handleOk = function () {
      if (type.value === 'query') {
        handleCancel();
        return false;
      }

      const callBack = () => {
        handleCancel();
        instance?.proxy!.$message.success(`${title.value}成功`);
      };
      commonFormRef?.value?.formRef?.validate().then((vaild) => {
        console.log(vaild);
        if (type.value === 'add') {
          addMenu({
            ...formData.value,
            parentId: formData.value.parentId ? formData.value.parentId : 0,
          }).then(callBack);
        } else {
          editMenuById({
            ...formData.value,
            parentId: formData.value.parentId ? formData.value.parentId : 0,
            id: formData.value.id as number,
          }).then(callBack);
        }
      });
    };

    const getData = function () {
      getMenuMap().then((data) => {
        menuOption.value = data;
      });
    };

    const handleSelectIcon = function (node: { type: string }) {
      formData.value.icon = node.type;
      isIconShow.value = false;
    };

    const show = (
      newType: ActionType = 'add',
      val: MenuFormData = defaultFormData
    ) => {
      type.value = newType;

      val.parentId = val?.parentId === 0 ? undefined : val?.parentId;
      switch (newType) {
        case 'add': {
          formData.value = {
            ...defaultFormData,
          };
          break;
        }
        case 'edit': {
          formData.value = {
            ...val,
          };
          break;
        }
        case 'query': {
          formData.value = {
            ...val,
          };
          break;
        }
      }

      visible.value = true;
    };
    onMounted(() => {
      getData();
    });
    return {
      visible,
      formData,
      type,
      title,
      isIconShow,
      menuIconList,
      menuOption,
      formJson,
      handleIconClick,
      handleOk,
      handleCancel,
      getData,
      handleSelectIcon,
      show,
      instance,
      commonFormRef,
    };
  },
  render() {
    const {
      title,
      visible,
      handleOk,
      handleCancel,
      formData,
      formJson,
      handleSelectIcon,
      menuIconList,
      isIconShow,
    } = this;
    return (
      <a-modal
        title={title}
        visible={visible}
        width="420px"
        cancelText="取消"
        okText="确定"
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CommonForm
          ref="commonFormRef"
          formData={formData}
          formJson={formJson}
        />
        <a-modal
          onCancel={() => (this.isIconShow = false)}
          visible={isIconShow}
          title="图标"
          footer={false}
        >
          <div class="icon-container">
            {menuIconList.map((item: { type: string }) => (
              <div
                key={item.type}
                class="icon"
                onClick={() => handleSelectIcon(item)}
              >
                <c-icon type={item.type} />
              </div>
            ))}
          </div>
        </a-modal>
      </a-modal>
    );
  },
});
