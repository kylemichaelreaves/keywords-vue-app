import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { setupWeekSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import { debugTableLoadingState, waitForElementUILoadingToComplete, waitForPageReady } from '@test/e2e/helpers/waitHelpers.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'
import { setupMemoRouteInterceptor, MEMO_PRESETS } from '@test/e2e/helpers/memoRouteHelper'

test.describe('Week Summary Table', () => {
  let transactionsPage: TransactionsPage
  let weekSummaryPage: WeekSummaryPage
  let selectedWeek: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    weekSummaryPage = new WeekSummaryPage(page)

    console.time('setting up weekSummaryMocks')
    await setupWeekSummaryMocks(page)
    console.timeEnd('setting up weekSummaryMocks')

    // DRY: Use reusable memo route helper
    await setupMemoRouteInterceptor(page, MEMO_PRESETS.basic)

    // Add route interceptor for budget category hierarchy sum request
    await page.route('**/transactions?budgetCategoryHierarchySum=true&timeFrame=week&date=*', async route => {
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

    // Use comprehensive page ready waiting
    await transactionsPage.goto()
    await waitForPageReady(page)

    // Wait for Element UI components to be fully loaded
    await waitForElementUILoadingToComplete(page)

    // Use the transactions page method that includes proper Element UI waiting
    await transactionsPage.waitForTransactionsTableReady()

    // Select week with proper Element UI handling
    selectedWeek = await transactionsPage.selectFirstWeek()

    // Wait for navigation and Element UI loading to complete
    await waitForPageReady(page)
    await waitForElementUILoadingToComplete(page)

    // Ensure we're on the week summary page and it's fully loaded
    await weekSummaryPage.waitForSummaryTableReady()
  })

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should display the week summary table elements correctly', async () => {
    await weekSummaryPage.expectTableVisible()
    const weekTitle = await weekSummaryPage.getWeekTitle()
    expect(weekTitle).toContain(selectedWeek)
    await weekSummaryPage.page.getByRole('button', { name: 'Next Week' }).isDisabled()
  })

  test('should reset the week when reset button is clicked', async () => {
    await weekSummaryPage.clickResetButton()
    await weekSummaryPage.page.waitForURL('/budget-visualizer/transactions', { waitUntil: 'networkidle' })
    const weekSelectValue = await transactionsPage.getWeekSelectValue()
    expect(weekSelectValue).toBe('')
  })


  test('memo edit modal workflow: open, display content, and close', async ({ page }) => {
    // DRY: Use reusable memo route helper with specific preset and clear existing routes
    await setupMemoRouteInterceptor(page, MEMO_PRESETS.weekly, true)

    await debugTableLoadingState(page, 'week-summary-table')

    // Initially hidden
    await weekSummaryPage.expectMemoEditModalHidden()

    // Wait for the week summary table to be ready with comprehensive loading checks
    await weekSummaryPage.waitForSummaryTableReady()
    await waitForElementUILoadingToComplete(page)

    await debugTableLoadingState(page, 'week-summary-table')

    // Right click opens modal with correct content
    await weekSummaryPage.rightClickOnTableRow(1)
    await weekSummaryPage.expectMemoEditModalVisible()
    await weekSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    await weekSummaryPage.expectMemoEditFormVisible()

    // Closing hides modal
    await weekSummaryPage.closeMemoEditModal()
    await weekSummaryPage.expectMemoEditModalHidden()
  })
})