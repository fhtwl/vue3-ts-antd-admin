//http.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { notification } from 'ant-design-vue';

import { useStore } from '@/store/system/user';
import { ACCESS_TOKEN } from '@/store/system/user/const';

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
        message: data.msg,
        // description: 'Authorization verification failed'
      });
      if (token) {
        userStore.logout().then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }
    }
  }
  return Promise.reject(error);
};
// 响应拦截
axios.interceptors.response.use((response) => {
  if (response.data.errorCode !== 10000) {
    notification.error({
      message: '请求失败',
      description: response.data.msg,
    });
    // errorHandler(response)
    return Promise.reject(response);
    // return Promise.reject(response)
  }
  return response.data.data;
}, errorHandler);

// interface Http {
//   get<T>(url: string, params?: unknown): Promise<T>;
//   post<T>(url: string, params?: unknown): Promise<T>;
//   upload<T>(url: string, params: unknown): Promise<T>;
//   download(url: string): void;
// }

// const http: Http = {
//   get(url, params) {
//     return new Promise((resolve, reject) => {
//       NProgress.start();
//       axios
//         .get(url, { params })
//         .then((res) => {
//           NProgress.done();
//           resolve(res.data);
//         })
//         .catch((err: AxiosError) => {
//           NProgress.done();
//           reject(err.response);
//         });
//     });
//   },
//   post(url, params) {
//     return new Promise((resolve, reject) => {
//       NProgress.start();
//       axios
//         .post(url, JSON.stringify(params))
//         .then((res) => {
//           NProgress.done();
//           resolve(res.data);
//         })
//         .catch((err: AxiosError) => {
//           NProgress.done();
//           reject(err.response);
//         });
//     });
//   },
//   upload(url, file) {
//     return new Promise((resolve, reject) => {
//       NProgress.start();
//       axios
//         .post(url, file, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         })
//         .then((res) => {
//           NProgress.done();
//           resolve(res.data);
//         })
//         .catch((err: AxiosError) => {
//           NProgress.done();
//           reject(err.response);
//         });
//     });
//   },
//   download(url) {
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     iframe.src = url;
//     iframe.onload = function () {
//       document.body.removeChild(iframe);
//     };
//     document.body.appendChild(iframe);
//   },
// };
export default axios;
