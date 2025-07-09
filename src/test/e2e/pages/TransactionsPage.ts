import type { Locator, Page } from '@playwright/test'

export class TransactionsPage {
  readonly transactionsTable: Locator
  readonly daySelect: Locator
  readonly weekSelect: Locator
  readonly monthSelect: Locator
  readonly yearSelect: Locator
  readonly memoSelect: Locator
  readonly intervalTypeSelect: Locator
  readonly intervalNumberInput: Locator
  readonly intervalLineChart: Locator
  readonly transactionsTablePagination: Locator
  readonly transactionEditModal: Locator

  // edit modal locators
  readonly modalTransactionNumberInput: Locator
  readonly modalCloseButton: Locator

  constructor(public readonly page: Page) {
    this.transactionsTable = this.page.getByTestId('transactions-table')
    this.daySelect = this.page.getByTestId('transaction-table-day-select')
    this.weekSelect = this.page.getByTestId('transaction-table-week-select')
    this.monthSelect = this.page.getByTestId('transactions-table-month-select')
    this.yearSelect = this.page.getByTestId('transaction-table-year-select')
    this.memoSelect = this.page.getByTestId('transaction-table-memo-select')
    this.intervalLineChart = this.page.getByTestId('daily-interval-line-chart')
    this.intervalTypeSelect = this.page.getByRole('main').getByText('Month', { exact: true })
    this.intervalNumberInput = this.page.getByRole('spinbutton', { name: 'Interval Count' })
    this.transactionsTablePagination = this.page.getByTestId('transactions-table-pagination')
    this.transactionEditModal = this.page.getByTestId('transaction-edit-dialog')

    this.modalTransactionNumberInput = this.page
      .getByTestId('transaction-edit-form-form-item-transaction_number')
      .getByText('Transaction Number')

    this.modalCloseButton = this.transactionEditModal.getByRole('button', { name: 'Close this dialog' })

    // Ensure all locators are initialized
  }

  async goto() {
    await this.page.goto('budget-visualizer/transactions')
  }

  async clickOnDaySelect() {
    await this.daySelect.click()
  }

  async clickIncreaseInterval() {
    await this.page.locator('button').filter({ hasText: /^Increase Interval$/ }).click()
  }

  async clickDecreaseInterval() {
    await this.page.locator('button').filter({ hasText: /^Decrease Interval$/ }).click()
  }

  async getFirstTransactionNumber() {
    const firstRow = this.transactionsTable.getByRole('row').nth(1) // Skip header row
    const firstCell = firstRow.getByRole('cell').nth(1)
    return await firstCell.textContent()
  }

  async rightClickOnFirstTransaction() {
    const firstRow = this.transactionsTable.getByRole('row').first()
    const firstCell = firstRow.getByRole('cell').first()
    await firstCell.click({ button: 'right' })
  }
}
