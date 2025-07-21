import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { generateMonthSummaryArray } from '@test/e2e/mocks/monthSummaryMock.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'
import { generateDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { mockTransactionsTableSelects } from '@test/e2e/helpers/mockTransactionsTableSelects.ts'

test.describe('Month Summary Page', () => {
  let transactionsPage: TransactionsPage
  let monthSummaryPage: MonthSummaryPage
  let selectedMonth: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    monthSummaryPage = new MonthSummaryPage(page)


    // mock transactions?limit=100&offset=0&timeFrame=year
    await page.route('**/transactions?limit=100&offset=0&timeFrame=year', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(100))
      })
    })

    // mock /transactions?limit=100&offset=0&timeFrame=month&date=2025-06-01T00:00:00.000Z
    await page.route('**/transactions?limit=*&offset=0&timeFrame=month&date=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(100))
      })
    })

    // mock the transactions count
    await page.route('**/transactions?count=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 200 })
      })
    })

    // mock the total_amount_debit for the month
    await page.route(url => {
      const urlObj = new URL(url)
      return urlObj.pathname.endsWith('/transactions') &&
        urlObj.searchParams.get('timeFrame') === 'month' &&
        urlObj.searchParams.get('totalAmountDebit') === 'true' &&
        urlObj.searchParams.has('date')
    }, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          [{ total_amount_debit: -5000 }]
        )
      })
    })

    // mock the budgetCategorySummaries
    await page.route('**/transactions?budgetCategoryHierarchySum=true&timeFrame=month&date*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateBudgetCategoryHierarchy())
      })
    })

    // mock the daily total intervals, with and without date
    await page.route('**/transactions?dailyTotals=true&interval=1+months', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateDailyIntervals(30))
      })
    })

    await page.route('**/transactions?dailyTotals=true&interval=1+months&date=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateDailyIntervals(30))
      })
    })

    // TODO need to figure out why httpClient is generating the params in this order
    // transactions?interval=1+months&dailyTotals=true
    await page.route('**/transactions?interval=1+months&dailyTotals=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateDailyIntervals(30))
      })
    })

    // mock the month summary
    await page.route('**/transactions/months/*/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateMonthSummaryArray())
      })
    })

    // mock transactions table selects
    await mockTransactionsTableSelects(page)


    await transactionsPage.goto()

    await transactionsPage.monthSelect.click()
    const firstMonth = await transactionsPage.page.getByRole('option').first().textContent() ?? ''

    const firstOption = transactionsPage.page.getByRole('option', { name: firstMonth }).first()

    selectedMonth = firstMonth

    await firstOption.click()

    await monthSummaryPage.page.waitForLoadState('networkidle')
  })

  test('should display the month title', async () => {
    await monthSummaryPage.monthSummaryTable.waitFor({ state: 'visible' })
    const title = await monthSummaryPage.getMonthTitle()
    expect(title).toContain('Month Summary for:' + ' ' + selectedMonth)
  })

  test('should display the month summary table', async () => {
    await monthSummaryPage.monthSummaryTable.waitFor({ state: 'visible' })
    expect(await monthSummaryPage.expectTableVisible()).toBeTruthy()
  })

  test('should display the budget categories summary component', async () => {
    await monthSummaryPage.budgetCategorySummaries.waitFor({ state: 'visible' })
    await expect(monthSummaryPage.budgetCategorySummaries).toBeVisible()
  })

  test('the navigation button group should be visible', async () => {
    await monthSummaryPage.navigationButtonGroup.waitFor({ state: 'visible' })
    await expect(monthSummaryPage.navigationButtonGroup).toBeVisible()
  })

  test('the next month button should be disabled when on the latest month', async () => {
    await monthSummaryPage.navigationButtonGroup.waitFor({ state: 'visible' })
    const nextButton = monthSummaryPage.navigationButtonGroup.getByRole('button', { name: 'Next Month' })
    expect(await nextButton.isDisabled()).toBeTruthy()
  })

  test('should handle reset button click', async () => {
    await monthSummaryPage.clickResetButton()

    // waitFor
    await transactionsPage.page.waitForLoadState('networkidle')

    await expect(transactionsPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
    // the monthSelect should be reset when we're back on the TransactionsPage
    const monthSelect = await transactionsPage.getMonthSelectValue()
    expect(monthSelect).toBe('')
  })
})
