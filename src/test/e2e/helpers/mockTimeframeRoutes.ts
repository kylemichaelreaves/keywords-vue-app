import type { Page } from '@playwright/test'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateMonthSummaryArray } from '@test/e2e/mocks/monthSummaryMock.ts'

/**
 * Mock month-specific transaction routes
 */
export async function mockMonthTransactionRoutes(page: Page) {
  // Mock transactions for month timeframe with date
  await Promise.all([
    page.route(
      '**/execute-api.*/*/transactions?limit=*&offset=0&timeFrame=month&date=*',
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(generateTransactionsArray(100)),
        })
      },
    ),
    // Mock total amount debit for month
    page.route(
      (url) => {
        const urlObj = new URL(url)
        return (
          urlObj.pathname.includes('/execute-api') &&
          urlObj.pathname.endsWith('/transactions') &&
          urlObj.searchParams.get('timeFrame') === 'month' &&
          urlObj.searchParams.get('totalAmountDebit') === 'true' &&
          urlObj.searchParams.has('date')
        )
      },
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ total_amount_debit: -5000 }]),
        })
      },
    ),
    // Mock month summary
    page.route('**/execute-api.*/*/transactions/months/*/summary', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateMonthSummaryArray()),
      })
    }),
  ])
}

/**
 * Mock week-specific transaction routes
 */
export async function mockWeekTransactionRoutes(page: Page) {
  // Mock transactions for week timeframe with date
  await Promise.all([
    page.route(
      '**/execute-api.*/*/transactions?limit=*&offset=0&timeFrame=week&date=*',
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(generateTransactionsArray(25)),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        })
      },
    ),
    // Mock total amount debit for week
    page.route(
      (url) => {
        const urlObj = new URL(url)
        return (
          urlObj.pathname.includes('/execute-api') &&
          urlObj.pathname.endsWith('/transactions') &&
          urlObj.searchParams.get('timeFrame') === 'week' &&
          urlObj.searchParams.get('totalAmountDebit') === 'true' &&
          urlObj.searchParams.has('date')
        )
      },
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ total_amount_debit: -700 }]),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        })
      },
    ),
    // Mock week summary - this is the critical endpoint for the week summary page
    page.route('**/execute-api.*/*/transactions/weeks/*/summary', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateMonthSummaryArray(20)),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }),
    // Mock week days
    page.route('**/execute-api.*/*/transactions/weeks/*/days', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }),
  ])
}

/**
 * Mock day-specific transaction routes
 */
export async function mockDayTransactionRoutes(page: Page) {
  // Mock transactions for day timeframe with date
  await page.route(
    '**/execute-api.*/*/transactions?limit=100&offset=0&timeFrame=day&date=*',
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(5)),
      })
    },
  )
}
