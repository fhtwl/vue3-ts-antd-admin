import { addRole, editRoleById, getRoleMap } from '@/api/system/role';
import CommonForm, { CommonFormItem } from '@/components/CommonForm';
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import './index.less';

export interface RoleFormData extends RoleReq.AddRole {
  id: undefined | number;
}

const defaultFormData: RoleFormData = {
  name: '',
  parentId: undefined,
  serialNum: 0,
  describe: '',
  id: undefined,
};

export type ActionType = 'edit' | 'add' | 'query';

const actionConfig = {
  edit: '编辑',
  add: '新增',
  query: '详情',
};

export default defineComponent({
  components: {
    CommonForm,
  },
  emits: ['update'],
  setup(_props: Common.Params, { emit }) {
    const commonFormRef = ref<InstanceType<typeof CommonForm>>();
    const instance = getCurrentInstance();
    // 弹窗显示
    const visible = ref<boolean>(false);
    const formData = ref<RoleFormData>(defaultFormData);
    const type = ref<ActionType>('add');
    const title = computed(() => actionConfig[type.value]);

    const isIconShow = ref(false);

    const roleOptions = ref<System.Role[]>([]);

    const formJson = computed<CommonFormItem[]>(function (): CommonFormItem[] {
      const disabled = type.value === 'query';

      const list: CommonFormItem[] = [
        {
          type: 'input',
          label: '角色名称',
          fieldName: 'name',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          dataType: String,
        },
        {
          type: 'tree-select',
          label: '上级角色',
          fieldName: 'parentId',
          className: 'row',
          extraConfig: {
            treeData: roleOptions,
            replaceFields: {
              children: 'children',
              label: 'name',
              key: 'id',
              value: 'id',
            },
            disabled,
          },
          dataType: Number,
        },
        {
          type: 'number',
          label: '角色排序',
          fieldName: 'serialNum',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [
            { required: true, message: '角色排序不能为空', trigger: 'blur' },
          ],
          dataType: String,
        },
        {
          type: 'textarea',
          label: '角色备注',
          fieldName: 'describe',
          className: 'row',
          extraConfig: {
            disabled,
          },
          dataType: String,
        },
      ];
      return list;
    });

    const handleCancel = function () {
      visible.value = false;
      formData.value = {
        ...defaultFormData,
      };
      emit('update');
      commonFormRef?.value?.formRef?.resetFields();
    };
    const handleOk = function () {
      if (type.value === 'query') {
        handleCancel();
        return false;
      }
      const callBack = () => {
        handleCancel();
        instance?.proxy?.$message.success(`${title.value}成功`);
      };
      commonFormRef.value?.formRef?.validate().then(() => {
        if (type.value === 'add') {
          addRole({
            ...formData.value,
            parentId: formData.value.parentId ? formData.value.parentId : 0,
          }).then(callBack);
        } else {
          editRoleById({
            ...formData.value,
            parentId: formData.value.parentId ? formData.value.parentId : 0,
            id: formData.value.id as number,
          }).then(callBack);
        }
      });
    };

    const getData = function () {
      getRoleMap().then((data) => {
        roleOptions.value = data;
      });
    };

    const show = function (
      newType: ActionType = 'add',
      val: RoleFormData = { ...defaultFormData }
    ) {
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
    return {
      visible,
      formData,
      type,
      title,
      isIconShow,
      roleOptions,
      formJson,
      handleOk,
      handleCancel,
      getData,
      show,
      commonFormRef,
    };
  },
  data() {
    return {};
  },

  mounted() {
    this.getData();
  },
  methods: {},
  render() {
    const {
      title,
      visible,
      handleOk,
      handleCancel,
      formData,
      formJson,
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
        <a-modal visible={isIconShow} title="图标" footer={false}>
          <div class="icon-container"></div>
        </a-modal>
      </a-modal>
    );
  },
});
