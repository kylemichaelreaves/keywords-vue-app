import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname =
  typeof __dirname === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : __dirname

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    // Root-level options
    reporters: ['default', 'html'],
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
    projects: [
      {
        extends: true,
        test: {
          globals: true,
          environment: 'jsdom',
          exclude: [...configDefaults.exclude, './src/test/e2e/**', './tests-examples/*'],
          setupFiles: ['./src/test/test-setup.ts'],
          root: fileURLToPath(new URL('./', import.meta.url)),
          include: ['src/test/**/*.{test,spec}.{ts,tsx,jsx,js}'],
          typecheck: {
            checker: 'vue-tsc',
          },
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
