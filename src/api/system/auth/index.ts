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
 * @param parameter
 * @returns
 */
export function login(parameter: Login) {
  return http.post(api.login, parameter);
}

export function getEmailCaptcha(parameter: {
  userName: string;
  email: string;
}) {
  return http.post(api.sendEmail, parameter);
}

export function logout() {
  return http.get(api.logout);
}

export function register(parameter: {
  userName: string;
  email: string;
  password: string;
  code: string;
}) {
  return http.post(api.register, parameter);
}
