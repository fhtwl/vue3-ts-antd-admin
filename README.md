# 一、前言

<a href="https://github.com/fhtwl/vue3-ts-antd-admin" >vue3-ts-antd-admin</a>是基于 vue3、ts、tsx、vite 开发的一套中后台管理系统模板, 简洁轻量, 适合中小型中后台项目的开发.

演示地址：<a href ="https://admin.fhtwl.cc/" >传送门</a>

编辑器预览：

![预览.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8757f92912b7414daf146e1d10992bb2~tplv-k3u1fbpfcp-watermark.image?)
![1661504529243.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e68c0b4a91e48a3a4c66f01b9de61ea~tplv-k3u1fbpfcp-watermark.image?)

# 二、技术栈

- 前端

  **vue3**: 核心框架 <br/>
  **pinia**: 状态管理 <br/>
  **less**: css 预编译器 <br/>
  **ant design**: 组件库 <br/>
  **ts/tsx**: 开发和模板语言 <br/>
  **vite2**: 前端构建工具 <br/>

- 服务端

  **koa2**: 核心框架 <br/>
  **mysql**: 数据库 <br/>
  **redis**: 缓存 <br/>
  **ts**:开发语言 <br/>

该工程只包含前端部分, 服务端请访问 <a href="https://github.com/fhtwl/koa-ts-learn" >koa-ts-learn</a>

# 三、功能

本项目旨在构建一套通用的的中后台管理系统的前端部分, 便于工作和个人项目的开发, 故只实现了我认为必须的部分.

从业务上看, 系统包含:

- 登录注册

- 完整的权限管理模块, 包括 用户管理、角色管理、菜单管理等

- 系统风格样式设置, 如主题色切换、布局切换、整体风格切换、色弱模式等等

从开发的角度上, 系统也对常见功能做了封装:

- ts、tsx 支持

- antdv 按需引入

- 基于 eslint、prettier、husky 的完整的校验和格式化支持

- 环境变量支持

- vue-router 路由支持

- pinia 状态管理

- 自定义 icon 引入

- less 支持

- 表单封装

- 图片预览封装

- 常见 筛选表单 + 按钮组 + 表格页面封装

- axios 请求封装和全局拦截

- gzip

# 四、目录结构

```
├── .husky husky # 脚本
├── .vscode vscode # 配置
├── public
│ └── favicon.ico # 网站图标
├── src
│ ├── api # Api ajax 等
│ ├── assets # 本地静态资源
│ ├── config # 项目全局设置
│ ├── components # 通用组件
│ ├── core # 自定义指令等
│ ├── lib # 依赖包引入
│ ├── router # Vue-Router
│ ├── store # Pinia
│ ├── typings # .d.ts 描述文件
│ ├── utils # 工具库
│ ├── views # 业务页面入口和常用模板
│ └── App.vue # Vue 模板入口
│ └── env.d.ts # 环境变量定义文件
│ └── main.ts # Vue 入口 ts
│ └── permission.ts # 路由守卫(路由权限控制)
└── .env # 环境变量
└── .env.development # 开发环境变量
└── .env.production # 生产环境变量
└── .eslintrc.json # eslint 配置
└── .prettierrc.json # prettier 配置
└── deploy.sh # 部署脚本
└── index.html # Vue 入口模板
└── README.md
└── package.json
└── tsconfig.json
└── tsconfig.node.json
└── vite.config.ts
```

# 五、已知 bug

- <a href="https://github.com/vuejs/core/issues/6222">issues</a>: 热更新报错 TypeError: parentComponent.ctx.deactivate is not a function
