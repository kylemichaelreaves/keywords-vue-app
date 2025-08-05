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

  // Various parameter orders for daily totals
  await page.route('**/transactions?dailyTotals=true&interval=1+month&date=*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(intervals)
    })
  })

  await page.route('**/transactions?dailyTotals=true&interval=1+months', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(intervals)
    })
  })

  await page.route('**/transactions?dailyTotals=true&interval=1+months&date=*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(intervals)
    })
  })

  await page.route('**/transactions?interval=1+months&dailyTotals=true', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(intervals)
    })
  })

  await page.route('**/transactions?interval=1+month&dailyTotals=true', route => {
    route.fulfill({
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
  await page.route('**/memos/*', async route => {
    const url = new URL(route.request().url())
    const memoName = url.pathname.split('/').pop()

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: 1,
        name: memoName,
        budget_category: 'Groceries',
        total_amount_debit: -150.00,
        necessary: true,
        recurring: false,
        frequency: null,
        ambiguous: false
      }])
    })
  })
}
