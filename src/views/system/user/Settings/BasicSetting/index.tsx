import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
} from 'vue';
import { useStore } from '@/store/system/user';
import { editUserInfo } from '@/api/system/user';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import './index.less';

import CommonForm, { CommonFormItem } from '@/components/CommonForm';
import AvatarModal from './AvatarModal';
export default defineComponent({
  setup() {
    const instance = getCurrentInstance();
    const commonFormRef = ref<InstanceType<typeof CommonForm>>();
    const modalRef = ref<InstanceType<typeof AvatarModal>>();
    const userStore = useStore();
    const { avatar = '', nickName = '', profile = '' } = userStore.info || {};
    const img = ref<string>(avatar);

    const info = reactive({
      nickName,
      avatar,
      profile,
    });
    const saveLoading = ref<boolean>(false);

    const setAvatar = function (url: string) {
      img.value = url;
      info.avatar = url;
    };
    const handleUpload = function () {
      modalRef?.value?.edit();
    };
    const formJson = computed(function () {
      const list: CommonFormItem[] = [
        {
          type: 'input',
          label: '昵称',
          fieldName: 'nickName',
          rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          className: 'text-row',
        },
        {
          type: 'custom',
          render() {
            return (
              <div class="ant-upload-preview" onClick={handleUpload}>
                <CloudUploadOutlined class="upload-icon" />
                <div class="mask">
                  <PlusOutlined class="plus" />
                </div>
                <img src={img.value} />
              </div>
            );
          },
        },
        {
          type: 'textarea',
          label: '个人简介',
          fieldName: 'profile',
          className: 'text-row',
          extraConfig: {
            autoSize: { minRows: 4 },
          },
        },
      ];

      return [...list];
    });
    const handleSave = function () {
      commonFormRef.value?.formRef?.validate().then(() => {
        saveLoading.value = true;
        editUserInfo(info).then(() => {
          instance?.proxy?.$message.success('更新成功');
          saveLoading.value = false;
        });
      });
    };

    return {
      instance,
      modalRef,
      formJson,
      info,
      saveLoading,
      setAvatar,
      handleSave,
    };
  },
  render() {
    const { info, formJson, setAvatar } = this;
    return (
      <div class="account-settings-info-view">
        <CommonForm ref="commonFormRef" formData={info} formJson={formJson} />
        <AvatarModal ref="modalRef" onOk={setAvatar} />
      </div>
    );
  },
});
