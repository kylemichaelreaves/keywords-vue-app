import type { Page } from '@playwright/test'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock'
import type { BudgetCategoryHierarchyOptions, MockMemoOptions } from '@types'

/**
 * Default memo mock data
 */
const DEFAULT_MEMO: MockMemoOptions = {
  id: 1,
  name: 'Test Memo',
  recurring: false,
  necessary: false,
  frequency: null,
  budget_category: null,
  ambiguous: false,
  avatar_s3_url: null,
}

/**
 * Creates a memo route interceptor with customizable mock data
 */
export async function setupMemoRouteInterceptor(
  page: Page,
  options: MockMemoOptions = {},
  clearExisting: boolean = false,
) {
  // Clear existing route handlers if requested
  if (clearExisting) {
    await page.unroute('**/execute-api.*/*/memos/*')
  }

  const mockMemo = { ...DEFAULT_MEMO, ...options }

  await page.route('**/execute-api.*/*/memos/*', async (route) => {
    const url = new URL(route.request().url())
    console.log('Intercepted memo request:', url.toString())

    // CRITICAL: Skip if this is a component file request
    if (url.pathname.includes('/src/')) {
      await route.continue()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([mockMemo]), // Always return as array for consistency
    })
  })
}

/**
 * Creates a budget category hierarchy route interceptor
 */
export async function setupBudgetCategoryHierarchyInterceptor(
  page: Page,
  options: BudgetCategoryHierarchyOptions,
  clearExisting: boolean = false,
) {
  const { timeFrame, includeChildren = false, maxParentCategories = 5, sourceId = 1 } = options

  // Clear existing route handlers if requested
  if (clearExisting) {
    await page.unroute(
      `**/execute-api.*/*/transactions?budgetCategoryHierarchySum=true&timeFrame=${timeFrame}&date=*`,
    )
  }

  await page.route(
    `**/execute-api.*/*/transactions?budgetCategoryHierarchySum=true&timeFrame=${timeFrame}&date=*`,
    async (route) => {
      const url = new URL(route.request().url())
      console.log(`Intercepted budget category hierarchy request (${timeFrame}):`, url.toString())

      const mockBudgetCategories = generateBudgetCategoryHierarchy({
        includeChildren,
        maxParentCategories,
        sourceId,
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBudgetCategories),
      })
    },
  )
}

/**
 * Predefined memo configurations for common test scenarios
 */
export const MEMO_PRESETS = {
  weekly: {
    name: 'Weekly Groceries',
    recurring: true,
    necessary: true,
    frequency: 'weekly',
    budget_category: 'Food & Dining',
  },
  monthly: {
    name: 'Monthly Groceries',
    recurring: true,
    necessary: true,
    frequency: 'monthly',
    budget_category: 'Food & Dining',
  },
  basic: {
    name: 'Basic Test Memo',
    recurring: false,
    necessary: false,
    frequency: null,
    budget_category: null,
  },
} as const
