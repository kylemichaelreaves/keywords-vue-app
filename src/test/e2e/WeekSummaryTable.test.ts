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

    console.time('setting up weekSummaryMocks')
    await setupWeekSummaryMocks(page)
    console.timeEnd('setting up weekSummaryMocks')

    // Clear any existing state first
    await transactionsPage.goto()

    // Wait for page to be fully loaded before interacting
    await page.waitForLoadState('domcontentloaded')

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
    await page.waitForURL(/\/budget-visualizer\/transactions\/weeks\/.*\/summary/, { waitUntil: 'domcontentloaded' })

    // Wait for network requests to complete
    await page.waitForLoadState('networkidle')

    // Wait for the summary table to be visible and stable
    await expect(weekSummaryPage.weekSummaryTable).toBeVisible()
    await expect(weekSummaryPage.weekSummaryTable.locator('tbody tr').first()).toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
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
    await weekSummaryPage.page.waitForURL('/budget-visualizer/transactions', { waitUntil: 'domcontentloaded' })
    const weekSelectValue = await transactionsPage.getWeekSelectValue()
    expect(weekSelectValue).toBe('')
  })

  test('the next week button should be disabled, since we are on the first week in the weeks', async () => {
    await weekSummaryPage.page.getByRole('button', { name: 'Next Week' }).isDisabled()
  })

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