import { editPassword, email } from '@/api/system/user';
import CommonForm, { CommonFormItem } from '@/components/CommonForm';
import './index.less';

import {
  defineComponent,
  getCurrentInstance,
  ref,
  reactive,
  computed,
} from 'vue';
import { getCode } from '@/api/system/common';
import md5 from 'md5';
import { useStore } from '@/store/system/user';
interface FormData {
  password: string;
  code: string;
  emailCode: string;
}

export default defineComponent({
  emits: ['cancel'],
  setup(_props, { emit }) {
    const instance = getCurrentInstance();
    const commonFormRef = ref<InstanceType<typeof CommonForm>>();
    const visible = ref<boolean>(false);
    const confirmLoading = ref<boolean>(false);
    const emailTime = ref<number>(0);
    const emailCodeLoading = ref<boolean>(false);
    const handleEmailCode = function () {
      emailCodeLoading.value = true;
      email().then(() => {
        emailCodeLoading.value = false;
        instance?.proxy?.$message.success('验证码邮件发送成功');
        emailTime.value = 60;
        const emailTimer = setInterval(() => {
          emailTime.value--;
          if (emailTime.value === 0) {
            clearInterval(emailTimer);
          }
        }, 1000);
      });
    };

    const code = ref<string>(getCode());
    const handleCode = function () {
      code.value = getCode();
    };
    const formData = reactive<FormData>({
      password: '',
      code: '',
      emailCode: '',
    });
    const formJson = computed<CommonFormItem[]>(function (): CommonFormItem[] {
      return [
        {
          type: 'password',
          label: '新密码',
          fieldName: 'password',
          className: 'row',
          rules: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
          ],
        },
        {
          type: 'custom-form',
          fieldName: 'emailCode',
          className: 'row',
          label: '邮箱验证码',
          rules: [
            { required: true, message: '邮箱验证码不能为空', trigger: 'blur' },
          ],
          render(form: unknown, extraConfig) {
            return (
              <div class="row-flex">
                <a-input
                  {...(extraConfig as Common.Params)}
                  v-model:value={(form as FormData).emailCode}
                />
                <a-button
                  disabled={emailTime.value > 0}
                  loading={emailCodeLoading.value}
                  onClick={handleEmailCode}
                  class="code-email"
                >
                  {emailTime.value === 0 ? '邮箱验证码' : `${emailTime.value}s`}
                </a-button>
              </div>
            );
          },
        },
        {
          type: 'custom-form',
          fieldName: 'code',
          className: 'row',
          label: '验证码',
          rules: [
            { required: true, message: '验证码不能为空', trigger: 'blur' },
          ],
          render(form: unknown, extraConfig) {
            return (
              <div class="row-flex">
                <a-input
                  {...(extraConfig as Common.Params)}
                  v-model:value={(form as FormData).code}
                />
                <div onClick={handleCode} class="code">
                  <img src={code.value} alt="" srcset="" />
                </div>
              </div>
            );
          },
        },
      ];
    });
    const show = function () {
      visible.value = true;
    };
    const reset = function () {
      visible.value = false;
      commonFormRef.value?.formRef?.resetFields();
    };
    const handleCancel = function () {
      emit('cancel');
      reset();
    };
    const handleOk = function () {
      commonFormRef.value?.formRef?.validate().then((bool) => {
        if (bool) {
          confirmLoading.value = true;
          editPassword({
            ...formData,
            password: md5(formData.password),
          })
            .then(() => {
              instance?.proxy?.$message.success(
                '密码修改成功, 请重新登录, 正在跳转到登录页'
              );

              setTimeout(() => {
                const userStore = useStore();
                userStore.logout();
                instance?.proxy?.$router.push({ name: 'login' });
                reset();
              }, 1500);
            })
            .catch(() => {
              confirmLoading.value = false;
            });
        }
      });
    };
    return {
      visible,
      confirmLoading,
      show,
      handleCancel,
      handleOk,
      instance,
      commonFormRef,
      formData,
      formJson,
    };
  },
  render() {
    const {
      visible,
      confirmLoading,
      handleCancel,
      handleOk,
      formData,
      formJson,
    } = this;
    return (
      <a-modal
        title="修改密码"
        visible={visible}
        maskClosable={false}
        confirmLoading={confirmLoading}
        width={460}
        onCancel={handleCancel}
        onOk={handleOk}
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
