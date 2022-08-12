<script lang="ts">
import { FormInstance } from 'ant-design-vue';
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store/system/user';
import md5 from 'md5';
import './index.less';
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

    const code = ref(`/api/system/common/code?v=${Math.random()}`);
    function handleUpdateCode() {
      code.value = `/api/system/common/code?v=${Math.random()}`;
    }
    return {
      isLoginError,
      setLoginError,
      form,
      formRef,
      loading,
      setLoading,
      code,
      handleUpdateCode,
    };
  },
  data() {
    return {
      rules: {
        userName: [
          { required: true, message: '请输入用户名！', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
        ],
        code: [{ required: true, message: '请输入验证码！', trigger: 'blur' }],
      },
    };
  },
  computed: {
    nameLength() {
      return userStore.nameLength;
    },
    name() {
      return userStore.name;
    },
  },
  methods: {
    handleSubmit() {
      const { formRef } = this;
      this.setLoading(true);

      const validateFieldsKey = ['userName', 'password', 'code'];
      formRef
        ?.validateFields(validateFieldsKey)
        .then((values) => {
          const loginParams = { ...values };
          loginParams.password = md5(values.password);
          userStore
            .login(loginParams as FormState)
            .then(() => this.loginSuccess())
            .catch((res) => this.requestFailed(res))
            .finally(() => {
              this.setLoading(false);
            });
        })
        .catch(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 600);
        });
    },

    loginSuccess() {
      this.$router.push({ path: '/' });
      this.setLoginError(false);
    },
    requestFailed(res: unknown) {
      console.log('requestFailed', res);
      this.setLoginError(true);
      this.handleUpdateCode();
    },
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
          placeholder="密码: user"
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

      <div class="user-login-other">
        <router-link class="register" :to="{ name: 'register' }">
          注册
        </router-link>
      </div>
    </a-form>
  </div>
</template>
