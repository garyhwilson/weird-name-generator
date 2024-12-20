import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: [/^@radix-ui\/themes/],
        },
    },
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
            '@radix-ui/themes': '@radix-ui/themes',
        },
    },
    optimizeDeps: {
        include: ['@radix-ui/themes'],
    },
});
