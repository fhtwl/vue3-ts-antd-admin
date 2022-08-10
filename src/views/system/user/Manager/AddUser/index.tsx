import { getRoleMap } from '@/api/system/role';
import { addUser, editUserById } from '@/api/system/user';

import CommonForm, { CommonFormItem } from '@/components/CommonForm';
import { uploadImgWrap } from '@/utils/utils';
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import { Info } from '..';
import './index.less';

export interface UserFormData {
  userName: string;
  password: string;
  avatar: string;
  roleIds: string[];
  email: string;
  id: number | undefined;
  info: Info;
  parentId: number | undefined;
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
    roleName: '',
    profile: '',
    updatedAt: '',
  },
  email: '',
  profile: '',
  id: undefined,
  parentId: undefined,
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

    const beforeUpload = function (file: File) {
      uploadImgWrap(file, 'avatar', formData.value).then((img) => {
        formData.value.info.avatar = img;
        formData.value.avatar = img;
      });
      return false;
    };
    const formJson = computed<CommonFormItem[]>(function (): CommonFormItem[] {
      const disabled = type.value === 'query';

      const list: CommonFormItem[] = [
        {
          type: 'input',
          label: '用户名',
          fieldName: 'userName',
          extraConfig: {
            className: 'row',
            disabled,
          },
          rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          dataType: String,
        },
        {
          type: 'tree-select',
          label: '角色',
          fieldName: 'roleIds',
          extraConfig: {
            className: 'row',
            treeData: roleOption,
            multiple: true,
            replaceFields: {
              children: 'children',
              label: 'name',
              key: 'id',
              value: 'id',
            },
            disabled,
          },
          rules: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
          dataType: Number,
        },
        {
          type: 'upload',
          rules: [
            { required: true, message: '用户头像不能为空', trigger: 'blur' },
          ],
          label: '背景图片',
          fieldName: 'avatar',
          beforeUpload,
          extraConfig: {
            showUploadList: false,
            disabled,
          },
          dataType: String,
        },
        {
          type: 'input',
          label: '简介',
          fieldName: 'profile',
          extraConfig: {
            className: 'row',
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
        const roleIds = formData.value.roleIds.join(',');
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
      val.parentId = val?.parentId === 0 ? undefined : val?.parentId;
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
            avatar: val.info.avatar,
            userName: val.info.nickName,
            profile: val.info.profile,
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
