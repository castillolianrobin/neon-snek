import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    // PWA Config
    VitePWA({ 
      devOptions: { enabled: true },
      registerType: 'autoUpdate', 
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
      },
      includeAssets: [
        '/favicon.ico',
        '/img/icons/android-chrome-192x192.png',
        '/img/icons/pwa-192x192.png',
        '/img/icons/android-chrome-512x512.png',
        '/img/icons/pwa-512x512.png',
      ],
      manifest: {
        name: 'Retro Snake',
        short_name: 'Retro Snek',
        description: 'Classic Snake game with retro neo theme',
        theme_color: '#ec4899',
        background_color: '#71717a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        icons: [
          {
            src: '/img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/icons/pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      } 
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
