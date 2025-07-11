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
    await page.route('**/transactions?dailyTotals=true&interval=1+months',  route => {
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
    await transactionsPage.goto()
    await transactionsPage.transactionsTable.waitFor({ state: 'visible' })
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

    // the use shouldn't ever be able to edit the transactionNumber
    const transactionNumberInput = transactionsPage.modalTransactionNumberInput
    await expect(transactionNumberInput).toBeVisible()
    await expect(transactionNumberInput).toBeDisabled()

    //   close the Transaction Edit modal
    const closeButton = transactionsPage.modalCloseButton
    await closeButton.click()
    await expect(editTransactionForm).not.toBeVisible()
  })


})