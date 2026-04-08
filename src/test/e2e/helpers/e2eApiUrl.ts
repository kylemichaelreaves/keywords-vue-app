/**
 * Pure URL helpers for Playwright route matching (Vite dev proxy prefixes).
 */

const API_PREFIXES = ['/api/v1', '/api/gateway']

/** Path after optional dev proxy prefix (/api/v1 or /api/gateway). */
export function apiPathname(url: URL): string {
  const { pathname } = url
  for (const prefix of API_PREFIXES) {
    if (pathname === prefix) return '/'
    if (pathname.startsWith(prefix + '/')) return pathname.slice(prefix.length)
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
