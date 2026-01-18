import type { Locator, Page } from '@playwright/test'
import { BaseSummaryPage } from './BaseSummaryPage'

export class WeekSummaryPage extends BaseSummaryPage {
  // Week-specific elements
  readonly weekSummaryHeader: Locator
  readonly headerNavButtonGroup: Locator
  readonly weekSummaryTable: Locator
  readonly weekTitle: Locator
  readonly daySummariesTable: Locator

  constructor(page: Page) {
    super(page)

    // Initialize week-specific elements
    this.weekSummaryHeader = page.getByLabel('Week Summary Header')
    this.headerNavButtonGroup = this.weekSummaryHeader.getByLabel('Navigation Button Group')
    this.weekSummaryTable = page.getByRole('table').first()
    this.weekTitle = page.locator('h2')
    this.daySummariesTable = page.getByRole('table').nth(1)
  }

  // Implement abstract methods from base class
  getErrorAlert(): Locator {
    return this.page.getByRole('alert').first()
  }

  getResetButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset Week' })
  }

  getBudgetCategorySummaries(): Locator {
    return this.page.getByTestId('budget-category-summaries-for-week')
  }

  getNavigationButtonGroup(): Locator {
    return this.page.getByLabel('Navigation Button Group')
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
