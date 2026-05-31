import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

const backendUrl = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    proxy: {
      '/analyze': { target: backendUrl, changeOrigin: true },
      '/ratelimit': { target: backendUrl, changeOrigin: true },
      '/health': { target: backendUrl, changeOrigin: true },
    },
  },
});
