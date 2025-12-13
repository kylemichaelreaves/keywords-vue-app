import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { setupMonthSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import {
  MEMO_PRESETS,
  setupBudgetCategoryHierarchyInterceptor,
  setupMemoRouteInterceptor,
} from '@test/e2e/helpers/memoRouteHelper'
import { Timeframe } from '@types'

test.describe('Month Summary Page', () => {
  let transactionsPage: TransactionsPage
  let monthSummaryPage: MonthSummaryPage
  let selectedMonth: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    monthSummaryPage = new MonthSummaryPage(page)

    // Setup all mocks first
    await setupMonthSummaryMocks(page)
    await setupMemoRouteInterceptor(page, MEMO_PRESETS.basic)
    await setupBudgetCategoryHierarchyInterceptor(page, { timeFrame: Timeframe.Month })

    // Navigate and select month
    await transactionsPage.goto()
    selectedMonth = await transactionsPage.selectFirstMonth()

    // Wait for navigation and content to be ready
    await page.waitForURL(/\/budget-visualizer\/transactions\/months\/.*\/summary/, {
      waitUntil: 'domcontentloaded',
    })
    await monthSummaryPage.expectTableHasData() // Wait for actual content instead of spinners
  })

  test('should display all month summary page elements correctly', async () => {
    // Check month title
    const title = await monthSummaryPage.getMonthTitle()
    expect(title).toContain('Month Summary for:')
    expect(title).toContain(selectedMonth)
    // Check main table visibility with content
    await expect(monthSummaryPage.monthSummaryTable).toBeVisible()
    // Check budget categories summary component
    await expect(monthSummaryPage.budgetCategorySummaries).toBeVisible()
    // Check navigation button group visibility
    await expect(monthSummaryPage.navigationButtonGroup).toBeVisible()
    // Check that next month button is disabled when on the latest month
    const nextButton = monthSummaryPage.navigationButtonGroup.getByRole('button', {
      name: 'Next Month',
    })
    expect(await nextButton.isDisabled()).toBeTruthy()
  })

  test('should handle reset button click', async () => {
    await monthSummaryPage.clickResetButton()
    await monthSummaryPage.page.waitForURL('/budget-visualizer/transactions', {
      waitUntil: 'networkidle',
    })
    await expect(transactionsPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
    // the monthSelect should be reset when we're back on the TransactionsPage
    const monthSelect = await transactionsPage.getMonthSelectValue()
    expect(monthSelect).toBe('')
  })

  test('right clicking on a table row opens the memo edit modal', async ({ page }) => {
    // Set up the memo route interceptor with better timing and logging
    await setupMemoRouteInterceptor(page, MEMO_PRESETS.monthly, true)

    await monthSummaryPage.expectMemoEditModalHidden()

    // Wait for the memo request to be made and responded to
    // const responsePromise = page.waitForResponse(response =>
    //   response.url().includes('/memos/') && response.status() === 200
    // )

    await monthSummaryPage.rightClickOnTableRow(1)

    // Wait for modal to be visible before checking for form
    await monthSummaryPage.expectMemoEditModalVisible()
    // Wait for the memo response to complete
    // const response = await responsePromise

    // Now check if the form is visible
    try {
      await monthSummaryPage.expectMemoEditFormVisible()
      await monthSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    } catch (error) {
      // If form isn't visible, log the current state for debugging
      const modalContent = await page.locator('[data-testid="memo-edit-dialog"]').textContent()
      console.log('Modal content:', modalContent)
      throw error
    }

    await monthSummaryPage.closeMemoEditModal()
    await monthSummaryPage.expectMemoEditModalHidden()
  })
})
