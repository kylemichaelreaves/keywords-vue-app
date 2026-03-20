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

function suppressNoisyTestConsole(log: string): boolean {
  if (log.includes('[constants]')) return false
  if (log.includes('[MemoSelect]')) return false
  if (log.includes('compiler-sfc')) return false
  if (log.includes('[httpClient]')) return false
  if (log.includes('[Vue warn]')) return false
  return true
}

export default defineConfig({
  test: {
    reporters: ['default', 'html'],
    server: {
      deps: {
        inline: ['element-plus']
      }
    },
    // Must be on the root `test` object when using `projects` (not inside each project).
    onConsoleLog(log: string) {
      return suppressNoisyTestConsole(log)
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
          },
        }
      }
    ]
  }
} as UserConfig)