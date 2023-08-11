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
      registerType: 
      'autoUpdate', 
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
      },
      manifest: {
        name: 'Retro Snake',
        short_name: 'retsnek',
        description: 'Classic Snake game with retro neo theme',
        theme_color: '#ec4899',
        background_color: '#71717a',
        display: 'standalone',
        icons: [
          {
            src: 'img/icons/android-chrome-60x60.png',
            size: '60x60',
            type: 'image/png',
          },
          {
            src: 'img/icons/android-chrome-192x192.png',
            size: '144x144',
            type: 'image/png',
          },
          {
            src: 'img/icons/android-chrome-192x192.png',
            size: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/icons/android-chrome-512x512.png',
            size: '512x512',
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
