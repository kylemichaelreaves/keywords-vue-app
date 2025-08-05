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

    console.time('setting up transactionMocks')
    await setupTransactionsTableWithStaticMocks(page, staticTransactions, staticDailyIntervals)
    console.timeEnd('setting up transactionMocks')

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
    await debugTableLoadingState(page, 'transactions-table')

    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })

    // Ensure table is ready for interaction
    await page.waitForLoadState('networkidle')

    // select the row after the header row
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

    // IMPORTANT: Register the flexible route BEFORE chart interactions
    // This needs to be done early to catch the initial page requests
    await page.route('**/transactions**', async route => {
      const url = new URL(route.request().url())
      const params = url.searchParams

      console.log('Intercepted transactions request:', {
        limit: params.get('limit'),
        offset: params.get('offset'),
        timeFrame: params.get('timeFrame'),
        date: params.get('date'),
        full_url: url.toString()
      })

      const dateParam = params.get('date')
      const timeFrame = params.get('timeFrame')

      if (timeFrame === 'year' && (!dateParam || dateParam === '')) {
        // This is the initial page load request - use static transactions
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticTransactions)
        })
        return
      }

      // Let other requests continue to existing mocks for now
      await route.continue()
    })

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

    console.time('generating transactions')
    const fifthPointDateTransactions = generateTransactionsArray(5, '', fifthPointDate)
    console.timeEnd('generating transactions')

    // Now update the route to handle the chart click request
    await page.route('**/transactions**', async route => {
      const url = new URL(route.request().url())
      const params = url.searchParams

      console.log('Updated interceptor - transactions request:', {
        limit: params.get('limit'),
        offset: params.get('offset'),
        timeFrame: params.get('timeFrame'),
        date: params.get('date'),
        full_url: url.toString()
      })

      const dateParam = params.get('date')
      const timeFrame = params.get('timeFrame')

      // check if fifthPointDate is defined
      if (!fifthPointDate) {
        console.error('fifthPointDate is not defined')
        await route.continue()
        return
      }

      if (dateParam && dateParam.includes(fifthPointDate) && timeFrame === 'day') {
        // This is our chart click request for a specific date
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(fifthPointDateTransactions)
        })
      } else if (timeFrame === 'year' && (!dateParam || dateParam === '')) {
        // This is the initial page load request - use static transactions
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(staticTransactions)
        })
      } else {
        // Let other requests fall through to existing mocks
        await route.continue()
      }
    })

    const requestPromise = transactionsPage.page.waitForRequest(request =>
      request.url().includes('transactions') && request.url().includes(`date=${fifthPointDate}`)
    )

    await fifthPoint.click()

    await requestPromise

    await transactionsPage.page.waitForLoadState('networkidle')

    // Use the new Element UI-aware waiting helpers
    await waitForLoadingToComplete(transactionsPage.page)
    await waitForElementTableReady(transactionsPage.transactionsTable, transactionsPage.page)

    const dateText = await transactionsPage.getCellTextContent(1, 2)

    expect(dateText).toBe(fifthPointDate)
  })

})