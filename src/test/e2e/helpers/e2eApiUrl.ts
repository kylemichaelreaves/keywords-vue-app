/**
 * Pure URL helpers for Playwright route matching (Vite /api/v1 proxy vs direct paths).
 */

const API_PREFIX = '/api/v1'

/** Path after optional /api/v1 prefix (Vite dev proxy uses /api/v1 → backend). */
export function apiPathname(url: URL): string {
  const { pathname } = url
  if (pathname === API_PREFIX || pathname.startsWith(API_PREFIX + '/')) {
    return pathname === API_PREFIX ? '/' : pathname.slice(API_PREFIX.length)
  }
  return pathname
}

export function isExecuteApiUrl(url: URL): boolean {
  if (url.hostname.includes('execute-api')) {
    return true
  }

  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    const path = apiPathname(url)
    const apiPaths = ['/memos', '/transactions', '/budget-categories']
    return apiPaths.some((p) => path.startsWith(p))
  }

  return false
}
