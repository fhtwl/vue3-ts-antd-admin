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
