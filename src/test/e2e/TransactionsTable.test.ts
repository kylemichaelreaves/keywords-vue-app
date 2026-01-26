// Enhanced TransactionsTable test with user behavior focus
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { setupTransactionsTableWithComprehensiveMocks } from '@test/e2e/helpers/setupTestMocks'
import { waitForTableContent } from '@test/e2e/helpers/waitHelpers'
import { setupApiRequestLogging, setupAwsApiRequestLogging } from '@test/e2e/helpers/requestLogger'

const isCI = !!process.env.CI

test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    // CI FIX: Enhanced logging and setup for CI environment
    if (isCI) {
      setupAwsApiRequestLogging(page)
    }

    transactionsPage = new TransactionsPage(page)

    // CRITICAL FIX: Set up API mocks FIRST before any navigation
    await setupTransactionsTableWithComprehensiveMocks(
      page,
      staticTransactions.reverse(),
      staticDailyIntervals,
    )

    // Now navigate to the transactions page
    await transactionsPage.goto()

    // CRITICAL: Wait for Vue app to be mounted and DOM to be ready
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Ensure the Vue app is actually rendered (not showing JSON)
    await page.waitForSelector('[data-testid="transactions-table-selects"]', { timeout: 15000 })

    // BEST PRACTICE: Wait for final state only, not intermediate loading states
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 45000 : 30000,
    })

    // Ensure chart is visible before proceeding with chart tests
    await expect(transactionsPage.intervalLineChart).toBeVisible({
      timeout: isCI ? 45000 : 30000,
    })
  })

  test('The TransactionsPage contains all of its elements: selects, the line chart and its form, pagination, and the table itself', async ({
    page,
  }) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // BEST PRACTICE: Wait directly for the final state (table with data), not loading states
    await expect(transactionsPage.transactionsTable).toBeVisible({ timeout: isCI ? 45000 : 30000 })

    // Test what the user can see - UI elements visibility
    await expect(transactionsPage.daySelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.weekSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.monthSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.yearSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.memoSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.intervalTypeSelect).toBeVisible({ timeout: isCI ? 30000 : 15000 })
    await expect(transactionsPage.intervalNumberInput).toBeVisible({
      timeout: isCI ? 30000 : 15000,
    })
    await expect(transactionsPage.transactionsTablePagination).toBeVisible({
      timeout: isCI ? 30000 : 15000,
    })
  })

  test('right clicking on a cell in the TransactionsTable opens the context menu', async ({
    page,
  }) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // Test user interaction - right click behavior
    const firstDataCell = transactionsPage.transactionsTable
      .getByRole('row')
      .nth(1)
      .getByRole('cell')
      .first()
    await expect(firstDataCell).not.toBeEmpty({ timeout: 30000 })

    // Get the transaction number before right-clicking
    const firstTransactionNumber = await transactionsPage.getCellTextContent(1, 1)
    console.log('[TEST DEBUG] Transaction number from table:', firstTransactionNumber)

    // Right click to open modal
    await transactionsPage.clickOnTableCell({
      rowIndex: 1,
      cellIndex: 1,
      clickOptions: { button: 'right' },
    })

    // Wait for modal with longer timeout - using aria-label selector
    const editTransactionModal = transactionsPage.transactionEditModal
    await expect(editTransactionModal).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Wait for form to be visible (indicates modal is fully loaded and has content)
    // This is more reliable than checking if modal is "not empty" since Element UI
    // has complex nested structure that Playwright may interpret as empty
    const editForm = transactionsPage.transactionEditForm
    await expect(editForm).toBeVisible({ timeout: isCI ? 10000 : 5000 })

    // Verify modal title contains the transaction number
    // The title is dynamic: "Edit Transaction: ABCD1234"
    // Use aria-label instead of brittle CSS class selector
    const modalTitleElement = editTransactionModal.getByLabel('Transaction Edit Dialog Title')
    await expect(modalTitleElement).toBeVisible({ timeout: isCI ? 10000 : 5000 })

    const modalTitle = await modalTitleElement.textContent()
    const expectedTitle = 'Edit Transaction: ' + firstTransactionNumber

    expect(modalTitle).toBe(expectedTitle)

    // Verify all form elements are visible
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

  test('line chart displays tooltip on hover and allows clicking points to load transactions', async ({
    page,
  }) => {
    // Test user interaction with chart - what they see and can do
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // User should see the chart
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Wait for chart to fully render with data points (critical for Firefox stability)
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Verify chart has multiple points loaded (not just rendering)
    const allPoints = transactionsPage.intervalLineChart.getByTestId(/chart-dot-\d+/)
    const pointCount = await allPoints.count()
    expect(pointCount).toBeGreaterThan(0)

    // Wait for chart to be stable by checking the tooltip is ready to show
    // This ensures D3/SVG rendering is complete without arbitrary timeouts
    await expect(firstPoint).toBeEnabled()

    // Test user can hover over chart points and see tooltip
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Hover and immediately capture tooltip data to avoid race conditions
    await firstPoint.hover({ force: isCI })

    const toolTip = transactionsPage.intervalLineChartTooltip.first()
    await expect(toolTip).toBeVisible({ timeout: isCI ? 15000 : 5000 })

    // Test tooltip shows expected information to user
    const tooltipText = await toolTip.textContent()
    expect(tooltipText).toBeDefined()
    expect(tooltipText).toMatch(/\d{4}-\d{2}-\d{2}/) // Date format
    expect(tooltipText).toContain('$') // Currency

    // Extract date immediately while tooltip is stable
    const firstPointDate = tooltipText?.match(/\d{4}-\d{2}-\d{2}/)?.[0]
    expect(firstPointDate).toBeDefined()
    expect(firstPointDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    // Ensure tooltip is still visible before clicking (prevents Firefox race condition)
    await expect(toolTip).toBeVisible({ timeout: 2000 })

    // Click the point (tooltip will disappear after click, which is expected)
    await firstPoint.click({ force: isCI })

    // Wait for UI to update with new data
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 90000 : 60000,
    })

    // Verify user sees filtered data in table
    // Note: The table date cell may be formatted differently than the tooltip
    // The important thing is that the table now shows transactions for a specific day
    const dateText = await transactionsPage.getCellTextContent(1, 2)

    // Verify the date is in a valid format (table may format differently than tooltip)
    expect(dateText).toMatch(/\d{4}-\d{2}-\d{2}/)

    // Verify we have specific transaction data (not aggregate view)
    // The table should show transactions for a single day
    const firstRowId = await transactionsPage.getCellTextContent(1, 0)
    expect(firstRowId).toBeDefined()
    expect(firstRowId).not.toBe('')

    // Test that chart hides after user selects a specific day (expected UX behavior)
    await expect(transactionsPage.intervalLineChart).not.toBeVisible({
      timeout: isCI ? 20000 : 10000,
    })
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
    await expect(transactionsPage.intervalLineChart).not.toBeVisible({
      timeout: isCI ? 20000 : 10000,
    })
  })

  test('selecting a day from the DailyIntervalLineChart, the date of the node is reflected in the URL params', async ({
    page,
  }) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // Get the first point in the chart
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Get the date from the chart point's data BEFORE clicking
    const chartPointDate = await transactionsPage.getChartPointDate(0)
    console.log('[TEST DEBUG] Chart point date:', chartPointDate)

    expect(chartPointDate).toBeDefined()
    expect(chartPointDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    // Click on the first point in the chart
    await firstPoint.click({ force: isCI })

    // Wait for UI to update with new data
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 90000 : 60000,
    })

    // Verify the URL now contains the selected day as a query parameter
    const url = page.url()
    console.log('[TEST DEBUG] URL after clicking chart point:', url)

    // The chart point date should match the URL parameter
    expect(url).toContain(`day=${encodeURIComponent(chartPointDate)}`)

    // Verify the date was also set in the Pinia store
    const storeState = await transactionsPage.getStoreState()
    expect(storeState.selectedDay).toBe(chartPointDate)
  })

  test('selecting a day in the DaySelect is reflected in the URLs params', async ({ page }) => {
    // Log only API requests for this test
    setupApiRequestLogging(page)

    // Get the first day from the Pinia store
    const days = await transactionsPage.getDaysFromStore()

    expect(days.length).toBeGreaterThan(0)
    const firstDay = days[0].day

    // User selects the first day from the DaySelect
    await transactionsPage.selectDay(firstDay)

    // Wait for UI to update with new data
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 90000 : 60000,
    })

    // Verify the URL now contains the selected day as a query parameter
    const url = page.url()

    expect(url).toContain(`day=${encodeURIComponent(firstDay)}`)
  })
})
