// setupTestMocks.ts
import type { Page } from '@playwright/test'
import type { Transaction, DailyInterval } from '@types'
import { mockCommonRoutes, type CommonRoutesOptions } from './mockCommonRoutes'

const isCI = !!process.env.CI

// ============================================================================
// CI-SAFE SETUP - Use this in all tests
// ============================================================================

/**
 * Sets up all routes safely for both local and CI environments.
 * This function ensures routes are registered before any requests can be made.
 */
export async function setupTestMocks(page: Page, options: CommonRoutesOptions = {}): Promise<void> {
  // CI FIX: Clear all existing routes first
  await page.unrouteAll({ behavior: 'wait' })

  // CI DEBUG: Log all requests to help diagnose failures
  if (isCI) {
    page.on('request', (req) => {
      if (req.url().includes('execute-api')) {
        console.log(`[CI REQUEST] ${req.method()} ${req.url()}`)
      }
    })
    page.on('response', (res) => {
      if (res.url().includes('execute-api')) {
        console.log(`[CI RESPONSE] ${res.status()} ${res.url()}`)
      }
    })
  }

  // Register all routes
  await mockCommonRoutes(page, options)

  if (isCI) {
    console.log('[CI SETUP] All routes registered successfully')
  }
}

// ============================================================================
// PRESETS
// ============================================================================

export const MOCK_PRESETS = {
  MONTH_SUMMARY: {
    dailyIntervalDays: 30,
  } as CommonRoutesOptions,

  WEEK_SUMMARY: {} as CommonRoutesOptions,

  TRANSACTIONS_TABLE: {} as CommonRoutesOptions,

  MEMOS_TABLE: {
    skipTransactions: true,
    skipTimeIntervals: true,
    skipBudgetCategories: true,
  } as CommonRoutesOptions,

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
// RE-EXPORTS
// ============================================================================

export {
  mockCommonRoutes,
  mockMemoRoutes,
  mockTransactionRoutes,
  mockTimeIntervalRoutes,
  mockBudgetCategoryRoutes,
  MEMO_PRESETS,
} from './mockCommonRoutes'
