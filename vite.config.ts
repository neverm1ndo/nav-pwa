import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*'],
      },
      includeAssets: ['**/**'],
      devOptions: {
        // enabled: true
        /* other options */
      },
      manifest: {
        name: 'PWA Nav',
        short_name: 'PWANav',
        display: 'standalone',
        description: 'PWA Navigation app',
        theme_color: '#242424',
        icons: [
          {
            src: 'maskable_icon_x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable_icon_x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'maskable_icon_x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
        ]
      }
    })
  ],
})