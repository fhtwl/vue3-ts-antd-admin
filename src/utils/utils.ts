import { uploadImg } from '@/api/system/upload';
import { FieldName } from '@/components/CommonForm';
import { message } from 'ant-design-vue';
import { getLoading } from '../components/CommonForm/index';

type ForeachTreeCallBack = (node: Common.TreeNode) => void;
/**
 * 循环遍历树的每一个元素
 * @param tree
 * @param callBack
 */
export function foreachTree(
  tree: Common.TreeNode[],
  callBack: ForeachTreeCallBack = () => {}
) {
  tree.forEach((element) => {
    callBack(element);
    if (element.children) {
      foreachTree(element.children, callBack);
    }
  });
}

/**
 * 上传图片
 * @param { File } file 文件对象
 * @param { string } fieldName 字段名
 * @param { object} form
 * @returns { Promise<string> }
 */
export function uploadImgWrap(
  file: File,
  fieldName: FieldName,
  form: Common.Params
): Promise<string> {
  return new Promise((resolve, reject) => {
    const loadingFieldName = getLoading(fieldName);
    form[loadingFieldName] = true;
    const formData = new FormData();
    formData.append('img', file);
    uploadImg(formData)
      .then((data) => {
        form[loadingFieldName] = false;
        resolve(data.path);
      })
      .catch((err) => {
        message.error(err);
        reject(err);
      });
  });
}

/**
 * 深拷贝
 * @param target
 * @returns
 */
export function deepCopy<T>(target: T): T {
  if (typeof target === 'object') {
    const result = (Array.isArray(target) ? [] : {}) as T;
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (typeof target[key] === 'object' && target[key] !== null) {
          result[key] = deepCopy(target[key]);
        } else {
          result[key] = target[key];
        }
      }
    }

    return result as T;
  }

  return target;
}
