import type { Locator, Page } from '@playwright/test'

export class MonthSummaryPage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly monthSummaryTable: Locator
  readonly transactionsCount: Locator
  readonly transactionsAmount: Locator
  readonly backButton: Locator
  readonly monthTitle: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.locator('.el-alert--error')
    this.monthSummaryTable = page.getByTestId('month-transactions-table')
    this.transactionsCount = page.getByTestId('transactions-count').locator('div')
    this.transactionsAmount = page.getByTestId('sum-amount-debit').locator('div')
    this.backButton = page.getByRole('button', { name: 'Go Back' })

    this.monthTitle = page.locator('header-content').locator('h2')
  }

  async goTo(monthId: string) {
    await this.page.goto(`budget-visualizer/months/${monthId}`)
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

  async getMonthTitle() {
    return this.monthTitle.textContent()
  }

  async getStats() {
    return {
      transactionsCount: await this.transactionsCount.textContent(),
      transactionsAmount: await this.transactionsAmount.textContent()
    }
  }

  expectTableVisible() {
    return this.monthSummaryTable.isVisible()
  }
}