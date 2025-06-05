import type { Locator, Page } from '@playwright/test'

export class MemoSummaryTablePage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly memoSummaryTable: Locator
  readonly transactionsCount: Locator
  readonly transactionsAmount: Locator
  readonly backButton: Locator
  readonly memoTitle: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.locator('.el-alert--error')
    this.memoSummaryTable = page.getByTestId('memo-transactions-table')
    this.transactionsCount = page.getByTestId('transactions-count').locator('div')
    this.transactionsAmount = page.getByTestId('sum-amount-debit').locator('div')
    this.backButton = page.getByRole('button', { name: 'Go Back' })

    this.memoTitle = page.locator('header-content').locator('h2')
  }


  async goTo(memoId: string) {
    await this.page.goto(`budget-visualizer/memos/${memoId}`)
  }

  async clickBackButton() {
    await this.backButton.click()
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

  expectTableVisible() {
    return this.memoSummaryTable.isVisible()
  }

  async hasError() {
    return this.errorAlert.isVisible()
  }


}