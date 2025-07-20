import tsconfigPaths from "vite-tsconfig-paths";
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import {fileURLToPath} from "node:url";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueDevTools from 'vite-plugin-vue-devtools'

const ALIASES: string[] = [
    'api',
    'constants',
    'components',
    'composables',
    'main',
    'mocks',
    'stores',
    'test',
    'types',
    'router',
]

export default defineConfig({
    server: {
        host: 'localhost',
        port: 5173,
    },
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins: [
        vue(),
        vueDevTools(),
        tsconfigPaths({
          configNames: ['tsconfig.app.json'],
        }),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: ALIASES.map(alias => (
            {
                find: `@${alias}`,
                replacement: path.resolve(__dirname, `src/${alias}`),
            }
        ))
    }
});

