// import {test, expect} from '@playwright/test';
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'
import { mockTransactionsTableSelects } from '@test/e2e/helpers/mockTransactionsTableSelects.ts'
import { generateDailyIntervals } from '@test/e2e/mocks/dailyIntervalMock.ts'


test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)

    // mock transactions?limit=100&offset=0&timeFrame=year
    await page.route('**/transactions?limit=100&offset=0&timeFrame=year', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateTransactionsArray(100))
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
        body: JSON.stringify(generateDailyIntervals(30))
      })
    })

    await page.route('**/transactions?interval=1+months&dailyTotals=true', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(generateDailyIntervals(30))
      })
    })


    await transactionsPage.goto()
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })
  })


  test('clicking the Transactions icon on the menu NavBar opens the TransactionsTable', async ({ page }) => {
    await page.goto('/budget-visualizer')

    await transactionsPage.goto()

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
    const firstRow = transactionsPage.transactionsTable.getByRole('row').nth(1)
    const firstCell = firstRow.getByRole('cell').nth(1)
    await firstCell.click({ button: 'right' })


    const editTransactionForm = transactionsPage.transactionEditModal
    await expect(editTransactionForm).toBeVisible()

    // check that the transactionEditModal has the correct title, ie, it has the transactionNumber in it
    // get the first transaction number from the table
    const modalTitle = await editTransactionForm
      .getByRole('heading', { name: 'Edit Transaction' })
      .textContent()

    const firstTransactionNumber = await transactionsPage.getFirstTransactionNumber()
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
    await expect(transactionsPage.intervalLineChartTooltip).toBeVisible()

    // grab the date from the tooltip text content
    const textContent = await transactionsPage.intervalLineChartTooltip.textContent()


    const fifthPointDate = textContent?.match(/\d{4}-\d{2}-\d{2}/)?.[0]
    await fifthPoint.click()

    //  intercept the request for transactions
    // transactions?limit=100&offset=0&timeFrame=day&date=${fifthPointDate}

    const fifthPointDateTransactions = generateTransactionsArray(15, '', fifthPointDate)

    await transactionsPage.page.route(`**/transactions?limit=100&offset=0&timeFrame=day&date=${fifthPointDate}`, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fifthPointDateTransactions)
      })
    })


    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })

    // compare the date in the date column in the transactions table to the date of the point clicked
    const dateRow = transactionsPage.transactionsTable.getByRole('row').nth(1)

    const dateCell = dateRow.getByRole('cell').nth(2) // the date is in the second cell
    const dateText = await dateCell.textContent()

    expect(dateText).toBe(fifthPointDate)

  })

})