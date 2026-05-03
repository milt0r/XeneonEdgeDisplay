import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  base: './',
  publicDir: resolve(__dirname, 'resources'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@renderer': resolve(__dirname, 'src/renderer')
    }
  },
  plugins: [
    react(),
    electron([
      {
        entry: resolve(__dirname, 'src/main/index.ts'),
        vite: {
          build: {
            outDir: resolve(__dirname, 'dist-electron/main'),
            sourcemap: true,
            rollupOptions: {
              external: ['electron', 'bufferutil', 'utf-8-validate']
            }
          }
        }
      },
      {
        entry: resolve(__dirname, 'src/preload/index.ts'),
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: resolve(__dirname, 'dist-electron/preload'),
            sourcemap: 'inline'
          }
        }
      }
    ]),
    renderer()
  ],
  server: {
    port: 5173,
    strictPort: true
  }
});
