import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'
import { UserConfig } from 'vite'

const dirname = path.dirname(new URL(import.meta.url).pathname)

export default defineConfig({
  plugins: [vue()],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' }]
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
    include: ['**/*.stories.?(m)[jt]s?(x)']
  }
} as UserConfig)