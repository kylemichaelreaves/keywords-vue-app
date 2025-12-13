import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const isStorybookProcess =
  process.env.npm_lifecycle_event === 'storybook' || process.env.SB_MODE === 'development'

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

export default defineConfig(async () => {
  const plugins = [
    vue(),
    tsconfigPaths({
      configNames: ['tsconfig.app.json']
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]

  // Only load vueDevTools when not in Storybook
  if (!isStorybookProcess) {
    const vueDevTools = (await import('vite-plugin-vue-devtools')).default
    plugins.push(vueDevTools())
  }

  return {
    server: {
      host: 'localhost',
      port: 5173,
      // proxy: {
      //   '/api': {
      //     target: import.meta.env.VITE_APIGATEWAY_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '/dev'),
      //     secure: true
      //   }
      // }
    },
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins,
    resolve: {
      alias: ALIASES.map((alias) => ({
        find: `@${alias}`,
        replacement: path.resolve(__dirname, `src/${alias}`)
      }))
    }
  }
})
