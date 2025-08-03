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
}
