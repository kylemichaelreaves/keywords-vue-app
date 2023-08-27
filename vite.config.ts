import tsconfigPaths from "vite-tsconfig-paths";
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
// import {ALIASES} from "./src/constants";

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
    },
});

