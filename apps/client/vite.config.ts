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
            '@boilerplate/ui/i18n': path.resolve(__dirname, '../../packages/ui/src/i18n'),
            '@boilerplate/ui/components': path.resolve(__dirname, '../../packages/ui/src/components'),
            '@boilerplate/ui/form': path.resolve(__dirname, '../../packages/ui/src/form'),
            '@boilerplate/types': path.resolve(__dirname, '../../packages/types/src'),
        },
    },
    optimizeDeps: {
        exclude: ['@boilerplate/ui'],
    },
    server: {
        watch: {
            ignored: ['!**/@boilerplate/ui/**'],
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true, //browsers can handle top-level-await features
        },
        sourcemap: true,
        keepNames: true, // Required for recharts tooltip to work in production
    },
    build: {
        sourcemap: true,
    },
    envDir: path.resolve(__dirname, '../../'),
});
