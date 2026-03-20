/**
 * Pure URL helpers for Playwright route matching (Vite /api proxy vs direct paths).
 */

/** Path after optional /api prefix (Vite dev proxy uses /api → backend). */
export function apiPathname(url: URL): string {
  const { pathname } = url
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return pathname === '/api' ? '/' : pathname.slice('/api'.length)
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
