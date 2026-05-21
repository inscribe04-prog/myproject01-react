import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/me': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/admin': {
        target: 'http://localhost:3000',
        bypass: (req) => {
            if (req.method === 'GET' && !req.url.startsWith('/admin/users')) {
                return req.url;
            }
        }
    },
      '/register': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.method === 'GET') return req.url;
        }
      }
    }
  }
})
