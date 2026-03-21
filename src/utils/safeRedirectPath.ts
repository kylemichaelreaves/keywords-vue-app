const MAX_PATH_LENGTH = 2048

/**
 * Returns a safe internal path from an untrusted value (e.g. `route.query.redirect`).
 * Rejects non-strings, empty/oversized values, and anything that isn't a single-slash
 * relative path (catches protocol-relative `//`, absolute URLs, etc.).
 * Returns `undefined` when the value is missing, empty, or unsafe.
 */
export function safeRedirectPath(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_PATH_LENGTH) {
    return undefined
  }

  const trimmed = value.trim()

  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return undefined
  }

  return trimmed
}
