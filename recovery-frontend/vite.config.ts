// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

// Имя вашего репозитория на GitHub
const repoName = 'IU5-Web-front';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  
  return {
    // Базовый URL для GitHub Pages
    base: isBuild ? `/${repoName}/` : '/',

    plugins: [
      react(),
      // Плагин для HTTPS
      mkcert(),
      // Конфигурация PWA
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: 'RecoveryTime - Прогноз восстановления',
          short_name: 'RecoveryTime',
          description: 'Система для оценки и прогнозирования времени восстановления IT-систем.',
          theme_color: '#E53935',
          background_color: '#F8F9FA',
          display: 'standalone',
          scope: isBuild ? `/${repoName}/` : '/',
          start_url: isBuild ? `/${repoName}/` : '/',
          icons: [
            { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        }
      })
    ],

    server: {
      // Включаем HTTPS
      https: true,
      port: 3000,
      proxy: {
        // Прокси для запросов к API в режиме разработки в браузере
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },

    build: {
      sourcemap: false,
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});