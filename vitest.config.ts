import {fileURLToPath} from 'node:url'
import {mergeConfig, defineConfig} from 'vitest/config'
import {configDefaults} from 'vitest/config'
import viteConfig from './vite.config'


export default defineConfig(
    mergeConfig(viteConfig, {
        test: {
            alias: [
                {
                    find: "@components",
                    replacement: "src/components",
                },
                {
                    find: "@stores",
                    replacement: "src/stores",
                },
                {
                    find: '@test',
                    replacement: "src/test",
                },
                {
                    find: '@api',
                    replacement: "src/api",
                }
            ],
            globals: true,
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/*'],
            root: fileURLToPath(new URL('./', import.meta.url)),
            testTransformMode: {
                web: [/\.[jt]sx$/]
            },
            setupFiles: ['./src/test/test-setup.ts'],
            include: ['**/**.{test,spec}.{ts, tsx, jsx, js}'],
            reporters: ['default', 'html', 'json'],
            typecheck: {
                checker: 'vue-tsc'
            }
        }
    }))

