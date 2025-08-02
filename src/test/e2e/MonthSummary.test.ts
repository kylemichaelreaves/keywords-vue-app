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

    // mock transactions?dailyTotals=true&interval=1+month&date=2025-07-01
    await page.route('**/transactions?dailyTotals=true&interval=1+month&date=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateDailyIntervals(30))
      })
    })

    // mock budget-categories?flatten=false
    await page.route('**/budget-categories?flatten=false', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateBudgetCategoryHierarchy())
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

    // mock individual memo API calls for the context menu functionality
    await page.route('**/memos/*', async route => {
      const url = new URL(route.request().url())
      const memoName = url.pathname.split('/').pop()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 1,
          name: memoName,
          budget_category: 'Groceries',
          total_amount_debit: -150.00,
          necessary: true,
          recurring: false,
          frequency: null,
          ambiguous: false
        }])
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
    const title = await monthSummaryPage.getMonthTitle()
    expect(title).toContain('Month Summary for:' + ' ' + selectedMonth)
  })

  test('should display the month summary table', async () => {
    await expect(monthSummaryPage.monthSummaryTable).toBeVisible()
  })

  test('should display the budget categories summary component', async () => {
    await expect(monthSummaryPage.budgetCategorySummaries).toBeVisible()
  })

  test('the navigation button group should be visible', async () => {
    await expect(monthSummaryPage.navigationButtonGroup).toBeVisible()
  })

  test('the next month button should be disabled when on the latest month', async () => {
    const nextButton = monthSummaryPage.navigationButtonGroup.getByRole('button', { name: 'Next Month' })
    expect(await nextButton.isDisabled()).toBeTruthy()
  })

  test('should handle reset button click', async () => {
    await monthSummaryPage.clickResetButton()

    await expect(transactionsPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
    // the monthSelect should be reset when we're back on the TransactionsPage
    const monthSelect = await transactionsPage.getMonthSelectValue()
    expect(monthSelect).toBe('')
  })

  test.describe('Memo Edit Context Menu', () => {
    test('right clicking on a table row opens the memo edit modal', async () => {
      // Initially, modal should be hidden
      await monthSummaryPage.expectMemoEditModalHidden()
      await monthSummaryPage.rightClickOnTableRow(0)
      await monthSummaryPage.expectMemoEditModalVisible()
      await monthSummaryPage.expectMemoEditFormVisible()
      await monthSummaryPage.expectMemoEditFormTitle('Edit Memo:')
      await monthSummaryPage.closeMemoEditModal()
      await monthSummaryPage.expectMemoEditModalHidden()
    })
  })
})
