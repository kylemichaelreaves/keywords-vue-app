import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('devConsole', () => {
  beforeEach(() => {
    for (const method of ['log', 'info', 'warn', 'error'] as const) {
      vi.spyOn(console, method)
        .mockClear()
        .mockImplementation(() => {})
    }
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it.each([
    ['log', 'log'] as const,
    ['info', 'info'] as const,
    ['warn', 'warn'] as const,
    ['error', 'error'] as const,
  ])('forwards %s to console.%s when DEV is true', async (level, method) => {
    vi.stubEnv('DEV', true)
    const { devConsole } = await import('@utils/devConsole')

    devConsole(level, 'msg', 42)

    expect(console[method]).toHaveBeenCalledTimes(1)
    expect(console[method]).toHaveBeenCalledWith('msg', 42)
  })

  it.each([['log'] as const, ['info'] as const, ['warn'] as const, ['error'] as const])(
    'does not call console when DEV is false (%s)',
    async (level) => {
      vi.stubEnv('DEV', false)
      const { devConsole } = await import('@utils/devConsole')

      devConsole(level, 'should-not-appear')

      expect(console[level]).not.toHaveBeenCalled()
    },
  )
})
