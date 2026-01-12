import type { Page } from '@playwright/test'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'

/**
 * Mock memo-specific routes
 */
export async function mockMemoTableRoutes(page: Page) {
  const memos = generateMemosArray()

  // Filter out memos without names to ensure data consistency
  const validMemos = memos.filter((memo) => memo.name && memo.name.trim() !== '')

  // Mock the memos count
  await page.route('**/execute-api.*/*/memos?count=true', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: validMemos.length * 4 }),
    })
  })

  // Mock memos list with flexible limit/offset matching and ID/name filtering
  await page.route('**/execute-api.*/*/memos?**', (route) => {
    const url = new URL(route.request().url())

    // Check if this is a count request
    if (url.searchParams.get('count') === 'true') {
      return route.continue()
    }

    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10)
    const offset = Number.parseInt(url.searchParams.get('offset') || '0', 10)
    const idParam = url.searchParams.get('id')
    const nameParam = url.searchParams.get('name')

    if (idParam) {
      const memoId = Number.parseInt(idParam, 10)
      const memo = validMemos.find((m) => m.id === memoId)
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memo ? [memo] : []),
      })
      return
    }

    if (nameParam) {
      const memo = validMemos.find((m) => m.name === nameParam)
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memo ? [memo] : []),
      })
      return
    }

    const paginatedMemos = validMemos.slice(offset, offset + limit)
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(paginatedMemos),
    })
  })

  // Mock memo summary route
  await page.route('**/execute-api.*/*/memos/*/summary', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sum_amount_debit: 0,
        transactions_count: 1,
      }),
    })
  })

  // Mock individual memo details
  await page.route('**/execute-api.*/*/memos/*', (route) => {
    const url = new URL(route.request().url())
    const pathSegments = url.pathname.split('/')
    const encodedMemoName = pathSegments.at(-1)

    if (encodedMemoName === 'summary') {
      return route.continue()
    }

    if (!encodedMemoName) {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid memo path' }),
      })
      return
    }

    const memoName = decodeURIComponent(encodedMemoName)
    const memo = validMemos.find((m) => m.name === memoName)

    if (memo) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(memo),
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
  await page.route('**/execute-api.*/*/transactions?memoId=*', (route) => {
    const url = new URL(route.request().url())
    const memoIdParam = url.searchParams.get('memoId')

    if (memoIdParam) {
      const memoId = Number.parseInt(memoIdParam, 10)
      const memo = validMemos.find((m) => m.id === memoId)
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
