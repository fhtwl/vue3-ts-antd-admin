/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 *
 */

export default {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#18a058', // '#F5222D', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  colorWeak: false,
  title: 'vue3-ts-antd-admin',
  pwa: false,
  iconfontUrl: '',
  production: process.env.NODE_ENV === 'production',
  multiTab: true,
  hideSetting: false,
};
