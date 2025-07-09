// import {test, expect} from '@playwright/test';
import { expect, test } from '@test/e2e/fixtures/PageFixture'
import { TransactionsPage } from '@test/e2e/pages/TransactionsPage'


test.describe('Transactions Table', () => {
  let transactionsPage: TransactionsPage

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page)
    await transactionsPage.goto()
    await page.waitForLoadState('networkidle')
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


