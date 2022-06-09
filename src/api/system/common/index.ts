export const ApiCodePath = '/api/system/common';
/**
 * 获取验证码
 * @returns
 */
export const getCode = () => `${ApiCodePath}?v=${Math.random()}`;
