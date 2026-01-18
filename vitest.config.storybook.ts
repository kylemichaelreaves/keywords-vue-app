import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'
import { UserConfig } from 'vite'

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