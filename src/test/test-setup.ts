import '@testing-library/jest-dom';
import {setupServer} from 'msw/node'
import {beforeAll, afterEach, afterAll} from 'vitest'
import handlers from './msw/handlers'
import type {SetupServer} from 'msw/node'

export const server: SetupServer = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
