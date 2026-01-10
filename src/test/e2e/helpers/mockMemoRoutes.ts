import type { Page } from '@playwright/test'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'

/**
 * Mock memo-specific routes
 */
export async function mockMemoTableRoutes(page: Page) {
  const memos = generateMemosArray()

  // Mock the memos count
  await page.route('**/memos?count=true', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: memos.length * 4 }), // multiply for pagination
    })
  })

  // Mock memos list with flexible limit/offset matching and ID/name filtering
  await page.route('**/memos?**', (route) => {
    const url = new URL(route.request().url())

    // Check if this is a count request
    if (url.searchParams.get('count') === 'true') {
      // Let the count route handle it
      return route.continue()
    }

    const limit = parseInt(url.searchParams.get('limit') || '20', 10)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)
    const idParam = url.searchParams.get('id')
    const nameParam = url.searchParams.get('name')

    // If ID or name is specified, return specific memo
    if (idParam) {
      const memoId = parseInt(idParam, 10)
      const memo = memos.find((m) => m.id === memoId)
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memo ? [memo] : []),
      })
      return
    }

    if (nameParam) {
      const memo = memos.find((m) => m.name === nameParam)
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memo ? [memo] : []),
      })
      return
    }

    // Return paginated list of memos
    const paginatedMemos = memos.slice(offset, offset + limit)

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(paginatedMemos),
    })
  })

  // Mock memo summary route FIRST (more specific route)
  await page.route('**/memos/**/summary', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sum_amount_debit: 0,
        transactions_count: 1,
      }),
    })
  })

  // Mock individual memo details (less specific, comes after summary)
  await page.route('**/memos/**', (route) => {
    const url = new URL(route.request().url())
    const pathSegments = url.pathname.split('/')
    const encodedMemoName = pathSegments[pathSegments.length - 1]

    // Skip if this is a summary route (should be handled above)
    if (encodedMemoName === 'summary') {
      console.warn('Summary route hit individual memo handler - this should not happen')
      return route.continue()
    }

    // Check if encodedMemoName exists before decoding
    if (!encodedMemoName) {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid memo path' }),
      })
      return
    }

    // Decode the URL-encoded memo name (e.g., "Movie%20Theater" -> "Movie Theater")
    const memoName = decodeURIComponent(encodedMemoName)

    console.log('Mock memo route - encoded name:', encodedMemoName, 'decoded name:', memoName)

    const memo = memos.find((m) => m.name === memoName)

    if (memo) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memo), // Return the actual found memo, not always memos[0]
      })
    } else {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Memo not found' }),
      })
    }
  })

  // Mock transactions for a specific memo by ID
  await page.route('**/transactions?memoId=*', (route) => {
    const url = new URL(route.request().url())
    const memoIdParam = url.searchParams.get('memoId')

    if (memoIdParam) {
      const memoId = parseInt(memoIdParam, 10)
      const memo = memos.find((m) => m.id === memoId)
      const memoName = memo?.name || 'Unknown Memo'

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(5, memoName)),
      })
    } else {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Memo ID parameter required' }),
      })
    }
  })
}
