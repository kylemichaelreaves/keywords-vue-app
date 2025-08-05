import type { Page } from '@playwright/test'

export interface MockMemoOptions {
  id?: number
  name?: string
  recurring?: boolean
  necessary?: boolean
  frequency?: string | null
  budget_category?: string | null
  ambiguous?: boolean
  avatar_s3_url?: string | null
}

/**
 * Default memo mock data
 */
const DEFAULT_MEMO: MockMemoOptions = {
  id: 1,
  name: "Test Memo",
  recurring: false,
  necessary: false,
  frequency: null,
  budget_category: null,
  ambiguous: false,
  avatar_s3_url: null
}

/**
 * Creates a memo route interceptor with customizable mock data
 */
export async function setupMemoRouteInterceptor(
  page: Page, 
  options: MockMemoOptions = {},
  clearExisting: boolean = false
) {
  // Clear existing route handlers if requested
  if (clearExisting) {
    await page.unroute('**/memos/*')
  }

  const mockMemo = { ...DEFAULT_MEMO, ...options }

  await page.route('**/memos/*', async route => {
    const url = new URL(route.request().url())
    console.log('Intercepted memo request:', url.toString())

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([mockMemo]) // Always return as array for consistency
    })
  })
}

/**
 * Predefined memo configurations for common test scenarios
 */
export const MEMO_PRESETS = {
  weekly: {
    name: "Weekly Groceries",
    recurring: true,
    necessary: true,
    frequency: "weekly",
    budget_category: "Food & Dining"
  },
  monthly: {
    name: "Monthly Groceries",
    recurring: true,
    necessary: true,
    frequency: "monthly",
    budget_category: "Food & Dining"
  },
  basic: {
    name: "Basic Test Memo",
    recurring: false,
    necessary: false,
    frequency: null,
    budget_category: null
  }
} as const
