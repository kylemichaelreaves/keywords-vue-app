import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { setupWeekSummaryMocks } from '@test/e2e/helpers/setupTestMocks'

test.describe('Week Summary Table', () => {
  let transactionsPage: TransactionsPage
  let weekSummaryPage: WeekSummaryPage
  let selectedWeek: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    weekSummaryPage = new WeekSummaryPage(page)

    await setupWeekSummaryMocks(page)

    await transactionsPage.goto()
    // click on week select
    await transactionsPage.weekSelect.click()
    // wait for the week select options to be visible
    await transactionsPage.page.getByRole('option').first().waitFor({ state: 'visible' })
    // get the text content of the first option
    const firstWeekText = await transactionsPage.page.getByRole('option').first().textContent() ?? ''
    const firstOption = transactionsPage.page.getByRole('option', { name: firstWeekText }).first()

    selectedWeek = await firstOption.textContent() ?? null

    await firstOption.click()

    // Wait for navigation to summary page after selecting week
    await page.waitForURL(/\/budget-visualizer\/transactions\/weeks\/.*\/summary/)

    // Wait for the page to fully load after navigation
    await page.waitForLoadState('networkidle')

    // Wait for the summary table to be visible before proceeding
    await weekSummaryPage.weekSummaryTable.waitFor({ state: 'visible' })
  })

  test('should display the week summary table', async () => {
    await weekSummaryPage.expectTableVisible()
  })

  test('should show selected week in the title header', async () => {
    const weekTitle = await weekSummaryPage.getWeekTitle()
    expect(weekTitle).toContain(selectedWeek)
  })

  test('should reset the week when reset button is clicked', async () => {
    await weekSummaryPage.clickResetButton()
    const weekSelectValue = await transactionsPage.getWeekSelectValue()
    expect(weekSelectValue).toBe('')
  })

  test('the next week button should be disabled, since we are on the first week in the weeks', async () => {
    await weekSummaryPage.page.getByRole('button', { name: 'Next Week' }).isDisabled()
  })

  test.describe('Memo Edit Context Menu', () => {
    test('memo edit modal workflow: open, display content, and close', async () => {
      // Initially hidden
      await weekSummaryPage.expectMemoEditModalHidden()

      // Right click opens modal with correct content
      await weekSummaryPage.rightClickOnTableRow(0)
      await weekSummaryPage.expectMemoEditModalVisible()
      await weekSummaryPage.expectMemoEditFormTitle('Edit Memo:')
      await weekSummaryPage.expectMemoEditFormVisible()

      // Closing hides modal
      await weekSummaryPage.closeMemoEditModal()
      await weekSummaryPage.expectMemoEditModalHidden()
    })
  })
})