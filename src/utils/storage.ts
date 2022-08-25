// localStorage封装
/**
 * 获取数据
 * @param key
 * @param isNotObj 值是否是对象
 * @returns
 */
export function getItem(
  key: string,
  isNotObj?: boolean
): string | Common.Params {
  const value = localStorage.getItem(key);
  return value && isNotObj ? value : JSON.parse(value!);
}

/**
 * 设置数据
 * @param key
 * @param value
 */
export function setItem(
  key: string,
  value: string | Common.Params | unknown[]
) {
  localStorage.setItem(
    key,
    value instanceof Object ? JSON.stringify(value) : value
  );
}
