import { uploadImg } from '@/api/system/upload';
import { message } from 'ant-design-vue';
/**
 * 获取本地图片
 * @param path
 * @returns
 */
export function getAssrtsImages(path: string): string {
  return new URL(`/src/assets${path}`, import.meta.url).href;
}

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
  fieldName: string,
  form: Common.Params
): Promise<string> {
  return new Promise((resolve, reject) => {
    form[fieldName + 'loading'] = true;
    const formData = new FormData();
    formData.append('img', file);
    uploadImg(formData)
      .then((data) => {
        form[fieldName + 'loading'] = false;
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

// // 判断是否为数组
// const isArr = (origin: unknown): boolean => {
//   const str = '[object Array]';
//   return Object.prototype.toString.call(origin) == str ? true : false;
// };

// export function deepCopy<T>(origin: T, target?: Record<string, unknown> | T): T {
//   const tar = target || {};

//   for (const key in origin) {
//     if (Object.prototype.hasOwnProperty.call(origin, key)) {
//       if (typeof origin[key] === 'object' && origin[key] !== null) {
//         tar[key] = isArr(origin[key]) ? [] : {};
//         deepCopy(origin[key], tar[key]);
//       } else {
//         tar[key] = origin[key];
//       }
//     }
//   }

//   return tar as T;
// }
