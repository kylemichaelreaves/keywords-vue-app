import {fileURLToPath} from 'node:url'
import {mergeConfig, defineConfig} from 'vitest/config'
import {configDefaults} from 'vitest/config'
import viteConfig from './vite.config'


export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, './src/test/e2e/**', './tests-examples/*'],
            setupFiles: ['./src/test/test-setup.ts'],
            root: fileURLToPath(new URL('./', import.meta.url)),
            include: ['src/test/**/*.{test,spec}.{ts,tsx,jsx,js}'],
            reporters: ['default', 'html'],
            typecheck: {
                checker: 'vue-tsc'
            }
        }
    })
)


