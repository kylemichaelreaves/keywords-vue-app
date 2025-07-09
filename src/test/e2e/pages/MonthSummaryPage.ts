import type { Locator, Page } from '@playwright/test'

export class MonthSummaryPage {
  readonly page: Page

  readonly errorAlert: Locator
  readonly monthSummaryTable: Locator
  readonly budgetCategorySummaries: Locator
  readonly transactionsCount: Locator
  readonly transactionsAmount: Locator
  readonly resetButton: Locator
  readonly monthTitle: Locator
  readonly navigationButtonGroup: Locator

  constructor(page: Page) {
    this.page = page

    this.errorAlert = page.getByTestId('month-summary-table-error')
    this.monthSummaryTable = page.getByTestId('month-summary-transactions-table')
    this.transactionsCount = page.getByTestId('transactions-count').locator('div')
    this.transactionsAmount = page.getByTestId('sum-amount-debit').locator('div')
    this.resetButton = page.getByRole('button', { name: 'Reset Month' })
    this.monthTitle = page.getByTestId('month-summary-table-header').locator('h2')
    this.budgetCategorySummaries = page.getByTestId('budget-category-summaries')
    this.navigationButtonGroup = page.getByTestId('month-summary-navigation-button-group')
  }

  async goTo(monthId: string) {
    await this.page.goto(`budget-visualizer/transactions/months/${monthId}/summary`)
  }

  async clickResetButton() {
    await this.resetButton.click()
  }

  async expectError(message?: string) {
    if (message) {
      expect(this.errorAlert).toHaveAttribute('title', message)
    } else {
      expect(this.errorAlert.isVisible())
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