import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { setupWeekSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import {
  debugTableLoadingState, logSpinnersAndWait,
  waitForPageReady,
  waitForSpinnersToDisappear
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

    // Simplified setup with comprehensive spinner waiting
    await transactionsPage.goto()
    // await waitForPageReady(page)
    // await waitForSpinnersToDisappear(page) // Wait for initial page spinners

    // Select week and navigate
    selectedWeek = await transactionsPage.selectFirstWeek()

    // Wait for navigation and all spinners to disappear
    await page.waitForURL(/\/budget-visualizer\/transactions\/weeks\/.*\/summary/, { waitUntil: 'domcontentloaded' })
    // await logSpinnersAndWait(weekSummaryPage.page)
    await weekSummaryPage.weekSummaryTable.waitFor({ state: 'visible' })
  })

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should display the week summary table elements correctly', async () => {
    await logSpinnersAndWait(weekSummaryPage.page)
    await weekSummaryPage.expectTableVisible()
    const weekTitle = await weekSummaryPage.getWeekTitle()
    expect(weekTitle).toContain(selectedWeek)
    await weekSummaryPage.page.getByRole('button', { name: 'Next Week' }).isDisabled()
  })

  test('should reset the week when reset button is clicked', async () => {
    await logSpinnersAndWait(weekSummaryPage.page)
    await weekSummaryPage.clickResetButton()
    await weekSummaryPage.page.waitForURL('/budget-visualizer/transactions', { waitUntil: 'networkidle' })
    const weekSelectValue = await transactionsPage.getWeekSelectValue()
    expect(weekSelectValue).toBe('')
  })


  test('memo edit modal workflow: open, display content, and close', async ({ page }) => {
    await logSpinnersAndWait(weekSummaryPage.page)

    await setupMemoRouteInterceptor(page, MEMO_PRESETS.weekly, true)

    // Wait for all spinners to disappear before interaction
    await waitForSpinnersToDisappear(page)
    await debugTableLoadingState(page, 'week-summary-table')

    await weekSummaryPage.expectMemoEditModalHidden()
    await weekSummaryPage.waitForSummaryTableReady()

    // Final spinner check before right-click
    await waitForSpinnersToDisappear(page)
    await debugTableLoadingState(page, 'week-summary-table')

    await weekSummaryPage.rightClickOnTableRow(1)
    await weekSummaryPage.expectMemoEditModalVisible()
    await weekSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    await weekSummaryPage.expectMemoEditFormVisible()

    await weekSummaryPage.closeMemoEditModal()
    await weekSummaryPage.expectMemoEditModalHidden()
  })
})