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

const isCI = !!process.env.CI

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
 * Helper function to setup transaction-related mocks
 */
async function setupTransactionMocks(page: Page, config: TestMockOptions) {
  // Handle comprehensive transaction mocking (takes priority over basic)
  if (config.comprehensiveTransactions) {
    await mockComprehensiveTransactionRoutes(
      page,
      config.comprehensiveTransactions.staticTransactions,
      config.comprehensiveTransactions.staticDailyIntervals
    )
    return // Skip other transaction mocking when using comprehensive
  }

  // Handle basic transaction routes
  if (config.basicTransactions) {
    const staticData = Array.isArray(config.basicTransactions) ? config.basicTransactions : undefined
    await mockBasicTransactionRoutes(page, staticData)
  }

  // Handle daily intervals (only when not using comprehensive mocking)
  if (config.dailyIntervals) {
    await setupDailyIntervalMocks(page, config.dailyIntervals)
  }
}

/**
 * Helper function to setup daily interval mocks with different configurations
 */
async function setupDailyIntervalMocks(page: Page, intervalConfig: boolean | number | any[]) {
  if (Array.isArray(intervalConfig)) {
    // Static data provided
    await mockDailyIntervalRoutes(page, 30, intervalConfig)
  } else if (typeof intervalConfig === 'number') {
    // Number of days provided
    await mockDailyIntervalRoutes(page, intervalConfig)
  } else {
    // Boolean true, use defaults
    await mockDailyIntervalRoutes(page)
  }
}

/**
 * Helper function to setup timeframe-specific mocks
 */
async function setupTimeframeMocks(page: Page, config: TestMockOptions) {
  const timeframeMocks = [
    { condition: config.monthTransactions, mockFn: mockMonthTransactionRoutes },
    { condition: config.weekTransactions, mockFn: mockWeekTransactionRoutes },
    { condition: config.dayTransactions, mockFn: mockDayTransactionRoutes }
  ]

  for (const { condition, mockFn } of timeframeMocks) {
    if (condition) {
      await mockFn(page)
    }
  }
}

/**
 * Helper function to setup feature-specific mocks
 */
async function setupFeatureMocks(page: Page, config: TestMockOptions) {
  const featureMocks = [
    { condition: config.budgetCategories, mockFn: mockBudgetCategoryRoutes },
    { condition: config.memos, mockFn: mockMemoRoutes },
    { condition: config.transactionSelects, mockFn: mockTransactionsTableSelects },
    { condition: config.memoTable, mockFn: mockMemoTableRoutes }
  ]

  for (const { condition, mockFn } of featureMocks) {
    if (condition) {
      await mockFn(page)
    }
  }
}

/**
 * Setup common API mocks for tests with configurable options
 * Refactored to be less complex and more maintainable
 */
export async function setupTestMocks(page: Page, options: TestMockOptions = {}) {
  const config = { ...DEFAULT_MOCK_OPTIONS, ...options }

  // Setup mocks in logical groups
  await setupTransactionMocks(page, config)
  await setupTimeframeMocks(page, config)
  await setupFeatureMocks(page, config)
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
 * Convenience functions for common scenarios
 */
export const setupMonthSummaryMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.MONTH_SUMMARY)
export const setupWeekSummaryMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.WEEK_SUMMARY)
export const setupMemosTableMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.MEMOS_TABLE)
/**
 * Enhanced setup for TransactionsTable tests with comprehensive mocking
 * Simplified error handling and CI-specific configurations
 */
export const setupTransactionsTableWithComprehensiveMocks = async (page: Page, staticTransactions: any[], staticIntervals: any[]) => {
  const mockOptions = {
    comprehensiveTransactions: {
      staticTransactions,
      staticDailyIntervals: staticIntervals
    },
    transactionSelects: true
  }

  try {
    if (isCI) {
      console.log('[CI SETUP] Starting comprehensive mock setup')
    }

    await setupTestMocks(page, mockOptions)

    // CI-specific setup timeout
    if (isCI) {
      await page.waitForTimeout(1000)
    }

    console.log('[SETUP] Mock setup complete')
    return true
  } catch (error) {
    console.error('[SETUP ERROR] Mock setup failed:', error)

    if (isCI) {
      console.error('[CI SETUP] Continuing despite error')
      return false
    }

    throw error
  }
}
