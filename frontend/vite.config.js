import { defineConfig ,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT,
      mode:"production",
      proxy: {
        '/api': {
          target: `http://localhost:${env.VITE_API_PORT}`,
          changeOrigin: true,
        },
        '/chat': {
          target: `http://localhost:${env.VITE_CHAT_PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});
