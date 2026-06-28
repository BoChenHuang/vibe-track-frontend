import { defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_API_BASE_URL ?? 'http://localhost:3000';

  return {
    plugins: [reactRouter()],
    server: {
      proxy: {
        '/analyze': { target: backendUrl, changeOrigin: true },
        '/ratelimit': { target: backendUrl, changeOrigin: true },
        '/health': { target: backendUrl, changeOrigin: true },
      },
    },
  };
});
