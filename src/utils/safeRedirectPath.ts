const MAX_PATH_LENGTH = 2048

/**
 * Returns a safe internal path from an untrusted value (e.g. `route.query.redirect`).
 * Guards against open-redirect attacks (protocol-relative `//`, `javascript:`, etc.).
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

  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) {
    return undefined
  }

  return trimmed
}
