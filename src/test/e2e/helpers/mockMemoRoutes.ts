import type { Page } from '@playwright/test'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'

/**
 * Mock memo-specific routes
 */
export async function mockMemoTableRoutes(page: Page) {
  const memos = generateMemosArray()

  // Mock the memos count
  await page.route('**/memos?count=true', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: memos.length * 4 }) // multiply for pagination
    })
  })

  // Mock memos list
  await page.route('**/memos?limit=100&offset=0', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(memos)
    })
  })

  // Mock individual memo details
  await page.route('**/memos/**', route => {
    const url = new URL(route.request().url())
    const pathSegments = url.pathname.split('/')
    const encodedMemoName = pathSegments[pathSegments.length - 1]

    // Decode the URL-encoded memo name (e.g., "Movie%20Theater" -> "Movie Theater")
    const memoName = decodeURIComponent(encodedMemoName)

    console.log('Mock memo route - encoded name:', encodedMemoName, 'decoded name:', memoName)

    const memo = memos.find(m => m.name === memoName)

    if (memo) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([memos[0]])
      })
    } else {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Memo not found' })
      })
    }
  })

}
