import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('initBaseApiUrl', () => {
  beforeEach(() => {
    vi.stubEnv(
      'VITE_APIGATEWAY_URL',
      'https://gw.example.execute-api.us-east-1.amazonaws.com/Stage',
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('falls back to API gateway URL when proxy HEAD returns 502', async () => {
    vi.stubEnv('DEV', true)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 502,
        ok: false,
      }),
    )

    const { initBaseApiUrl, getBaseApiUrl } = await import('@constants')
    await initBaseApiUrl()

    expect(getBaseApiUrl()).toBe('https://gw.example.execute-api.us-east-1.amazonaws.com/Stage/api/v1')
  })

  it('defaults baseApiUrl to /api/v1 when VITE_APIGATEWAY_URL is unset (production)', async () => {
    vi.stubEnv('VITE_APIGATEWAY_URL', undefined as unknown as string)
    vi.stubEnv('DEV', false)

    const { getBaseApiUrl } = await import('@constants')

    expect(getBaseApiUrl()).toBe('/api/v1')
  })

  it('defaults fallback to /api/v1 when VITE_APIGATEWAY_URL is unset (dev, proxy down)', async () => {
    vi.stubEnv('VITE_APIGATEWAY_URL', undefined as unknown as string)
    vi.stubEnv('DEV', true)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connection refused')))

    const { initBaseApiUrl, getBaseApiUrl } = await import('@constants')
    await initBaseApiUrl()

    expect(getBaseApiUrl()).toBe('/api/v1')
  })

  it('keeps /api/v1 when proxy HEAD succeeds', async () => {
    vi.stubEnv('DEV', true)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
      }),
    )

    const { initBaseApiUrl, getBaseApiUrl } = await import('@constants')
    await initBaseApiUrl()

    expect(getBaseApiUrl()).toBe('/api/v1')
  })
})
