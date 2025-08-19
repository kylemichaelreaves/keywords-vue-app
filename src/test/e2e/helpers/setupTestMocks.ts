/**
 * CRITICAL FIX DOCUMENTATION - Test Mock Setup for DailyIntervalLineChart
 *
 * This file contains the test mock setup that was essential for fixing
 * DailyIntervalLineChart loading issues in Playwright tests.
 *
 * KEY ISSUES RESOLVED:
 * 1. Store State Initialization: Proper cleanup and initialization of localStorage
 * 2. Initial Date Setup: Ensuring the API hook's enabled condition is met
 * 3. Comprehensive Mock Strategy: Using the right mocking approach for complex components
 *
 * DO NOT REMOVE the store initialization logic without ensuring the API hooks
 * can still function properly in test environments.
 */

import type { Page } from '@playwright/test'
import { mockTransactionsTableSelects } from './mockTransactionsTableSelects'
import {
  mockBasicTransactionRoutes,
  mockDailyIntervalRoutes,
  mockBudgetCategoryRoutes,
  mockMemoRoutes,
  mockComprehensiveTransactionRoutes
} from './mockCommonRoutes'
import {
  mockMonthTransactionRoutes,
  mockWeekTransactionRoutes,
  mockDayTransactionRoutes
} from './mockTimeframeRoutes'
import { mockMemoTableRoutes } from './mockMemoRoutes'

export interface TestMockOptions {
  basicTransactions?: boolean | any[] // Can pass static data
  comprehensiveTransactions?: { staticTransactions: any[], staticDailyIntervals: any[] } // For full transaction table mocking
  dailyIntervals?: boolean | number | any[] // boolean, number of days, or static data
  budgetCategories?: boolean
  memos?: boolean
  transactionSelects?: boolean
  monthTransactions?: boolean
  weekTransactions?: boolean
  dayTransactions?: boolean
  memoTable?: boolean
}

/**
 * Default options for common test scenarios
 */
export const DEFAULT_MOCK_OPTIONS: TestMockOptions = {
  basicTransactions: true,
  dailyIntervals: true,
  budgetCategories: true,
  memos: true,
  transactionSelects: true,
  monthTransactions: false,
  weekTransactions: false,
  dayTransactions: false,
  memoTable: false
}

/**
 * Setup common API mocks for tests with configurable options
 */
export async function setupTestMocks(page: Page, options: TestMockOptions = {}) {
  const config = { ...DEFAULT_MOCK_OPTIONS, ...options }

  // Handle comprehensive transaction mocking (takes priority over basic)
  if (config.comprehensiveTransactions) {
    await mockComprehensiveTransactionRoutes(
      page,
      config.comprehensiveTransactions.staticTransactions,
      config.comprehensiveTransactions.staticDailyIntervals
    )
    // Skip separate daily intervals mocking when using comprehensive - it's already handled
  } else if (config.basicTransactions) {
    const staticData = Array.isArray(config.basicTransactions) ? config.basicTransactions : undefined
    await mockBasicTransactionRoutes(page, staticData)

    // Only set up separate daily intervals mocking when NOT using comprehensive mocking
    if (config.dailyIntervals) {
      if (Array.isArray(config.dailyIntervals)) {
        // Static data provided
        await mockDailyIntervalRoutes(page, 30, config.dailyIntervals)
      } else if (typeof config.dailyIntervals === 'number') {
        // Number of days provided
        await mockDailyIntervalRoutes(page, config.dailyIntervals)
      } else {
        // Boolean true, use defaults
        await mockDailyIntervalRoutes(page)
      }
    }
  }

  if (config.budgetCategories) {
    await mockBudgetCategoryRoutes(page)
  }

  if (config.memos) {
    await mockMemoRoutes(page)
  }

  if (config.transactionSelects) {
    await mockTransactionsTableSelects(page)
  }

  if (config.monthTransactions) {
    await mockMonthTransactionRoutes(page)
  }

  if (config.weekTransactions) {
    await mockWeekTransactionRoutes(page)
  }

  if (config.dayTransactions) {
    await mockDayTransactionRoutes(page)
  }

  if (config.memoTable) {
    await mockMemoTableRoutes(page)
  }
}

/**
 * Preset configurations for common test scenarios
 */
export const MOCK_PRESETS = {
  MONTH_SUMMARY: {
    basicTransactions: true,
    dailyIntervals: 30,
    budgetCategories: true,
    memos: true,
    transactionSelects: true,
    monthTransactions: true
  } as TestMockOptions,

  WEEK_SUMMARY: {
    basicTransactions: true,
    memos: true,
    transactionSelects: true,
    weekTransactions: true
  } as TestMockOptions,

  TRANSACTIONS_TABLE: {
    basicTransactions: true,
    dailyIntervals: true,
    transactionSelects: true,
    dayTransactions: true
  } as TestMockOptions,

  MEMOS_TABLE: {
    memos: true,
    memoTable: true
  } as TestMockOptions
}

/**
 * Quick setup functions for common scenarios
 */
export const setupMonthSummaryMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.MONTH_SUMMARY)
export const setupWeekSummaryMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.WEEK_SUMMARY)
export const setupTransactionsTableMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.TRANSACTIONS_TABLE)
export const setupMemosTableMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.MEMOS_TABLE)

/**
 * Setup mocks with static data for TransactionsTable tests
 */
export const setupTransactionsTableWithStaticMocks = (page: Page, staticTransactions: any[], staticIntervals: any[]) =>
  setupTestMocks(page, {
    basicTransactions: staticTransactions,
    dailyIntervals: staticIntervals,
    transactionSelects: true
  })

/**
 * Enhanced setup for TransactionsTable tests with comprehensive mocking
 *
 * CRITICAL: This function was redesigned to fix DailyIntervalLineChart test failures.
 * The store initialization is ESSENTIAL for the component to load properly.
 */
export const setupTransactionsTableWithComprehensiveMocks = async (page: Page, staticTransactions: any[], staticIntervals: any[]) => {
  // CRITICAL FIX: Initialize store state AND set proper initial date to enable API calls
  await page.addInitScript(() => {
    // Clear any existing store state that might interfere with chart visibility
    window.localStorage.removeItem('transactions-store')
    window.sessionStorage.clear()

    // CRITICAL: Set up initial state to ensure the API hook's enabled condition passes
    // This ensures selectedValue in DailyIntervalLineChart will have a valid date
    // WITHOUT this, the useDailyTotalAmountDebit hook will be disabled and no API calls will be made
    const initialDate = new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    window.localStorage.setItem('transactions-store', JSON.stringify({
      selectedDay: '',
      selectedWeek: '',
      selectedMonth: '',
      selectedYear: '',
      firstDay: initialDate // This will be used as fallback in selectedValue computed property
    }))
  })

  return setupTestMocks(page, {
    comprehensiveTransactions: {
      staticTransactions,
      staticDailyIntervals: staticIntervals
    },
    transactionSelects: true
  })
}
