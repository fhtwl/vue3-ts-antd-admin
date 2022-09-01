import { getRoleMap } from '@/api/system/role';
import { addUser, editUserById } from '@/api/system/user';

import CommonForm, {
  AcceptType,
  CommonFormItem,
} from '@/components/CommonForm';
import { uploadImgWrap } from '@/utils/utils';
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import './index.less';

export interface UserFormData {
  userName: string;
  password: string;
  avatar: string;
  roleIds: number[] | string;
  email: string;
  id: number | undefined;
  info: System.UserInfo;
  profile: string;
}

const defaultFormData: UserFormData = {
  userName: '',
  avatar: '',
  password: '',
  roleIds: [],
  info: {
    nickName: '',
    avatar: '',
    profile: '',
  },
  email: '',
  profile: '',
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
    const instance = getCurrentInstance();
    const commonFormRef = ref<InstanceType<typeof CommonForm>>();
    // 弹窗显示
    const visible = ref(false);
    const formData = ref<UserFormData>(defaultFormData);
    const type = ref<ActionType>('add');
    const title = computed(() => actionConfig[type.value]);

    const roleOption = ref<System.Role[]>([]);
    const uploadLoading = ref<boolean>(false);

    const beforeUpload = function (file: File) {
      uploadLoading.value = true;
      uploadImgWrap(file, ['info', 'avatar'], formData.value).then((img) => {
        formData.value.info.avatar = img;
        formData.value.avatar = img;
        uploadLoading.value = false;
      });
      return false;
    };
    const formJson = computed(function () {
      const disabled = type.value === 'query';
      const base: CommonFormItem[] = [
        {
          type: 'input',
          label: '用户名',
          fieldName: 'userName',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ],
        },
        {
          type: 'custom-form',
          label: '昵称',
          fieldName: ['info', 'nickName'],
          rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          extraConfig: {
            disabled,
          },
          className: 'row',
          render(formData, extraConfig) {
            return (
              <a-input
                {...(extraConfig as Common.Params)}
                v-model:value={(formData as UserFormData).info.nickName}
              />
            );
          },
        },
        {
          type: 'tree-select',
          label: '角色',
          fieldName: 'roleIds',
          className: 'row',
          extraConfig: {
            treeData: roleOption.value,
            multiple: true,
            fieldNames: {
              children: 'children',
              label: 'name',
              key: 'id',
              value: 'id',
            },
            disabled,
          },
          rules: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '邮箱',
          fieldName: 'email',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        },
      ];
      const password: CommonFormItem[] = [
        {
          type: 'password',
          label: '密码',
          fieldName: 'password',
          className: 'row',
          extraConfig: {
            disabled,
          },
          rules: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        },
      ];
      const list: CommonFormItem[] = [
        {
          type: 'upload',
          rules: [
            { required: true, message: '用户头像不能为空', trigger: 'blur' },
          ],
          label: '用户头像',
          fieldName: ['info', 'avatar'],
          vModel: formData.value.info.avatar,

          extraConfig: {
            showUploadList: false,
            beforeUpload,
            disabled,
            acceptType: AcceptType.IMG,
          },
        },
        {
          type: 'custom-form',
          label: '简介',
          fieldName: ['info', 'profile'],
          vModel: formData.value.info.profile,
          className: 'row',
          extraConfig: {
            disabled,
          },
          render(formData, extraConfig) {
            return (
              <a-input
                {...(extraConfig as Common.Params)}
                v-model:value={(formData as UserFormData).info.profile}
              />
            );
          },
        },
      ];
      return [...base, ...(type.value === 'add' ? password : []), ...list];
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

      commonFormRef?.value?.formRef?.validate().then(() => {
        const roleIds = (formData.value.roleIds as number[]).join(',');
        if (type.value === 'add') {
          addUser({
            ...formData.value,
            ...formData.value.info,
            roleIds,
          }).then(callBack);
        } else {
          editUserById({
            ...formData.value,
            ...formData.value.info,
            roleIds,
            id: formData.value.id as number,
          }).then(callBack);
        }
      });
    };

    const getData = function () {
      getRoleMap().then((data) => {
        roleOption.value = data;
      });
    };

    const show = function (
      newType: ActionType = 'add',
      val: UserFormData = defaultFormData
    ) {
      type.value = newType;
      switch (newType) {
        case 'add': {
          formData.value = {
            ...defaultFormData,
          };
          break;
        }
        case 'edit':
        case 'query': {
          formData.value = {
            ...formData.value,
            id: val.id,
            userName: val.userName,
            email: val.email,
            info: val.info,
            roleIds: (val.roleIds as string)
              .split(',')
              .map((str) => Number(str)),
          };
          break;
        }
      }

      visible.value = true;
    };

    return {
      instance,
      commonFormRef,
      visible,
      formData,
      type,
      title,
      roleOption,
      formJson,
      handleOk,
      handleCancel,
      getData,
      show,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {},
  render() {
    const { title, visible, handleOk, handleCancel, formData, formJson } = this;
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
      </a-modal>
    );
  },
});
