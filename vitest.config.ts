import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { UserConfig } from 'vite'

const dirname =
  typeof __dirname === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : __dirname

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
  'router'
]

const sharedConfig = {
  plugins: [vue()],
  resolve: {
    alias: ALIASES.map((alias) => ({
      find: `@${alias}`,
      replacement: path.resolve(dirname, `src/${alias}`)
    }))
  }
}

export default defineConfig({
  test: {
    reporters: ['default', 'html'],
    server: {
      deps: {
        inline: ['element-plus']
      }
    },
    projects: [
      {
        ...sharedConfig,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          exclude: [...configDefaults.exclude, './src/test/e2e/**', './tests-examples/*'],
          setupFiles: ['./src/test/test-setup.ts'],
          root: fileURLToPath(new URL('./', import.meta.url)),
          include: ['src/test/**/*.{test,spec}.{ts,tsx,jsx,js}'],
          typecheck: {
            checker: 'vue-tsc'
          }
        }
      },
      // {
      //   ...sharedConfig,
      //   test: {
      //     name: 'storybook',
      //     browser: {
      //       enabled: true,
      //       headless: true,
      //       provider: playwright({}),
      //       instances: [{ browser: 'chromium' }]
      //     },
      //     setupFiles: ['.storybook/vitest.setup.ts']
      //   }
      // }
    ]
  }
} as UserConfig)