import {fileURLToPath} from 'node:url'
import {mergeConfig, defineConfig} from 'vitest/config'
import {configDefaults} from 'vitest/config'
import viteConfig from './vite.config'
import path from "path";
// import {ALIASES} from "./src/constants";

const ALIASES: string[] = [
    'api',
    'constants',
    'components',
    'main',
    'stores',
    'test',
    'types'
]

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/*'],
            setupFiles: ['./src/test/test-setup.ts'],
            root: fileURLToPath(new URL('./', import.meta.url)),
            include: ['**/**.{test,spec}.{ts,tsx,jsx,js}'],
            reporters: ['default', 'html'],
            typecheck: {
                checker: 'vue-tsc'
            },
            alias: ALIASES.map((alias: string) => (
                {
                    find: `@${alias}`,
                    replacement: path.resolve(__dirname, `src/${alias}`),
                }
            ))
        }
    })
)


