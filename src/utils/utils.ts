import { uploadImg } from '@/api/system/upload';
import { FieldName } from '@/components/CommonForm';
import { message } from 'ant-design-vue';
import { getLoading } from '../components/CommonForm/index';

type ForeachTreeCallBack<T> = (node: T) => void;

interface TreeItem<T> {
  children: TreeItem<T>[];
  [propsName: string]: unknown;
}
/**
 * 循环遍历树的每一个元素
 * @param tree
 * @param callBack
 */
export function foreachTree<T>(
  tree: TreeItem<T>[],
  callBack: ForeachTreeCallBack<TreeItem<T>> = (arg: TreeItem<T>) => arg
) {
  tree.forEach((element: TreeItem<T>) => {
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

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export function listToTree(
  list: Common.List,
  tree: Common.TreeNode[],
  parentId: number
) {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        id: item.id!,
        key: item.id || item.name,
        children: [],
        serialNum: item.serialNum as number,
        parentId: item.parentId,
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id!);
      // 加入到树中
      tree.push(child);
    }
  });
}

export function scorePassword(pass: string) {
  let score = 0;
  if (!pass) {
    return score;
  }

  const letters: { [propsName: string]: number } = {};
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  const variations: { [propsName: string]: boolean } = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  };

  let variationCount = 0;
  for (const check in variations) {
    variationCount += variations[check] === true ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return parseInt(score.toString());
}
