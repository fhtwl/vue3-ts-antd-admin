<script lang="ts">
import { FormInstance } from 'ant-design-vue';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { useStore } from '@/store/system/user';
import md5 from 'md5';
import './index.less';
import demo from './demo';

const userStore = useStore();

interface FormState {
  userName: string;
  password: string;
  code: string;
}

export default defineComponent({
  name: 'Login',
  components: {},
  setup() {
    const instance = getCurrentInstance();
    const form = reactive<FormState>({
      userName: '',
      password: '',
      code: '',
    });
    const formRef = ref<FormInstance>();

    const isLoginError = ref(false);
    function setLoginError(bool: boolean) {
      isLoginError.value = bool;
    }

    const loading = ref(false);
    function setLoading(bool: boolean) {
      loading.value = bool;
    }
    const getCode = () => `/api/system/common/code?v=${Math.random()}`;
    const code = ref(getCode());
    function handleUpdateCode() {
      code.value = getCode();
    }

    const rules = ref({
      userName: [
        { required: true, message: '请输入用户名！', trigger: 'blur' },
      ],
      password: [{ required: true, message: '请输入密码！', trigger: 'blur' }],
      code: [{ required: true, message: '请输入验证码！', trigger: 'blur' }],
    });

    onMounted(() => {
      instance?.proxy?.$notification.success(demo());
    });

    const handleSubmit = function () {
      setLoading(true);

      const validateFieldsKey = ['userName', 'password', 'code'];
      formRef.value
        ?.validateFields(validateFieldsKey)
        .then((values) => {
          const loginParams = { ...values };
          loginParams.password = md5(values.password);
          userStore
            .login(loginParams as FormState)
            .then(() => loginSuccess())
            .catch((res) => requestFailed(res))
            .finally(() => {
              setLoading(false);
            });
        })
        .catch(() => {
          setTimeout(() => {
            setLoading(false);
          }, 600);
        });
    };

    const loginSuccess = function () {
      instance?.proxy?.$router.push({ path: '/' });
      setLoginError(false);
    };
    const requestFailed = function (res: unknown) {
      console.log('requestFailed', res);
      setLoginError(true);
      handleUpdateCode();
    };

    return {
      isLoginError,
      setLoginError,
      form,
      formRef,
      loading,
      setLoading,
      code,
      handleUpdateCode,
      rules,
      handleSubmit,
      loginSuccess,
      requestFailed,
    };
  },
});
</script>

<template>
  <div class="main">
    <a-form
      id="formLogin"
      ref="formRef"
      class="user-layout-login"
      :model="form"
      :rules="rules"
      @finish="handleSubmit"
    >
      <a-alert
        v-if="isLoginError"
        type="error"
        show-icon
        style="margin-bottom: 24px"
        message="账户或密码或验证码错误"
      />

      <a-form-item name="userName">
        <a-input
          v-model:value="form.userName"
          size="large"
          placeholder="用户名"
        >
          <template #prefix>
            <user-outlined class="icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="password">
        <a-input-password
          v-model:value="form.password"
          size="large"
          placeholder="密码"
        >
          <template #prefix>
            <lock-outlined class="icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <div name="code" style="display: flex; width: 100%">
          <a-input
            v-model:value="form.code"
            size="large"
            type="text"
            placeholder="验证码"
          />
          <img
            :src="code"
            alt=""
            srcset=""
            class="getCaptcha"
            @click="handleUpdateCode"
          />
        </div>
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          class="login-button"
          html-type="submit"
          :loading="loading"
          :disabled="loading"
        >
          登录
        </a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <router-link class="register" :to="{ name: 'register' }">
          注册
        </router-link>
      </div> -->
    </a-form>
  </div>
</template>
