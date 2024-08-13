import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        //api 삭제 - 삭제 안 하면 3000/api 이렇게 붙어버림
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
      }
    }
  },
})