import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage.ts'
import { WeekSummaryPage } from '@test/e2e/pages/WeekSummaryPage'
import { setupWeekSummaryMocks } from '@test/e2e/helpers/setupTestMocks'
import { debugTableLoadingState } from '@test/e2e/helpers/waitHelpers.ts'
import { generateBudgetCategoryHierarchy } from '@test/e2e/mocks/budgetCategoriesSummaryMock.ts'

test.describe('Week Summary Table', () => {
  let transactionsPage: TransactionsPage
  let weekSummaryPage: WeekSummaryPage
  let selectedWeek: string | null

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    weekSummaryPage = new WeekSummaryPage(page)


    // Add route interceptor for budget category hierarchy sum request
    await page.route('**/transactions?budgetCategoryHierarchySum=true&timeFrame=week&date=*', async route => {
      const url = new URL(route.request().url())
      console.log('Intercepted budget category hierarchy request:', url.toString())

      // Use the budget categories mock generator instead of hardcoded data
      const mockBudgetCategories = generateBudgetCategoryHierarchy({
        includeChildren: false, // Only parent categories for summary
        maxParentCategories: 5,
        sourceId: 1
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBudgetCategories)
      })
    })


    console.time('setting up weekSummaryMocks')
    await setupWeekSummaryMocks(page)
    console.timeEnd('setting up weekSummaryMocks')

    // Clear any existing state first
    await transactionsPage.goto()

    // Wait for page to be fully loaded before interacting
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('networkidle')

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
    await page.waitForURL(/\/budget-visualizer\/transactions\/weeks\/.*\/summary/, { waitUntil: 'networkidle' })

    // Wait for the summary table to be visible and stable
    await expect(weekSummaryPage.weekSummaryTable).toBeVisible()

    // Wait for table content to be loaded
    const tableBody = weekSummaryPage.weekSummaryTable.locator('tbody')
    await expect(tableBody).toBeVisible()

    // Ensure at least one row is present before continuing
    await expect(tableBody.locator('tr').first()).toBeVisible()

    // Final network idle wait to ensure all data is loaded
    await page.waitForLoadState('networkidle')
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

  test('memo edit modal workflow: open, display content, and close', async ({ page }) => {
    await debugTableLoadingState(page, 'week-summary-table')

    // Initially hidden
    await weekSummaryPage.expectMemoEditModalHidden()

    // wait for the week summary table to be ready
    await weekSummaryPage.expectTableVisible()
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