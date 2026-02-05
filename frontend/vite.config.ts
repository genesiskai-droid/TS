import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carga variables VITE_* (NO usar process.env en frontend)
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    build: {
      // Aumentado intencionalmente para DEMO (evita warning en Vercel)
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          // Separación explícita de chunks para mejor performance
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react'],
          },
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
