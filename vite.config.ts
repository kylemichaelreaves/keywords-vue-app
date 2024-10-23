import tsconfigPaths from "vite-tsconfig-paths";
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import {fileURLToPath} from "node:url";

const ALIASES: string[] = [
    'api',
    'constants',
    'components',
    'main',
    'mocks',
    'stores',
    'test',
    'types'
]

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins: [
        vue(),
        tsconfigPaths()
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

