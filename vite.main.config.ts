import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            '@common': '/src/common',
            '@main': '/src/main',
        }
    }
});
