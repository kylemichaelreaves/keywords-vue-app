import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { setupMonthSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import { waitForElementUILoadingToComplete, waitForPageReady } from '@test/e2e/helpers/waitHelpers'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'

test.describe('Month Summary Page', () => {
  let transactionsPage: TransactionsPage
  let monthSummaryPage: MonthSummaryPage
  let selectedMonth: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    monthSummaryPage = new MonthSummaryPage(page)

    // Add route interceptor for budget category hierarchy sum request
    await page.route('**/transactions?budgetCategoryHierarchySum=true&timeFrame=month&date=*', async route => {
      const url = new URL(route.request().url())
      console.log('Intercepted budget category hierarchy request:', url.toString())

      const mockBudgetCategories = generateBudgetCategoryHierarchy({
        includeChildren: false,
        maxParentCategories: 5,
        sourceId: 1
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBudgetCategories)
      })
    })

    console.time('setting up monthSummaryMocks')
    await setupMonthSummaryMocks(page)
    console.timeEnd('setting up monthSummaryMocks')

    // Use comprehensive page ready waiting
    await transactionsPage.goto()
    await waitForPageReady(page)

    // Wait for Element UI components to be fully loaded
    await waitForElementUILoadingToComplete(page)

    // Use the transactions page method that includes proper Element UI waiting
    await transactionsPage.waitForTransactionsTableReady()

    // Select month with proper Element UI handling
    selectedMonth = await transactionsPage.selectFirstMonth()

    // Wait for navigation and Element UI loading to complete
    await page.waitForURL(/\/budget-visualizer\/transactions\/months\/.*\/summary/, { waitUntil: 'networkidle' })
    await waitForPageReady(page)
    await waitForElementUILoadingToComplete(page)

    // Ensure we're on the month summary page and it's fully loaded
    await monthSummaryPage.waitForSummaryTableReady()
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should display all month summary page elements correctly', async () => {
    // Check month title
    const title = await monthSummaryPage.getMonthTitle()
    expect(title).toContain('Month Summary for:' + ' ' + selectedMonth)

    // Check main table visibility
    await expect(monthSummaryPage.monthSummaryTable).toBeVisible()

    // Check budget categories summary component
    await expect(monthSummaryPage.budgetCategorySummaries).toBeVisible()

    // Check navigation button group visibility
    await expect(monthSummaryPage.navigationButtonGroup).toBeVisible()

    // Check that next month button is disabled when on the latest month
    const nextButton = monthSummaryPage.navigationButtonGroup.getByRole('button', { name: 'Next Month' })
    expect(await nextButton.isDisabled()).toBeTruthy()
  })

  test('should handle reset button click', async () => {
    await monthSummaryPage.clickResetButton()
    await monthSummaryPage.page.waitForURL('/budget-visualizer/transactions', { waitUntil: 'networkidle' })
    await expect(transactionsPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
    // the monthSelect should be reset when we're back on the TransactionsPage
    const monthSelect = await transactionsPage.getMonthSelectValue()
    expect(monthSelect).toBe('')
  })

  test('right clicking on a table row opens the memo edit modal', async () => {
    await monthSummaryPage.expectMemoEditModalHidden()
    await monthSummaryPage.rightClickOnTableRow(1)
    await monthSummaryPage.expectMemoEditModalVisible()
    await monthSummaryPage.expectMemoEditFormVisible()
    await monthSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    await monthSummaryPage.closeMemoEditModal()
    await monthSummaryPage.expectMemoEditModalHidden()
  })
})
