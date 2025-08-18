import type { Page } from '@playwright/test'
import { mockTransactionsTableSelects } from './mockTransactionsTableSelects'
import {
  mockBasicTransactionRoutes,
  mockDailyIntervalRoutes,
  mockBudgetCategoryRoutes,
  mockMemoRoutes
} from './mockCommonRoutes'
import {
  mockMonthTransactionRoutes,
  mockWeekTransactionRoutes,
  mockDayTransactionRoutes
} from './mockTimeframeRoutes'
import { mockMemoTableRoutes } from './mockMemoRoutes'

export interface TestMockOptions {
  basicTransactions?: boolean | any[] // Can pass static data
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

  if (config.basicTransactions) {
    const staticData = Array.isArray(config.basicTransactions) ? config.basicTransactions : undefined
    await mockBasicTransactionRoutes(page, staticData)
  }

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
