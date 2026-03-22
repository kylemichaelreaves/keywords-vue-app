import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ROUTE_ALIASES } from './constants.node'
import { logLocalPostgresTunnelStatus } from './scripts/checkLocalPostgresTunnel'

const isStorybookProcess =
  process.env.npm_lifecycle_event === 'storybook' || process.env.SB_MODE === 'development'

/** Dev-only: TCP check for SSM-tunneled Postgres (see scripts/checkLocalPostgresTunnel.ts). */
function localPostgresTunnelCheckPlugin(): PluginOption {
  return {
    name: 'local-postgres-tunnel-check',
    apply: 'serve',
    async configureServer() {
      await logLocalPostgresTunnelStatus()
    },
  }
}

export default defineConfig(async () => {
  const plugins: PluginOption[] = [
    vue(),
    tsconfigPaths({
      configNames: ['tsconfig.app.json'],
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver({ importStyle: false }),
        // Auto import icons
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: false }),
        // Auto register icon components
        IconsResolver({
          enabledCollections: ['ep'], // Element Plus icons
        }),
      ],
      dts: 'src/components.d.ts',
    }),
    Icons({
      autoInstall: true,
    }),
  ]

  // Only load vueDevTools when not in Storybook
  if (!isStorybookProcess) {
    const vueDevTools = (await import('vite-plugin-vue-devtools')).default
    plugins.push(vueDevTools())
    plugins.push(localPostgresTunnelCheckPlugin())
  }

  return {
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins,
    resolve: {
      alias: ROUTE_ALIASES.map((alias) => ({
        find: `@${alias}`,
        replacement: path.resolve(__dirname, `src/${alias}`),
      })),
    },
    optimizeDeps: {
      include: ['element-plus/es'],
    },
  }
})
