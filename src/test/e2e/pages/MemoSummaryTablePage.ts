import type { Locator, Page } from '@playwright/test'

export class MemoSummaryTablePage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly summaryHeader: Locator
  readonly summaryCard: Locator
  readonly title: Locator
  readonly backButton: Locator

  readonly transactionsAmount: Locator
  readonly transactionsCount: Locator
  readonly budgetCategory: Locator

  readonly transactionsTable: Locator
  readonly budgetCategoryButton: Locator
  readonly budgetCategoryModal: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.getByRole('alert').getByTestId('memo-summary-error')
    this.summaryHeader = page.getByTestId('memo-summary-header')
    this.summaryCard = page.getByTestId('memo-summary-card')
    this.title = this.summaryHeader.getByTestId('memo-title')
    this.backButton = page.getByRole('button', { name: 'Go Back' })

    this.transactionsAmount = page.getByTestId('memo-transactions-amount')
    this.transactionsCount = page.getByTestId('memo-transactions-count')
    this.budgetCategory = page.getByTestId('memo-budget-category-stat')

    this.transactionsTable = page.getByTestId('memo-transactions-table')
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
    expect(this.errorAlert.isVisible())
    if (message) {
      expect(this.errorAlert).toHaveAttribute('title', message)
    }
  }

  async expectNoError() {
    expect(this.errorAlert.isHidden())
  }

  async getMemoTitle() {
    await this.title.waitFor({ state: 'visible' })
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector)
        return element?.textContent?.trim() !== 'Loading...'
      },
      '[data-testid="memo-title"]',
      { timeout: 10000 },
    )
    return this.title.textContent()
  }

  async getStats() {
    return {
      transactionsCount: await this.transactionsCount.textContent(),
      transactionsAmount: await this.transactionsAmount.textContent(),
      budgetCategory: await this.budgetCategory.textContent(),
    }
  }

  expectTransactionsTableVisible() {
    return this.transactionsTable.isVisible()
  }

  expectSummaryCardVisible() {
    return this.summaryCard.isVisible()
  }

  async hasError() {
    return this.errorAlert.isVisible()
  }

  async clickBackButton() {
    await this.backButton.click()
  }
}
