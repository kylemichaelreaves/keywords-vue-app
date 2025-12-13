import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  async viteFinal(config) {
    // Don't merge any plugins - let Storybook handle it
    return config
  },
}

export default config
