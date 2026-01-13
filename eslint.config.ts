// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import storybook from 'eslint-plugin-storybook'


export default defineConfigWithVueTs(
  // Global ignores - must be the first config object and ONLY contain ignores
  {
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/storybook-static/**',
      '**/html/**',
      '**/*.min.js',
      '**/trace/**',
      '**/src/stories/**',
      '**/*.config.d.ts',
      '**/components.d.ts',
      '**/auto-imports.d.ts'
    ]
  },

  // Main linting config
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // Vue-specific rule overrides
  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}']
  },

  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.{js,ts,jsx,tsx,vue}'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    },
  },

  skipFormatting
)