import type { Locator, Page } from '@playwright/test'
import { BaseSummaryPage } from './BaseSummaryPage'

export class WeekSummaryPage extends BaseSummaryPage {
  // Week-specific elements
  readonly weekSummaryTable: Locator
  readonly weekTitle: Locator
  readonly daySummariesTable: Locator

  constructor(page: Page) {
    super(page)

    // Initialize week-specific elements
    this.weekSummaryTable = page.getByTestId('week-summary-table')
    this.weekTitle = page.locator('h2')
    this.daySummariesTable = page.getByTestId('day-summaries-for-selected-week-table')
  }

  // Implement abstract methods from base class
  getErrorAlert(): Locator {
    return this.page.getByTestId('week-error-alert')
  }

  getResetButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset Week' })
  }

  getBudgetCategorySummaries(): Locator {
    return this.page.getByTestId('budget-category-summaries-for-week')
  }

  getNavigationButtonGroup(): Locator {
    return this.page.getByTestId('week-navigation-button-group')
  }

  getSummaryTable(): Locator {
    return this.weekSummaryTable
  }

  // Week-specific methods
  async goTo(weekId: string) {
    await this.page.goto(`budget-visualizer/transactions/weeks/${weekId}/summary`)
  }

  async getWeekTitle() {
    return this.weekTitle.textContent()
  }

  // Commented out as it appears to be incomplete in the original
  // async getStats() {
  //   return {
  //     transactionsCount: await this.transactionsCount.textContent(),
  //     transactionsAmount: await this.transactionsAmount.textContent()
  //   }
  // }
}
