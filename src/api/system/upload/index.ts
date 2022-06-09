import http from '@/utils/http';

const api = {
  img: 'system/upload/img',
};

/**
 * 上传图片
 * @param {*} parameter
 * @returns
 */
export function uploadImg(parameter: FormData) {
  http.post(api.img, parameter);
}
