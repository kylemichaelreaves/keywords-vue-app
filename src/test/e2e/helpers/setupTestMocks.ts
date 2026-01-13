// setupTestMocks.ts
import type { Page } from '@playwright/test'
import type { Transaction, DailyInterval } from '@types'
import { mockCommonRoutes, type CommonRoutesOptions } from './mockCommonRoutes'

// ============================================================================
// MAIN SETUP FUNCTION
// ============================================================================

export async function setupTestMocks(page: Page, options: CommonRoutesOptions = {}): Promise<void> {
  await page.unroute('**')
  await mockCommonRoutes(page, options)
}

// ============================================================================
// PRESETS
// ============================================================================

export const MOCK_PRESETS = {
  /** Full mocking for month summary pages */
  MONTH_SUMMARY: {
    dailyIntervalDays: 30,
  } as CommonRoutesOptions,

  /** Full mocking for week summary pages */
  WEEK_SUMMARY: {} as CommonRoutesOptions,

  /** Full mocking for transactions table */
  TRANSACTIONS_TABLE: {} as CommonRoutesOptions,

  /** Memos table only (skip transactions) */
  MEMOS_TABLE: {
    skipTransactions: true,
    skipTimeIntervals: true,
    skipBudgetCategories: true,
  } as CommonRoutesOptions,

  /** Minimal - only what's needed */
  MINIMAL: {
    skipMemos: true,
    skipBudgetCategories: true,
  } as CommonRoutesOptions,
} as const

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const setupMonthSummaryMocks = (page: Page) =>
  setupTestMocks(page, MOCK_PRESETS.MONTH_SUMMARY)

export const setupWeekSummaryMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.WEEK_SUMMARY)

export const setupMemosTableMocks = (page: Page) => setupTestMocks(page, MOCK_PRESETS.MEMOS_TABLE)

export const setupTransactionsTableMocks = (page: Page) =>
  setupTestMocks(page, MOCK_PRESETS.TRANSACTIONS_TABLE)

/** Enhanced setup with custom static data */
export async function setupTransactionsTableWithComprehensiveMocks(
  page: Page,
  staticTransactions: Transaction[],
  staticIntervals: DailyInterval[],
): Promise<boolean> {
  try {
    await setupTestMocks(page, {
      transactions: staticTransactions,
      dailyIntervals: staticIntervals,
    })
    return true
  } catch (error) {
    console.error('[SETUP ERROR] Mock setup failed:', error)
    throw error
  }
}

// ============================================================================
// RE-EXPORTS for direct access
// ============================================================================

export {
  mockCommonRoutes,
  mockMemoRoutes,
  mockTransactionRoutes,
  mockTimeIntervalRoutes,
  mockBudgetCategoryRoutes,
  MEMO_PRESETS,
} from './mockCommonRoutes'
