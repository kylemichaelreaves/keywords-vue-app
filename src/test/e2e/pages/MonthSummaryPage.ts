import type { Locator, Page } from '@playwright/test'
import { BaseSummaryPage } from './BaseSummaryPage'

export class MonthSummaryPage extends BaseSummaryPage {
  // Month-specific elements
  readonly monthSummaryTable: Locator
  readonly transactionsCount: Locator
  readonly transactionsAmount: Locator
  readonly monthTitle: Locator

  constructor(page: Page) {
    super(page)

    // Initialize month-specific elements
    this.monthSummaryTable = page.getByLabel('Month Summary Transactions Table')
    this.transactionsCount = page.getByTestId('transactions-count').locator('div')
    this.transactionsAmount = page.getByTestId('sum-amount-debit').locator('div')
    this.monthTitle = page.locator('h2')
  }

  // Implement abstract methods from base class
  getErrorAlert(): Locator {
    return this.page.getByRole('alert').first()
  }

  getResetButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset Month' })
  }

  getBudgetCategorySummaries(): Locator {
    return this.page.getByTestId('budget-category-summaries')
  }

  getNavigationButtonGroup(): Locator {
    return this.page.getByTestId('month-summary-navigation-button-group')
  }

  getSummaryTable(): Locator {
    return this.monthSummaryTable
  }

  // Month-specific methods
  async goTo(monthId: string) {
    await this.page.goto(`budget-visualizer/transactions/months/${monthId}/summary`)
  }

  async getMonthTitle() {
    return this.monthTitle.textContent()
  }

  async getStats() {
    return {
      transactionsCount: await this.transactionsCount.textContent(),
      transactionsAmount: await this.transactionsAmount.textContent(),
    }
  }
}
