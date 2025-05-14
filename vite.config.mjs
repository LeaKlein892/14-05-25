import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          'babel-plugin-macros',
          [
            '@emotion/babel-plugin',
            {
              importMap: {
                '@mui/material': {
                  styled: {
                    canonicalImport: ['@emotion/styled', 'default'],
                    styledBaseImport: ['@mui/material', 'styled']
                  }
                },
                '@mui/material/styles': {
                  styled: {
                    canonicalImport: ['@emotion/styled', 'default'],
                    styledBaseImport: ['@mui/material/styles', 'styled']
                  }
                }
              }
            }
          ]
        ]
      }
    }),
    svgr(), // Transform SVGs into React components
    tsconfigPaths(), // Support for path aliases in tsconfig
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',
      filename: 'service-worker.js', // Explicitly name the service worker file
      manifest: {
        name: 'Castory',
        short_name: 'Castory',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logos/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logos/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Improved update handling
        clientsClaim: true,
        skipWaiting: true, // This will make updates apply immediately
        cleanupOutdatedCaches: true, // Remove old caches
        
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB to accommodate larger files
        
        // Include service worker functionality similar to CRA
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Add a network-first strategy for HTML and JS files to ensure updates are fetched
          {
            urlPattern: /\.(?:js|html)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-html-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      // Add any aliases if needed
    }
  },
  server: {
    port: 3000,
    open: true,
    host:true,
  },
  build: {
    outDir: 'build', // Keep the same output directory as CRA
    sourcemap: true
  },
  define: {
    // Handle global variables and process.env
    'process.env': {},
    global: 'window'
  }
});
