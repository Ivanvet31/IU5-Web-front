import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  // Для нативного приложения путь всегда от корня
  base: '/',

  plugins: [
    react(),
    mkcert(),
    // PWA плагин можно оставить, он не мешает Tauri,
    // но генерирует манифест, который может пригодиться
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: "RecoveryTime",
        short_name: "RecoveryTime",
        description: "Система для оценки времени восстановления",
        theme_color: "#E53935",
        background_color: "#F8F9FA",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  server: {
    port: 3000,
    https: true,
    // Прокси работает ТОЛЬКО при npm run tauri:dev (в браузере/окне разработки).
    // В собранном приложении (.deb/.exe) используется src/config.ts
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})