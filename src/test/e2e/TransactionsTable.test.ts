// Enhanced TransactionsTable test with comprehensive route mocking
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { generateTransactionsArray, staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { mockTransactionsTableSelects } from '@test/e2e/helpers/mockTransactionsTableSelects'
import { waitForTableContent, waitForLineChartReady } from '@test/e2e/helpers/waitHelpers'

const isCI = !!process.env.CI

async function setupComprehensiveTransactionMocks(page: any, staticTransactions: any[], staticDailyIntervals: any[]) {
  // Mock all transaction select dropdowns
  await mockTransactionsTableSelects(page)

  // Mock the main transactions route with comprehensive pattern matching
  await page.route('**/transactions*', async (route: any) => {
    const url = new URL(route.request().url())
    const params = url.searchParams

    const isDailyTotals = params.get('dailyTotals') === 'true'
    const hasInterval = params.has('interval')
    const hasDate = params.has('date')
    const timeFrame = params.get('timeFrame')

    if (isCI) {
      console.log('[MOCK] Intercepting transactions request:', {
        url: url.toString(),
        isDailyTotals,
        hasInterval,
        hasDate,
        timeFrame,
        allParams: Object.fromEntries(params)
      })
    }

    // Handle daily intervals requests
    if (isDailyTotals) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticDailyIntervals),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
      return
    }

    // Handle main transactions table data requests
    if (hasInterval || hasDate || timeFrame) {
      // For specific date/timeframe requests, generate targeted data
      const dateParam = params.get('date')
      if (dateParam && timeFrame === 'day') {
        const targetTransactions = generateTransactionsArray(5, '', dateParam)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(targetTransactions),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        return
      }
    }

    // Default: return static transactions for all other cases
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(staticTransactions),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  })

  if (isCI) {
    console.log('[MOCK] All transaction mocks setup complete')
  }
}

test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)

    if (isCI) {
      console.log('[CI] Starting test setup with comprehensive mocking')
    }

    // Set up comprehensive mocks
    await setupComprehensiveTransactionMocks(page, staticTransactions, staticDailyIntervals)

    // Use the first date from your static data instead of hardcoding
    const firstStaticDate = staticDailyIntervals[0].date.split('T')[0] // Extract date part
    const targetUrl = `budget-visualizer/transactions?firstDay=${firstStaticDate}`

    if (isCI) {
      console.log('[CI] Navigating to:', targetUrl)
    }

    await page.goto(targetUrl)

    // Enhanced waiting with better CI debugging
    try {
      // Wait for actual table content instead of just visibility
      await waitForTableContent(transactionsPage.transactionsTable, page, {
        timeout: isCI ? 120000 : 60000
      })

      if (isCI) {
        // Additional debugging for table state after content load
        const rowCount = await transactionsPage.transactionsTable.getByRole('row').count()
        const cellCount = await transactionsPage.transactionsTable.getByRole('cell').count()
        const firstCellText = await transactionsPage.transactionsTable.getByRole('row').nth(1).getByRole('cell').first().textContent()
        console.log('[CI] Table state after waitForTableContent:', { rowCount, cellCount, firstCellText })
      }

      // Wait for the chart to be ready with data points before running any tests
      await waitForLineChartReady(transactionsPage.intervalLineChart, page, {
        minDataPoints: 5,
        timeout: isCI ? 60000 : 40000
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (isCI) {
        console.log('[CI] Setup failed:', errorMessage)

        // Capture detailed table state on failure
        try {
          const tableExists = await transactionsPage.transactionsTable.count()
          const rowCount = await transactionsPage.transactionsTable.getByRole('row').count()
          const cellCount = await transactionsPage.transactionsTable.getByRole('cell').count()

          console.log('[CI] Detailed table state on setup failure:', {
            tableExists,
            rowCount,
            cellCount
          })

          // Check each row's first cell content
          for (let i = 0; i < Math.min(rowCount, 5); i++) {
            const cellText = await transactionsPage.transactionsTable.getByRole('row').nth(i).getByRole('cell').first().textContent()
            console.log(`[CI] Row ${i} first cell text:`, cellText)
          }
        } catch (debugError) {
          const debugErrorMessage = debugError instanceof Error ? debugError.message : String(debugError)
          console.log('[CI] Failed to capture debug info:', debugErrorMessage)
        }
      }
      throw error
    }

    if (isCI) {
      console.log('[CI] Setup completed successfully')
    }
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })


  test('The TransactionsPage contains all of its elements: selects, the line chart and its form, pagination, and the table itself', async ({ page }) => {
    if (isCI) {
      console.log('[CI] Starting elements visibility test')

      // Extra verification that table has actual data before checking other elements
      const firstDataCell = transactionsPage.transactionsTable.getByRole('row').nth(1).getByRole('cell').first()
      const cellText = await firstDataCell.textContent()
      console.log('[CI] First data cell content before visibility tests:', cellText)

      // If cell is empty, wait a bit more and check network requests
      if (!cellText || cellText.trim() === '') {
        console.log('[CI] First data cell is empty, waiting for data...')
        await page.waitForTimeout(2000)

        const updatedCellText = await firstDataCell.textContent()
        console.log('[CI] First data cell content after wait:', updatedCellText)
      }
    }

    // Enhanced visibility tests with CI timeouts
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

    if (isCI) {
      console.log('[CI] All elements visibility test completed')
    }
  })

  test('right clicking on a cell in the TransactionsTable opens the context menu', async ({ page }) => {
    if (isCI) {
      console.log('[CI] Starting right click test')

      // Verify table has data before attempting right click
      const firstDataCell = transactionsPage.transactionsTable.getByRole('row').nth(1).getByRole('cell').first()
      await expect(firstDataCell).not.toBeEmpty({ timeout: 30000 })

      const cellText = await firstDataCell.textContent()
      console.log('[CI] Table data verified, first cell:', cellText)
    }

    await transactionsPage.clickOnTableCell({
      rowIndex: 1,
      cellIndex: 1,
      clickOptions: { button: 'right' }
    })

    const editTransactionModal = transactionsPage.transactionEditModal
    await expect(editTransactionModal).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // check that the transactionEditModal has the correct title, ie, it has the transactionNumber in it
    // get the first transaction number from the table
    const modalTitle = await editTransactionModal
      .getByRole('heading', { name: 'Edit Transaction' })
      .textContent()

    const firstTransactionNumber = await transactionsPage.getCellTextContent(1, 1)
    const expectedTitle = 'Edit Transaction: ' + firstTransactionNumber
    expect(modalTitle).toBe(expectedTitle)

    await transactionsPage.expectTransactionEditFormElementsToBeVisible()

    // the user shouldn't ever be able to edit the transactionNumber
    const numberInput = transactionsPage.transactionNumberInput
    await expect(numberInput).toBeVisible()
    await expect(numberInput).toBeDisabled()

    //   close the Transaction Edit modal
    const closeButton = transactionsPage.modalCloseButton
    await closeButton.click({ force: isCI })
    await page.waitForLoadState('domcontentloaded')
    await expect(editTransactionModal).not.toBeVisible()

    if (isCI) {
      console.log('[CI] Right click test completed successfully')
    }
  })

  test('line chart displays tooltip on hover and allows clicking points to load transactions', async ({ page }) => {
    if (isCI) {
      console.log('[CI] Starting chart interaction test')
    }

    // Chart should already be ready from beforeEach, but let's ensure it's still visible
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Test tooltip functionality first - use a lower index since we have limited static data
    const secondPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-1')
    await expect(secondPoint).toBeVisible({ timeout: isCI ? 20000 : 10000 })

    await secondPoint.hover({ force: isCI })
    if (isCI) {
      await page.waitForTimeout(1000) // Extra wait for CI
    }

    const toolTip = transactionsPage.intervalLineChartTooltip.first()
    await expect(toolTip).toBeVisible({ timeout: isCI ? 15000 : 5000 })

    // Check that the tooltip has the correct text
    const tooltipText = await toolTip.textContent()
    expect(tooltipText).toBeDefined()
    expect(tooltipText).toContain('2023-06') // Should contain our test date range
    expect(tooltipText).toContain('$') // Should contain currency

    // Test clicking functionality - use first point to avoid any missing data issues
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 20000 : 10000 })

    // Hover over the first chart-dot to get the date
    await firstPoint.hover({ force: isCI })
    if (isCI) {
      await page.waitForTimeout(1000)
    }

    await expect(transactionsPage.intervalLineChartTooltip.first()).toBeVisible()

    const hoverTextContent = await transactionsPage.intervalLineChartTooltip.first().textContent()
    const firstPointDate = hoverTextContent?.match(/\d{4}-\d{2}-\d{2}/)?.[0]

    // Ensure we got a valid date before proceeding
    expect(firstPointDate).toBeDefined()
    expect(firstPointDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    if (isCI) {
      console.log('[CI] Chart point date extracted:', firstPointDate)
    }

    // Set up request promise to wait for the specific chart click request
    const requestPromise = page.waitForRequest(request => {
      const url = request.url()
      const matches = url.includes('transactions') &&
        url.includes(`date=${firstPointDate}`) &&
        url.includes('timeFrame=day')

      if (isCI && matches) {
        console.log('[CI] Found expected request:', url)
      }

      return matches
    }, { timeout: isCI ? 30000 : 15000 })

    // Click the chart point
    await firstPoint.click({ force: isCI })
    if (isCI) {
      console.log('[CI] Chart point clicked')
    }

    // Wait for the specific request we're expecting
    await requestPromise

    // Wait for table to have new content instead of just network idle
    await waitForTableContent(transactionsPage.transactionsTable, page, {
      timeout: isCI ? 90000 : 60000
    })

    // Verify the table shows the correct date
    const dateText = await transactionsPage.getCellTextContent(1, 2)
    expect(dateText).toBe(firstPointDate)

    // NEW TEST: Verify that the chart is now hidden after selecting a day
    await expect(transactionsPage.intervalLineChart).not.toBeVisible({ timeout: isCI ? 20000 : 10000 })

    if (isCI) {
      console.log('[CI] Chart interaction test completed successfully')
    }
  })

  test('daily interval line chart is hidden when a day is selected', async ({ page }) => {
    if (isCI) {
      console.log('[CI] Starting chart hide test')
    }

    // Initially, the chart should be visible (no day selected)
    await expect(transactionsPage.intervalLineChart).toBeVisible({ timeout: isCI ? 30000 : 15000 })

    // Click on a chart point to select a day
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible({ timeout: isCI ? 20000 : 10000 })

    // Click the chart point to select a day
    await firstPoint.click({ force: isCI })
    if (isCI) {
      console.log('[CI] Chart point clicked for hide test')
    }

    // Wait for the store to update and the chart to hide
    await page.waitForTimeout(isCI ? 2000 : 500)

    // Verify that the chart is now hidden
    await expect(transactionsPage.intervalLineChart).not.toBeVisible({ timeout: isCI ? 20000 : 10000 })

    if (isCI) {
      console.log('[CI] Chart hide test completed successfully')
    }
  })

})