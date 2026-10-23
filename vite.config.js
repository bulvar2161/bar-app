import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.DEPLOY_BASE || '/bar-app/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'robots.txt', 'brand/logo.png'],
      manifest: {
        name: 'Бульвар 21 — меню и заказ',
        short_name: 'Бульвар 21',
        description:
          'Меню бара «Бульвар 21» в Азове: кухня, авторские коктейли, настойки. Заказ за столом и установка приложения на телефон.',
        lang: 'ru',
        theme_color: '#9B0000',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        categories: ['food', 'drinks', 'shopping'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,woff2,ttf,otf}'],
        globIgnores: ['**/menu/**', '**/gallery/**'],
        navigateFallback: `${base}index.html`,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'bar-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
})
