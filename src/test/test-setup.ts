import '@testing-library/jest-dom'
import { config as vueTestUtilsConfig } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { vi } from 'vitest'
import handlers from './msw/handlers'
import type { SetupServer } from 'msw/node'

vueTestUtilsConfig.global.config = {
  ...vueTestUtilsConfig.global.config,
  warnHandler: () => {},
}

// Run synchronously when this file loads (before test modules import httpClient/constants).
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'info').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

export const server: SetupServer = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => {
  server.close()
  vi.restoreAllMocks()
})
