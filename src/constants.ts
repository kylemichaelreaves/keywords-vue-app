import { devConsole } from '@utils/devConsole'

const LAMBDA_DEV_URL: string = 'http://127.0.0.1:3000'
const LAMBDA_DEV_PROXY = '/api/v1'
const GATEWAY_DEV_PROXY = '/api/gateway'
const API_GATEWAY_URL = import.meta.env.VITE_APIGATEWAY_URL ?? ''

// In DEV mode, all requests go through Vite's proxy to avoid CORS:
//   /api/v1/*      → API Gateway (or 127.0.0.1:3000 if VITE_PROXY_LOCAL_LAMBDA=1 in vite.config)
//   /api/gateway/* → same API Gateway with path rewritten to /api/v1/* (fallback)
// In production, hit the API Gateway directly.
let baseApiUrl = import.meta.env.DEV ? LAMBDA_DEV_PROXY : `${API_GATEWAY_URL}/api/v1`

/**
 * Returns the current base API URL.
 */
const getBaseApiUrl = (): string => baseApiUrl

/**
 * Checks whether /api/v1 is reachable via the Vite dev proxy.
 * If unreachable (502-504 or network error) and VITE_APIGATEWAY_URL is set,
 * switches baseApiUrl to /api/gateway (Vite rewrites to /api/v1 on the gateway).
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
    // Ping /api/v1 through the Vite proxy (same-origin, no CORS issues).
    // The proxy forwards /api/v1/* → API Gateway or localhost:3000 (see vite.config).
    // fetch() only rejects on network errors to Vite; a dead upstream still returns
    // a response (typically 502), so we treat 502-504 as unreachable and fall back
    // to /api/gateway (which Vite rewrites to /api/v1/* on the API Gateway).
    const response = await fetch(LAMBDA_DEV_PROXY, {
      method: 'HEAD',
      signal: controller.signal,
    })
    if (response.status >= 502 && response.status <= 504) {
      throw new Error(`Local API proxy upstream unavailable (${response.status})`)
    }

    devConsole(
      'info',
      '[constants] Local dev server is reachable via proxy, using:',
      LAMBDA_DEV_PROXY,
    )
  } catch {
    if (API_GATEWAY_URL) {
      baseApiUrl = GATEWAY_DEV_PROXY
      devConsole(
        'info',
        '[constants] Local dev server not reachable, falling back to gateway proxy:',
        GATEWAY_DEV_PROXY,
      )
    } else {
      devConsole(
        'warn',
        '[constants] Local dev server not reachable and VITE_APIGATEWAY_URL is not set. API calls will fail.',
      )
    }
  } finally {
    clearTimeout(timeoutId)
  }

  return baseApiUrl
}

export {
  API_GATEWAY_URL,
  GATEWAY_DEV_PROXY,
  LAMBDA_DEV_PROXY,
  LAMBDA_DEV_URL,
  getBaseApiUrl,
  initBaseApiUrl,
}

export { ROUTE_ALIASES } from '../constants.node'
