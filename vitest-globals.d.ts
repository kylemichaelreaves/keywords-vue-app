/// <reference types="vitest/globals" />


declare global {
  const expect: typeof import('vitest').expect
  const describe: typeof import('vitest').describe
  const it: typeof import('vitest').it
  const test: typeof import('vitest').test
  const beforeEach: typeof import('vitest').beforeEach
  const afterEach: typeof import('vitest').afterEach
  const beforeAll: typeof import('vitest').beforeAll
  const afterAll: typeof import('vitest').afterAll
  const vi: typeof import('vitest').vi
}

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R
  toHaveTextContent(text: string): R
  toBeVisible(): R
  toBeDisabled(): R
  toHaveValue(value: string | number): R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

export {}

