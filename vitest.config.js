"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname,
        },
        deps: {
            moduleDirectories: ['node_modules', 'src'],
        },
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/test-setup.ts'],
        include: ['**/**.{test,spec}.{ts, tsx, jsx, js}'],
        reporters: ['default', 'html', 'json'],
        typecheck: {
            checker: 'vue-tsc'
        }
    },
});
