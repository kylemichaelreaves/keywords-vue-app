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
 * The route handling order is CRITICAL - daily totals must be processed first.
 */
export async function mockComprehensiveTransactionRoutes(page: Page, staticTransactions: any[], staticDailyIntervals: any[]) {
  if (isCI) {
    console.log('[MOCK SETUP] Starting comprehensive transaction mocking with:', {
      staticTransactionsCount: staticTransactions.length,
      staticDailyIntervalsCount: staticDailyIntervals.length,
      firstDailyInterval: staticDailyIntervals[0],
      lastDailyInterval: staticDailyIntervals[staticDailyIntervals.length - 1]
    })
  }

  // CRITICAL FIX: Add specific route for daily intervals BEFORE the catch-all
  await page.route('**/transactions*', async (route: any) => {
    const url = new URL(route.request().url())

    // Skip if this is the main page URL (contains /budget-visualizer/ in path)
    if (url.pathname.includes('/budget-visualizer/')) {
      if (isCI) {
        console.log('[MOCK] Skipping page navigation URL:', url.toString())
      }
      return route.continue()
    }

    const params = url.searchParams
    const isDailyTotals = params.get('dailyTotals') === 'true'
    const hasInterval = params.has('interval')
    const hasDate = params.has('date')
    const timeFrame = params.get('timeFrame')
    const hasLimit = params.has('limit')
    const hasOffset = params.has('offset')

    if (isCI) {
      console.log('[MOCK] Processing request:', {
        url: url.toString(),
        isDailyTotals,
        hasInterval,
        hasDate,
        timeFrame,
        hasLimit,
        hasOffset,
        allParams: Object.fromEntries(params)
      })
    }

    // PRIORITY 1: Handle daily totals requests (for line chart) - MUST BE FIRST
    // This is the CRITICAL fix that enables DailyIntervalLineChart to load properly
    if (isDailyTotals) {
      if (isCI) {
        console.log('[MOCK DAILY] Returning daily intervals data:', staticDailyIntervals.length, 'items')
        console.log('[MOCK DAILY] Sample data:', staticDailyIntervals.slice(0, 2))
      }

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

    // PRIORITY 2: Handle table data requests (limit/offset patterns for pagination)
    if (hasLimit && hasOffset) {
      if (isCI) {
        console.log('[MOCK TABLE] Returning paginated transactions data:', staticTransactions.length, 'items')
        console.log('[MOCK TABLE] Sample data:', staticTransactions.slice(0, 2))
      }
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

    // PRIORITY 3: Handle specific date/timeframe requests (for table data)
    if (timeFrame === 'day' && hasDate) {
      const dateParam = params.get('date')
      const targetTransactions = generateTransactionsArray(5, '', dateParam)
      if (isCI) {
        console.log('[MOCK TABLE] Returning day-specific transactions for:', dateParam)
      }
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

    // PRIORITY 4: Handle other transaction requests
    if (isCI) {
      console.log('[MOCK DEFAULT] Returning default static transactions')
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(staticTransactions),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  })

  if (isCI) {
    console.log('[MOCK] Comprehensive transaction mocks setup complete')
  }
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
