import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { setupWeekSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import {
  MEMO_PRESETS,
  mockMemoRoutes,
  mockBudgetCategoryRoutes,
} from '@test/e2e/helpers/mockCommonRoutes'
import { Timeframe } from '@types'

test.describe('Week Summary Table', () => {
  let transactionsPage: TransactionsPage
  let weekSummaryPage: WeekSummaryPage
  let selectedWeek: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    weekSummaryPage = new WeekSummaryPage(page)

    await setupWeekSummaryMocks(page)
    await mockMemoRoutes(page, { memos: [MEMO_PRESETS.basic] })
    await mockBudgetCategoryRoutes(page, { timeFrame: Timeframe.Week })

    await transactionsPage.goto()
    selectedWeek = await transactionsPage.selectFirstWeek()

    await page.waitForURL(/\/budget-visualizer\/transactions\/weeks\/.*\/summary/, {
      waitUntil: 'domcontentloaded',
    })
    await weekSummaryPage.expectTableHasData()
  })

  test('should display the week summary table elements correctly', async () => {
    await weekSummaryPage.expectTableVisible()
    const weekTitle = await weekSummaryPage.getWeekTitle()
    expect(weekTitle).toContain(selectedWeek)

    // Check that next week button is disabled when on the latest week
    const nextButton = weekSummaryPage.navigationButtonGroup.getByRole('button', {
      name: 'Next Week',
    })
    expect(await nextButton.isDisabled()).toBeTruthy()
  })

  test('should reset the week when reset button is clicked', async () => {
    await weekSummaryPage.clickResetButton()
    await weekSummaryPage.page.waitForURL('/budget-visualizer/transactions', {
      waitUntil: 'networkidle',
    })
    const weekSelectValue = await transactionsPage.getWeekSelectValue()
    expect(weekSelectValue).toBe('')
  })

  test('memo edit modal workflow: open, display content, and close', async ({ page }) => {
    // Set up the memo route interceptor for weekly preset
    await mockMemoRoutes(page, { memos: [MEMO_PRESETS.weekly] })

    await weekSummaryPage.expectMemoEditModalHidden()

    // Wait for the memo request to be made and responded to
    // Updated to match execute-api pattern
    // const responsePromise = page.waitForResponse(
    //   (response) =>
    //     response.url().includes('execute-api') &&
    //     response.url().includes('/memos/') &&
    //     response.status() === 200,
    //   { timeout: 15000 }
    // )

    await weekSummaryPage.rightClickOnTableRow(1)

    // Wait for modal to be visible
    await weekSummaryPage.expectMemoEditModalVisible()

    // // Wait for the memo response to complete
    // await responsePromise

    // Now check if the form is visible
    await weekSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    await weekSummaryPage.expectMemoEditFormVisible()

    await weekSummaryPage.closeMemoEditModal()
    await weekSummaryPage.expectMemoEditModalHidden()
  })
})
