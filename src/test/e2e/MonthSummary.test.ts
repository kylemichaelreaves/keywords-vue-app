import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { setupMonthSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import { logSpinnersAndWait, waitForSpinnersToDisappear } from '@test/e2e/helpers/waitHelpers'
import {
  MEMO_PRESETS,
  setupBudgetCategoryHierarchyInterceptor,
  setupMemoRouteInterceptor
} from '@test/e2e/helpers/memoRouteHelper'

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
    await setupBudgetCategoryHierarchyInterceptor(page, { timeFrame: 'month' })

    // Simplified setup with comprehensive spinner waiting
    await transactionsPage.goto()
    // await waitForPageReady(page)
    // await waitForSpinnersToDisappear(page) // Wait for initial page spinners

    // Select month and navigate
    selectedMonth = await transactionsPage.selectFirstMonth()

    // Wait for navigation and all spinners to disappear
    await page.waitForURL(/\/budget-visualizer\/transactions\/months\/.*\/summary/, { waitUntil: 'domcontentloaded' })
    // await waitForSpinnersToDisappear(page) // Critical for CI - wait for all spinners
    // await logSpinnersAndWait(monthSummaryPage.page)

    await monthSummaryPage.monthSummaryTable.waitFor({ state: 'visible' })
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should display all month summary page elements correctly', async () => {
    await logSpinnersAndWait(monthSummaryPage.page)
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
    await logSpinnersAndWait(monthSummaryPage.page)
    await monthSummaryPage.clickResetButton()
    await monthSummaryPage.page.waitForURL('/budget-visualizer/transactions', { waitUntil: 'networkidle' })
    await expect(transactionsPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
    // the monthSelect should be reset when we're back on the TransactionsPage
    const monthSelect = await transactionsPage.getMonthSelectValue()
    expect(monthSelect).toBe('')
  })

  test('right clicking on a table row opens the memo edit modal', async ({ page }) => {
    await logSpinnersAndWait(monthSummaryPage.page)

    await setupMemoRouteInterceptor(page, MEMO_PRESETS.monthly, true)

    // Wait for all spinners to disappear before interaction
    await waitForSpinnersToDisappear(page)
    await monthSummaryPage.waitForSummaryTableReady()

    // Final spinner check before right-click
    await waitForSpinnersToDisappear(page)

    await monthSummaryPage.expectMemoEditModalHidden()
    await monthSummaryPage.rightClickOnTableRow(1)
    await page.waitForLoadState('networkidle')
    await monthSummaryPage.expectMemoEditModalVisible()
    await monthSummaryPage.expectMemoEditFormVisible()
    await monthSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    await monthSummaryPage.closeMemoEditModal()
    await page.waitForLoadState('networkidle')
    await monthSummaryPage.expectMemoEditModalHidden()
  })
})
