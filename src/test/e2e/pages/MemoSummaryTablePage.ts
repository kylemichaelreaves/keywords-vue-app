import type { Locator, Page } from '@playwright/test'

export class MemoSummaryTablePage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly memoSummaryTable: Locator
  readonly memoTransactionsTable: Locator
  readonly transactionsCount: Locator
  readonly transactionsAmount: Locator
  readonly backButton: Locator
  readonly memoTitle: Locator
  readonly budgetCategoryButton: Locator
  readonly budgetCategoryModal: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.getByRole('alert').getByTestId('memo-summary-table-error')
    this.memoSummaryTable = page.getByTestId('memo-summary-table')
    this.memoTransactionsTable = page.getByTestId('memo-transactions-table')
    this.transactionsCount = page.getByTestId('transactions-count')
    this.transactionsAmount = page.getByTestId('sum-amount-debit')
    this.backButton = page.getByRole('button', { name: 'Go Back' })
    this.memoTitle = page.getByTestId('memo-title')
    this.budgetCategoryButton = page.getByTestId('budget-category-button')
    this.budgetCategoryModal = page.getByTestId('budget-category-modal')

  }

  async goToMemos() {
    await this.page.goto('budget-visualizer/memos')
  }


  async goTo(memoId: string) {
    await this.page.goto(`budget-visualizer/memos/${memoId}`)
  }


  async expectError(message?: string) {
    await expect(this.errorAlert.isVisible())
    if (message) {
      await expect(this.errorAlert).toHaveAttribute('title', message)
    }
  }

  async expectNoError() {
    expect(this.errorAlert.isHidden())
  }

  async getMemoTitle() {
    return this.memoTitle.textContent()
  }

  async getStats() {
    return {
      transactionsCount: await this.transactionsCount.textContent(),
      transactionsAmount: await this.transactionsAmount.textContent()
    }
  }

  expectSummaryTableVisible() {
    return this.memoSummaryTable.isVisible()
  }

  async hasError() {
    return this.errorAlert.isVisible()
  }

  async clickBackButton() {
    await this.backButton.click()
  }


}