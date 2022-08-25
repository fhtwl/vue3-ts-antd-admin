import { getItem, setItem } from '@/utils/storage';
import { SystemTheme } from './index';
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
export function getSystemThemeData(): SystemTheme {
  return getItem(THEME_STOREAGE_KEY) as unknown as SystemTheme;
}
