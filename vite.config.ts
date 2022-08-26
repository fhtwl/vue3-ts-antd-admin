import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import { version } from './package.json';
import config from './src/config/defaultSettings';

function resolve(url: string): string {
  return path.resolve(__dirname, url);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 按需加载
    Components({
      resolvers: [
        AntDesignVueResolver({
          // 不加载css, 而是手动加载css. 通过手动加载less文件并将less变量绑定到css变量上, 即可实现动态主题色
          importStyle: false,
          // 加载所有icon
          resolveIcons: true,
        }),
      ],
    }),
    viteCompression(),
    createHtmlPlugin({
      inject: {
        data: {
          title: config.title,
          description: config.description,
          version,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~@': resolve('./src'),
    },
    // 省略文件后缀
    extensions: ['.js', '.ts', '.json', '.jsx', '.tsx'],
  },
  // 声明node变量
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        // 全局添加less
        additionalData: `@import '@/assets/styles/common/var.less';`,
        javascriptEnabled: true,
      },
    },
  },
  build: {
    outDir: './dist',
  },
  server: {
    port: 8001,
    proxy: {
      '/api': {
        target: 'http://localhost:9002',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
      '/resource': {
        target: 'https://static.fhtwl.cc',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resource/, ''),
      },
    },
  },
});
