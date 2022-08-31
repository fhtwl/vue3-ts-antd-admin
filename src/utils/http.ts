import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { notification } from 'ant-design-vue';

import { useStore } from '@/store/system/user';
import { ACCESS_TOKEN } from '@/store/system/user/const';
import router from '@/router';
import { loginRoutePath } from '@/permission';

// 设置请求头和请求路径
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.interceptors.request.use(
  (config): AxiosRequestConfig<unknown> => {
    const userStore = useStore();
    const token = userStore.token;
    if (token) {
      config.headers![ACCESS_TOKEN] = token;
    }
    return config;
  },
  (error) => {
    return error;
  }
);

// 异常拦截处理器
const errorHandler = (error: AxiosError) => {
  if (error.response) {
    const userStore = useStore();
    const data = error.response.data as Common.ResponseData<unknown>;
    const token = userStore.token;
    if (error.response.status === 403) {
      notification.error({
        message: '权限不足',
        description: data.msg,
      });
    }
    if (error.response.status === 401 && !data.data) {
      notification.error({
        message: '登录失效',
        description: data.msg,
      });
      const reload = () => {
        setTimeout(() => {
          router.push(loginRoutePath);
        }, 1500);
      };
      if (token) {
        userStore.deleteToken();
      }
      reload();
    }
  }
  return Promise.reject(error);
};
// 响应拦截
axios.interceptors.response.use((response) => {
  if (response.data?.errorCode !== 10000) {
    notification.error({
      message: '请求失败',
      description: response.data.msg,
    });
    return Promise.reject(response);
  }
  return response.data.data;
}, errorHandler);

export default axios;
