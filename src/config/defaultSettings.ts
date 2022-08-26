/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * iconfontUrl - 自定义iconfont路径
 * multiTab - 多页签模式
 * hideSetting - 隐藏设置
 */

export default {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#18a058', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  colorWeak: false,
  title: 'vue3-ts-antd-admin',
  description: '基于vue3+ts+vite+pinia的antdv后台管理系统',
  iconfontUrl: '//at.alicdn.com/t/font_3233276_vdxns10ldqf.js',
  multiTab: true,
  hideSetting: false,
};
