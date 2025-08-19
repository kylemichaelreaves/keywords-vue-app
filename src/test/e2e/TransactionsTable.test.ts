// Enhanced TransactionsTable test with user behavior focus
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks'
import { waitForTableContent } from '@test/e2e/helpers/waitHelpers'
import { setupAwsApiRequestLogging, setupApiRequestLogging } from '@test/e2e/helpers/requestLogger'

const isCI = !!process.env.CI

test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    // Log only AWS API requests
    setupAwsApiRequestLogging(page)

    transactionsPage = new TransactionsPage(page)

    console.time('TransactionsTableTestSetup')
    // CRITICAL FIX: Set up API mocks AND initialize clean store state
    await setupTransactionsTableWithComprehensiveMocks(page, staticTransactions, staticDailyIntervals)
    console.timeEnd('TransactionsTableTestSetup')

    // Navigate to the page
    await page.goto('budget-visualizer/transactions')

    console.time('TransactionsPageLoad')
    // Wait for both table and chart components to load properly
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 120000 : 60000
    })
    console.timeEnd('TransactionsPageLoad')

    // CRITICAL: Ensure chart is visible before proceeding with chart tests
    await expect(transactionsPage.intervalLineChart).toBeVisible({
      timeout: isCI ? 60000 : 30000
    })
  })

  test.afterEach(async ({ page }) => {
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch (error) {
      // Ignore cleanup errors if page is already closed
    }
  })

  test('The TransactionsPage contains all of its elements: selects, the line chart and its form, pagination, and the table itself', async ({page}) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // Test what the user can see - UI elements visibility
    await expect(transactionsPage.transactionsTable).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.daySelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.weekSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.monthSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.yearSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.memoSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.intervalTypeSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.intervalNumberInput).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.transactionsTablePagination).toBeVisible({ timeout: isCI ? 30000 : 15000 })
  })

  test('right clicking on a cell in the TransactionsTable opens the context menu', async ({ page }) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // Test user interaction - right click behavior
    const firstDataCell = transactionsPage.transactionsTable.getByRole('row').nth(1).getByRole('cell').first()
    await expect(firstDataCell).not.toBeEmpty({ timeout: 30000 })

    await transactionsPage.clickOnTableCell({
      rowIndex: 1,
      cellIndex: 1,
      clickOptions: { button: 'right' }
    })

    const editTransactionModal = transactionsPage.transactionEditModal
    await expect(editTransactionModal).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Verify user sees expected content in modal
    const modalTitle = await editTransactionModal
      .getByRole('heading', { name: 'Edit Transaction' })
      .textContent()

    const firstTransactionNumber = await transactionsPage.getCellTextContent(1, 1)
    const expectedTitle = 'Edit Transaction: ' + firstTransactionNumber
    expect(modalTitle).toBe(expectedTitle)

    await transactionsPage.expectTransactionEditFormElementsToBeVisible()

    // Test that user cannot edit the transaction number (UI constraint)
    const numberInput = transactionsPage.transactionNumberInput
    await expect(numberInput).toBeVisible()
    await expect(numberInput).toBeDisabled()

    // Test user can close the modal
    const closeButton = transactionsPage.modalCloseButton
    await closeButton.click({ force: isCI })
    await page.waitForLoadState('domcontentloaded')
    await expect(editTransactionModal).not.toBeVisible()
  })

  test('line chart displays tooltip on hover and allows clicking points to load transactions', async ({ page }) => {
    // Test user interaction with chart - what they see and can do
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // User should see the chart
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Test user can hover over chart points and see tooltip
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    await firstPoint.hover({ force: isCI })

    const toolTip = transactionsPage.intervalLineChartTooltip.first()
    await expect(toolTip).toBeVisible({ timeout: isCI ? 15000 : 5000 })

    // Test tooltip shows expected information to user
    const tooltipText = await toolTip.textContent()
    expect(tooltipText).toBeDefined()
    expect(tooltipText).toMatch(/\d{4}-\d{2}-\d{2}/) // Date format
    expect(tooltipText).toContain('$') // Currency

    // Test user can click chart points to drill down
    const hoverTextContent = await transactionsPage.intervalLineChartTooltip.first().textContent()
    const firstPointDate = hoverTextContent?.match(/\d{4}-\d{2}-\d{2}/)?.[0]

    expect(firstPointDate).toBeDefined()
    expect(firstPointDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    // User clicks chart point
    await firstPoint.click({ force: isCI })

    // Wait for UI to update with new data
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 90000 : 60000
    })

    // Verify user sees filtered data in table
    const dateText = await transactionsPage.getCellTextContent(1, 2)
    expect(dateText).toBe(firstPointDate)

    // Test that chart hides after user selects a specific day (expected UX behavior)
    await expect(transactionsPage.intervalLineChart).not.toBeVisible({ timeout: isCI ? 20000 : 10000 })
  })

  test('daily interval line chart is hidden when a day is selected', async ({ page }) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // Initially, user should see the chart (aggregate view)
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    // User clicks on a chart point to drill down
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 20000 : 10000 })

    await firstPoint.click({ force: isCI })
    // Give time for UI to respond to user action
    await page.waitForLoadState('domcontentloaded', { timeout: isCI ? 20000 : 10000 })
    // Chart should now be hidden (user is in detail view)
    await expect(transactionsPage.intervalLineChart).not.toBeVisible({ timeout: isCI ? 20000 : 10000 })
  })
})
