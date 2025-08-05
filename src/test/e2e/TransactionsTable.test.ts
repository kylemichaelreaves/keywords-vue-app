// import {test, expect} from '@playwright/test';
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { generateTransactionsArray, staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'
import { setupTransactionsTableWithStaticMocks } from '@test/e2e/helpers/setupTestMocks'
import {
  debugTableLoadingState,
  waitForElementTableReady,
  waitForLoadingToComplete
} from '@test/e2e/helpers/waitHelpers'

test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)


    await setupTransactionsTableWithStaticMocks(page, staticTransactions, staticDailyIntervals)


    await transactionsPage.goto()

    // Single comprehensive wait instead of multiple redundant waits
    await waitForElementTableReady(transactionsPage.transactionsTable, page)
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })


  test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({ page }) => {
    await page.goto('/budget-visualizer')
    await transactionsPage.goto()
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })

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

  test('right clicking on a cell in the TransactionsTable opens the context menu', async ({ page }) => {
    // Use comprehensive Element UI-aware waiting
    await transactionsPage.waitForTransactionsTableReady()

    // Additional debug info for CI troubleshooting
    await debugTableLoadingState(page, 'transactions-table')

    // Use the improved click method that handles Element UI loading
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
    await expect(editTransactionModal).not.toBeVisible()
  })

  test('should display the tooltip of the point on the linechart when hovering over it', async ({ page }) => {
    // Wait for chart to be fully loaded
    await page.waitForLoadState('networkidle')
    await expect(transactionsPage.intervalLineChart).toBeVisible()

    // hover over the first chart-dot on the line chart
    const tenthPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-10')
    await expect(tenthPoint).toBeVisible()
    await tenthPoint.hover()

    const toolTip = transactionsPage.intervalLineChartTooltip
    await expect(toolTip).toBeVisible()

    // check that the tooltip has the correct text
    const tooltipText = await toolTip.textContent()
    expect(tooltipText).toBeDefined()
  })

  test('clicking on a point in the line chart loads the transactions for that date', async ({ page }) => {
    await debugTableLoadingState(page, 'transactions-table')

    // Wait for chart to be fully loaded
    await page.waitForLoadState('networkidle')
    await expect(transactionsPage.intervalLineChart).toBeVisible()

    const fifthPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-5')
    await expect(fifthPoint).toBeVisible()

    // hover over the fifth chart-dot on the line chart
    await fifthPoint.hover()
    // wait for the intervalLineChartTooltip to be visible
    await expect(transactionsPage.intervalLineChartTooltip).toBeVisible()

    const textContent = await transactionsPage.intervalLineChartTooltip.textContent()

    const fifthPointDate = textContent?.match(/\d{4}-\d{2}-\d{2}/)?.[0]

    // Ensure we got a valid date before proceeding
    expect(fifthPointDate).toBeDefined()
    expect(fifthPointDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)


    const fifthPointDateTransactions = generateTransactionsArray(5, '', fifthPointDate)


    // CRITICAL FIX: Unroute existing handlers first to prevent conflicts
    await page.unroute('**/transactions**')

    // Set up the route handler BEFORE clicking to ensure it catches the request
    await page.route('**/transactions**', async route => {
      const url = new URL(route.request().url())
      const params = url.searchParams

      console.log('Chart click interceptor - transactions request:', {
        limit: params.get('limit'),
        offset: params.get('offset'),
        timeFrame: params.get('timeFrame'),
        date: params.get('date'),
        full_url: url.toString()
      })

      const dateParam = params.get('date')
      const timeFrame = params.get('timeFrame')

      // More robust date matching - check if the date parameter contains our target date
      if (fifthPointDate && dateParam && dateParam.includes(fifthPointDate) && timeFrame === 'day') {
        console.log(`Fulfilling chart click request for date: ${fifthPointDate}`)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(fifthPointDateTransactions)
        })
      } else {
        // For any other request, use static transactions as fallback
        console.log('Using static transactions as fallback')
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
        url.includes(`date=${fifthPointDate}`) &&
        url.includes('timeFrame=day')
    })

    // Click the chart point
    await fifthPoint.click()

    // Wait for the specific request we're expecting
    await requestPromise

    // Wait for UI to update
    await page.waitForLoadState('networkidle')

    // Use the Element UI-aware waiting helpers
    await waitForLoadingToComplete(page)
    await waitForElementTableReady(transactionsPage.transactionsTable, page)

    // Verify the table shows the correct date
    const dateText = await transactionsPage.getCellTextContent(1, 2)

    expect(dateText).toBe(fifthPointDate)
  })

})