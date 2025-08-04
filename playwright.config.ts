import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'
import path from 'path'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/test/e2e',

  // Increased timeouts for CI
  timeout: isCI ? 120 * 1000 : 60 * 1000, // 2 minutes in CI, 1 minute locally
  expect: {
    timeout: isCI ? 15000 : 5000, // 15s in CI, 5s locally
  },

  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined, // Serial execution in CI

  // Better reporting for CI
  reporter: isCI
    ? [['html'], ['github'], ['line']]
    : [['html'], ['list']],

  use: {
    // CI-appropriate action timeout
    actionTimeout: isCI ? 30000 : 15000,

    // Fix: Different ports for dev vs preview
    baseURL: isCI ? 'http://localhost:4173' : 'http://localhost:5173',

    // Better trace collection
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
    video: isCI ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',

    headless: isCI,

    // CI-specific browser launch options
    launchOptions: isCI ? {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
      ],
    } : {},
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve('./src/test/e2e/playwright/.auth/storageState.json')
      },
      dependencies: ['setup']
    },

    // Only run additional browsers locally, not in CI
    ...(!isCI ? [
      {
        name: 'firefox',
        use: {
          ...devices['Desktop Firefox'],
          storageState: path.resolve('./src/test/e2e/playwright/.auth/storageState.json')
        },
        dependencies: ['setup']
      },
      {
        name: 'webkit',
        use: {
          ...devices['Desktop Safari'],
          storageState: path.resolve('./src/test/e2e/playwright/.auth/storageState.json')
        },
        dependencies: ['setup']
      }
    ] : [])
  ],

  webServer: {
    // Fix: Use correct ports for each environment
    command: isCI ? 'npm run preview' : 'npm run dev',
    port: isCI ? 4173 : 5173, // Preview uses 4173, dev uses 5173
    reuseExistingServer: !isCI, // Don't reuse in CI for clean state
    timeout: 120 * 1000, // 2 minutes to start server

    // Add environment variables for server
    env: {
      NODE_ENV: isCI ? 'production' : 'development',
    }
  }
})