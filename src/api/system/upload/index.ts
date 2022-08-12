import http from '@/utils/http';

const api = {
  img: 'system/common/upload/img',
};

/**
 * 上传图片
 * @param {*} params
 * @returns
 */
export function uploadImg(params: FormData): Promise<Common.FileJson> {
  return http.post(api.img, params);
}
