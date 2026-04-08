import { defineConfig, loadEnv, PluginOption } from 'vite'
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

const LAMBDA_DEV_URL = 'http://127.0.0.1:3000'

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

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const API_GATEWAY_URL = env.VITE_APIGATEWAY_URL ?? ''
  const apiV1Target =
    env.VITE_PROXY_LOCAL_LAMBDA === '1' ? LAMBDA_DEV_URL : API_GATEWAY_URL || LAMBDA_DEV_URL

  const plugins: PluginOption[] = [
    vue(),
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
        '/api/v1': {
          target: apiV1Target,
          changeOrigin: true,
        },
        // Fallback when local Lambda was used but died: baseURL becomes /api/gateway; paths must map to .../api/v1/*
        // Only enabled when API_GATEWAY_URL is configured, otherwise the proxy target would be invalid.
        ...(API_GATEWAY_URL && {
          '/api/gateway': {
            target: API_GATEWAY_URL,
            changeOrigin: true,
            rewrite: (p: string) => p.replace(/^\/api\/gateway/, '/api/v1'),
          },
        }),
      },
    },
    root: fileURLToPath(new URL('./', import.meta.url)),
    plugins,
    resolve: {
      tsconfigPaths: true,
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
