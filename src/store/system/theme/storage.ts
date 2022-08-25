import { getItem, setItem } from '@/utils/Storage';
import { THEME_STOREAGE_KEY } from './const';

/**
 * 更新系统主题相关配置
 * @param data
 */
export function updateSystemThemeData(data: Common.Params) {
  setItem(THEME_STOREAGE_KEY, data);
}

/**
 * 获取系统主题相关配置
 * @returns
 */
export function getSystemThemeData() {
  return getItem(THEME_STOREAGE_KEY);
}
