# 基于 vue3 + Typescript + Vite + pinia + Antd 的后台管理系统

# 一、前言

时至今日, vue3 的生态已经趋于成熟, 无论是学习还是工作, 尝试 vue3 都是有必要的, 本项目是对 vue3 开发中后管理系统最佳实践的一次尝试和总结.

# 二、技术栈

### 前端

**vue3**: 核心框架 <br/>
**pinia**: 状态管理 <br/>
**less**: css 预编译器 <br/>
**ant design**: 组件库 <br/>
**ts/tsx**: 开发和模板语言 <br/>
**vite2**: 前端构建工具 <br/>

### 服务端

**koa2**: 核心框架 <br/>
**mysql**: 数据库 <br/>
**redis**: 缓存 <br/>
**ts**:开发语言 <br/>

本文主要介绍前端部分的设计和开发, 服务端的开发在我的掘金专栏 <a href="https://juejin.cn/column/7100898007582769160"  >超细致 nodejs + koa2 + ts + mysql + redis 后端框架搭建</a>里有详细介绍, 感兴趣的可以看看

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

├── .husky husky # 脚本 <br/>
├── .vscode vscode # 配置 <br/>
├── public <br/>
│ └── favicon.ico # 网站图标 <br/>
├── src <br/>
│ ├── api # Api ajax 等 <br/>
│ ├── assets # 本地静态资源 <br/>
│ ├── config # 项目全局设置 <br/>
│ ├── components # 通用组件 <br/>
│ ├── core # 自定义指令等 <br/>
│ ├── lib # 依赖包引入 <br/>
│ ├── router # Vue-Router <br/>
│ ├── store # Pinia <br/>
│ ├── typings # .d.ts 描述文件 <br/>
│ ├── utils # 工具库 <br/>
│ ├── views # 业务页面入口和常用模板 <br/>
│ └── App.vue # Vue 模板入口 <br/>
│ └── env.d.ts # 环境变量定义文件 <br/>
│ └── main.ts # Vue 入口 ts <br/>
│ └── permission.ts # 路由守卫(路由权限控制) <br/>
└── .env # 环境变量 <br/>
└── .env.development # 开发环境变量 <br/>
└── .env.production # 生产环境变量 <br/>
└── .eslintrc.json # eslint 配置 <br/>
└── .prettierrc.json # prettier 配置 <br/>
└── deploy.sh # 部署脚本 <br/>
└── index.html # Vue 入口模板 <br/>
└── README.md <br/>
└── package.json <br/>
└── tsconfig.json <br/>
└── tsconfig.node.json <br/>
└── vite.config.ts <br/>
