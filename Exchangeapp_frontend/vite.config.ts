// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // 前端运行在5173端口（Vite默认端口）
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务运行在3000端口
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
