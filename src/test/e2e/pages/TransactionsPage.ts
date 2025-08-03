import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export class TransactionsPage {
  readonly transactionsTable: Locator
  readonly daySelect: Locator
  readonly weekSelect: Locator
  readonly monthSelect: Locator
  readonly yearSelect: Locator
  readonly memoSelect: Locator

  readonly intervalForm: Locator
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
  readonly transactionBudgetCategoryTreeSelect: Locator
  readonly transactionCheckNumberInput: Locator
  readonly transactionFeesInput: Locator
  readonly transactionBalanceInput: Locator

  readonly modalCloseButton: Locator
  readonly modalSaveButton: Locator

  constructor(public readonly page: Page) {
    this.transactionsTable = this.page.getByTestId('transactions-table')
    this.daySelect = this.page.getByTestId('transactions-table-day-select')
    this.weekSelect = this.page.getByTestId('transactions-table-week-select')
    this.monthSelect = this.page.getByTestId('transactions-table-month-select')
    this.yearSelect = this.page.getByTestId('transactions-table-year-select')
    this.memoSelect = this.page.getByTestId('transactions-table-memo-select')

    this.intervalLineChart = this.page.getByTestId('daily-interval-line-chart')
    this.intervalForm = this.page.getByTestId('interval-form')
    this.intervalTypeSelect = this.page.getByText('Interval Type')
    this.intervalNumberInput = this.page.getByText('Interval Count')
    this.intervalLineChartTooltip = this.page.getByTestId('line-chart-tooltip')

    this.transactionsTablePagination = this.page.getByTestId('transactions-table-pagination')
    this.transactionEditModal = this.page.getByTestId('transaction-edit-dialog')
    this.transactionEditForm = this.transactionEditModal.getByTestId('transaction-edit-form')

    // transaction edit form inputs
    this.transactionNumberInput = this.transactionEditForm.getByRole('textbox', { name: 'Transaction Number' })
    this.transactionDatePicker = this.transactionEditForm.getByRole('combobox', { name: 'Date' })
    this.transactionAmountDebitInput = this.transactionEditForm.getByRole('textbox', { name: 'Amount Debit' })
    this.transactionAmountCreditInput = this.transactionEditForm.getByRole('textbox', { name: 'Amount Credit' })
    this.transactionDescriptionInput = this.transactionEditForm.getByRole('textbox', { name: 'Description' })
    this.transactionMemoInput = this.transactionEditForm.getByRole('combobox', { name: 'Memo' })
    this.transactionBudgetCategoryTreeSelect = this.transactionEditForm.getByRole('combobox', { name: 'Budget Category' })
    this.transactionCheckNumberInput = this.transactionEditForm.getByRole('textbox', { name: 'Check Number' })
    this.transactionFeesInput = this.transactionEditForm.getByRole('textbox', { name: 'Fees' })
    this.transactionBalanceInput = this.transactionEditForm.getByRole('textbox', { name: 'Balance' })


    this.modalCloseButton = this.transactionEditModal.getByRole('button', { name: 'Close this dialog' })
    this.modalSaveButton = this.transactionEditModal.getByRole('button', { name: 'Save' })

  }

  async goto() {
    await this.page.goto('budget-visualizer/transactions')
  }

  async goTo() {
    await this.goto()
  }

  async selectFirstMonth(): Promise<string> {
    await this.monthSelect.click()
    const firstMonth = await this.page.getByRole('option').first().textContent() ?? ''
    const firstOption = this.page.getByRole('option', { name: firstMonth }).first()
    await firstOption.click()
    return firstMonth
  }

  async selectFirstWeek(): Promise<string> {
    await this.weekSelect.click()
    // wait for the week select options to be visible
    await this.page.getByRole('option').first().waitFor({ state: 'visible' })

    // get the text content of the first option
    const firstWeekText = await this.page.getByRole('option').first().textContent() ?? ''
    const firstOption = this.page.getByRole('option', { name: firstWeekText }).first()
    await firstOption.click()
    return firstWeekText
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


  // getWeekSelectValue method to get the value of the week select
  async getWeekSelectValue(): Promise<string> {
    return this.getSelectValue(this.weekSelect, 'select a week')
  }

  private async getSelectValue(
    selector: Locator,
    expectedPlaceholder?: string
  ): Promise<string> {
    // Try to get the input value first (most reliable)
    const input = selector.locator('input')
    if (await input.count() > 0) {
      const value = await input.inputValue()
      if (value) return value
    }

    // Check the visible text content of the select
    const selectText = await selector.textContent()
    const trimmedText = selectText?.trim() ?? ''

    // If it shows placeholder text, consider it empty
    const isPlaceholder = trimmedText === '' ||
      trimmedText.includes('select') ||
      (expectedPlaceholder && trimmedText === expectedPlaceholder)

    return isPlaceholder ? '' : trimmedText
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
    await expect(this.transactionBudgetCategoryTreeSelect).toBeVisible()
    await expect(this.transactionCheckNumberInput).toBeVisible()
    await expect(this.transactionFeesInput).toBeVisible()
    await expect(this.transactionBalanceInput).toBeVisible()
    await expect(this.modalCloseButton).toBeVisible()
    await expect(this.modalSaveButton).toBeVisible()
  }

}
