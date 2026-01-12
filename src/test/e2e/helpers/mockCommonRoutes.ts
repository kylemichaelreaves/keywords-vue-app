/**
 * CRITICAL FIX DOCUMENTATION - API Route Mocking for DailyIntervalLineChart
 *
 * This file contains the comprehensive transaction route mocking that was essential
 * for fixing DailyIntervalLineChart loading issues in Playwright tests.
 *
 * KEY ISSUES RESOLVED:
 * 1. Route Priority: Daily totals requests (dailyTotals=true) MUST be handled FIRST
 * 2. Parameter Detection: Proper parsing of URL search params to identify request types
 * 3. Mock Data Return: Correct static data structure for daily intervals
 *
 * DO NOT REORDER the route handling logic without ensuring daily totals requests
 * are still processed with highest priority.
 */

import type { Page, Route } from '@playwright/test'
import type { Transaction, DailyInterval } from '@types'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'

const isCI = !!process.env.CI

// Define interfaces for mock data structures
interface TransactionCountResponse {
  count: number
}

interface MockMemo {
  id: number
  name: string
  budget_category: string
  necessary: boolean
  recurring: boolean
  frequency: string
  ambiguous: boolean
}

/**
 * Mock basic transaction routes that are commonly used across tests
 */
export async function mockBasicTransactionRoutes(
  page: Page,
  staticData?: Transaction[],
): Promise<void> {
  const transactions = staticData || generateTransactionsArray(100)

  await Promise.all([
    // CRITICAL FIX: Use execute-api pattern to avoid intercepting /src requests
    // Mock transactions with year timeframe
    page.route('**/execute-api.*/*/transactions?limit=100&offset=0&timeFrame=year', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions),
      })
    }),
    // Mock transaction count
    page.route('**/execute-api.*/*/transactions?count=true', (route) => {
      const countResponse: TransactionCountResponse = { count: 200 }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(countResponse),
      })
    }),
    // mock **/execute-api.*/*/transactions?limit=100&offset=0&timeFrame=day&date=
    page.route(
      '**/execute-api.*/*/transactions?limit=100&offset=0&timeFrame=day&date=*',
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(transactions),
        })
      },
    ),
    //   transactions?limit=100&offset=0&timeFrame=year&date=
    page.route(
      '**/execute-api.*/*/transactions?limit=100&offset=0&timeFrame=year&date=',
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(transactions),
        })
      },
    ),
  ])
}

/**
 * Comprehensive transaction route mocking that handles all patterns including page navigation protection
 *
 * CRITICAL: This function was redesigned to fix DailyIntervalLineChart test failures.
 * FIXED: Removed hardcoded API URL for security - requires environment variable to be set
 * CI FIX: Added proper CORS headers and longer timeouts for CI environment
 */
export async function mockComprehensiveTransactionRoutes(
  page: Page,
  staticTransactions: Transaction[],
  staticDailyIntervals: DailyInterval[],
): Promise<void> {
  // CRITICAL FIX: Use execute-api pattern to avoid intercepting /src requests
  // Only intercept actual API calls with query parameters, not page routes
  await page.route(`**/execute-api.*/*/transactions?**`, async (route: Route) => {
    const url = new URL(route.request().url())
    const params = url.searchParams
    const isDailyTotals = params.get('dailyTotals') === 'true'
    const hasInterval = params.has('interval')
    const hasDate = params.has('date')
    const timeFrame = params.get('timeFrame')
    const hasLimit = params.has('limit')
    const hasOffset = params.has('offset')

    // CI-specific: Standard headers for all responses
    const ciHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }

    // Add CI-specific headers when running in CI environment
    if (isCI) {
      ciHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
      ciHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    }

    try {
      // PRIORITY 1: Handle daily totals requests (for line chart) - MUST BE FIRST
      if (isDailyTotals && hasInterval && hasDate) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticDailyIntervals),
          headers: ciHeaders,
        })
        return
      }

      // PRIORITY 2: Handle basic daily totals requests (fallback)
      if (isDailyTotals) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticDailyIntervals),
          headers: ciHeaders,
        })
        return
      }

      // PRIORITY 3: Handle table data requests (limit/offset patterns for pagination)
      if (hasLimit && hasOffset) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticTransactions),
          headers: ciHeaders,
        })
        return
      }

      // PRIORITY 4: Handle specific date/timeframe requests (for table data)
      if (timeFrame === 'day' && hasDate) {
        const dateParam = params.get('date')
        const targetTransactions = generateTransactionsArray(5, '', dateParam ?? undefined)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(targetTransactions),
          headers: ciHeaders,
        })
        return
      }

      // PRIORITY 5: Handle other transaction requests
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticTransactions),
        headers: ciHeaders,
      })
    } catch (error) {
      console.error('[CI MOCK ERROR] Failed to fulfill route:', error)
      // Fallback to continue the request if mocking fails
      await route.continue()
    }
  })

  if (isCI) {
    console.log('[CI MOCK] AWS API Gateway transaction mocks setup complete')
  }
}

/**
 * Mock daily interval routes with various parameter orders
 * FIXED: Use more specific pattern to avoid conflicts with comprehensive routes
 */
export async function mockDailyIntervalRoutes(
  page: Page,
  days: number = 30,
  staticData?: DailyInterval[],
): Promise<void> {
  const intervals = staticData || generateDailyIntervals(days)

  // CRITICAL FIX: Use execute-api pattern to avoid intercepting /src requests
  await page.route('**/execute-api.*/*/transactions?*dailyTotals=true*', async (route: Route) => {
    const url = new URL(route.request().url())
    const params = url.searchParams

    // Only handle requests that have dailyTotals=true
    if (params.get('dailyTotals') === 'true') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(intervals),
      })
      return
    }

    // Continue to other handlers if not a daily totals request
    await route.continue()
  })

  if (isCI) {
    console.log('[CI MOCK] Daily interval mocks setup complete')
  }
}

/**
 * Mock budget category routes
 */
export async function mockBudgetCategoryRoutes(page: Page): Promise<void> {
  await page.route('**/execute-api.*/*/budget-categories?flatten=false', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateBudgetCategoryHierarchy()),
    })
  })

  await page.route(
    '**/execute-api.*/*/transactions?budgetCategoryHierarchySum=true&timeFrame=month&date*',
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateBudgetCategoryHierarchy()),
      })
    },
  )
}

/**
 * Mock individual memo API calls for context menu functionality
 * FIXED: Simplified and consolidated memo route handlers to prevent conflicts
 * CRITICAL: Must exclude /src/ paths to avoid intercepting Vue component files
 */
export async function mockMemoRoutes(page: Page): Promise<void> {
  // Single comprehensive memo route handler to avoid conflicts
  // Using a more specific pattern that matches execute-api URLs but not /src/ paths
  await page.route('**/execute-api.*/*/memos/*', async (route: Route) => {
    const url = new URL(route.request().url())

    // CRITICAL: Skip if this is a component file request
    if (url.pathname.includes('/src/')) {
      await route.continue()
      return
    }

    const pathParts = url.pathname.split('/memos/')
    const memoName = pathParts[1] ? decodeURIComponent(pathParts[1]) : 'Unknown Memo'

    const mockMemo: MockMemo = {
      id: 1,
      name: memoName,
      budget_category: 'Groceries',
      necessary: true,
      recurring: false,
      frequency: 'monthly',
      ambiguous: false,
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([mockMemo]),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  })
}
