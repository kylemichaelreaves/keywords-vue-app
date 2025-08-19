// mockTransactionsTableSelects.ts
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateDaysArray } from '@test/e2e/mocks/daysMock.ts'
import { generateWeeksArray } from '@test/e2e/mocks/weeksMock.ts'
import { generateMonthsArray } from '@test/e2e/mocks/monthsMock.ts'
import { generateYearsArray } from '@test/e2e/mocks/yearsMock.ts'
import type { Page } from '@playwright/test'

export async function mockTransactionsTableSelects(page: Page) {
  // mock the transaction selects
  await page.route('**/memos?limit=100&offset=0', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMemosArray())
    })
  })

  // CRITICAL FIX: Return days with at least one entry to prevent firstDay from blocking chart
  // but ensure the store doesn't auto-select it
  await page.route('**/transactions/days', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]) // Keep empty to ensure chart shows in aggregate view
    })
  })

  await page.route('**/transactions/weeks', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateWeeksArray())
    })
  })

  await page.route('**/transactions/months', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMonthsArray())
    })
  })

  await page.route('**/transactions/years', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateYearsArray())
    })
  })
}