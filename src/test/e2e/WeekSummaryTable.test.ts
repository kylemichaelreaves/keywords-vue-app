import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { setupWeekSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import {
  debugTableLoadingState,
  waitForElementUILoadingToComplete,
  waitForPageReady
} from '@test/e2e/helpers/waitHelpers.ts'
import {
  MEMO_PRESETS,
  setupBudgetCategoryHierarchyInterceptor,
  setupMemoRouteInterceptor
} from '@test/e2e/helpers/memoRouteHelper'

test.describe('Week Summary Table', () => {
  let transactionsPage: TransactionsPage
  let weekSummaryPage: WeekSummaryPage
  let selectedWeek: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    weekSummaryPage = new WeekSummaryPage(page)

    await setupWeekSummaryMocks(page)
    await setupMemoRouteInterceptor(page, MEMO_PRESETS.basic)
    await setupBudgetCategoryHierarchyInterceptor(page, { timeFrame: 'week' })

    // Simplified setup - reduce redundant waits
    await transactionsPage.goto()
    await waitForPageReady(page) // This includes networkidle

    // Select week and navigate
    selectedWeek = await transactionsPage.selectFirstWeek()

    // Single comprehensive wait for the summary page
    await page.waitForURL(/\/budget-visualizer\/transactions\/weeks\/.*\/summary/, { waitUntil: 'networkidle' })
    await weekSummaryPage.waitForSummaryTableReady() // This includes Element UI loading
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