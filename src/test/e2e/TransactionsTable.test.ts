// import {test, expect} from '@playwright/test';
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { generateTransactionsArray, staticTransactions } from '@test/e2e/mocks/transactionsMock.ts'
import { mockTransactionsTableSelects } from '@test/e2e/helpers/mockTransactionsTableSelects.ts'
import { staticDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'


test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)

    // mock transactions?limit=100&offset=0&timeFrame=year
    await page.route('**/transactions?limit=100&offset=0&timeFrame=year', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticTransactions)
      })
    })

    // mock the transaction selects
    await mockTransactionsTableSelects(page)

    // mock the transactions count
    await page.route('**/transactions?count=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 200 })
      })
    })

    // mock the daily total intervals, with and without date
    await page.route('**/transactions?dailyTotals=true&interval=1+months', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticDailyIntervals)
      })
    })

    await page.route('**/transactions?interval=1+months&dailyTotals=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticDailyIntervals)
      })
    })

    // mock transactions?dailyTotals=true&interval=1+month&date=
    await page.route('**/transactions?dailyTotals=true&interval=1+month&date=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticDailyIntervals)
      })
    })

    // mock transactions?interval=1+month&dailyTotals=true
    await page.route('**/transactions?interval=1+month&dailyTotals=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(staticDailyIntervals)
      })
    })


    await transactionsPage.goto()
    await transactionsPage.page.waitForLoadState('networkidle')
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })
  })


  test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({ page }) => {
    await page.goto('/budget-visualizer')
    await transactionsPage.page.waitForLoadState('networkidle')
    await transactionsPage.goto()
    await transactionsPage.page.waitForLoadState('networkidle')
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

  test('right clicking on a cell in the TransactionsTable opens the context menu', async () => {
    // select the row after the header row
    await transactionsPage.clickOnTableCell({
      rowIndex: 1,
      cellIndex: 1,
      clickOptions: { button: 'right' }
    })

    const editTransactionForm = transactionsPage.transactionEditModal
    await expect(editTransactionForm).toBeVisible()

    // check that the transactionEditModal has the correct title, ie, it has the transactionNumber in it
    // get the first transaction number from the table
    const modalTitle = await editTransactionForm
      .getByRole('heading', { name: 'Edit Transaction' })
      .textContent()

    const firstTransactionNumber = await transactionsPage.getCellTextContent(1, 1)
    const expectedTitle = 'Edit Transaction: ' + firstTransactionNumber
    expect(modalTitle).toBe(expectedTitle)

    // the user shouldn't ever be able to edit the transactionNumber
    const transactionNumberInput = transactionsPage.modalTransactionNumberInput
    await expect(transactionNumberInput).toBeVisible()
    await expect(transactionNumberInput).toBeDisabled()

    //   close the Transaction Edit modal
    const closeButton = transactionsPage.modalCloseButton
    await closeButton.click()
    await expect(editTransactionForm).not.toBeVisible()
  })

  test('should display the tooltip of the point on the linechart when hovering over it', async () => {

    // hover over the first chart-dot on the line chart
    const tenthPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-10')
    await tenthPoint.hover()

    const toolTip = transactionsPage.intervalLineChartTooltip
    await expect(toolTip).toBeVisible()

    // check that the tooltip has the correct text
    const tooltipText = await toolTip.textContent()
    expect(tooltipText).toBeDefined()

  })

  test('clicking on a point in the line chart loads the transactions for that date', async () => {

    const fifthPoint = transactionsPage.intervalLineChart.getByTestId('chart-dot-5')

    // hover over the fifth chart-dot on the line chart
    await fifthPoint.hover()
    // wait for the intervalLineChartTooltip to be visible
    await transactionsPage.intervalLineChart.waitFor({ state: 'visible' })
    await expect(transactionsPage.intervalLineChartTooltip).toBeVisible()

    const textContent = await transactionsPage.intervalLineChartTooltip.textContent()

    const fifthPointDate = textContent?.match(/\d{4}-\d{2}-\d{2}/)?.[0]

    const fifthPointDateTransactions = generateTransactionsArray(5, '', fifthPointDate)

    await transactionsPage.page.route(`**/transactions?limit=100&offset=0&timeFrame=day&date=${fifthPointDate}T00:00:00.000Z`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fifthPointDateTransactions)
      })
    })

    const requestPromise = transactionsPage.page.waitForRequest(request =>
      request.url().includes('transactions') && request.url().includes(`date=${fifthPointDate}`)
    )

    await fifthPoint.click()

    await requestPromise

    await transactionsPage.page.waitForLoadState('networkidle')
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })

    const dateText = await transactionsPage.getCellTextContent(1, 2)

    expect(dateText).toBe(fifthPointDate)
  })

})