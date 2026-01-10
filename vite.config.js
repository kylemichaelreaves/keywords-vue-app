import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
const isStorybookProcess = process.env.npm_lifecycle_event === 'storybook' || process.env.SB_MODE === 'development';
const ALIASES = [
    'api',
    'constants',
    'components',
    'composables',
    'main',
    'mocks',
    'stores',
    'test',
    'types',
    'router',
];
export default defineConfig(async () => {
    const plugins = [
        vue(),
        tsconfigPaths({
            configNames: ['tsconfig.app.json'],
        }),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
                // Auto import icons
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
            dts: 'src/auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
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
    ];
    // Only load vueDevTools when not in Storybook
    if (!isStorybookProcess) {
        const vueDevTools = (await import('vite-plugin-vue-devtools')).default;
        plugins.push(vueDevTools());
    }
    return {
        server: {
            host: 'localhost',
            port: 5173,
        },
        root: fileURLToPath(new URL('./', import.meta.url)),
        plugins,
        resolve: {
            alias: ALIASES.map((alias) => ({
                find: `@${alias}`,
                replacement: path.resolve(__dirname, `src/${alias}`),
            })),
        },
    };
});
