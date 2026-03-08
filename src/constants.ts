const LAMBDA_DEV_URL: string = 'http://127.0.0.1:3000'
const API_GATEWAY_URL = import.meta.env.VITE_APIGATEWAY_URL

// In DEV mode, start with LAMBDA_DEV_URL but fall back to API_GATEWAY_URL
// if the local server isn't running. In production, always use API_GATEWAY_URL.
// Kept module-private to avoid exporting a mutable binding.
let baseApiUrl = import.meta.env.DEV ? LAMBDA_DEV_URL : API_GATEWAY_URL

/**
 * Returns the current base API URL.
 */
const getBaseApiUrl = (): string => baseApiUrl

/**
 * Checks whether the local Lambda dev server is reachable.
 * If not, falls back to the API Gateway URL.
 * Should be called once during app initialization in DEV mode.
 *
 * @returns The resolved base API URL.
 */
const initBaseApiUrl = async (): Promise<string> => {
  if (!import.meta.env.DEV) {
    return baseApiUrl
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 1500)

  try {
    await fetch(LAMBDA_DEV_URL, {
      method: 'HEAD',
      signal: controller.signal,
    })

    console.log('[constants] Local dev server is reachable, using:', LAMBDA_DEV_URL)
  } catch {
    baseApiUrl = API_GATEWAY_URL
    console.log('[constants] Local dev server not reachable, falling back to:', API_GATEWAY_URL)
  } finally {
    clearTimeout(timeoutId)
  }

  return baseApiUrl
}

export { API_GATEWAY_URL, LAMBDA_DEV_URL, getBaseApiUrl, initBaseApiUrl }

export { ROUTE_ALIASES } from '../constants.node'
