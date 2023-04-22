/// <reference types="vitest" />
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import mkcert from 'vite-plugin-mkcert'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), mkcert(), tsconfigPaths()],
    build: {
        target: 'esnext',
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/test-setup.ts'],
        include: ['**/**.{test,spec}.{ts, tsx, jsx, js}'],
        reporters: ['default', 'html'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '/src'),
        }
    },
    server: {
        host: '127.0.0.1',
        https: true,
    },
})
