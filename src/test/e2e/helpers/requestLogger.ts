import type { Page } from '@playwright/test'

/**
 * Sets up API request logging for debugging purposes.
 * Logs requests that match the specified URL pattern to the console.
 *
 * @param page - The Playwright page instance
 */
export function setupApiRequestLogging(page: Page) {
  page.on('console', (msg) => {
    if (msg.type() === 'log' || msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text())
    }
  })
  // Track all network requests to see what's happening
  page.on('request', (request) => {
    console.log(`[REQUEST]: ${request.method()} ${request.url()}`)
  })

  page.on('response', (response) => {
    console.log(`[RESPONSE]: ${response.status()} ${response.url()}`)
  })
}

/**
 * Sets up specific AWS API request logging for debugging purposes.
 * This is a convenience function for the common case of logging AWS API requests.
 *
 * @param page - The Playwright page instance
 */
export function setupAwsApiRequestLogging(page: Page): void {
  setupApiRequestLogging(page)
}
