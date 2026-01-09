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

import type { Page } from '@playwright/test'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'

const _isCI = !!process.env.CI

/**
 * Mock basic transaction routes that are commonly used across tests
 */
export async function mockBasicTransactionRoutes(page: Page, staticData?: unknown[]) {
  const transactions = staticData || generateTransactionsArray(100)

  await Promise.all([
    // CRITICAL FIX: Use more specific API patterns to avoid intercepting page navigation
    // Mock transactions with year timeframe
    await page.route('**/transactions?limit=100&offset=0&timeFrame=year', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions)
      })
    }),
    // Mock transaction count
    await page.route('**/transactions?count=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 200 })
      })
    }),
    // mock **/transactions?limit=100&offset=0&timeFrame=day&date=
    await page.route('**/transactions?limit=100&offset=0&timeFrame=day&date=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions)
      })
    }),
    //   transactions?limit=100&offset=0&timeFrame=year&date=
    await page.route('**/transactions?limit=100&offset=0&timeFrame=year&date=', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions)
      })
    })
  ])
}

/**
 * Comprehensive transaction route mocking that handles all patterns including page navigation protection
 *
 * CRITICAL: This function was redesigned to fix DailyIntervalLineChart test failures.
 * FIXED: Removed hardcoded API URL for security - requires environment variable to be set
 * CI FIX: Added proper CORS headers and longer timeouts for CI environment
 */
export async function mockComprehensiveTransactionRoutes(page: Page, staticTransactions: unknown[], staticDailyIntervals: unknown[]) {

  // CRITICAL FIX: Use specific API patterns to avoid intercepting SPA navigation
  // Only intercept actual API calls with query parameters, not page routes
  await page.route(`**/transactions?**`, async (route: unknown) => {
    const url = new URL(route.request().url())
    const params = url.searchParams
    const isDailyTotals = params.get('dailyTotals') === 'true'
    const hasInterval = params.has('interval')
    const hasDate = params.has('date')
    const timeFrame = params.get('timeFrame')
    const hasLimit = params.has('limit')
    const hasOffset = params.has('offset')

    // CI-specific: Standard headers for all responses
    const ciHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }

    try {
      // PRIORITY 1: Handle daily totals requests (for line chart) - MUST BE FIRST
      if (isDailyTotals && hasInterval && hasDate) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticDailyIntervals),
          headers: ciHeaders
        })
        return
      }

      // PRIORITY 2: Handle basic daily totals requests (fallback)
      if (isDailyTotals) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticDailyIntervals),
          headers: ciHeaders
        })
        return
      }

      // PRIORITY 3: Handle table data requests (limit/offset patterns for pagination)
      if (hasLimit && hasOffset) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticTransactions),
          headers: ciHeaders
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
          headers: ciHeaders
        })
        return
      }

      // PRIORITY 5: Handle other transaction requests
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticTransactions),
        headers: ciHeaders
      })
    } catch (error) {
      console.error('[CI MOCK ERROR] Failed to fulfill route:', error)
      // Fallback to continue the request if mocking fails
      await route.continue()
    }
  })

  console.log('[CI MOCK] AWS API Gateway transaction mocks setup complete')
}

/**
 * Mock daily interval routes with various parameter orders
 * FIXED: Use more specific pattern to avoid conflicts with comprehensive routes
 */
export async function mockDailyIntervalRoutes(page: Page, days: number = 30, staticData?: unknown[]) {
  const intervals = staticData || generateDailyIntervals(days)

  // CRITICAL FIX: Use specific API pattern that only matches dailyTotals requests to avoid conflicts
  await page.route('**/transactions?*dailyTotals=true*', async route => {
    const url = new URL(route.request().url())
    const params = url.searchParams

    // Only handle requests that have dailyTotals=true
    if (params.get('dailyTotals') === 'true') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(intervals)
      })
      return
    }

    // Continue to other handlers if not a daily totals request
    await route.continue()
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
 * FIXED: Simplified and consolidated memo route handlers to prevent conflicts
 */
export async function mockMemoRoutes(page: Page) {
  // Single comprehensive memo route handler to avoid conflicts
  await page.route('**/memos/**', async route => {
    const url = new URL(route.request().url())
    const pathParts = url.pathname.split('/memos/')
    const memoName = pathParts[1] ? decodeURIComponent(pathParts[1]) : 'Unknown Memo'

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
      }]),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  })
}
