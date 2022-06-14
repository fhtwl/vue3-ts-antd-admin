import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

function resolve(url: string): string {
  return path.resolve(__dirname, url);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Components({
    //   resolvers: [
    //     AntDesignVueResolver({
    //       importStyle: 'less',
    //     }),
    //   ],
    // }),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~@': resolve('./src'),
    },
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        // 全局添加less
        additionalData: `@import '@/styles/common/common.less';`,
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
      '/resource': {
        target: 'http://localhost:9000',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resource/, ''),
      },
    },
  },
});
