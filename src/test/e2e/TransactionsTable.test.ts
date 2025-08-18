// import {test, expect} from '@playwright/test';
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { generateTransactionsArray, staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { setupTransactionsTableWithStaticMocks } from '@test/e2e/helpers/setupTestMocks'
import { waitForTableContent, waitForLineChartReady } from '@test/e2e/helpers/waitHelpers'

test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)

    // Set up comprehensive mocks with enhanced daily intervals route handling
    await setupTransactionsTableWithStaticMocks(page, staticTransactions, staticDailyIntervals)

    // Add specific route handler for daily intervals with better logging
    await page.route('**/transactions*dailyTotals=true*', async route => {
      const url = route.request().url()
      console.log('DailyIntervals route intercepted:', url)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticDailyIntervals),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    })

    // Use the first date from your static data instead of hardcoding
    const firstStaticDate = staticDailyIntervals[0].date.split('T')[0] // Extract date part
    await page.goto(`budget-visualizer/transactions?firstDay=${firstStaticDate}`)

    // Wait for actual table content instead of just visibility
    await waitForTableContent(transactionsPage.transactionsTable, page)

    // Wait for the chart to be ready with data points before running any tests
    await waitForLineChartReady(transactionsPage.intervalLineChart, page, {
      minDataPoints: 5, // Reduced from 10 since we have limited static data
      timeout: 40000
    })
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })


  test('The TransactionsPage contains all of its elements: selects, the line chart and its form, pagination, and the table itself', async ({ transactionsPage }) => {
    await expect(transactionsPage.transactionsTable).toBeVisible()
    await expect(transactionsPage.daySelect).toBeVisible()
    await expect(transactionsPage.weekSelect).toBeVisible()
    await expect(transactionsPage.monthSelect).toBeVisible()
    await expect(transactionsPage.yearSelect).toBeVisible()
    await expect(transactionsPage.memoSelect).toBeVisible()
    await expect(transactionsPage.intervalLineChart).toBeVisible()
    await expect(transactionsPage.intervalTypeSelect).toBeVisible()
    await expect(transactionsPage.intervalNumberInput).toBeVisible()
    await expect(transactionsPage.transactionsTablePagination).toBeVisible()
  })

  test('right clicking on a cell in the TransactionsTable opens the context menu', async () => {
    await transactionsPage.clickOnTableCell({
      rowIndex: 1,
      cellIndex: 1,
      clickOptions: { button: 'right' }
    })

    const editTransactionModal = transactionsPage.transactionEditModal
    await expect(editTransactionModal).toBeVisible()

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
    await closeButton.click()
    await transactionsPage.page.waitForLoadState('domcontentloaded')
    await expect(editTransactionModal).not.toBeVisible()
  })

  test('line chart displays tooltip on hover and allows clicking points to load transactions', async ({ page }) => {
    // Chart should already be ready from beforeEach, but let's ensure it's still visible
    await expect(transactionsPage.intervalLineChart).toBeVisible()

    // Test tooltip functionality first - use a lower index since we have limited static data
    const secondPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-1')
    await expect(secondPoint).toBeVisible()
    await secondPoint.hover()

    const toolTip = transactionsPage.intervalLineChartTooltip.first()
    await expect(toolTip).toBeVisible()

    // Check that the tooltip has the correct text
    const tooltipText = await toolTip.textContent()
    expect(tooltipText).toBeDefined()
    expect(tooltipText).toContain('2023-06') // Should contain our test date range
    expect(tooltipText).toContain('$') // Should contain currency

    // Test clicking functionality - use first point to avoid any missing data issues
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible()

    // Hover over the first chart-dot to get the date
    await firstPoint.hover()
    await expect(transactionsPage.intervalLineChartTooltip.first()).toBeVisible()

    const hoverTextContent = await transactionsPage.intervalLineChartTooltip.first().textContent()
    const firstPointDate = hoverTextContent?.match(/\d{4}-\d{2}-\d{2}/)?.[0]

    // Ensure we got a valid date before proceeding
    expect(firstPointDate).toBeDefined()
    expect(firstPointDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const firstPointDateTransactions = generateTransactionsArray(5, '', firstPointDate)

    // Set up the route handler BEFORE clicking to ensure it catches the request
    await page.route('**/transactions**', async route => {
      const url = new URL(route.request().url())
      const params = url.searchParams

      const dateParam = params.get('date')
      const timeFrame = params.get('timeFrame')

      // More robust date matching - check if the date parameter contains our target date
      if (firstPointDate && dateParam && dateParam.includes(firstPointDate) && timeFrame === 'day') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(firstPointDateTransactions)
        })
      } else {
        // For any other request, use static transactions as fallback
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticTransactions)
        })
      }
    })

    // Set up request promise to wait for the specific chart click request
    const requestPromise = page.waitForRequest(request => {
      const url = request.url()
      return url.includes('transactions') &&
        url.includes(`date=${firstPointDate}`) &&
        url.includes('timeFrame=day')
    })

    // Click the chart point
    await firstPoint.click()

    // Wait for the specific request we're expecting
    await requestPromise

    // Wait for table to have new content instead of just network idle
    await waitForTableContent(transactionsPage.transactionsTable, page)

    // Verify the table shows the correct date
    const dateText = await transactionsPage.getCellTextContent(1, 2)
    expect(dateText).toBe(firstPointDate)

    // NEW TEST: Verify that the chart is now hidden after selecting a day
    await expect(transactionsPage.intervalLineChart).not.toBeVisible()
  })

  test('daily interval line chart is hidden when a day is selected', async ({ page }) => {
    // Initially, the chart should be visible (no day selected)
    await expect(transactionsPage.intervalLineChart).toBeVisible()

    // Click on a chart point to select a day
    const firstPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-0')
    await expect(firstPoint).toBeVisible()
    
    // Set up route handler for the chart click
    await page.route('**/transactions**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(5, '', '2023-06-01'))
      })
    })

    // Click the chart point to select a day
    await firstPoint.click()

    // Wait for the store to update and the chart to hide
    await page.waitForTimeout(500)

    // Verify that the chart is now hidden
    await expect(transactionsPage.intervalLineChart).not.toBeVisible()
  })

})