import type { Locator, Page } from '@playwright/test'
import { BaseSummaryPage } from './BaseSummaryPage'

export class MonthSummaryPage extends BaseSummaryPage {
  // Month-specific elements
  readonly monthSummaryTable: Locator
  readonly monthlyAmountDebitTotal: Locator
  readonly monthTitle: Locator

  constructor(page: Page) {
    super(page)

    // Initialize month-specific elements
    this.monthSummaryTable = page.getByTestId('month-summary-transactions-table')
    this.monthlyAmountDebitTotal = page.getByTestId('monthly-amount-debit-total-statistic')
    this.monthTitle = page.getByTestId('month-summary-title')
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
      monthlyAmountDebitTotal: await this.monthlyAmountDebitTotal.textContent(),
    }
  }
}
