import http from '@/utils/http';
const Auth = '/system/auth';
const api = {
  login: `${Auth}/login`,
  logout: `${Auth}/logout`,
  forgePassword: `${Auth}/forge-password`,
  register: `${Auth}/register`,
  sendEmail: `${Auth}/sendCodeEmail`,
};

interface Login {
  userName: string;
  password: string;
  code: string;
}

/**
 * 登录
 * @param params
 * @returns
 */
export function login(params: Login): Promise<string> {
  return http.post(api.login, params);
}

export function getEmailCaptcha(params: { userName: string; email: string }) {
  return http.post(api.sendEmail, params);
}

export function logout() {
  return http.get(api.logout);
}

export function register(params: {
  userName: string;
  email: string;
  password: string;
  code: string;
}) {
  return http.post(api.register, params);
}
