import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import mkcert from 'vite-plugin-mkcert'
import tsconfigPaths from "vite-tsconfig-paths/dist";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), mkcert(), tsconfigPaths()],
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '/src'),
            './runtimeConfig': './runtimeConfig.browser'
        }
    },
    server: {
        host: '127.0.0.1',
        https: true,
    },
})
