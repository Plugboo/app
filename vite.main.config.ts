import path from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'src', 'common'),
      '@main': path.resolve(__dirname, 'src', 'main')
    }
  }
})
