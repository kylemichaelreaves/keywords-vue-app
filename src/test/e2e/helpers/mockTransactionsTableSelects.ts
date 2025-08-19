// mockTransactionsTableSelects.ts
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateDaysArray } from '@test/e2e/mocks/daysMock.ts'
import { generateWeeksArray } from '@test/e2e/mocks/weeksMock.ts'
import { generateMonthsArray } from '@test/e2e/mocks/monthsMock.ts'
import { generateYearsArray } from '@test/e2e/mocks/yearsMock.ts'
import type { Page } from '@playwright/test'

export async function mockTransactionsTableSelects(page: Page) {
  // SECURITY FIX: No hardcoded API URLs - must be provided via environment variable
  const apiGatewayUrl = process.env.VITE_APIGATEWAY_URL

  if (!apiGatewayUrl) {
    throw new Error('VITE_APIGATEWAY_URL environment variable is required for API mocking')
  }

  console.log('[MOCK DEBUG] Using API Gateway URL for selects:', apiGatewayUrl)

  await page.route(`${apiGatewayUrl}/memos?limit=100&offset=0`, route => {
    console.log('[MOCK] Returning memos data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMemosArray())
    })
  })

  // CRITICAL FIX: Return multiple days to ensure chart can render properly
  // The DailyIntervalLineChart needs multiple data points to create a line chart
  await page.route(`${apiGatewayUrl}/transactions/days`, route => {
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
      body: JSON.stringify(days)
    })
  })

  await page.route(`${apiGatewayUrl}/transactions/weeks`, route => {
    console.log('[MOCK] Returning weeks data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateWeeksArray())
    })
  })

  await page.route(`${apiGatewayUrl}/transactions/months`, route => {
    console.log('[MOCK] Returning months data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateMonthsArray())
    })
  })

  await page.route(`${apiGatewayUrl}/transactions/years`, route => {
    console.log('[MOCK] Returning years data for select dropdown')
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(generateYearsArray())
    })
  })
}