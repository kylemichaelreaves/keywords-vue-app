import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/

const aliases: string[] = [
    'components',
    'stores',
    'test',
    'api'
]

export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: aliases.map(alias => (
            {
                find: `@${alias}`,
                replacement: path.resolve(__dirname, `src/${alias}`),
            }
        ))
    }
});

