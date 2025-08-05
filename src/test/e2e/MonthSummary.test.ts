import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { setupMonthSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import { waitForLoadingToComplete } from '@test/e2e/helpers/waitHelpers'
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

      // Use the budget categories mock generator instead of hardcoded data
      const mockBudgetCategories = generateBudgetCategoryHierarchy({
        includeChildren: false, // Only parent categories for summary
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

    await transactionsPage.goto()
    // Wait for page to be fully loaded before interactions
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')

    await transactionsPage.monthSelect.click()
    // Wait for options to be visible before trying to get text
    await page.getByRole('option').first().waitFor({ state: 'visible' })

    const firstMonth = await transactionsPage.page.getByRole('option').first().textContent() ?? ''
    const firstOption = transactionsPage.page.getByRole('option', { name: firstMonth }).first()

    selectedMonth = firstMonth
    await firstOption.click()
    // Wait for navigation to summary page after selecting month
    await page.waitForURL(/\/budget-visualizer\/transactions\/months\/.*\/summary/, { waitUntil: 'networkidle' })

    // Wait for any loading to complete before proceeding
    await waitForLoadingToComplete(page)

    // Use the base class method that includes Element UI-aware waiting
    await monthSummaryPage.expectTableVisible()
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
