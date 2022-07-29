import http from '@/utils/http';

const api = {
  img: 'system/upload/img',
};

/**
 * 上传图片
 * @param {*} params
 * @returns
 */
export function uploadImg(params: FormData) {
  http.post(api.img, params);
}
