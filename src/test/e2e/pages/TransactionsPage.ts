import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import {
  clickElementTableCell,
  waitForElementTableReady,
  waitForModalReady,
} from '@test/e2e/helpers/waitHelpers'

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
  readonly transactionSplitBudgetCategoryCheckBox: Locator
  readonly transactionCheckNumberInput: Locator
  readonly transactionFeesInput: Locator
  readonly transactionBalanceInput: Locator

  readonly modalCloseButton: Locator
  readonly modalSaveButton: Locator

  readonly splitBudgetCategoryDrawer: Locator
  readonly splitBudgetCategorySaveButton: Locator
  readonly splitBudgetCategoryCancelButton: Locator
  readonly splitBudgetCategoryAddSplitButton: Locator
  readonly splitBudgetCategoryRows: Locator

  constructor(public readonly page: Page) {
    this.transactionsTable = this.page.getByLabel('Transactions Table')
    this.daySelect = this.page.getByRole('combobox', { name: 'Day selector' })
    this.weekSelect = this.page.getByRole('combobox', { name: 'Week selector' })
    this.monthSelect = this.page.getByRole('combobox', { name: 'Month selector' })
    this.yearSelect = this.page.getByRole('combobox', { name: 'Year selector' })
    this.memoSelect = this.page.getByLabel('Memo Selector')

    this.intervalLineChart = this.page.getByTestId('daily-interval-line-chart')
    this.intervalForm = this.page.getByTestId('daily-interval-line-chart-form')
    this.intervalTypeSelect = this.page.getByText('Interval Type')
    this.intervalNumberInput = this.page.getByText('Interval Count')
    this.intervalLineChartTooltip = this.page.getByTestId('line-chart-tooltip')

    this.transactionsTablePagination = this.page.getByTestId('transactions-table-pagination')

    // Use aria-label for modal (more reliable than role matching)
    this.transactionEditModal = this.page.getByLabel('Transaction Edit Modal')

    // Use aria-label for form within modal
    this.transactionEditForm = this.transactionEditModal.getByLabel('Transaction Edit Form')

    // Use data-testid for form fields (more reliable than role + name matching)
    this.transactionNumberInput = this.transactionEditForm.getByTestId(
      'transaction-edit-form-transaction_number',
    )
    this.transactionDatePicker = this.transactionEditForm.getByLabel('Transaction Date Picker')
    this.transactionAmountDebitInput = this.transactionEditForm.getByTestId(
      'transaction-edit-form-amount_debit',
    )
    this.transactionAmountCreditInput = this.transactionEditForm.getByTestId(
      'transaction-edit-form-amount_credit',
    )
    this.transactionDescriptionInput = this.transactionEditForm.getByTestId(
      'transaction-edit-form-description',
    )
    this.transactionMemoInput = this.transactionEditForm.getByTestId('transaction-edit-form-memo')
    this.transactionBudgetCategoryTreeSelect = this.transactionEditForm.getByTestId(
      'transaction-edit-form-budget_category',
    )

    this.transactionSplitBudgetCategoryCheckBox = this.transactionEditForm.getByLabel(
      'Split Budget Category Checkbox',
    )

    this.transactionCheckNumberInput = this.transactionEditForm.getByTestId(
      'transaction-edit-form-check_number',
    )
    this.transactionFeesInput = this.transactionEditForm.getByTestId('transaction-edit-form-fees')
    this.transactionBalanceInput = this.transactionEditForm.getByTestId(
      'transaction-edit-form-balance',
    )

    // Modal buttons can use role since they're simple
    this.modalCloseButton = this.transactionEditModal.getByRole('button', { name: /close/i })
    this.modalSaveButton = this.transactionEditModal.getByRole('button', { name: /save/i })

    this.splitBudgetCategoryDrawer = this.page.getByLabel('Split Budget Category Drawer')
    this.splitBudgetCategorySaveButton = this.splitBudgetCategoryDrawer.getByRole('button', {
      name: /save/i,
    })
    this.splitBudgetCategoryCancelButton = this.splitBudgetCategoryDrawer.getByRole('button', {
      name: /cancel/i,
    })
    this.splitBudgetCategoryAddSplitButton = this.splitBudgetCategoryDrawer.getByRole('button', {
      name: /add split/i,
    })

    this.splitBudgetCategoryRows = this.splitBudgetCategoryDrawer.getByTestId('split-row')
  }

  async goto() {
    await this.page.goto('/budget-visualizer/transactions')
  }

  async goTo() {
    await this.goto()
  }

  async selectFirstMonth(): Promise<string> {
    await this.monthSelect.click()
    await this.page.getByRole('option').first().waitFor({ state: 'visible' })
    const firstMonth = (await this.page.getByRole('option').first().textContent()) ?? ''
    const firstOption = this.page.getByRole('option', { name: firstMonth }).first()
    await firstOption.click()
    return firstMonth
  }

  async selectFirstWeek(): Promise<string> {
    await this.weekSelect.click()
    await this.page.getByRole('option').first().waitFor({ state: 'visible' })
    const firstWeekText = (await this.page.getByRole('option').first().textContent()) ?? ''
    const firstOption = this.page.getByRole('option', { name: firstWeekText }).first()
    await firstOption.click()
    return firstWeekText
  }

  async clickOnDaySelect() {
    await this.daySelect.click()
  }

  async clickIncreaseInterval() {
    await this.page
      .locator('button')
      .filter({ hasText: /^Increase Interval$/ })
      .click()
  }

  async clickDecreaseInterval() {
    await this.page
      .locator('button')
      .filter({ hasText: /^Decrease Interval$/ })
      .click()
  }

  // Method to wait for transactions table to be fully ready
  async waitForTransactionsTableReady() {
    await waitForElementTableReady(this.transactionsTable, this.page)
  }

  // Improved table cell clicking with proper Element UI loading handling
  async clickOnTableCell(
    options: {
      rowIndex?: number
      cellIndex?: number
      clickOptions?: { button?: 'left' | 'right' | 'middle' }
    } = {},
  ) {
    const { rowIndex = 1, cellIndex = 1, clickOptions = {} } = options

    await clickElementTableCell(
      this.transactionsTable,
      this.page,
      rowIndex,
      cellIndex,
      clickOptions,
    )
  }

  // get the text content of a given cell and row index
  async getCellTextContent(rowIndex: number, cellIndex: number): Promise<string> {
    // Wait for table to be ready first
    // await waitForElementTableReady(this.transactionsTable, this.page)

    const row = this.transactionsTable.getByRole('row').nth(rowIndex)
    const cell = row.getByRole('cell').nth(cellIndex)

    await expect(cell).toBeVisible()
    const text = await cell.textContent()

    return text?.trim() || ''
  }

  // Method to get the value of the month select
  async getMonthSelectValue(): Promise<string> {
    // Try to get the input value first (most reliable)
    const input = this.monthSelect.locator('input')
    if ((await input.count()) > 0) {
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

  private async getSelectValue(selector: Locator, expectedPlaceholder?: string): Promise<string> {
    // Try to get the input value first (most reliable)
    const input = selector.locator('input')
    if ((await input.count()) > 0) {
      const value = await input.inputValue()
      if (value) return value
    }

    // Check the visible text content of the select
    const selectText = await selector.textContent()
    const trimmedText = selectText?.trim() ?? ''

    // If it shows placeholder text, consider it empty
    const isPlaceholder =
      trimmedText === '' ||
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

  async expectTransactionEditFormElementsToBeVisible() {
    await expect(this.transactionNumberInput).toBeVisible()
    await expect(this.transactionDatePicker).toBeVisible()
    await expect(this.transactionAmountDebitInput).toBeVisible()
    await expect(this.transactionAmountCreditInput).toBeVisible()
    await expect(this.transactionDescriptionInput).toBeVisible()
    await expect(this.transactionMemoInput).toBeVisible()
    await expect(this.transactionBudgetCategoryTreeSelect).toBeVisible()
    await expect(this.transactionSplitBudgetCategoryCheckBox).toBeVisible()
    await expect(this.transactionCheckNumberInput).toBeVisible()
    await expect(this.transactionFeesInput).toBeVisible()
    await expect(this.transactionBalanceInput).toBeVisible()
  }

  async expectTransactionEditModalVisible() {
    await expect(this.transactionEditModal).toBeVisible()
  }

  async waitForTransactionEditModalReady() {
    await waitForModalReady(this.transactionEditModal, this.page)
  }

  async expectTransactionEditModalHidden() {
    await expect(this.transactionEditModal).toBeHidden()
  }

  async closeTransactionEditModal() {
    await this.modalCloseButton.click()
    await this.expectTransactionEditModalHidden()
  }
}
