/**
 * 获取本地图片
 * @param path
 * @returns
 */
export function getAssrtsImages(path: string): string {
  return new URL(`/src/assets${path}`, import.meta.url).href;
}
