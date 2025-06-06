import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@common': '/src/common',
            '@renderer': '/src/renderer',
        }
    },
    server: {
        port: 7642
    },
    plugins: [react(), tailwindcss()]
});
