// mockTransactionsTableSelects.ts
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateDaysArray } from '@test/e2e/mocks/daysMock.ts'
import { generateWeeksArray } from '@test/e2e/mocks/weeksMock.ts'
import { generateMonthsArray } from '@test/e2e/mocks/monthsMock.ts'
import { generateYearsArray } from '@test/e2e/mocks/yearsMock.ts'
import type { Page } from '@playwright/test'

export async function mockTransactionsTableSelects(page: Page) {

  // CRITICAL FIX: Use more specific API patterns to avoid intercepting page navigation
  // AND ensure they work in both local and CI environments
  await page.route(`**/api/**/memos?limit=100&offset=0`, route => {
    console.log('[MOCK] Returning memos data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMemosArray()),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  })

  // CRITICAL FIX: Return multiple days to ensure chart can render properly
  // The DailyIntervalLineChart needs multiple data points to create a line chart
  await page.route(`**/api/**/transactions/days`, route => {
    const today = new Date()
    const days = []

    // Generate last 30 days to provide realistic data for chart rendering
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push({ day: date.toISOString().split('T')[0] })
    }

    console.log('[MOCK] Returning days data with', days.length, 'days for DailyIntervalLineChart')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(days),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  })

  await page.route(`**/api/**/transactions/weeks`, route => {
    console.log('[MOCK] Returning weeks data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateWeeksArray()),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  })

  await page.route(`**/api/**/transactions/months`, route => {
    console.log('[MOCK] Returning months data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMonthsArray()),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  })

  await page.route(`**/api/**/transactions/years`, route => {
    console.log('[MOCK] Returning years data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateYearsArray()),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  })
}