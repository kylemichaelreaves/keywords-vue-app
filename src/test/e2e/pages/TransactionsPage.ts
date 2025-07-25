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
  readonly transactionEditForm: Locator

  // edit modal locators
  readonly transactionNumberInput: Locator
  readonly transactionDatePicker: Locator
  readonly transactionAmountDebitInput: Locator
  readonly transactionAmountCreditInput: Locator
  readonly transactionDescriptionInput: Locator
  readonly transactionMemoInput: Locator
  readonly transactionBudgetCategoryInput: Locator
  readonly transactionCheckNumberInput: Locator
  readonly transactionFeesInput: Locator
  readonly transactionBalanceInput: Locator

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
    this.transactionEditForm = this.transactionEditModal.getByTestId('transaction-edit-form')

    // transaction edit form inputs
    this.transactionNumberInput = this.transactionEditForm.getByTestId('transaction-edit-form-form-transaction_number-input')
    this.transactionDatePicker = this.transactionEditForm.getByTestId('transaction-edit-form-transaction-date-picker')
    this.transactionAmountDebitInput = this.transactionEditForm.getByTestId('transaction-edit-form-amount_debit-input')
    this.transactionAmountCreditInput = this.transactionEditForm.getByTestId('transaction-edit-form-amount_credit-input')
    this.transactionDescriptionInput = this.transactionEditForm.getByTestId('transaction-edit-form-description-input')
    this.transactionMemoInput = this.transactionEditForm.getByTestId('transaction-edit-form-memo-input')
    this.transactionBudgetCategoryInput = this.transactionEditForm.getByTestId('transaction-edit-form-budget_category-input')
    this.transactionCheckNumberInput = this.transactionEditForm.getByTestId('transaction-edit-form-check_number-input')
    this.transactionFeesInput = this.transactionEditForm.getByTestId('transaction-edit-form-fees-input')
    this.transactionBalanceInput = this.transactionEditForm.getByTestId('transaction-edit-form-balance-input')


    this.modalCloseButton = this.transactionEditModal.getByRole('button', { name: 'Close this dialog' })

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

  async expectTransactionEditFormElementsToBeVisible() {
    await expect(this.transactionNumberInput).toBeVisible()
    await expect(this.transactionDatePicker).toBeVisible()
    await expect(this.transactionAmountDebitInput).toBeVisible()
    await expect(this.transactionAmountCreditInput).toBeVisible()
    await expect(this.transactionDescriptionInput).toBeVisible()
    await expect(this.transactionMemoInput).toBeVisible()
    await expect(this.transactionBudgetCategoryInput).toBeVisible()
    await expect(this.transactionCheckNumberInput).toBeVisible()
    await expect(this.transactionFeesInput).toBeVisible()
    await expect(this.transactionBalanceInput).toBeVisible()
  }

}


