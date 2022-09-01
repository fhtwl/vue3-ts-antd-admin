<script lang="ts">
import { getEmailCaptcha, register } from '@/api/system/auth';
import { scorePassword } from '@/utils/utils';
import { FormInstance, message } from 'ant-design-vue';
import md5 from 'md5';

import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
} from 'vue';

import './index.less';

interface FormState {
  userName: string;
  password: string;
  password2: string;
  email: string;
  captcha: string;
}

type Level = 0 | 1 | 2 | 3;

interface State {
  time: number;
  level: Level;
  emailSendBtn: boolean;
  passwordLevel: Level;
  passwordLevelChecked: boolean;
  percent: number;
  progressColor: string;
}

const levelNames = {
  0: '强度：太短',
  1: '强度：低',
  2: '强度：中',
  3: '强度：强',
};
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success',
};
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a',
};

type CheckCallback = <T = unknown>(names?: Error) => Promise<T>;

export default defineComponent({
  name: 'Register',
  setup() {
    const instance = getCurrentInstance();
    const state = ref<State>({
      time: 60,
      level: 0,
      emailSendBtn: false,
      passwordLevel: 0,
      passwordLevelChecked: false,
      percent: 10,
      progressColor: '#FF0000',
    });
    const registerBtn = ref(false);

    const form = reactive<FormState>({
      userName: '',
      password: '',

      password2: '',
      captcha: '',
      email: '',
    });
    const formRef = ref<FormInstance>();

    const passwordLevelClass = computed(
      () => levelClass[state.value.passwordLevel]
    );

    const passwordLevelName = computed(
      () => levelNames[state.value.passwordLevel]
    );

    const passwordLevelColor = computed(
      () => levelColor[state.value.passwordLevel]
    );

    const handlePasswordLevel = (
      _rule: unknown,
      value: string,
      callback: CheckCallback
    ) => {
      if (value === '') {
        return callback();
      }
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          state.value.level = 1;
        }
        if (scorePassword(value) >= 60) {
          state.value.level = 2;
        }
        if (scorePassword(value) >= 80) {
          state.value.level = 3;
        }
      } else {
        state.value.level = 0;
        callback(new Error('密码强度不够'));
      }
      state.value.passwordLevel = state.value.level;
      state.value.percent = state.value.level * 33;

      callback();
    };

    const handlePasswordCheck = (
      rule: unknown,
      value: string,
      callback: CheckCallback
    ) => {
      const password = form.password;
      if (value === undefined) {
        callback(new Error('请输入密码！'));
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次输入的密码不匹配！'));
      }
      callback();
    };

    const handlePasswordInputClick = () => {
      state.value.passwordLevelChecked = true;
    };

    const handleSubmit = () => {
      formRef.value?.validateFields().then((values) => {
        registerBtn.value = true;
        state.value.passwordLevelChecked = false;

        register({
          userName: values.userName,
          email: values.email,
          password: md5(values.password),
          code: values.captcha,
        })
          .then(() => {
            registerBtn.value = false;
            instance?.proxy?.$router.push({
              name: 'registerResult',
              params: { ...values },
            });
          })
          .catch(() => {
            registerBtn.value = false;
          });
      });
    };

    const getCaptcha = (e: Event) => {
      e.preventDefault();
      formRef.value
        ?.validateFields(['userName', 'email', 'password'])
        .then((values) => {
          state.value.emailSendBtn = true;

          const interval = window.setInterval(() => {
            if (state.value.time-- <= 0) {
              state.value.time = 60;
              state.value.emailSendBtn = false;
              window.clearInterval(interval);
            }
          }, 1000);

          instance?.proxy?.$message.loading('验证码发送中..', 0);

          getEmailCaptcha({ userName: values.userName, email: values.email })
            .then(() => {
              instance?.proxy?.$notification['success']({
                message: '提示',
                description: '验证码已发送，请查看您的邮箱',
                duration: 2,
              });
              instance?.proxy?.$message.destroy();
              // clearInterval(interval);
              state.value.time = 60;
              state.value.emailSendBtn = true;
              registerBtn.value = false;
            })
            .catch((res) => {
              instance?.proxy?.$message.destroy();
              // clearInterval(interval);
              instance?.proxy?.$message.error(res.response.data.msg);
              state.value.time = 60;
              state.value.emailSendBtn = true;
              registerBtn.value = false;
            });
        });
    };

    const rules = ref({
      email: [
        {
          required: true,
          message: '请输入邮箱！',
          trigger: ['change', 'blur'],
        },
      ],
      userName: [
        {
          required: true,
          message: '请输入用户名！',
          trigger: ['change', 'blur'],
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码！',
          trigger: ['change', 'blur'],
        },
        {
          validator: handlePasswordLevel,
          trigger: ['change', 'blur'],
        },
      ],
      password2: [
        {
          required: true,
          message: '请输入密码！',
          trigger: ['change', 'blur'],
        },
        { validator: handlePasswordCheck, trigger: ['change', 'blur'] },
      ],
      captcha: [{ required: true, message: '请输入验证码！', trigger: 'blur' }],
    });

    return {
      state,
      registerBtn,
      form,
      formRef,
      passwordLevelClass,
      passwordLevelName,
      passwordLevelColor,
      handlePasswordLevel,
      handlePasswordCheck,
      handlePasswordInputClick,
      handleSubmit,
      getCaptcha,
      instance,
      rules,
    };
  },
});
</script>

<template>
  <div class="main user-layout-register">
    <h3><span>注册</span></h3>
    <a-form ref="formRef" :model="form" :rules="rules">
      <a-form-item name="email">
        <a-input
          v-model:value="form.email"
          size="large"
          type="text"
          placeholder="邮箱"
        ></a-input>
      </a-form-item>

      <a-form-item name="userName">
        <a-input
          v-model:value="form.userName"
          size="large"
          type="text"
          placeholder="用户名"
        ></a-input>
      </a-form-item>

      <a-popover
        v-model:visible="state.passwordLevelChecked"
        placement="rightTop"
        :trigger="['focus']"
        :get-popup-container="(trigger: Element) => trigger.parentElement"
      >
        <template #content>
          <div :style="{ width: '240px' }">
            <div :class="['user-register', passwordLevelClass]">
              {{ passwordLevelName }}
            </div>
            <a-progress
              :percent="state.percent"
              :show-info="false"
              :stroke-color="passwordLevelColor"
            />
            <div style="margin-top: 10px">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item name="password">
          <a-input-password
            v-model:value="form.password"
            size="large"
            placeholder="请至少输入 6 个字符。请不要使用容易被猜到的密码。"
            @click="handlePasswordInputClick"
          ></a-input-password>
        </a-form-item>
      </a-popover>

      <a-form-item name="password2">
        <a-input-password
          v-model:value="form.password2"
          size="large"
          placeholder="确认密码"
        ></a-input-password>
      </a-form-item>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item name="captcha">
            <a-input
              v-model:value="form.captcha"
              size="large"
              type="text"
              placeholder="验证码"
            >
              <template #prefix>
                <mail-outlined
                  class="icon"
                  :style="{ color: 'rgba(0,0,0,.25)' }"
                />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="getCaptcha"
            size="large"
            :disabled="state.emailSendBtn"
            @click="getCaptcha"
            v-text="(!state.emailSendBtn && '获取验证码') || state.time + ' s'"
          ></a-button>
        </a-col>
      </a-row>

      <a-form-item>
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="register-button"
          :loading="registerBtn"
          :disabled="registerBtn"
          @click="handleSubmit"
          >注册
        </a-button>
        <router-link class="login" :to="{ name: 'login' }"
          >使用已有账户登录</router-link
        >
      </a-form-item>
    </a-form>
  </div>
</template>
