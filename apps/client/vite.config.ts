import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // Adjust './src' as needed
            '@client': path.resolve(__dirname, './src'), // Adjust './src' as needed
            '@darts/ui/i18n': path.resolve(__dirname, '../../packages/ui/src/i18n'),
            '@darts/ui/components': path.resolve(__dirname, '../../packages/ui/src/components'),
            '@darts/ui/form': path.resolve(__dirname, '../../packages/ui/src/form'),
        },
    },
    optimizeDeps: {
        exclude: ['@darts/ui'],
    },
    server: {
        watch: {
            ignored: ['!**/@darts/ui/**'],
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true, //browsers can handle top-level-await features
        },
        sourcemap: true,
    },
    build: {
        sourcemap: true,
    },
    envDir: path.resolve(__dirname, '../../'),
});
