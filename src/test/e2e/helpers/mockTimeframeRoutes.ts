import type { Page } from '@playwright/test'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateMonthSummaryArray } from '@test/e2e/mocks/monthSummaryMock.ts'

/**
 * Mock month-specific transaction routes
 */
export async function mockMonthTransactionRoutes(page: Page) {
  // Mock transactions for month timeframe with date
  await page.route('**/transactions?limit=*&offset=0&timeFrame=month&date=*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateTransactionsArray(100))
    })
  })

  // Mock total amount debit for month
  await page.route(url => {
    const urlObj = new URL(url)
    return urlObj.pathname.endsWith('/transactions') &&
      urlObj.searchParams.get('timeFrame') === 'month' &&
      urlObj.searchParams.get('totalAmountDebit') === 'true' &&
      urlObj.searchParams.has('date')
  }, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ total_amount_debit: -5000 }])
    })
  })

  // Mock month summary
  await page.route('**/transactions/months/*/summary', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMonthSummaryArray())
    })
  })
}

/**
 * Mock week-specific transaction routes
 */
export async function mockWeekTransactionRoutes(page: Page) {
  // Mock transactions for week timeframe with date
  await page.route('**/transactions?limit=*&offset=0&timeFrame=week&date=*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateTransactionsArray(25))
    })
  })

  // Mock total amount debit for week
  await page.route(url => {
    const urlObj = new URL(url)
    return urlObj.pathname.endsWith('/transactions') &&
      urlObj.searchParams.get('timeFrame') === 'week' &&
      urlObj.searchParams.get('totalAmountDebit') === 'true' &&
      urlObj.searchParams.has('date')
  }, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ total_amount_debit: -700 }])
    })
  })

  // Mock week summary
  await page.route('**/transactions/weeks/**/summary', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMonthSummaryArray(20))
    })
  })

  // Mock week days
  await page.route('**/transactions/weeks/**/days', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    })
  })
}

/**
 * Mock day-specific transaction routes
 */
export async function mockDayTransactionRoutes(page: Page) {
  // Mock transactions for day timeframe with date
  await page.route('**/transactions?limit=100&offset=0&timeFrame=day&date=*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateTransactionsArray(5))
    })
  })
}
