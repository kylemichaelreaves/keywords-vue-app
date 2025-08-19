import type { Page } from '@playwright/test'

/**
 * Sets up API request logging for debugging purposes.
 * Logs requests that match the specified URL pattern to the console.
 *
 * @param page - The Playwright page instance
 * @param urlPattern - URL pattern to match (defaults to 'api' to catch all API requests)
 * @param logPrefix - Optional prefix for log messages (defaults to 'API Request:')
 */
export function setupApiRequestLogging(
  page: Page,
  urlPattern: string = 'api',
  logPrefix: string = 'API Request:'
): void {
  page.on('request', req => {
    if (req.url().includes(urlPattern)) {
      console.log(logPrefix, req.url())
    }
  })
}

/**
 * Sets up specific AWS API request logging for debugging purposes.
 * This is a convenience function for the common case of logging AWS API requests.
 *
 * @param page - The Playwright page instance
 */
export function setupAwsApiRequestLogging(page: Page): void {
  setupApiRequestLogging(page, 'api.us-east-1', 'AWS API Request:')
}
