import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // Adjust './src' as needed
            '@client': path.resolve(__dirname, './src'), // Adjust './src' as needed
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
