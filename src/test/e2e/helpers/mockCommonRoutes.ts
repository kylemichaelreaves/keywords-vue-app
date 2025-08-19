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

const isCI = !!process.env.CI

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
 * Comprehensive transaction route mocking that handles all patterns including page navigation protection
 *
 * CRITICAL: This function was redesigned to fix DailyIntervalLineChart test failures.
 * FIXED: Removed hardcoded API URL for security - requires environment variable to be set
 */
export async function mockComprehensiveTransactionRoutes(page: Page, staticTransactions: any[], staticDailyIntervals: any[]) {
  if (isCI) {
    console.log('[MOCK SETUP] Starting comprehensive transaction mocking with:', {
      staticTransactionsCount: staticTransactions.length,
      staticDailyIntervalsCount: staticDailyIntervals.length
    })
  }

  await page.route(`**/dev/transactions**`, async (route: any) => {
    const url = new URL(route.request().url())
    const params = url.searchParams
    const isDailyTotals = params.get('dailyTotals') === 'true'
    const hasInterval = params.has('interval')
    const hasDate = params.has('date')
    const timeFrame = params.get('timeFrame')
    const hasLimit = params.has('limit')
    const hasOffset = params.has('offset')

    // Log the actual request parameters for debugging
    console.log('[MOCK DEBUG] Intercepted AWS API request:', {
      url: url.toString(),
      isDailyTotals,
      interval: params.get('interval'),
      date: params.get('date'),
      hasLimit,
      hasOffset
    })

    try {
      // PRIORITY 1: Handle daily totals requests (for line chart) - MUST BE FIRST
      if (isDailyTotals && hasInterval && hasDate) {
        console.log('[MOCK] Returning daily intervals for chart with', staticDailyIntervals.length, 'items')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticDailyIntervals),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        return
      }

      // PRIORITY 2: Handle basic daily totals requests (fallback)
      if (isDailyTotals) {
        console.log('[MOCK] Returning basic daily intervals')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticDailyIntervals),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        return
      }

      // PRIORITY 3: Handle table data requests (limit/offset patterns for pagination)
      if (hasLimit && hasOffset) {
        console.log('[MOCK] Returning transactions for table pagination')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticTransactions),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        return
      }

      // PRIORITY 4: Handle specific date/timeframe requests (for table data)
      if (timeFrame === 'day' && hasDate) {
        const dateParam = params.get('date')
        const targetTransactions = generateTransactionsArray(5, '', dateParam)
        console.log('[MOCK] Returning day-specific transactions')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(targetTransactions),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        return
      }

      // PRIORITY 5: Handle other transaction requests
      console.log('[MOCK] Returning default transaction data')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticTransactions),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (error) {
      console.error('[MOCK ERROR] Failed to fulfill route:', error)
      // Fallback to continue the request if mocking fails
      await route.continue()
    }
  })

  console.log('[MOCK] AWS API Gateway transaction mocks setup complete')
}

/**
 * Mock daily interval routes with various parameter orders
 * FIXED: Use more specific pattern to avoid conflicts with comprehensive routes
 */
export async function mockDailyIntervalRoutes(page: Page, days: number = 30, staticData?: any[]) {
  const intervals = staticData || generateDailyIntervals(days)

  // CRITICAL FIX: Use specific pattern that only matches dailyTotals requests to avoid conflicts
  await page.route('**/transactions?*dailyTotals=true*', async route => {
    const url = new URL(route.request().url())
    const params = url.searchParams

    // Only handle requests that have dailyTotals=true
    if (params.get('dailyTotals') === 'true') {
      if (isCI) {
        console.log('Daily intervals mock - intercepted request:', url.toString())
        console.log('Daily intervals mock - fulfilling request with data:', intervals.length, 'intervals')
      }

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

    // Only log in non-CI environments to reduce noise
    if (!isCI) {
      console.log('Mock intercepted memo request for:', memoName)
    }

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
