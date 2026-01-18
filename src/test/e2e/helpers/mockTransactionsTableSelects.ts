// mockTransactionsTableSelects.ts
import { generateMemosArray } from '@test/e2e/mocks/memosMock.ts'
import { generateWeeksArray } from '@test/e2e/mocks/weeksMock.ts'
import { generateMonthsArray } from '@test/e2e/mocks/monthsMock.ts'
import { generateYearsArray } from '@test/e2e/mocks/yearsMock.ts'
import type { Page } from '@playwright/test'

export async function mockTransactionsTableSelects(page: Page) {
  // Mock filtered memo search requests (for remote filtering scenarios)
  await page.route('**/memos?**', async route => {
    const url = new URL(route.request().url())
    const searchName = url.searchParams.get('name') || url.searchParams.get('memoName')
    
    // If there's a search parameter, filter the memos
    if (searchName) {
      console.log('[MOCK] Filtering memos by name:', searchName)
      
      const allMemos = generateMemosArray()
      const filteredMemos = allMemos.filter(memo => 
        memo.name.toLowerCase().includes(searchName.toLowerCase())
      )
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filteredMemos),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    } else {
      // Handle base memos endpoint without search parameters
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
    }
  })

  await Promise.all([

    // CRITICAL FIX: Return multiple days to ensure chart can render properly
    // The DailyIntervalLineChart needs multiple data points to create a line chart
    await page.route(`**/transactions/days`, route => {
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
    }),

    await page.route(`**/transactions/weeks`, route => {
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
    }),

    await page.route(`**/transactions/months`, route => {
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
    }),

    await page.route(`**/transactions/years`, route => {
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
  ])
}