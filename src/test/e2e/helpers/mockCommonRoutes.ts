import type { Page } from '@playwright/test'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'

/**
 * Mock basic transaction routes that are commonly used across tests
 */
export async function mockBasicTransactionRoutes(page: Page, staticData?: any[]) {
  const transactions = staticData || generateTransactionsArray(100)

  // Mock transactions with year timeframe
  await page.route('**/transactions?limit=100&offset=0&timeFrame=year', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(transactions)
    })
  })

  // Mock transaction count
  await page.route('**/transactions?count=true', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: 200 })
    })
  })

  // mock **/transactions?limit=100&offset=0&timeFrame=day&date=
  await page.route('**/transactions?limit=100&offset=0&timeFrame=day&date=*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(transactions)
    })
  })

  //   transactions?limit=100&offset=0&timeFrame=year&date=
  await page.route('**/transactions?limit=100&offset=0&timeFrame=year&date=', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(transactions)
    })
  })
}

/**
 * Mock daily interval routes with various parameter orders
 */
export async function mockDailyIntervalRoutes(page: Page, days: number = 30, staticData?: any[]) {
  const intervals = staticData || generateDailyIntervals(days)

  // Use more specific route patterns to avoid conflicts
  await page.route('**/transactions?dailyTotals=true*', async route => {
    const url = route.request().url()
    console.log('Daily intervals mock - intercepted request:', url)
    console.log('Daily intervals mock - fulfilling request with data:', intervals.length, 'intervals')

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(intervals)
    })
  })

  // Also handle requests with different parameter order
  await page.route('**/transactions*dailyTotals=true*', async route => {
    const url = route.request().url()
    console.log('Daily intervals mock (alt pattern) - intercepted request:', url)
    console.log('Daily intervals mock (alt pattern) - fulfilling request with data:', intervals.length, 'intervals')

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(intervals)
    })
  })
}

/**
 * Mock budget category routes
 */
export async function mockBudgetCategoryRoutes(page: Page) {
  await page.route('**/budget-categories?flatten=false', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateBudgetCategoryHierarchy())
    })
  })

  await page.route('**/transactions?budgetCategoryHierarchySum=true&timeFrame=month&date*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateBudgetCategoryHierarchy())
    })
  })
}

/**
 * Mock individual memo API calls for context menu functionality
 */
export async function mockMemoRoutes(page: Page) {
  // Add a catch-all debug route first to see all requests
  await page.route('**/*', async route => {
    const url = route.request().url()
    if (url.includes('memo')) {
      console.log('DEBUG: Any request containing "memo":', url)
    }
    await route.continue()
  })

  // More comprehensive route patterns to catch all possible API gateway URLs
  await page.route('**/memos/**', async route => {
    const url = new URL(route.request().url())
    const pathParts = url.pathname.split('/memos/')
    const memoName = pathParts[1] ? decodeURIComponent(pathParts[1]) : 'Unknown Memo'

    console.log('Mock intercepted memo request for:', memoName)
    console.log('Full URL:', route.request().url())

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: 1,
        name: memoName,
        budget_category: 'Groceries',
        necessary: true,
        recurring: false,
        frequency: 'monthly',
        ambiguous: false
      }])
    })
  })

  // Additional catch-all pattern for different API gateway configurations
  await page.route('**/api/**/memos/**', async route => {
    const url = new URL(route.request().url())
    const pathParts = url.pathname.split('/memos/')
    const memoName = pathParts[1] ? decodeURIComponent(pathParts[1]) : 'Unknown Memo'

    console.log('Mock intercepted API memo request for:', memoName)
    console.log('Full URL:', route.request().url())

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: 1,
        name: memoName,
        budget_category: 'Groceries',
        necessary: true,
        recurring: false,
        frequency: 'monthly',
        ambiguous: false
      }])
    })
  })

  // Even broader pattern to catch any memo-related requests
  await page.route('**/memos/**', async route => {
    const url = new URL(route.request().url())
    const pathParts = url.pathname.split('/memos/')
    const memoName = pathParts[1] ? decodeURIComponent(pathParts[1]) : 'Unknown Memo'

    console.log('Mock intercepted memo request for:', memoName)
    console.log('Full URL:', route.request().url())

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: 1,
        name: memoName,
        budget_category: 'Groceries',
        necessary: true,
        recurring: false,
        frequency: 'monthly',
        ambiguous: false
      }])
    })
  })
}
