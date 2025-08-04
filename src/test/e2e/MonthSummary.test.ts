import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { setupMonthSummaryMocks } from '@test/e2e/helpers/setupTestMocks'

test.describe('Month Summary Page', () => {
  let transactionsPage: TransactionsPage
  let monthSummaryPage: MonthSummaryPage
  let selectedMonth: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    monthSummaryPage = new MonthSummaryPage(page)

    await setupMonthSummaryMocks(page)

    await transactionsPage.goto()

    await transactionsPage.monthSelect.click()
    const firstMonth = await transactionsPage.page.getByRole('option').first().textContent() ?? ''
    const firstOption = transactionsPage.page.getByRole('option', { name: firstMonth }).first()

    selectedMonth = firstMonth
    await firstOption.click()
    // Wait for navigation to summary page after selecting month
    await page.waitForURL(/\/budget-visualizer\/transactions\/months\/.*\/summary/)
    // Wait for the summary table to be visible before proceeding
    await monthSummaryPage.monthSummaryTable.waitFor({ state: 'visible' })
    // Wait for the page to fully load after navigation
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
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
    await monthSummaryPage.page.waitForURL('/budget-visualizer/transactions')
    await expect(transactionsPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
    // the monthSelect should be reset when we're back on the TransactionsPage
    const monthSelect = await transactionsPage.getMonthSelectValue()
    expect(monthSelect).toBe('')
  })

  test('right clicking on a table row opens the memo edit modal', async () => {
    await monthSummaryPage.expectMemoEditModalHidden()
    await monthSummaryPage.rightClickOnTableRow(0)
    await monthSummaryPage.expectMemoEditModalVisible()
    await monthSummaryPage.expectMemoEditFormVisible()
    await monthSummaryPage.expectMemoEditFormTitle('Edit Memo:')
    await monthSummaryPage.closeMemoEditModal()
    await monthSummaryPage.expectMemoEditModalHidden()
  })
})
