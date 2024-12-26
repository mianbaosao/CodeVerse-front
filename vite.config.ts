import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8003,
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/user': {
        target: 'http://localhost:3011',
        changeOrigin: true,
        secure: false
      },
      '/subject/subject': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/subject/category': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      },
      '/subject/label': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vue/runtime-dom',
      '@vue/runtime-core'
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
}) 