import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

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
  readonly intervalLineChartTooltip: Locator

  readonly transactionsTablePagination: Locator
  readonly transactionEditModal: Locator

  // edit modal locators
  readonly modalTransactionNumberInput: Locator
  readonly modalCloseButton: Locator

  constructor(public readonly page: Page) {
    this.transactionsTable = this.page.getByTestId('transactions-table')
    this.daySelect = this.page.getByTestId('transactions-table-day-select')
    this.weekSelect = this.page.getByTestId('transactions-table-week-select')
    this.monthSelect = this.page.getByTestId('transactions-table-month-select')
    this.yearSelect = this.page.getByTestId('transactions-table-year-select')
    this.memoSelect = this.page.getByTestId('transactions-table-memo-select')

    this.intervalLineChart = this.page.getByTestId('daily-interval-line-chart')
    this.intervalTypeSelect = this.page.getByRole('main').getByText('Month', { exact: true })
    this.intervalNumberInput = this.page.getByRole('spinbutton', { name: 'Interval Count' })
    this.intervalLineChartTooltip = this.page.getByTestId('line-chart-tooltip')

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

  // get the text content of a given cell and row index
  async getCellTextContent(rowIndex: number, cellIndex: number): Promise<string> {
    const row = this.transactionsTable.getByRole('row').nth(rowIndex)
    const cell = row.getByRole('cell').nth(cellIndex)
    await expect(cell).not.toBeEmpty()
    return await cell.textContent() ?? ''
  }

  // Method to get the value of the month select
  async getMonthSelectValue(): Promise<string> {
    // Try to get the input value first (most reliable)
    const input = this.monthSelect.locator('input')
    if (await input.count() > 0) {
      const value = await input.inputValue()
      if (value) return value
    }

    // Check the visible text content of the select
    const selectText = await this.monthSelect.textContent()
    const trimmedText = selectText?.trim() ?? ''

    // If it shows the placeholder text, consider it empty
    if (trimmedText === 'select a month' || trimmedText === '' || trimmedText.includes('select')) {
      return ''
    }

    return trimmedText
  }

  async rightClickOnFirstTransaction() {
    await this.clickOnTableCell({ rowIndex: 1, cellIndex: 1, clickOptions: { button: 'right' } })
  }

  async clickOnMemoFromTable() {
    await this.clickOnTableCell({ rowIndex: 1, cellIndex: 5, clickOptions: { button: 'left' } })
  }

  async clickOnTableCell(options: {
    rowIndex?: number
    cellIndex?: number
    clickOptions?: { button?: 'left' | 'right' | 'middle' }
  } = {}) {
    const { rowIndex = 1, cellIndex = 1, clickOptions = {} } = options

    const row = this.transactionsTable.getByRole('row').nth(rowIndex)
    const cell = row.getByRole('cell').nth(cellIndex)
    await cell.click(clickOptions)
  }

}


