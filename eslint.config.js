import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import pluginPlaywright from 'eslint-plugin-playwright';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
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
        '**/html/**',
        '**/*.min.js',
        '**/trace/**'
    ]
}, 
// Main linting config
{
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
}, pluginVue.configs['flat/essential'], vueTsConfigs.recommended, 
// Vue-specific rule overrides
{
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    rules: {
        'vue/multi-word-component-names': 'off'
    }
}, {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
}, {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}']
}, skipFormatting);
