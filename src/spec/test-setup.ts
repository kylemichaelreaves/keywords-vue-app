/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import "@testing-library/jest-dom/extend-expect";
import {setupServer} from 'msw/node'
import {beforeAll, afterEach, afterAll} from 'vitest'
import {handlers} from './msw'

export const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())