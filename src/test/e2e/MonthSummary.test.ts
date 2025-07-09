import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { MonthSummaryPage } from '@test/e2e/pages/MonthSummaryPage'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'

test.describe('Month Summary Page', () => {
  let transactionsPage: TransactionsPage
  let monthSummaryPage: MonthSummaryPage
  let selectedMonth: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    monthSummaryPage = new MonthSummaryPage(page)

    await transactionsPage.goto()

    await transactionsPage.monthSelect.click()
    const firstMonth = await transactionsPage.page.getByRole('option').first().textContent() ?? ''

    const firstOption = transactionsPage.page.getByRole('option', { name: firstMonth }).first()

    selectedMonth = firstMonth

    await firstOption.click()

    await monthSummaryPage.page.waitForLoadState('networkidle')
  })

  test('should display the month title', async () => {
    const title = await monthSummaryPage.getMonthTitle()
    expect(title).toContain('Month Summary for:' + ' ' + selectedMonth)
  })

  test('should display the month summary table', async () => {
    expect(await monthSummaryPage.expectTableVisible()).toBeTruthy()
  })

  test('should display the budget categories summary component', async () => {
    expect(monthSummaryPage.budgetCategorySummaries.isVisible()).toBeTruthy()
  })

  test('the navigation button group should be visible', async () => {
    expect(monthSummaryPage.navigationButtonGroup.isVisible()).toBeTruthy()
  })

  test('the next month button should be disabled when on the latest month', async () => {
    const nextButton = monthSummaryPage.navigationButtonGroup.getByRole('button', { name: 'Next Month' })
    expect(await nextButton.isDisabled()).toBeTruthy()
  })

  test('should handle reset button click', async () => {
    await monthSummaryPage.clickResetButton()
    await expect(monthSummaryPage.page).toHaveURL(/\/budget-visualizer\/transactions/)
  })
})
