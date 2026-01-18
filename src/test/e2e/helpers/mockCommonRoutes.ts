// mockCommonRoutes.ts
// Consolidated API route mocking with URL predicates for maximum control

import type { Page, Route } from '@playwright/test'
import type { Transaction, DailyInterval } from '@types'
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { generateWeeksArray } from '@test/e2e/mocks/weeksMock.ts'
import { generateMonthsArray } from '@test/e2e/mocks/monthsMock.ts'
import { generateYearsArray } from '@test/e2e/mocks/yearsMock.ts'
import { generateDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'
import { generateMonthSummaryArray } from '@test/e2e/mocks/monthSummaryMock.ts'

const isCI = !!process.env.CI
const DEBUG = !!process.env.DEBUG_MOCKS

// ============================================================================
// SHARED UTILITIES
// ============================================================================

function isExecuteApiUrl(url: URL): boolean {
  // Match real API Gateway requests (local dev with real backend)
  if (url.hostname.includes('execute-api')) {
    return true
  }

  // Match localhost API requests (CI/preview mode where app makes relative requests)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    // Only intercept API paths, not static assets or page routes
    const apiPaths = ['/memos', '/transactions', '/budget-categories']
    return apiPaths.some((path) => url.pathname.startsWith(path))
  }

  return false
}

function corsHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
  if (isCI) {
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
  }
  return headers
}

function fulfill(route: Route, data: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
    headers: corsHeaders(),
  })
}

function log(category: string, message: string, data?: unknown) {
  // Always log in CI for debugging
  if (isCI || DEBUG) {
    console.log(`[MOCK:${category}] ${message}`, data ? JSON.stringify(data) : '')
  }
}

// ============================================================================
// MEMO ROUTES
// ============================================================================

export interface MemoMockOptions {
  memos?: ReturnType<typeof generateMemosArray>
}

export async function mockMemoRoutes(page: Page, options: MemoMockOptions = {}) {
  const memos = options.memos || generateMemosArray()
  const validMemos = memos.filter((memo) => memo.name?.trim())

  // 1. Memos count
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/memos') &&
      url.searchParams.get('count') === 'true',
    (route) => {
      log('Memos', 'Count request')
      fulfill(route, { count: validMemos.length * 4 })
    },
  )

  // 2. Memos list (with pagination, id, name filtering, search)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/memos') &&
      url.searchParams.get('count') !== 'true',
    (route) => {
      const url = new URL(route.request().url())
      const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10)
      const offset = Number.parseInt(url.searchParams.get('offset') || '0', 10)
      const idParam = url.searchParams.get('id')
      const nameParam = url.searchParams.get('name')
      const searchParam = url.searchParams.get('search')

      log('Memos', 'List request', { limit, offset, idParam, nameParam, searchParam })

      if (idParam) {
        const memo = validMemos.find((m) => m.id === Number.parseInt(idParam, 10))
        return fulfill(route, memo ? [memo] : [])
      }

      if (nameParam) {
        // If search param is true, do partial matching
        if (searchParam === 'true') {
          const searchResults = validMemos.filter((m) =>
            m.name?.toLowerCase().includes(nameParam.toLowerCase()),
          )
          return fulfill(route, searchResults.slice(0, limit))
        }
        // Otherwise, do exact matching
        const memo = validMemos.find((m) => m.name === nameParam)
        return fulfill(route, memo ? [memo] : [])
      }

      fulfill(route, validMemos.slice(offset, offset + limit))
    },
  )

  // 3. Memo summary (/memos/:name/summary)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) && url.pathname.includes('/memos/') && url.pathname.endsWith('/summary'),
    (route) => {
      log('Memos', 'Summary request')
      fulfill(route, { sum_amount_debit: 0, transactions_count: 1 })
    },
  )
  // 4. Individual memo (/memos/:id) - but NOT /memos or /memos/:id/summary
  await page.route(
    (url) => {
      if (!isExecuteApiUrl(url)) return false
      if (!url.pathname.includes('/memos/')) return false
      if (url.pathname.endsWith('/memos')) return false
      if (url.pathname.endsWith('/summary')) return false
      return true
    },
    (route) => {
      const url = new URL(route.request().url())
      const memoIdStr = url.pathname.split('/').at(-1)

      if (!memoIdStr) {
        return fulfill(route, { error: 'Invalid memo path' }, 400)
      }

      const memoId = Number.parseInt(memoIdStr, 10)
      let memo = validMemos.find((m) => m.id === memoId)

      // If no exact match, return first valid memo with the requested ID
      // This ensures the modal always gets data even if IDs don't align
      if (!memo && validMemos[0]) {
        memo = Object.assign({}, validMemos[0], { id: memoId })
      }

      log('Memos', 'Individual memo by ID', { memoId, found: !!memo })
      fulfill(route, memo || { error: 'Memo not found' }, memo ? 200 : 404)
    },
  )
}

// ============================================================================
// TRANSACTION ROUTES
// ============================================================================

export interface TransactionMockOptions {
  transactions?: Transaction[]
  dailyIntervals?: DailyInterval[]
  transactionCount?: number
  dailyIntervalDays?: number
}

export async function mockTransactionRoutes(page: Page, options: TransactionMockOptions = {}) {
  const transactions =
    options.transactions || generateTransactionsArray(options.transactionCount || 100)
  const dailyIntervals =
    options.dailyIntervals || generateDailyIntervals(options.dailyIntervalDays || 30)

  // 1. Daily totals (for DailyIntervalLineChart) - HIGHEST PRIORITY
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/transactions') &&
      url.searchParams.get('dailyTotals') === 'true',
    (route) => {
      log('Transactions', 'Daily totals request')
      fulfill(route, dailyIntervals)
    },
  )

  // 2. Transaction count
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/transactions') &&
      url.searchParams.get('count') === 'true',
    (route) => {
      log('Transactions', 'Count request')
      fulfill(route, { count: transactions.length })
    },
  )

  // 3. Transactions by memoId
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/transactions') &&
      url.searchParams.has('memoId'),
    (route) => {
      const url = new URL(route.request().url())
      const memoId = url.searchParams.get('memoId')
      log('Transactions', 'By memoId', { memoId })
      fulfill(route, generateTransactionsArray(5, `Memo ${memoId}`))
    },
  )

  // 4. Budget category hierarchy sum
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/transactions') &&
      url.searchParams.get('budgetCategoryHierarchySum') === 'true',
    (route) => {
      log('Transactions', 'Budget category hierarchy sum')
      fulfill(route, generateBudgetCategoryHierarchy())
    },
  )

  // 5. Total amount debit (month/week)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/transactions') &&
      url.searchParams.get('totalAmountDebit') === 'true',
    (route) => {
      const url = new URL(route.request().url())
      const timeFrame = url.searchParams.get('timeFrame')
      const amount = timeFrame === 'week' ? -700 : -5000
      log('Transactions', 'Total amount debit', { timeFrame, amount })
      fulfill(route, [{ total_amount_debit: amount }])
    },
  )

  // 6. General transactions (catch-all for /transactions with query params)
  await page.route(
    (url) => {
      if (!isExecuteApiUrl(url)) return false
      if (!url.pathname.endsWith('/transactions')) return false
      // Don't catch requests already handled above
      if (url.searchParams.get('dailyTotals') === 'true') return false
      if (url.searchParams.get('count') === 'true') return false
      if (url.searchParams.has('memoId')) return false
      if (url.searchParams.get('budgetCategoryHierarchySum') === 'true') return false
      if (url.searchParams.get('totalAmountDebit') === 'true') return false
      return true
    },
    (route) => {
      const url = new URL(route.request().url())
      const timeFrame = url.searchParams.get('timeFrame')
      const date = url.searchParams.get('date')
      const limit = url.searchParams.get('limit')

      log('Transactions', 'General request', { timeFrame, date, limit })

      if (timeFrame === 'day' && date) {
        return fulfill(route, generateTransactionsArray(5, '', date))
      }

      if (timeFrame === 'week') {
        return fulfill(route, generateTransactionsArray(25))
      }

      fulfill(route, transactions)
    },
  )
}

// ============================================================================
// TIME INTERVAL ROUTES (days, weeks, months, years selects + summaries)
// ============================================================================

export async function mockTimeIntervalRoutes(page: Page) {
  // Transaction days (for date picker / chart)
  await page.route(
    (url) => isExecuteApiUrl(url) && url.pathname.endsWith('/transactions/days'),
    (route) => {
      const today = new Date()
      const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - (29 - i))
        return { day: date.toISOString().split('T')[0] }
      })
      log('TimeIntervals', 'Days', { count: days.length })
      fulfill(route, days)
    },
  )

  // Transaction weeks
  await page.route(
    (url) => isExecuteApiUrl(url) && url.pathname.endsWith('/transactions/weeks'),
    (route) => {
      log('TimeIntervals', 'Weeks')
      fulfill(route, generateWeeksArray())
    },
  )

  // Transaction months
  await page.route(
    (url) => isExecuteApiUrl(url) && url.pathname.endsWith('/transactions/months'),
    (route) => {
      log('TimeIntervals', 'Months')
      fulfill(route, generateMonthsArray())
    },
  )

  // Transaction years
  await page.route(
    (url) => isExecuteApiUrl(url) && url.pathname.endsWith('/transactions/years'),
    (route) => {
      log('TimeIntervals', 'Years')
      fulfill(route, generateYearsArray())
    },
  )

  // Week summary (/transactions/weeks/:week/summary)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.includes('/transactions/weeks/') &&
      url.pathname.endsWith('/summary'),
    (route) => {
      log('TimeIntervals', 'Week summary')
      fulfill(route, generateMonthSummaryArray(20))
    },
  )

  // Week days (/transactions/weeks/:week/days)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.includes('/transactions/weeks/') &&
      url.pathname.endsWith('/days'),
    (route) => {
      log('TimeIntervals', 'Week days')
      fulfill(route, [])
    },
  )

  // Month summary (/transactions/months/:month/summary)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.includes('/transactions/months/') &&
      url.pathname.endsWith('/summary'),
    (route) => {
      log('TimeIntervals', 'Month summary')
      fulfill(route, generateMonthSummaryArray())
    },
  )
}

// ============================================================================
// BUDGET CATEGORY ROUTES
// ============================================================================

export interface BudgetCategoryMockOptions {
  timeFrame?: 'day' | 'week' | 'month' | 'year'
  includeChildren?: boolean
  maxParentCategories?: number
  sourceId?: number
}

export async function mockBudgetCategoryRoutes(
  page: Page,
  options: BudgetCategoryMockOptions = {},
) {
  const { includeChildren = false, maxParentCategories = 5, sourceId = 1 } = options

  const budgetCategories = generateBudgetCategoryHierarchy({
    includeChildren,
    maxParentCategories,
    sourceId,
  })

  // Budget categories list
  await page.route(
    (url) => isExecuteApiUrl(url) && url.pathname.endsWith('/budget-categories'),
    (route) => {
      log('BudgetCategories', 'List request')
      fulfill(route, budgetCategories)
    },
  )

  // Budget category hierarchy sum (with timeFrame)
  await page.route(
    (url) =>
      isExecuteApiUrl(url) &&
      url.pathname.endsWith('/transactions') &&
      url.searchParams.get('budgetCategoryHierarchySum') === 'true',
    (route) => {
      const url = new URL(route.request().url())
      const requestTimeFrame = url.searchParams.get('timeFrame')
      log('BudgetCategories', 'Hierarchy sum', { timeFrame: requestTimeFrame })
      fulfill(route, budgetCategories)
    },
  )
}

// ============================================================================
// COMBINED HELPER
// ============================================================================

export interface CommonRoutesOptions extends TransactionMockOptions, MemoMockOptions {
  skipMemos?: boolean
  skipTransactions?: boolean
  skipTimeIntervals?: boolean
  skipBudgetCategories?: boolean
}

export async function mockCommonRoutes(page: Page, options: CommonRoutesOptions = {}) {
  const promises: Promise<void>[] = []

  if (!options.skipMemos) {
    promises.push(mockMemoRoutes(page, options))
  }

  if (!options.skipTransactions) {
    promises.push(mockTransactionRoutes(page, options))
  }

  if (!options.skipTimeIntervals) {
    promises.push(mockTimeIntervalRoutes(page))
  }

  if (!options.skipBudgetCategories) {
    promises.push(mockBudgetCategoryRoutes(page))
  }

  await Promise.all(promises)

  log('Common', 'All routes registered', {
    memos: !options.skipMemos,
    transactions: !options.skipTransactions,
    timeIntervals: !options.skipTimeIntervals,
    budgetCategories: !options.skipBudgetCategories,
  })
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility during migration)
// ============================================================================

/** @deprecated Use mockTransactionRoutes instead */
export const mockBasicTransactionRoutes = (page: Page, staticData?: Transaction[]) =>
  mockTransactionRoutes(page, { transactions: staticData })

/** @deprecated Use mockTransactionRoutes instead */
export const mockDailyIntervalRoutes = (page: Page, days = 30, staticData?: DailyInterval[]) =>
  mockTransactionRoutes(page, {
    dailyIntervals: staticData,
    dailyIntervalDays: days,
  })

/** @deprecated Use mockTransactionRoutes instead */
export const mockComprehensiveTransactionRoutes = (
  page: Page,
  staticTransactions: Transaction[],
  staticDailyIntervals: DailyInterval[],
) =>
  mockTransactionRoutes(page, {
    transactions: staticTransactions,
    dailyIntervals: staticDailyIntervals,
  })

/** @deprecated Use mockTimeIntervalRoutes instead */
export const mockTransactionsTableSelects = mockTimeIntervalRoutes

/**
 * Predefined memo configurations for common test scenarios
 */
export const MEMO_PRESETS = {
  weekly: {
    id: 1,
    name: 'Weekly Groceries',
    recurring: true,
    necessary: true,
    frequency: 'weekly',
    budget_category: 'Food & Dining',
    ambiguous: false,
    avatar_s3_url: undefined,
  },
  monthly: {
    id: 2,
    name: 'Monthly Groceries',
    recurring: true,
    necessary: true,
    frequency: 'monthly',
    budget_category: 'Food & Dining',
    ambiguous: false,
    avatar_s3_url: undefined,
  },
  basic: {
    id: 3,
    name: 'Basic Test Memo',
    recurring: false,
    necessary: false,
    frequency: undefined,
    budget_category: undefined,
    ambiguous: false,
    avatar_s3_url: undefined,
  },
} as const

/**
 * Predefined memo sets for search/autocomplete testing
 */
export const MEMO_SEARCH_DATASETS = {
  // Dataset with Coffee-related memos
  coffee: [
    {
      id: 101,
      name: 'Coffee Shop',
      budget_category: 'Food & Dining',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
    {
      id: 102,
      name: 'Coffee Beans',
      budget_category: 'Groceries',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
  ],
  // Dataset with Gas-related memos
  gas: [
    {
      id: 201,
      name: 'Gas Station',
      budget_category: 'Transportation',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
    {
      id: 202,
      name: 'Gas Utility',
      budget_category: 'Bills',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
  ],
  // Default dataset for general searches
  default: [
    {
      id: 1,
      name: 'Groceries',
      budget_category: 'Food',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
    {
      id: 2,
      name: 'Gas',
      budget_category: 'Transportation',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
    {
      id: 3,
      name: 'Coffee',
      budget_category: 'Food',
      recurring: false,
      necessary: false,
      frequency: null,
      ambiguous: false,
    },
  ],
  // Empty dataset for no-results tests
  empty: [],
} as const
