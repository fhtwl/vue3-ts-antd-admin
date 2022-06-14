<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store/system/user';
import md5 from 'md5';
import './index.less';
import { useStore as useThemeStore } from '@/store/system/theme';
const themeStore = useThemeStore();

// import {} from 'ant-design/icon-vue';

const userStore = useStore();

interface FormState {
  userName: string;
  password: string;
  code: string;
}

export default defineComponent({
  name: 'Login',
  components: {
    // Button,
    // Form,
    // Alert,
    // Input,
    // Checkbox,
  },
  setup() {
    const form = reactive<FormState>({
      userName: '',
      password: '',
      code: '',
    });
    const formRef = ref<FormInstance>();
    return {
      pageName: 'Login',
      loginBtn: false,
      // login type: 101 email, 102 userName, 2 telephone
      loginType: 101,
      isLoginError: false,
      // form: this.$form.createForm(this),
      form,
      formRef,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 101 email, 102 userName, 2 telephone
        loginType: 101,
        smsSendBtn: false,
      },
      code: '/api/system/common/code',
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
    //   handleLogin() {
    //     userStore.$patch({
    //       name: '张三',
    //     });
    //     userStore.Login();
    //   },
    //   handleUsernameOrEmail(rule, value, callback) {
    //     const { state } = this;
    //     const regex =
    //       /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    //     if (regex.test(value)) {
    //       state.loginType = 101;
    //     } else {
    //       state.loginType = 102;
    //     }
    //     callback();
    //   },
    handleSubmit(e: unknown) {
      themeStore.setTheme('red');
      // e.preventDefault();
      const { state, formRef } = this;

      state.loginBtn = true;

      const validateFieldsKey = ['userName', 'password', 'code'];
      console.log(formRef);
      // this.formRef.validateFields(
      //   validateFieldsKey,
      //   { force: true },
      //   (err, values) => {
      //     if (!err) {
      //       console.log('login form', values);
      //       const loginParams = { ...values };
      //       delete loginParams.userName;
      //       loginParams[!state.loginType ? 'email' : 'userName'] =
      //         values.userName;
      //       loginParams.password = md5(values.password);
      //       loginParams.type = state.loginType;
      //       Login(loginParams)
      //         .then((res) => this.loginSuccess(res))
      //         .catch((err) => this.requestFailed(err))
      //         .finally(() => {
      //           state.loginBtn = false;
      //         });
      //     } else {
      //       setTimeout(() => {
      //         state.loginBtn = false;
      //       }, 600);
      //     }
      //   }
      // );
    },
    //   stepCaptchaSuccess() {
    //     this.loginSuccess();
    //   },
    //   stepCaptchaCancel() {
    //     this.Logout().then(() => {
    //       this.loginBtn = false;
    //       this.stepCaptchaVisible = false;
    //     });
    //   },
    //   loginSuccess(res) {
    //     this.$router.push({ path: '/' });
    //     // 延迟 1 秒显示欢迎信息
    //     // setTimeout(() => {
    //     //   this.$notification.success({
    //     //     message: '欢迎',
    //     //     description: `${timeFix()}，欢迎回来`,
    //     //   });
    //     // }, 1000);
    //     this.isLoginError = false;
    //   },
    //   requestFailed() {
    //     this.isLoginError = true;
    //     this.handleUpdateCode();
    //     // this.$notification['error']({
    //     //   message: '错误',
    //     //   description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
    //     //   duration: 4
    //     // })
    //   },
    //   handleUpdateCode() {
    //     this.code = `/api/system/common/code?v=${Math.random()}`;
    //   },
  },
});
</script>

<template>
  <div class="main">
    <a-form
      id="formLogin"
      ref="formLogin"
      class="user-layout-login"
      :form="form"
    >
      <a-button type="primary" @click="handleSubmit">Submit</a-button>
    </a-form>

    <div class="primary-color">path.resolve(__dirname, './src')</div>
  </div>
</template>
