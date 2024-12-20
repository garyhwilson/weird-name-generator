import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@radix-ui/themes']
  },
  build: {
    commonjsOptions: {
      include: [/@radix-ui\/themes/, /node_modules/]
    },
    rollupOptions: {
      external: ['@radix-ui/themes/styles.css'],
      output: {
        globals: {
          '@radix-ui/themes/styles.css': 'RadixUIThemesStylesCSS',
        },
      },
    },
  }
});