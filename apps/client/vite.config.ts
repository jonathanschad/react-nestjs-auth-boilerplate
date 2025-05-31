import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // Adjust './src' as needed
            '@client': path.resolve(__dirname, './src'), // Adjust './src' as needed
            '@boilerplate/ui/i18n': path.resolve(__dirname, '../../packages/ui/src/i18n'),
            '@boilerplate/ui/components': path.resolve(__dirname, '../../packages/ui/src/components'),
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
    },
    build: {
        sourcemap: true,
    },
    envDir: path.resolve(__dirname, '../../'),
});
