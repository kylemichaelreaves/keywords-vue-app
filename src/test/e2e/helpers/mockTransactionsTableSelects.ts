// test-utils.js
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

  await page.route('**/transactions/days', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateDaysArray())
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