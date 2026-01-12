import type { Locator, Page } from '@playwright/test'

export class MemoSummaryTablePage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly memoSummaryTable: Locator
  readonly memoSummaryHeader: Locator
  readonly memoSummaryCard: Locator
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
    this.memoSummaryHeader = page.getByTestId('memo-summary-header')
    this.memoSummaryCard = page.getByTestId('memo-summary-card')
    this.memoSummaryTable = page.getByTestId('memo-summary-table')
    this.memoTransactionsTable = page.getByTestId('memo-transactions-table')
    this.transactionsCount = page.getByTestId('transactions-count')
    this.transactionsAmount = page.getByTestId('sum-amount-debit')
    this.backButton = page.getByRole('button', { name: 'Go Back' })
    this.memoTitle = this.memoSummaryHeader.getByTestId('memo-title')
    // Fix: Target the specific button within the budget category column
    this.budgetCategoryButton = page
      .getByTestId('budget-category-column')
      .getByTestId('budget-category-button')
    this.budgetCategoryModal = page.getByTestId('budget-category-modal')
  }

  async goToMemos() {
    await this.page.goto('budget-visualizer/memos')
  }

  async goTo(memoId: string) {
    await this.page.goto(`budget-visualizer/memos/${memoId}`)
  }

  async expectError(message?: string) {
    expect(this.errorAlert.isVisible())
    if (message) {
      expect(this.errorAlert).toHaveAttribute('title', message)
    }
  }

  async expectNoError() {
    expect(this.errorAlert.isHidden())
  }

  async getMemoTitle() {
    // Wait for the title to be loaded (not "Loading...")
    await this.memoTitle.waitFor({ state: 'visible' })
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector)
        return element?.textContent?.trim() !== 'Loading...'
      },
      '[data-testid="memo-title"]',
      { timeout: 10000 },
    )
    return this.memoTitle.textContent()
  }

  async getStats() {
    return {
      transactionsCount: await this.transactionsCount.textContent(),
      transactionsAmount: await this.transactionsAmount.textContent(),
    }
  }

  expectSummaryTableVisible() {
    return this.memoSummaryTable.isVisible()
  }

  expectMemoSummaryCardVisible() {
    return this.memoSummaryCard.isVisible()
  }

  async hasError() {
    return this.errorAlert.isVisible()
  }

  async clickBackButton() {
    await this.backButton.click()
  }
}
